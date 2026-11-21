mod gen;

use gen::{fix_engine, Cylinder, Engine, Generator, LowPassFilter, Muffler, Noise, WaveGuide};

const MAX_FRAMES: usize = 512;

const PRESET_DEFAULT: &str = include_str!("../presets/default.esc");
const PRESET_EX1: &str = include_str!("../presets/example1.esc");
const PRESET_EX2: &str = include_str!("../presets/example2.esc");
const PRESET_EX3: &str = include_str!("../presets/example3.esc");
const PRESET_EX4: &str = include_str!("../presets/example4.esc");
const PRESET_EX5: &str = include_str!("../presets/example5.esc");
const PRESET_EX6: &str = include_str!("../presets/example6.esc");

struct SynthState {
    sample_rate: u32,
    generator: Generator,
    target_rpm: f32,
    current_rpm: f32,
    target_throttle: f32,
    current_throttle: f32,
    mix_intake: f32,
    mix_exhaust: f32,
    mix_vib: f32,
}

static mut STATE: Option<SynthState> = None;
static mut OUTPUT_BUF: [f32; MAX_FRAMES] = [0.0; MAX_FRAMES];

fn load_ron_preset(ron_str: &str, sample_rate: u32) -> Engine {
    let mut engine: Engine = ron::de::from_str(ron_str).expect("valid preset");
    fix_engine(&mut engine, sample_rate);
    engine
}

/// Helper to procedurally construct classic engine layouts (V8 crossplane, V10 F1, V12, Boxer-4)
fn build_custom_engine(
    sample_rate: u32,
    offsets: &[f32],
    pipe_delays_ms: &[f32],
    straight_pipe_ms: f32,
    muffler_ms: &[f32],
    ignition_time: f32,
    ignition_factor: f32,
    piston_factor: f32,
    intake_vol: f32,
    exhaust_vol: f32,
    vib_vol: f32,
    intake_noise_factor: f32,
    fluctuation: f32,
) -> Engine {
    let ms_to_samples = |ms: f32| -> usize { ((ms / 1000.0) * sample_rate as f32).max(1.0) as usize };

    let cylinders: Vec<Cylinder> = offsets
        .iter()
        .enumerate()
        .map(|(i, &offset)| {
            let ext_ms = pipe_delays_ms[i % pipe_delays_ms.len()];
            Cylinder {
                crank_offset: offset,
                exhaust_waveguide: WaveGuide::new(ms_to_samples(0.35), 0.94, 0.06, sample_rate),
                intake_waveguide: WaveGuide::new(
                    ms_to_samples(0.9 + (i as f32 % 3.0) * 0.12),
                    0.82,
                    -0.28,
                    sample_rate,
                ),
                extractor_waveguide: WaveGuide::new(ms_to_samples(ext_ms), 0.0, 0.04, sample_rate),
                intake_open_refl: 0.02,
                intake_closed_refl: 0.82,
                exhaust_open_refl: -0.02,
                exhaust_closed_refl: 0.94,
                piston_motion_factor: piston_factor,
                ignition_factor,
                ignition_time,
                cyl_sound: 0.0,
                extractor_exhaust: 0.0,
            }
        })
        .collect();

    let muffler_elements = muffler_ms
        .iter()
        .map(|&ms| WaveGuide::new(ms_to_samples(ms), -0.45, 0.35, sample_rate))
        .collect();

    Engine {
        rpm: 900.0,
        intake_volume: intake_vol,
        exhaust_volume: exhaust_vol,
        engine_vibrations_volume: vib_vol,
        cylinders,
        intake_noise: Noise::default(),
        intake_noise_factor,
        intake_noise_lp: LowPassFilter::new(1400.0, sample_rate),
        engine_vibration_filter: LowPassFilter::new(160.0, sample_rate),
        muffler: Muffler {
            straight_pipe: WaveGuide::new(ms_to_samples(straight_pipe_ms), 0.35, 0.28, sample_rate),
            muffler_elements,
        },
        intake_valve_shift: 0.0,
        exhaust_valve_shift: 0.0,
        crankshaft_fluctuation: fluctuation,
        crankshaft_fluctuation_lp: LowPassFilter::new(45.0, sample_rate),
        crankshaft_noise: Noise::default(),
        crankshaft_pos: 0.0,
        exhaust_collector: 0.0,
        intake_collector: 0.0,
    }
}

