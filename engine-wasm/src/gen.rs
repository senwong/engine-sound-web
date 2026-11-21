//! Procedural engine sound DSP core adapted for WebAssembly from DasEtwas/enginesound (MIT License).
//! All native I/O, GUI, audio device, and SystemTime dependencies have been removed.

use rand_core::{RngCore, SeedableRng};
use rand_xorshift::XorShiftRng;
use serde::{Deserialize, Serialize};

pub const PI2F: f32 = 2.0 * std::f32::consts::PI;
pub const PI4F: f32 = 4.0 * std::f32::consts::PI;
pub const WAVEGUIDE_MAX_AMP: f32 = 20.0;

#[derive(Serialize, Deserialize, Clone)]
pub struct Muffler {
    pub straight_pipe: WaveGuide,
    pub muffler_elements: Vec<WaveGuide>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Engine {
    pub rpm: f32,
    pub intake_volume: f32,
    pub exhaust_volume: f32,
    pub engine_vibrations_volume: f32,

    pub cylinders: Vec<Cylinder>,
    #[serde(skip)]
    pub intake_noise: Noise,
    pub intake_noise_factor: f32,
    pub intake_noise_lp: LowPassFilter,
    pub engine_vibration_filter: LowPassFilter,
    pub muffler: Muffler,
    /// valve timing -0.5..0.5
    pub intake_valve_shift: f32,
    /// valve timing -0.5..0.5
    pub exhaust_valve_shift: f32,
    pub crankshaft_fluctuation: f32,
    pub crankshaft_fluctuation_lp: LowPassFilter,
    #[serde(skip)]
    pub crankshaft_noise: Noise,
    /// crankshaft position, 0.0..1.0
    #[serde(skip)]
    pub crankshaft_pos: f32,
    #[serde(skip)]
    pub exhaust_collector: f32,
    #[serde(skip)]
    pub intake_collector: f32,
}

#[derive(Clone)]
pub struct Noise {
    inner: XorShiftRng,
}

impl Default for Noise {
    fn default() -> Self {
        // Deterministic Wasm-safe seed (SystemTime::now() is unsupported on wasm32-unknown-unknown)
        Noise {
            inner: XorShiftRng::from_seed([
                0x42, 0x7a, 0x19, 0xe3, 0x8f, 0x2c, 0x55, 0xa1, 0x10, 0x9b, 0xd4, 0x67, 0x3e, 0xf0,
                0x88, 0x51,
            ]),
        }
    }
}

impl Noise {
    #[inline]
    pub fn step(&mut self) -> f32 {
        self.inner.next_u32() as f32 / (u32::MAX as f32 / 2.0) - 1.0
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Cylinder {
    pub crank_offset: f32,
    pub exhaust_waveguide: WaveGuide,
    pub intake_waveguide: WaveGuide,
    pub extractor_waveguide: WaveGuide,
    pub intake_open_refl: f32,
    pub intake_closed_refl: f32,
    pub exhaust_open_refl: f32,
    pub exhaust_closed_refl: f32,

    pub piston_motion_factor: f32,
    pub ignition_factor: f32,
    pub ignition_time: f32,

    #[serde(skip)]
    pub cyl_sound: f32,
    #[serde(skip)]
    pub extractor_exhaust: f32,
}

impl Cylinder {
    #[inline]
    pub(crate) fn pop(
        &mut self,
        crank_pos: f32,
        exhaust_collector: f32,
        intake_valve_shift: f32,
        exhaust_valve_shift: f32,
        load_ignition_scale: f32,
    ) -> (f32, f32, f32, bool) {
        let crank = (crank_pos + self.crank_offset).rem_euclid(1.0);

        self.cyl_sound = piston_motion(crank) * self.piston_motion_factor
            + fuel_ignition(crank, self.ignition_time) * self.ignition_factor * load_ignition_scale;

        let ex_valve = exhaust_valve((crank + exhaust_valve_shift).rem_euclid(1.0));
        let in_valve = intake_valve((crank + intake_valve_shift).rem_euclid(1.0));

        self.exhaust_waveguide.alpha = self.exhaust_closed_refl
            + (self.exhaust_open_refl - self.exhaust_closed_refl) * ex_valve;
        self.intake_waveguide.alpha =
            self.intake_closed_refl + (self.intake_open_refl - self.intake_closed_refl) * in_valve;

        let ex_wg_ret = self.exhaust_waveguide.pop();
        let in_wg_ret = self.intake_waveguide.pop();

        let extractor_wg_ret = self.extractor_waveguide.pop();
        self.extractor_exhaust = extractor_wg_ret.0;
        self.extractor_waveguide
            .push(ex_wg_ret.1, exhaust_collector);

        (
            in_wg_ret.1,
            extractor_wg_ret.1,
            self.cyl_sound,
            ex_wg_ret.2 | in_wg_ret.2 | extractor_wg_ret.2,
        )
    }

    #[inline]
    pub(crate) fn push(&mut self, intake: f32) {
        let ex_in = (1.0 - self.exhaust_waveguide.alpha.abs()) * self.cyl_sound * 0.5;
        self.exhaust_waveguide.push(ex_in, self.extractor_exhaust);
        let in_in = (1.0 - self.intake_waveguide.alpha.abs()) * self.cyl_sound * 0.5;
        self.intake_waveguide.push(in_in, intake);
    }
}

pub struct Generator {
    pub volume: f32,
    pub samples_per_second: u32,
    pub engine: Engine,
    dc_lp: LowPassFilter,
    pub waveguides_dampened: bool,
}

impl Generator {
    pub fn new(samples_per_second: u32, engine: Engine) -> Generator {
        let dc_lp = LowPassFilter::new(0.5, samples_per_second);
        Generator {
            volume: 0.14_f32,
            samples_per_second,
            engine,
            dc_lp,
            waveguides_dampened: false,
        }
    }

    #[inline]
    pub fn generate_sample(&mut self, rpm: f32, throttle: f32, mix_in: f32, mix_ex: f32, mix_vib: f32) -> f32 {
        let samples_per_second = self.samples_per_second as f32 * 120.0;
        let inc = rpm / samples_per_second;
        self.engine.crankshaft_pos = (self.engine.crankshaft_pos + inc).rem_euclid(1.0);

        // Throttle load dynamically enriches intake induction and ignition punch
        let load_ignition = 0.65 + 0.70 * throttle;
        let load_intake = 0.55 + 0.90 * throttle;
        let load_exhaust = 0.72 + 0.55 * throttle;

        let channels = self.gen(load_ignition, load_intake);
        let mixed = (channels.0 * self.engine.intake_volume * mix_in * load_intake
            + channels.1 * self.engine.engine_vibrations_volume * mix_vib
            + channels.2 * self.engine.exhaust_volume * mix_ex * load_exhaust)
            * self.volume;
        self.waveguides_dampened = channels.3;

        let dc_free = mixed - self.dc_lp.filter(mixed);
        // Soft limiter to prevent harsh digital clipping
        (dc_free * 1.15).tanh()
    }

    fn gen(&mut self, load_ignition: f32, load_intake: f32) -> (f32, f32, f32, bool) {
        let intake_noise = self
            .engine
            .intake_noise_lp
            .filter(self.engine.intake_noise.step())
            * self.engine.intake_noise_factor
            * load_intake;

        let mut engine_vibration = 0.0;
        let num_cyl = (self.engine.cylinders.len() as f32).max(1.0);

        let last_exhaust_collector = self.engine.exhaust_collector / num_cyl;
        self.engine.exhaust_collector = 0.0;
        self.engine.intake_collector = 0.0;

        let crankshaft_fluctuation_offset = self
            .engine
            .crankshaft_fluctuation_lp
            .filter(self.engine.crankshaft_noise.step());

        let mut cylinder_dampened = false;

        for cylinder in self.engine.cylinders.iter_mut() {
            let (cyl_intake, cyl_exhaust, cyl_vib, dampened) = cylinder.pop(
                self.engine.crankshaft_pos
                    + self.engine.crankshaft_fluctuation * crankshaft_fluctuation_offset,
                last_exhaust_collector,
                self.engine.intake_valve_shift,
                self.engine.exhaust_valve_shift,
                load_ignition,
            );

            self.engine.intake_collector += cyl_intake;
            self.engine.exhaust_collector += cyl_exhaust;

            engine_vibration += cyl_vib;
            cylinder_dampened |= dampened;
        }

        let straight_pipe_wg_ret = self.engine.muffler.straight_pipe.pop();
        let mut muffler_wg_ret = (0.0, 0.0, false);

        for muffler_line in self.engine.muffler.muffler_elements.iter_mut() {
            let ret = muffler_line.pop();
            muffler_wg_ret.0 += ret.0;
            muffler_wg_ret.1 += ret.1;
            muffler_wg_ret.2 |= ret.2;
        }

        for cylinder in self.engine.cylinders.iter_mut() {
            cylinder.push(
                self.engine.intake_collector / num_cyl
                    + intake_noise
                        * intake_valve(
                            (self.engine.crankshaft_pos + cylinder.crank_offset).rem_euclid(1.0),
                        ),
            );
        }

        self.engine
            .muffler
            .straight_pipe
            .push(self.engine.exhaust_collector, muffler_wg_ret.0);

        self.engine.exhaust_collector += straight_pipe_wg_ret.0;

        let muffler_elements = (self.engine.muffler.muffler_elements.len() as f32).max(1.0);

        for muffler_delay_line in self.engine.muffler.muffler_elements.iter_mut() {
            muffler_delay_line.push(straight_pipe_wg_ret.1 / muffler_elements, 0.0);
        }

        engine_vibration = self.engine.engine_vibration_filter.filter(engine_vibration);

        (
            self.engine.intake_collector,
            engine_vibration,
            muffler_wg_ret.1,
            straight_pipe_wg_ret.2 | cylinder_dampened,
        )
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct WaveGuide {
    pub chamber0: DelayLine,
    pub chamber1: DelayLine,
    pub alpha: f32,
    pub beta: f32,
    #[serde(skip)]
    c1_out: f32,
    #[serde(skip)]
    c0_out: f32,
}

impl WaveGuide {
    pub fn new(delay: usize, alpha: f32, beta: f32, samples_per_second: u32) -> WaveGuide {
        let safe_delay = delay.max(1);
        WaveGuide {
            chamber0: DelayLine::new(safe_delay, samples_per_second),
            chamber1: DelayLine::new(safe_delay, samples_per_second),
            alpha,
            beta,
            c1_out: 0.0,
            c0_out: 0.0,
        }
    }

    #[inline]
    pub fn pop(&mut self) -> (f32, f32, bool) {
        let (c1_out, dampened_c1) = WaveGuide::dampen(self.chamber1.pop());
        let (c0_out, dampened_c0) = WaveGuide::dampen(self.chamber0.pop());
        self.c1_out = c1_out;
        self.c0_out = c0_out;

        (
            self.c1_out * (1.0 - self.alpha.abs()),
            self.c0_out * (1.0 - self.beta.abs()),
            dampened_c1 | dampened_c0,
        )
    }

    #[inline]
    pub fn dampen(sample: f32) -> (f32, bool) {
        let sample_abs = sample.abs();
        if sample_abs > WAVEGUIDE_MAX_AMP {
            (
                sample.signum()
                    * (-1.0 / (sample_abs - WAVEGUIDE_MAX_AMP + 1.0) + 1.0 + WAVEGUIDE_MAX_AMP),
                true,
            )
        } else {
            (sample, false)
        }
    }

    #[inline]
    pub fn push(&mut self, x0_in: f32, x1_in: f32) {
        let c0_in = self.c1_out * self.alpha + x0_in;
        let c1_in = self.c0_out * self.beta + x1_in;

        self.chamber0.push(c0_in);
        self.chamber1.push(c1_in);
        self.chamber0.samples.advance();
        self.chamber1.samples.advance();
    }
}

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct LoopBuffer {
    pub delay: f32,
    #[serde(skip)]
    pub data: Vec<f32>,
    #[serde(skip)]
    pub pos: usize,
}

impl LoopBuffer {
    pub fn new(len: usize, samples_per_second: u32) -> LoopBuffer {
        let safe_len = len.max(1);
        LoopBuffer {
            delay: safe_len as f32 / samples_per_second as f32,
            data: vec![0.0; safe_len],
            pos: 0,
        }
    }

    #[inline]
    pub fn push(&mut self, value: f32) {
        let len = self.data.len();
        self.data[self.pos % len] = value;
    }

    #[inline]
    pub fn pop(&mut self) -> f32 {
        let len = self.data.len();
        self.data[(self.pos + 1) % len]
    }

    #[inline]
    pub fn advance(&mut self) {
        self.pos = self.pos.wrapping_add(1);
    }
}

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct LowPassFilter {
    pub delay: f32,
    #[serde(skip)]
    pub alpha: f32,
    #[serde(skip)]
    pub last: f32,
}

impl LowPassFilter {
    pub fn new(freq: f32, samples_per_second: u32) -> LowPassFilter {
        let safe_freq = freq.max(0.01);
        LowPassFilter {
            delay: 1.0 / safe_freq,
            alpha: (PI2F * (1.0 / samples_per_second as f32) * safe_freq)
                / (PI2F * (1.0 / samples_per_second as f32) * safe_freq + 1.0),
            last: 0.0,
        }
    }

    #[inline]
    pub fn filter(&mut self, sample: f32) -> f32 {
        let ret = (sample - self.last).mul_add(self.alpha, self.last);
        self.last = ret;
        ret
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DelayLine {
    pub samples: LoopBuffer,
}

impl DelayLine {
    pub fn new(delay: usize, samples_per_second: u32) -> DelayLine {
        DelayLine {
            samples: LoopBuffer::new(delay, samples_per_second),
        }
    }

    #[inline]
    pub fn pop(&mut self) -> f32 {
        self.samples.pop()
    }

    #[inline]
    pub fn push(&mut self, sample: f32) {
        self.samples.push(sample);
    }
}

pub fn fix_engine(engine: &mut Engine, sample_rate: u32) {
    fn fix_lpf(lpf: &mut LowPassFilter, sample_rate: u32) {
        let freq = if lpf.delay > 0.0 { 1.0 / lpf.delay } else { 100.0 };
        *lpf = LowPassFilter::new(freq, sample_rate);
    }

    fn fix_loop_buffer(lb: &mut LoopBuffer, sample_rate: u32) {
        let len = ((lb.delay * sample_rate as f32) as usize).max(1);
        *lb = LoopBuffer {
            delay: lb.delay,
            data: vec![0.0; len],
            pos: 0,
        };
    }

    fix_lpf(&mut engine.crankshaft_fluctuation_lp, sample_rate);
    fix_lpf(&mut engine.engine_vibration_filter, sample_rate);
    fix_lpf(&mut engine.intake_noise_lp, sample_rate);

    for wg in engine
        .muffler
        .muffler_elements
        .iter_mut()
        .chain(std::iter::once(&mut engine.muffler.straight_pipe))
    {
        fix_loop_buffer(&mut wg.chamber0.samples, sample_rate);
        fix_loop_buffer(&mut wg.chamber1.samples, sample_rate);
    }

    for cyl in engine.cylinders.iter_mut() {
        fix_loop_buffer(&mut cyl.exhaust_waveguide.chamber0.samples, sample_rate);
        fix_loop_buffer(&mut cyl.exhaust_waveguide.chamber1.samples, sample_rate);
        fix_loop_buffer(&mut cyl.extractor_waveguide.chamber0.samples, sample_rate);
        fix_loop_buffer(&mut cyl.extractor_waveguide.chamber1.samples, sample_rate);
        fix_loop_buffer(&mut cyl.intake_waveguide.chamber0.samples, sample_rate);
        fix_loop_buffer(&mut cyl.intake_waveguide.chamber1.samples, sample_rate);
    }
}

#[inline]
fn exhaust_valve(crank_pos: f32) -> f32 {
    if 0.75 < crank_pos && crank_pos < 1.0 {
        -(crank_pos * PI4F).sin()
    } else {
        0.0
    }
}

#[inline]
fn intake_valve(crank_pos: f32) -> f32 {
    if 0.0 < crank_pos && crank_pos < 0.25 {
        (crank_pos * PI4F).sin()
    } else {
        0.0
    }
}

#[inline]
fn piston_motion(crank_pos: f32) -> f32 {
    (crank_pos * PI4F).cos()
}

#[inline]
fn fuel_ignition(crank_pos: f32, ignition_time: f32) -> f32 {
    if 0.5 < crank_pos && crank_pos < ignition_time / 2.0 + 0.5 {
        (PI2F * ((crank_pos - 0.5) / ignition_time)).sin()
    } else {
        0.0
    }
}
