import { CLUSTERS, CLUSTER_BRANDS, drawCluster } from './clusters.js?v=7526016c';

// ---- iOS: block long-press "Search / Translate" menu, selection, pinch & double-tap zoom ----
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount) sel.removeAllRanges();
  },
  { passive: false }
);

const PRESET_CATS = [
  { id: 'all', label: '全部' },
  { id: 'jdm', label: '日系 JDM' },
  { id: 'street', label: '欧美街车' },
  { id: 'super', label: '超跑' },
  { id: 'race', label: '赛车' },
  { id: 'moto', label: '摩托' },
  { id: 'classic', label: '经典 / 其他' },
];

const PRESETS = [
  { id: 0, cat: 'jdm', name: '经典直列四缸 (I4)', sub: '4 缸 · 均衡经典声浪', cars: '代表车型：本田 Civic Type R / 高尔夫 GTI', cyls: 4, idle: 900, redline: 7500, maxRpm: 8500 },
  { id: 4, cat: 'jdm', name: '高转自吸四缸 (I4 NA)', sub: '4 缸 · 轻快清脆高转', cars: '代表车型：本田 S2000 / 马自达 MX-5 / 路特斯 Elise', cyls: 4, idle: 900, redline: 8400, maxRpm: 9200 },
  { id: 15, cat: 'jdm', name: '2JZ 直列六缸涡轮', sub: '6 缸 · 丝滑顺畅 + 涡轮', cars: '代表车型：丰田 Supra MK4 (A80)', cyls: 6, idle: 800, redline: 7200, maxRpm: 8000 },
  { id: 14, cat: 'jdm', name: 'VR38 双涡轮 V6', sub: '6 缸 · 低沉凶狠', cars: '代表车型：日产 GT-R (R35)', cyls: 6, idle: 850, redline: 7100, maxRpm: 8000 },
  { id: 16, cat: 'jdm', name: '13B 双转子转子引擎', sub: '转子 · 标志性“Brap”声', cars: '代表车型：马自达 RX-7 (FD) / RX-8', cyls: 4, idle: 1000, redline: 9000, maxRpm: 10000 },
  { id: 10, cat: 'jdm', name: '水平对置 Boxer-4', sub: '4 缸 · 不等长芭蕉煮水', cars: '代表车型：斯巴鲁 WRX STI / 丰田 86 / BRZ', cyls: 4, idle: 850, redline: 7400, maxRpm: 8200 },
  { id: 6, cat: 'jdm', name: '拉力性能四缸 (I4 Rally)', sub: '4 缸 · 激进进排气响应', cars: '代表车型：三菱 Lancer Evo IX / AMG A45', cyls: 4, idle: 900, redline: 8000, maxRpm: 9000 },
  { id: 3, cat: 'jdm', name: '性能直列三缸 (I3)', sub: '3 缸 · 独特三缸节奏', cars: '代表车型：丰田 GR Yaris / GR Corolla', cyls: 3, idle: 850, redline: 7600, maxRpm: 8500 },
  { id: 7, cat: 'street', name: '美式十字曲轴 V8', sub: '8 缸 · 浑厚低沉煮水声', cars: '代表车型：福特 Mustang GT / 科尔维特 / 挑战者', cyls: 8, idle: 750, redline: 6800, maxRpm: 7500 },
  { id: 13, cat: 'street', name: '宝马直列六缸 (I6)', sub: '6 缸 · 经典“丝绸六”', cars: '代表车型：宝马 M3 (E46) / M2 / Z4', cyls: 6, idle: 800, redline: 8000, maxRpm: 9000 },
  { id: 5, cat: 'street', name: '经典直列五缸 (I5)', sub: '5 缸 · “小 V10” 独特声浪', cars: '代表车型：奥迪 RS3 / TT RS / 沃尔沃 850R', cyls: 5, idle: 850, redline: 7800, maxRpm: 8800 },
  { id: 2, cat: 'street', name: '街道十缸 (V10 Street)', sub: '10 缸 · 浑厚中低频', cars: '代表车型：宝马 M5 (E60) / 道奇 Viper', cyls: 10, idle: 950, redline: 8200, maxRpm: 9200 },
  { id: 11, cat: 'super', name: '平面曲轴 V8', sub: '8 缸 · 高亢嘶吼', cars: '代表车型：法拉利 458 / F8 / 迈凯伦 720S', cyls: 8, idle: 1000, redline: 9000, maxRpm: 10000 },
  { id: 12, cat: 'super', name: '自吸水平对置六缸', sub: '6 缸 · 9000 转机械交响', cars: '代表车型：保时捷 911 GT3 / GT3 RS', cyls: 6, idle: 900, redline: 9000, maxRpm: 10000 },
  { id: 8, cat: 'super', name: '高转自然吸气 V10', sub: '10 缸 · 标志性高频尖啸', cars: '代表车型：雷克萨斯 LFA / 保时捷 Carrera GT', cyls: 10, idle: 1400, redline: 9000, maxRpm: 10000 },
  { id: 1, cat: 'super', name: '赛用十缸 (V10 Race)', sub: '10 缸 · 暴躁直通排气', cars: '代表车型：奥迪 R8 V10 / 兰博基尼 Huracán', cyls: 10, idle: 1100, redline: 9000, maxRpm: 10000 },
  { id: 9, cat: 'super', name: '自然吸气 V12 超跑', sub: '12 缸 · 绵密高亢声浪', cars: '代表车型：法拉利 812 / 兰博基尼 Aventador / 帕加尼 Zonda', cyls: 12, idle: 1050, redline: 9200, maxRpm: 10500 },
  { id: 17, cat: 'super', name: 'W16 四涡轮', sub: '16 缸 · 低沉怪兽级', cars: '代表车型：布加迪 Veyron / Chiron', cyls: 16, idle: 900, redline: 6800, maxRpm: 7500 },
  { id: 18, cat: 'race', name: '90 年代 F1 V12', sub: '12 缸 · 17000 转天籁', cars: '代表车型：法拉利 412T / 641 F1', cyls: 12, idle: 3000, redline: 17000, maxRpm: 18000 },
  { id: 19, cat: 'race', name: '2006 F1 V8', sub: '8 缸 · 18000 转尖啸', cars: '代表车型：Cosworth CA2006 / 法拉利 248 F1', cyls: 8, idle: 4000, redline: 17500, maxRpm: 18000 },
  { id: 27, cat: 'race', name: 'NASCAR 赛道 V8', sub: '8 缸 · 开放直排轰鸣', cars: '代表车型：NASCAR Cup / 谢尔比 Cobra 427', cyls: 8, idle: 1100, redline: 9500, maxRpm: 10500 },
  { id: 22, cat: 'moto', name: '十字曲轴直列四缸', sub: '4 缸 · 类 V4 低吼', cars: '代表车型：雅马哈 YZF-R1 / MT-10', cyls: 4, idle: 1300, redline: 14000, maxRpm: 15000 },
  { id: 23, cat: 'moto', name: '高转直列四缸', sub: '4 缸 · 14000 转尖啸', cars: '代表车型：本田 CBR1000RR / 川崎 ZX-10R', cyls: 4, idle: 1300, redline: 14500, maxRpm: 16000 },
  { id: 21, cat: 'moto', name: '90° L 型双缸', sub: '2 缸 · 意式暴躁', cars: '代表车型：杜卡迪 Panigale 959 / Monster', cyls: 2, idle: 1200, redline: 11000, maxRpm: 12000 },
  { id: 20, cat: 'moto', name: '45° V 型双缸', sub: '2 缸 · “土豆土豆”节奏', cars: '代表车型：哈雷 Fat Boy / Street Glide', cyls: 2, idle: 800, redline: 5500, maxRpm: 6500 },
  { id: 24, cat: 'moto', name: '大单缸', sub: '1 缸 · 越野“突突”声', cars: '代表车型：KTM 690 / 本田 XR650', cyls: 1, idle: 1500, redline: 9000, maxRpm: 10000 },
  { id: 26, cat: 'classic', name: '风冷水平对置四缸', sub: '4 缸 · 复古“哒哒”声', cars: '代表车型：大众甲壳虫 / 保时捷 356', cyls: 4, idle: 850, redline: 4800, maxRpm: 5500 },
  { id: 25, cat: 'classic', name: '柴油直列六缸卡车', sub: '6 缸 · 低转重扭 + 涡轮', cars: '代表车型：道奇 Ram Cummins / 重卡', cyls: 6, idle: 650, redline: 3200, maxRpm: 4000 },
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
const wasmBytesPromise = fetch('engine_dsp.wasm?v=2286b53a')
  .then((res) => {
    if (!res.ok) throw new Error(`无法加载 engine_dsp.wasm?v=2286b53a (${res.status})`);
    return res.arrayBuffer();
  })
  .catch((err) => {
    console.error('Pre-fetch engine_dsp.wasm?v=2286b53a failed:', err);
    return null;
  });

const IS_IOS =
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_SAFARI =
  /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg|CriOS|FxiOS/i.test(navigator.userAgent);
// Every browser on iOS (Safari, Chrome, Edge, WeChat) uses WebKit under the hood
const USE_SCRIPT_PROCESSOR = IS_IOS || IS_SAFARI;

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
const presetTabs = document.getElementById('presetTabs');
let activePresetCat = 'all';
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
brandTabs.innerHTML = CLUSTER_BRANDS.map((b) => {
  const n = b.id === 'all' ? CLUSTERS.length : CLUSTERS.filter((c) => c.brand === b.id).length;
  return `<button class="brand-tab${b.id === 'all' ? ' active' : ''}" data-brand="${b.id}">${b.label} ${n}</button>`;
}).join('');
renderClusterPills();

// Render preset buttons
function renderPresets() {
  presetTabs.innerHTML = '';
  for (const c of PRESET_CATS) {
    const count = c.id === 'all' ? PRESETS.length : PRESETS.filter((p) => p.cat === c.id).length;
    const tab = document.createElement('button');
    tab.className = 'preset-tab' + (c.id === activePresetCat ? ' active' : '');
    tab.textContent = `${c.label} ${count}`;
    tab.onclick = () => {
      activePresetCat = c.id;
      renderPresets();
    };
    presetTabs.appendChild(tab);
  }

  presetGrid.innerHTML = '';
  const list = activePresetCat === 'all' ? PRESETS : PRESETS.filter((p) => p.cat === activePresetCat);
  for (const p of list) {
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

  // Use 1 input channel + silent oscillator driver so iOS WebKit reliably fires onaudioprocess!
  scriptNode = audioCtx.createScriptProcessor(2048, 1, 2);
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

  // Silent dummy driver keeps the audio graph active on iOS Safari / WebKit
  const dummyOsc = audioCtx.createOscillator();
  const silentGain = audioCtx.createGain();
  silentGain.gain.value = 0;
  dummyOsc.connect(silentGain);
  silentGain.connect(scriptNode);
  dummyOsc.start();

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
    const wasmRes = await fetch('engine_dsp.wasm?v=2286b53a');
    if (!wasmRes.ok) {
      throw new Error(`无法加载 engine_dsp.wasm?v=2286b53a (${wasmRes.status})，请先运行 ./build.sh`);
    }
    wasmBytes = await wasmRes.arrayBuffer();
  }

  // On iOS WebKit & macOS Safari, use main-thread Wasm + ScriptProcessorNode with silent driver
  const canUseWorklet = Boolean(audioCtx.audioWorklet) && !USE_SCRIPT_PROCESSOR;

  if (canUseWorklet) {
    try {
      await audioCtx.audioWorklet.addModule('engine-worklet.js?v=55919d26');
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
  // Auto-resume AudioContext on iOS if suspended/interrupted
  if (audioCtx && audioCtx.state !== 'running') {
    unlockSafariAudio(audioCtx);
  }
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

// pointerdown (not click) so shifting is instant and survives the double-tap guard on iOS
function bindTapButton(btn, fn) {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    fn();
  });
  btn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
}
bindTapButton(shiftUpBtn, shiftUp);
bindTapButton(shiftDownBtn, shiftDown);
throttleBtn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });

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