fn build_preset(preset_id: u32, sample_rate: u32) -> Engine {
    let sr = sample_rate;
    match preset_id {
        0 => load_ron_preset(PRESET_DEFAULT, sample_rate),
        1 => load_ron_preset(PRESET_EX1, sample_rate),
        2 => load_ron_preset(PRESET_EX2, sample_rate),
        3 => load_ron_preset(PRESET_EX3, sample_rate),
        4 => load_ron_preset(PRESET_EX4, sample_rate),
        5 => load_ron_preset(PRESET_EX5, sample_rate),
        6 => load_ron_preset(PRESET_EX6, sample_rate),
        // 7: American Crossplane V8 (uneven bank firing + deep rumble)
        7 => build_custom_engine(
            sample_rate,
            &[0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
            &[1.8, 2.5, 1.4, 2.8, 1.6, 2.4, 1.9, 2.7],
            4.8,
            &[3.2, 4.6, 2.1, 5.4],
            0.11,
            2.2,
            2.8,
            0.32,
            0.65,
            0.09,
            1.6,
            0.008,
        ),
        // 8: High-revving V10 F1 Screamer (even firing, short headers)
        8 => build_custom_engine(
            sample_rate,
            &[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
            &[0.75, 0.82, 0.78, 0.85, 0.80],
            2.3,
            &[1.4, 1.9, 2.3, 1.1],
            0.075,
            2.0,
            2.1,
            0.38,
            0.62,
            0.04,
            2.2,
            0.002,
        ),
        // 9: Naturally Aspirated V12 Supercar
        9 => build_custom_engine(
            sample_rate,
            &[
                0.0, 0.0833, 0.1667, 0.25, 0.3333, 0.4167, 0.5, 0.5833, 0.6667, 0.75, 0.8333,
                0.9167,
            ],
            &[0.95, 1.05, 0.98, 1.08, 1.0, 1.02],
            2.8,
            &[1.7, 2.2, 2.9, 1.4],
            0.08,
            1.8,
            2.0,
            0.36,
            0.62,
            0.04,
            1.9,
            0.002,
        ),
        // 10: Unequal-length header Boxer-4 (Subie rumble)
        10 => build_custom_engine(
            sample_rate,
            &[0.0, 0.25, 0.5, 0.75],
            &[0.8, 2.3, 0.9, 2.45],
            4.2,
            &[2.9, 3.8, 2.1, 4.5],
            0.12,
            2.6,
            3.1,
            0.34,
            0.64,
            0.08,
            1.8,
            0.006,
        ),
        // 11: Ferrari flat-plane V8 (458 / F8) - even firing, short equal headers
        11 => build_custom_engine(sr, &even(8), &[0.9, 0.95, 0.9, 0.95], 2.6, &[1.6, 2.1, 2.7, 1.3], 0.085, 2.0, 2.2, 0.36, 0.62, 0.05, 2.0, 0.003),
        // 12: Porsche flat-6 NA (911 GT3 4.0)
        12 => build_custom_engine(sr, &even(6), &[1.1, 1.25, 1.15, 1.3, 1.2, 1.05], 3.0, &[1.9, 2.6, 3.2, 1.5], 0.085, 2.1, 2.4, 0.40, 0.60, 0.05, 2.1, 0.003),
        // 13: BMW inline-6 (M3 S54 / B58)
        13 => build_custom_engine(sr, &even(6), &[1.4, 1.5, 1.45, 1.55, 1.5, 1.4], 3.4, &[2.2, 2.9, 3.6, 1.8], 0.09, 2.0, 2.5, 0.34, 0.60, 0.06, 1.7, 0.004),
        // 14: Nissan GT-R VR38 twin-turbo V6
        14 => build_custom_engine(sr, &even(6), &[1.9, 2.0, 1.95, 2.05, 2.0, 1.9], 3.8, &[2.6, 3.3, 4.1, 2.0], 0.10, 1.9, 2.6, 0.42, 0.55, 0.06, 2.6, 0.004),
        // 15: Toyota Supra 2JZ-GTE inline-6 turbo
        15 => build_custom_engine(sr, &even(6), &[1.6, 1.7, 1.65, 1.75, 1.7, 1.6], 4.0, &[2.8, 3.5, 4.3, 2.1], 0.095, 2.1, 2.6, 0.45, 0.58, 0.05, 2.8, 0.004),
        // 16: Mazda RX-7 13B twin rotor (4 combustion events / 720deg, long burn, no pistons)
        16 => build_custom_engine(sr, &even(4), &[0.55, 0.6, 0.55, 0.6], 2.2, &[1.2, 1.6, 2.0, 0.9], 0.16, 2.8, 1.2, 0.30, 0.70, 0.03, 2.0, 0.010),
        // 17: Bugatti W16 quad-turbo
        17 => build_custom_engine(sr, &even(16), &[1.3, 1.4, 1.35, 1.45], 3.6, &[2.4, 3.0, 3.8, 1.9], 0.08, 1.6, 1.8, 0.45, 0.55, 0.04, 3.0, 0.002),
        // 18: 1990s F1 V12 (Ferrari 412T)
        18 => build_custom_engine(sr, &even(12), &[0.6, 0.62, 0.61, 0.63, 0.6, 0.62], 1.8, &[1.0, 1.3, 1.6, 0.8], 0.07, 2.0, 1.8, 0.40, 0.62, 0.03, 2.4, 0.001),
        // 19: 2006 F1 2.4L V8 (Cosworth CA2006)
        19 => build_custom_engine(sr, &even(8), &[0.55, 0.57, 0.56, 0.58], 1.6, &[0.9, 1.2, 1.5, 0.7], 0.07, 2.1, 1.9, 0.40, 0.64, 0.03, 2.4, 0.001),
        // 20: Harley-Davidson 45deg V-twin (potato-potato 315/405 firing)
        20 => build_custom_engine(sr, &[0.0, 0.5625], &[2.6, 3.0], 5.5, &[3.6, 4.8, 2.4, 5.8], 0.13, 3.2, 3.6, 0.28, 0.70, 0.12, 1.4, 0.015),
        // 21: Ducati 90deg L-twin (270/450 firing)
        21 => build_custom_engine(sr, &[0.0, 0.375], &[1.2, 1.4], 3.0, &[2.0, 2.6, 1.5, 3.1], 0.10, 2.8, 3.0, 0.34, 0.66, 0.08, 1.8, 0.008),
        // 22: Yamaha R1 crossplane inline-4 (270-180-90-180)
        22 => build_custom_engine(sr, &[0.0, 0.375, 0.625, 0.75], &[0.8, 0.85, 0.82, 0.88], 2.4, &[1.4, 1.9, 2.3, 1.1], 0.08, 2.4, 2.4, 0.38, 0.62, 0.05, 2.0, 0.004),
        // 23: Honda CBR flat-plane inline-4 screamer
        23 => build_custom_engine(sr, &even(4), &[0.6, 0.62, 0.6, 0.62], 2.0, &[1.1, 1.5, 1.9, 0.9], 0.075, 2.2, 2.2, 0.40, 0.60, 0.04, 2.2, 0.003),
        // 24: Single-cylinder thumper (KTM 690 / dirt bike)
        24 => build_custom_engine(sr, &[0.0], &[1.8], 4.0, &[2.6, 3.4, 1.9, 4.2], 0.12, 3.4, 3.8, 0.30, 0.68, 0.12, 1.6, 0.012),
        // 25: Diesel truck inline-6 (Cummins) - slow burn, long pipes
        25 => build_custom_engine(sr, &even(6), &[3.0, 3.2, 3.1, 3.3, 3.2, 3.0], 7.0, &[4.5, 5.8, 7.2, 3.6], 0.20, 3.0, 3.8, 0.40, 0.55, 0.15, 3.2, 0.008),
        // 26: Air-cooled flat-4 (classic VW Beetle / Porsche 356)
        26 => build_custom_engine(sr, &even(4), &[1.6, 2.0, 1.6, 2.0], 3.6, &[2.4, 3.2, 1.8, 4.0], 0.12, 2.6, 3.2, 0.30, 0.64, 0.12, 1.4, 0.012),
        // 27: NASCAR / race crossplane V8 - open long headers
        27 => build_custom_engine(sr, &even(8), &[2.2, 3.0, 1.7, 3.2, 1.9, 2.9, 2.3, 3.1], 5.2, &[3.4, 4.8, 2.3, 5.6], 0.12, 2.6, 3.0, 0.30, 0.70, 0.10, 1.5, 0.010),
        _ => load_ron_preset(PRESET_DEFAULT, sample_rate),
    }
}

/// Evenly spaced firing offsets across the 720deg 4-stroke cycle
fn even(n: usize) -> Vec<f32> {
    (0..n).map(|i| i as f32 / n as f32).collect()
}

#[no_mangle]
pub extern "C" fn engine_init(sample_rate: f32) {
    let sr = (sample_rate as u32).clamp(22050, 96000);
    let engine = build_preset(0, sr);
    let rpm = engine.rpm.clamp(600.0, 12000.0);
    let generator = Generator::new(sr, engine);
    unsafe {
        STATE = Some(SynthState {
            sample_rate: sr,
            generator,
            target_rpm: rpm,
            current_rpm: rpm,
            target_throttle: 0.0,
            current_throttle: 0.0,
            mix_intake: 1.0,
            mix_exhaust: 1.0,
            mix_vib: 1.0,
        });
    }
}

#[no_mangle]
pub extern "C" fn engine_load_preset(preset_id: u32) -> u32 {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            let sr = state.sample_rate;
            let engine = build_preset(preset_id, sr);
            let cyls = engine.cylinders.len() as u32;
            let vol = state.generator.volume;
            state.generator = Generator::new(sr, engine);
            state.generator.volume = vol;
            // Warm up waveguides slightly to avoid initial silence/click
            for _ in 0..256 {
                state.generator.generate_sample(
                    state.current_rpm,
                    state.current_throttle,
                    state.mix_intake,
                    state.mix_exhaust,
                    state.mix_vib,
                );
            }
            return cyls;
        }
    }
    0
}

