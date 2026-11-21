import { CLUSTERS, drawCluster } from './clusters.js';

const PRESETS = [
  {
    id: 0,
    name: '经典直列四缸 (I4)',
    sub: '4 缸 · 均衡经典声浪',
    cars: '代表车型：本田 Civic Type R / 高尔夫 GTI',
    cyls: 4,
    idle: 900,
    redline: 7500,
    maxRpm: 8500,
  },
  {
    id: 7,
    name: '美式十字曲轴 V8',
    sub: '8 缸 · 浑厚低沉煮水声',
    cars: '代表车型：福特 Mustang GT / 科尔维特 / 挑战者',
    cyls: 8,
    idle: 750,
    redline: 6800,
    maxRpm: 7500,
  },
  {
    id: 8,
    name: '高转自然吸气 V10',
    sub: '10 缸 · 标志性高频尖啸',
    cars: '代表车型：雷克萨斯 LFA / 保时捷 Carrera GT / Huracán',
    cyls: 10,
    idle: 1400,
    redline: 13500,
    maxRpm: 15000,
  },
  {
    id: 9,
    name: '自然吸气 V12 超跑',
    sub: '12 缸 · 绵密高亢声浪',
    cars: '代表车型：法拉利 812 / 兰博基尼 Aventador / 帕加尼 Zonda',
    cyls: 12,
    idle: 1050,
    redline: 9200,
    maxRpm: 10500,
  },
  {
    id: 10,
    name: '水平对置 Boxer-4',
    sub: '4 缸 · 不等长芭蕉煮水',
    cars: '代表车型：斯巴鲁 WRX STI / 丰田 86 / BRZ',
    cyls: 4,
    idle: 850,
    redline: 7400,
    maxRpm: 8200,
  },
  {
    id: 1,
    name: '赛用十缸 (V10 Race)',
    sub: '10 缸 · 暴躁直通排气',
    cars: '代表车型：奥迪 R8 V10 / 兰博基尼 Gallardo',
    cyls: 10,
    idle: 1100,
    redline: 9000,
    maxRpm: 10000,
  },
  {
    id: 2,
    name: '街道十缸 (V10 Street)',
    sub: '10 缸 · 浑厚中低频',
    cars: '代表车型：宝马 M5 (E60) / 道奇 Viper',
    cyls: 10,
    idle: 950,
    redline: 8200,
    maxRpm: 9200,
  },
  {
    id: 3,
    name: '性能直列三缸 (I3)',
    sub: '3 缸 · 独特三缸节奏',
    cars: '代表车型：丰田 GR Yaris / GR Corolla / 柯尼塞格 Gemera',
    cyls: 3,
    idle: 850,
    redline: 7600,
    maxRpm: 8500,
  },
  {
    id: 4,
    name: '高转轻量化四缸 (I4 NA)',
    sub: '4 缸 · 轻快清脆高转',
    cars: '代表车型：本田 S2000 / 马自达 MX-5 / 路特斯 Elise',
    cyls: 4,
    idle: 900,
    redline: 8400,
    maxRpm: 9200,
  },
  {
    id: 5,
    name: '经典直列五缸 (I5)',
    sub: '5 缸 · “小 V10” 独特声浪',
    cars: '代表车型：奥迪 RS3 / TT RS / 沃尔沃 850R',
    cyls: 5,
    idle: 850,
    redline: 7800,
    maxRpm: 8800,
  },
  {
    id: 6,
    name: '拉力性能四缸 (I4 Rally)',
    sub: '4 缸 · 激进进排气响应',
    cars: '代表车型：三菱 Lancer Evo IX / AMG A45',
    cyls: 4,
    idle: 900,
    redline: 8000,
    maxRpm: 9000,
  },
];

const GEAR_RATIOS = [0, 3.4, 2.35, 1.72, 1.32, 1.05, 0.85]; // index 0 = Neutral

// Audio state
let audioCtx = null;
let workletNode = null;
let scriptNode = null;
let localWasm = null;
let localMemory = null;
let localOutPtr = 0;
let localPower = false;
let analyser = null;
let isRunning = false;
let wasmReady = false;

