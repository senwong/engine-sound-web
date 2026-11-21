class EngineWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.wasm = null;
    this.memory = null;
    this.outPtr = 0;
    this.running = false;

    this.port.onmessage = async (event) => {
      const msg = event.data;
      if (!msg || !msg.type) return;

      if (msg.type === 'init') {
        try {
          const { instance } = await WebAssembly.instantiate(msg.wasmBytes, {});
          this.wasm = instance.exports;
          this.memory = instance.exports.memory;
          this.wasm.engine_init(sampleRate);
          this.outPtr = this.wasm.engine_get_output_ptr();
          this.running = true;
          this.port.postMessage({ type: 'ready', sampleRate });
        } catch (err) {
          this.port.postMessage({ type: 'error', message: String(err) });
        }
        return;
      }

      if (!this.wasm) return;

      switch (msg.type) {
        case 'preset':
          this.wasm.engine_load_preset(msg.id >>> 0);
          break;
        case 'rpm':
          this.wasm.engine_set_rpm(msg.value);
          break;
        case 'throttle':
          this.wasm.engine_set_throttle(msg.value);
          break;
        case 'volume':
          this.wasm.engine_set_volume(msg.value);
          break;
        case 'mix':
          this.wasm.engine_set_mix(msg.intake, msg.exhaust, msg.vib);
          break;
        case 'valve':
          this.wasm.engine_set_valve_timing(msg.intakeShift, msg.exhaustShift);
          break;
        case 'power':
          this.running = Boolean(msg.on);
          break;
      }
    };
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    if (!output || output.length === 0) return true;

    const frames = output[0].length;
    if (!this.wasm || !this.running) {
      for (let ch = 0; ch < output.length; ch++) {
        output[ch].fill(0);
      }
      return true;
    }

    this.wasm.engine_process(frames);
    // Re-create view in case Wasm memory grew
    const pcm = new Float32Array(this.memory.buffer, this.outPtr, frames);

    for (let ch = 0; ch < output.length; ch++) {
      output[ch].set(pcm);
    }
    return true;
  }
}

registerProcessor('engine-worklet-processor', EngineWorkletProcessor);