#[no_mangle]
pub extern "C" fn engine_set_rpm(rpm: f32) {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            state.target_rpm = rpm.clamp(400.0, 18000.0);
        }
    }
}

#[no_mangle]
pub extern "C" fn engine_set_throttle(throttle: f32) {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            state.target_throttle = throttle.clamp(0.0, 1.0);
        }
    }
}

#[no_mangle]
pub extern "C" fn engine_set_volume(vol: f32) {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            state.generator.volume = vol.clamp(0.0, 0.5);
        }
    }
}

#[no_mangle]
pub extern "C" fn engine_set_mix(intake: f32, exhaust: f32, vib: f32) {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            state.mix_intake = intake.clamp(0.0, 2.5);
            state.mix_exhaust = exhaust.clamp(0.0, 2.5);
            state.mix_vib = vib.clamp(0.0, 2.5);
        }
    }
}

#[no_mangle]
pub extern "C" fn engine_set_valve_timing(intake_shift: f32, exhaust_shift: f32) {
    unsafe {
        if let Some(state) = STATE.as_mut() {
            state.generator.engine.intake_valve_shift = intake_shift.clamp(-0.5, 0.5);
            state.generator.engine.exhaust_valve_shift = exhaust_shift.clamp(-0.5, 0.5);
        }
    }
}

#[no_mangle]
pub extern "C" fn engine_get_output_ptr() -> *const f32 {
    unsafe { OUTPUT_BUF.as_ptr() }
}

#[no_mangle]
pub extern "C" fn engine_process(frames: usize) {
    let n = frames.min(MAX_FRAMES);
    unsafe {
        if let Some(state) = STATE.as_mut() {
            for i in 0..n {
                // Smooth RPM & throttle per sample to prevent zipper/click artifacts
                state.current_rpm += (state.target_rpm - state.current_rpm) * 0.004;
                state.current_throttle += (state.target_throttle - state.current_throttle) * 0.005;

                OUTPUT_BUF[i] = state.generator.generate_sample(
                    state.current_rpm,
                    state.current_throttle,
                    state.mix_intake,
                    state.mix_exhaust,
                    state.mix_vib,
                );
            }
        } else {
            for i in 0..n {
                OUTPUT_BUF[i] = 0.0;
            }
        }
    }
}