// Pre-fetch Wasm binary on page load so clicking START unlocks Safari audio immediately without network delay
const wasmBytesPromise = fetch('engine_dsp.wasm')
  .then((res) => {
    if (!res.ok) throw new Error(`无法加载 engine_dsp.wasm (${res.status})`);
    return res.arrayBuffer();
  })
  .catch((err) => {
    console.error('Pre-fetch engine_dsp.wasm failed:', err);
    return null;
  });

const IS_SAFARI =
  /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg|CriOS|FxiOS/i.test(navigator.userAgent);

// Simulation state
let activePreset = PRESETS[0];
let activeBrand = 'all';
let clusterStyle = CLUSTERS[0].id;
let rpm = activePreset.idle;
let gear = 0; // 0 = N, 1..6
let throttlePressed = false;
let manualRpmMode = false;
let autoShift = true;
let limiterCut = false;
let limiterTimer = 0;

// DOM refs
const statusDot = document.getElementById('statusDot');
const ignitionBtn = document.getElementById('ignitionBtn');
const ignitionText = document.getElementById('ignitionText');
const brandTabs = document.getElementById('brandTabs');
const clusterSwitcher = document.getElementById('clusterSwitcher');
const activeClusterLabel = document.getElementById('activeClusterLabel');
const prevClusterBtn = document.getElementById('prevClusterBtn');
const nextClusterBtn = document.getElementById('nextClusterBtn');
const throttleBtn = document.getElementById('throttleBtn');
const shiftUpBtn = document.getElementById('shiftUpBtn');
const shiftDownBtn = document.getElementById('shiftDownBtn');
const manualRpmToggle = document.getElementById('manualRpmToggle');
const autoShiftToggle = document.getElementById('autoShiftToggle');
const manualRpmRow = document.getElementById('manualRpmRow');
const manualRpmSlider = document.getElementById('manualRpmSlider');
const manualRpmVal = document.getElementById('manualRpmVal');
const presetGrid = document.getElementById('presetGrid');
const activeEngineMeta = document.getElementById('activeEngineMeta');

const volSlider = document.getElementById('volSlider');
const intakeSlider = document.getElementById('intakeSlider');
const exhaustSlider = document.getElementById('exhaustSlider');
const vibSlider = document.getElementById('vibSlider');
const inValveSlider = document.getElementById('inValveSlider');
const exValveSlider = document.getElementById('exValveSlider');

const tachCanvas = document.getElementById('tachCanvas');
const tachCtx = tachCanvas.getContext('2d');
const waveCanvas = document.getElementById('waveCanvas');
const waveCtx = waveCanvas.getContext('2d');

const TACH_W = 420;
const TACH_H = 340;
const WAVE_W = 420;
const WAVE_H = 72;

function setupHiDPI(canvas, ctx, logicalW, logicalH) {
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(logicalH * dpr);
  canvas.style.width = '100%';
  canvas.style.maxWidth = `${logicalW}px`;
  canvas.style.height = 'auto';
  canvas.style.aspectRatio = `${logicalW} / ${logicalH}`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

setupHiDPI(tachCanvas, tachCtx, TACH_W, TACH_H);
setupHiDPI(waveCanvas, waveCtx, WAVE_W, WAVE_H);

function renderClusterPills() {
  const list = activeBrand === 'all' ? CLUSTERS : CLUSTERS.filter((c) => c.brand === activeBrand);
  clusterSwitcher.innerHTML = '';
  for (const c of list) {
    const btn = document.createElement('button');
    btn.className = 'cluster-tab' + (c.id === clusterStyle ? ' active' : '');
    btn.dataset.style = c.id;
    btn.textContent = c.name;
    clusterSwitcher.appendChild(btn);
  }
  const cur = CLUSTERS.find((c) => c.id === clusterStyle) || CLUSTERS[0];
  activeClusterLabel.textContent = `${cur.brandLabel} · ${cur.name}`;
}

function cycleCluster(delta) {
  const idx = CLUSTERS.findIndex((c) => c.id === clusterStyle);
  const next = CLUSTERS[(idx + delta + CLUSTERS.length) % CLUSTERS.length];
  clusterStyle = next.id;
  if (activeBrand !== 'all' && next.brand !== activeBrand) {
    activeBrand = 'all';
    brandTabs.querySelectorAll('.brand-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.brand === 'all');
    });
  }
  renderClusterPills();
}

brandTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.brand-tab');
  if (!btn) return;
  activeBrand = btn.dataset.brand;
  brandTabs.querySelectorAll('.brand-tab').forEach((b) => {
    b.classList.toggle('active', b === btn);
  });
  const list = activeBrand === 'all' ? CLUSTERS : CLUSTERS.filter((c) => c.brand === activeBrand);
  if (!list.some((c) => c.id === clusterStyle) && list.length > 0) {
    clusterStyle = list[0].id;
  }
  renderClusterPills();
});

clusterSwitcher.addEventListener('click', (e) => {
  const btn = e.target.closest('.cluster-tab');
  if (!btn) return;
  clusterStyle = btn.dataset.style;
  renderClusterPills();
});

prevClusterBtn.onclick = () => cycleCluster(-1);
nextClusterBtn.onclick = () => cycleCluster(1);
renderClusterPills();

// Render preset buttons
function renderPresets() {
  presetGrid.innerHTML = '';
  for (const p of PRESETS) {
    const btn = document.createElement('button');
    btn.className = 'preset-card' + (p.id === activePreset.id ? ' active' : '');
    btn.innerHTML = `<div class="title">${p.name}</div><div class="sub">${p.sub}</div><div class="cars">${p.cars}</div>`;
    btn.onclick = () => selectPreset(p);
    presetGrid.appendChild(btn);
  }
  activeEngineMeta.textContent = `${activePreset.cyls} 缸 · 红线 ${activePreset.redline} RPM`;
  manualRpmSlider.min = Math.max(500, activePreset.idle - 200);
  manualRpmSlider.max = activePreset.maxRpm;
}

function sendAudioMsg(msg) {
  if (!wasmReady) return;
  if (workletNode) {
    workletNode.port.postMessage(msg);
    return;
  }
  if (!localWasm) return;
  switch (msg.type) {
    case 'preset':
      localWasm.engine_load_preset(msg.id >>> 0);
      break;
    case 'rpm':
      localWasm.engine_set_rpm(msg.value);
      break;
    case 'throttle':
      localWasm.engine_set_throttle(msg.value);
      break;
    case 'volume':
      localWasm.engine_set_volume(msg.value);
      break;
    case 'mix':
      localWasm.engine_set_mix(msg.intake, msg.exhaust, msg.vib);
      break;
    case 'valve':
      localWasm.engine_set_valve_timing(msg.intakeShift, msg.exhaustShift);
      break;
    case 'power':
      localPower = Boolean(msg.on);
      break;
  }
}

function selectPreset(preset) {
  activePreset = preset;
  rpm = Math.max(preset.idle, Math.min(rpm, preset.redline));
  renderPresets();
  if (wasmReady) {
    sendAudioMsg({ type: 'preset', id: preset.id });
    syncTuning();
  }
}