function updateSliderTrack(el) {
  const min = parseFloat(el.min) || 0;
  const max = parseFloat(el.max) || 100;
  const val = parseFloat(el.value) || 0;
  const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
  el.style.setProperty('--pct', `${Math.max(0, Math.min(100, pct))}%`);
}

manualRpmSlider.oninput = () => {
  manualRpmVal.textContent = `${manualRpmSlider.value} RPM`;
  updateSliderTrack(manualRpmSlider);
};
updateSliderTrack(manualRpmSlider);

// Tuning sliders
function bindSlider(el, labelId, fmt) {
  updateSliderTrack(el);
  el.oninput = () => {
    updateSliderTrack(el);
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
  [volSlider, intakeSlider, exhaustSlider, vibSlider, inValveSlider, exValveSlider].forEach(updateSliderTrack);
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
  const maxRpm = activePreset.maxRpm;
  const span = Math.max(2500, redline - idle);
  const limiterPeak = Math.min(maxRpm - 80, redline + span * 0.045);

  // Scale rev speed with engine's RPM range so F1/moto engines snap cleanly to redline
  const accelRate = gear === 0 ? span * 0.95 : span * 0.22 * GEAR_RATIOS[gear];
  const engineBrake = gear === 0 ? span * 0.52 : span * 0.15 * GEAR_RATIOS[gear];

  if (limiterCut) {
    limiterTimer -= dt;
    rpm -= span * 0.65 * dt;
    if (limiterTimer <= 0 || rpm <= redline - span * 0.02) limiterCut = false;
  } else if (throttlePressed) {
    rpm += accelRate * dt;
    if (rpm >= limiterPeak) {
      if (autoShift && gear >= 1 && gear < 6) {
        shiftUp();
      } else {
        rpm = limiterPeak;
        limiterCut = true;
        limiterTimer = 0.06; // crisp redline bounce inside the red zone
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