function unlockSafariAudio(ctx) {
  // Allow Web Audio even when iPhone physical Silent Switch is ON (iOS 17+ Safari)
  try {
    if (navigator.audioSession) {
      navigator.audioSession.type = 'playback';
    }
  } catch (_) {}

  // Play a 1-sample silent buffer synchronously inside user gesture to unlock Safari
  try {
    const buf = ctx.createBuffer(1, 1, ctx.sampleRate || 44100);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch (_) {}

  ctx.resume().catch(() => {});
}

async function initScriptProcessorFallback(wasmBytes) {
  const { instance } = await WebAssembly.instantiate(wasmBytes.slice(0), {});
  localWasm = instance.exports;
  localMemory = instance.exports.memory;
  localWasm.engine_init(audioCtx.sampleRate);
  localOutPtr = localWasm.engine_get_output_ptr();
  localPower = true;

  // 1024 samples (~21ms @ 48kHz), processed in 512-sample chunks matching Wasm MAX_FRAMES
  scriptNode = audioCtx.createScriptProcessor(1024, 0, 2);
  scriptNode.onaudioprocess = (e) => {
    const outL = e.outputBuffer.getChannelData(0);
    const outR = e.outputBuffer.getChannelData(1);
    const total = outL.length;

    if (!localWasm || !localPower) {
      outL.fill(0);
      outR.fill(0);
      return;
    }

    let offset = 0;
    while (offset < total) {
      const chunk = Math.min(512, total - offset);
      localWasm.engine_process(chunk);
      const pcm = new Float32Array(localMemory.buffer, localOutPtr, chunk);
      outL.set(pcm, offset);
      outR.set(pcm, offset);
      offset += chunk;
    }
  };

  scriptNode.connect(analyser);
  analyser.connect(audioCtx.destination);
  wasmReady = true;
}

async function initAudio() {
  if (audioCtx && wasmReady) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  unlockSafariAudio(audioCtx);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;

  let wasmBytes = await wasmBytesPromise;
  if (!wasmBytes) {
    const wasmRes = await fetch('engine_dsp.wasm');
    if (!wasmRes.ok) {
      throw new Error(`无法加载 engine_dsp.wasm (${wasmRes.status})，请先运行 ./build.sh`);
    }
    wasmBytes = await wasmRes.arrayBuffer();
  }

  // Safari (iOS & macOS) has known AudioWorklet + Wasm silent-output bugs;
  // use rock-solid main-thread Wasm + ScriptProcessorNode on Safari, and AudioWorklet elsewhere
  const canUseWorklet = Boolean(audioCtx.audioWorklet) && !IS_SAFARI;

  if (canUseWorklet) {
    try {
      await audioCtx.audioWorklet.addModule('engine-worklet.js');
      workletNode = new AudioWorkletNode(audioCtx, 'engine-worklet-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      });
      workletNode.connect(analyser);
      analyser.connect(audioCtx.destination);

      const copy = wasmBytes.slice(0);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('AudioWorklet init timeout')), 2000);
        workletNode.port.onmessage = (e) => {
          if (e.data.type === 'ready') {
            clearTimeout(timer);
            wasmReady = true;
            resolve();
          } else if (e.data.type === 'error') {
            clearTimeout(timer);
            reject(new Error(e.data.message));
          }
        };
        workletNode.port.postMessage({ type: 'init', wasmBytes: copy }, [copy]);
      });
    } catch (err) {
      console.warn('AudioWorklet unavailable, falling back to ScriptProcessor:', err);
      if (workletNode) {
        try {
          workletNode.disconnect();
        } catch (_) {}
        workletNode = null;
      }
      await initScriptProcessorFallback(wasmBytes);
    }
  } else {
    await initScriptProcessorFallback(wasmBytes);
  }

  sendAudioMsg({ type: 'preset', id: activePreset.id });
  syncTuning();
}

function syncTuning() {
  if (!wasmReady) return;
  sendAudioMsg({ type: 'volume', value: parseFloat(volSlider.value) });
  sendAudioMsg({
    type: 'mix',
    intake: parseFloat(intakeSlider.value),
    exhaust: parseFloat(exhaustSlider.value),
    vib: parseFloat(vibSlider.value),
  });
  sendAudioMsg({
    type: 'valve',
    intakeShift: parseFloat(inValveSlider.value),
    exhaustShift: parseFloat(exValveSlider.value),
  });
}

ignitionBtn.onclick = async () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Always unlock synchronously inside the click handler for Safari
    unlockSafariAudio(audioCtx);

    if (!wasmReady) {
      ignitionText.textContent = '加载 Wasm 中...';
      await initAudio();
    }
    if (!isRunning) {
      await audioCtx.resume();
      isRunning = true;
      rpm = activePreset.idle;
      sendAudioMsg({ type: 'power', on: true });
      ignitionBtn.classList.add('running');
      statusDot.classList.add('active');
      ignitionText.textContent = '熄火 (STOP)';
    } else {
      isRunning = false;
      sendAudioMsg({ type: 'power', on: false });
      ignitionBtn.classList.remove('running');
      statusDot.classList.remove('active');
      ignitionText.textContent = '启动引擎 (START)';
    }
  } catch (err) {
    alert('音频初始化失败: ' + err.message);
    ignitionText.textContent = '启动引擎 (START)';
  }
};

// Throttle & shifting controls
function setThrottle(down) {
  throttlePressed = down;
  throttleBtn.classList.toggle('pressed', down);
}

throttleBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (throttleBtn.setPointerCapture) {
    try {
      throttleBtn.setPointerCapture(e.pointerId);
    } catch (_) {}
  }
  setThrottle(true);
});
throttleBtn.addEventListener('pointerup', () => setThrottle(false));
throttleBtn.addEventListener('pointercancel', () => setThrottle(false));
throttleBtn.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('pointerup', () => setThrottle(false));
window.addEventListener('blur', () => setThrottle(false));

function shiftUp() {
  if (gear >= 6) return;
  const prevRatio = gear === 0 ? 4.2 : GEAR_RATIOS[gear];
  gear += 1;
  if (gear > 1) {
    rpm = Math.max(activePreset.idle, rpm * (GEAR_RATIOS[gear] / prevRatio));
  }
}

function shiftDown() {
  if (gear <= 0) return;
  const prevRatio = GEAR_RATIOS[gear];
  gear -= 1;
  if (gear >= 1) {
    rpm = Math.min(activePreset.maxRpm, rpm * (GEAR_RATIOS[gear] / prevRatio) * 1.04);
  }
}

shiftUpBtn.onclick = shiftUp;
shiftDownBtn.onclick = shiftDown;

// Prevent buttons/checkboxes from keeping focus and being toggled by Space/Arrows
document.addEventListener('click', (e) => {
  const el = e.target.closest('button, input[type="checkbox"], input[type="range"]');
  if (el) el.blur();
});

window.addEventListener(
  'keydown',
  (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) setThrottle(true);
      return;
    }
    if (e.repeat) return;
    if (e.code === 'KeyW') {
      e.preventDefault();
      setThrottle(true);
    } else if (e.code === 'KeyE' || e.code === 'ArrowUp') {
      e.preventDefault();
      shiftUp();
    } else if (e.code === 'KeyQ' || e.code === 'ArrowDown') {
      e.preventDefault();
      shiftDown();
    } else if (e.code === 'BracketLeft') {
      cycleCluster(-1);
    } else if (e.code === 'BracketRight') {
      cycleCluster(1);
    }
  },
  { capture: true }
);

window.addEventListener(
  'keyup',
  (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setThrottle(false);
    } else if (e.code === 'KeyW') {
      setThrottle(false);
    }
  },
  { capture: true }
);

manualRpmToggle.onchange = () => {
  manualRpmMode = manualRpmToggle.checked;
  manualRpmRow.style.opacity = manualRpmMode ? '1' : '0.45';
  manualRpmRow.style.pointerEvents = manualRpmMode ? 'auto' : 'none';
  if (manualRpmMode) {
    manualRpmSlider.value = Math.round(rpm);
    manualRpmVal.textContent = `${Math.round(rpm)} RPM`;
  }
};

autoShiftToggle.onchange = () => {
  autoShift = autoShiftToggle.checked;
};

manualRpmSlider.oninput = () => {
  manualRpmVal.textContent = `${manualRpmSlider.value} RPM`;
};

// Tuning sliders
function bindSlider(el, labelId, fmt) {
  el.oninput = () => {
    document.getElementById(labelId).textContent = fmt(parseFloat(el.value));
    syncTuning();
  };
}
bindSlider(volSlider, 'volVal', (v) => `${Math.round((v / 0.45) * 100)}%`);
bindSlider(intakeSlider, 'intakeVal', (v) => `${v.toFixed(2)}×`);
bindSlider(exhaustSlider, 'exhaustVal', (v) => `${v.toFixed(2)}×`);
bindSlider(vibSlider, 'vibVal', (v) => `${v.toFixed(2)}×`);
bindSlider(inValveSlider, 'inValveVal', (v) => v.toFixed(2));
bindSlider(exValveSlider, 'exValveVal', (v) => v.toFixed(2));

document.getElementById('resetMixBtn').onclick = () => {
  volSlider.value = 0.16;
  intakeSlider.value = 1.0;
  exhaustSlider.value = 1.0;
  vibSlider.value = 1.0;
  inValveSlider.value = 0.0;
  exValveSlider.value = 0.0;
  document.getElementById('volVal').textContent = '36%';
  document.getElementById('intakeVal').textContent = '1.00×';
  document.getElementById('exhaustVal').textContent = '1.00×';
  document.getElementById('vibVal').textContent = '1.00×';
  document.getElementById('inValveVal').textContent = '0.00';
  document.getElementById('exValveVal').textContent = '0.00';
  syncTuning();
};

// Physics + Visual Loop (60fps)
let lastTime = performance.now();

function stepPhysics(dt) {
  if (!isRunning) {
    rpm += (0 - rpm) * Math.min(1, dt * 6);
    return;
  }

  if (manualRpmMode) {
    rpm = parseFloat(manualRpmSlider.value);
    if (wasmReady) {
      sendAudioMsg({ type: 'rpm', value: rpm });
      sendAudioMsg({ type: 'throttle', value: 0.65 });
    }
    return;
  }

  const idle = activePreset.idle;
  const redline = activePreset.redline;

  // Gear load factor: Neutral revs very fast, higher gears climb slower
  const accelRate = gear === 0 ? 5200 : 1100 * GEAR_RATIOS[gear];
  const engineBrake = gear === 0 ? 3200 : 850 * GEAR_RATIOS[gear];

  if (limiterCut) {
    limiterTimer -= dt;
    rpm -= 4200 * dt;
    if (limiterTimer <= 0) limiterCut = false;
  } else if (throttlePressed) {
    rpm += accelRate * dt;
    if (rpm >= redline) {
      if (autoShift && gear >= 1 && gear < 6) {
        shiftUp();
      } else {
        rpm = redline;
        limiterCut = true;
        limiterTimer = 0.065; // crisp rev-limiter bounce
      }
    }
  } else {
    rpm -= engineBrake * dt;
    if (rpm < idle) {
      rpm = idle + Math.sin(performance.now() * 0.015) * 18;
    }
  }

  if (wasmReady) {
    sendAudioMsg({ type: 'rpm', value: Math.max(500, rpm) });
    sendAudioMsg({
      type: 'throttle',
      value: throttlePressed && !limiterCut ? 1.0 : 0.08,
    });
  }
}

function drawTachometer() {
  drawCluster(tachCtx, TACH_W, TACH_H, clusterStyle, {
    rpm,
    gear,
    maxRpm: activePreset.maxRpm,
    redline: activePreset.redline,
  });
}

function drawWaveform() {
  const w = WAVE_W;
  const h = WAVE_H;
  waveCtx.clearRect(0, 0, w, h);

  waveCtx.strokeStyle = '#1f2937';
  waveCtx.lineWidth = 1;
  waveCtx.beginPath();
  waveCtx.moveTo(0, h / 2);
  waveCtx.lineTo(w, h / 2);
  waveCtx.stroke();

  if (!analyser || !isRunning) return;

  const data = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(data);

  waveCtx.strokeStyle = '#00c8ff';
  waveCtx.lineWidth = 1.8;
  waveCtx.beginPath();
  const slice = w / data.length;
  for (let i = 0; i < data.length; i++) {
    const x = i * slice;
    const y = h / 2 + data[i] * (h * 0.44);
    if (i === 0) waveCtx.moveTo(x, y);
    else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();
}

function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  stepPhysics(dt);
  drawTachometer();
  drawWaveform();

  requestAnimationFrame(frame);
}

renderPresets();
requestAnimationFrame(frame);
