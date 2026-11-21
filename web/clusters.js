export const CLUSTERS = [
  // Porsche
  { id: 'porsche_gt3', brand: 'porsche', brandLabel: '保时捷', name: '911 GT3 (钛灰)' },
  { id: 'porsche_heritage', brand: 'porsche', brandLabel: '保时捷', name: '911 经典绿字' },
  { id: 'porsche_gt3rs', brand: 'porsche', brandLabel: '保时捷', name: 'GT3 RS 竞速黄' },
  { id: 'porsche_918', brand: 'porsche', brandLabel: '保时捷', name: '918 Spyder 酸绿' },
  { id: 'classic_930', brand: 'porsche', brandLabel: '保时捷', name: '930 Turbo (1975)' },
  { id: 'modern_992', brand: 'porsche', brandLabel: '保时捷', name: '992.2 全液晶' },
  // Ferrari
  { id: 'ferrari_yellow', brand: 'ferrari', brandLabel: '法拉利', name: '458/812 经典黄底' },
  { id: 'ferrari_red', brand: 'ferrari', brandLabel: '法拉利', name: '488 Pista 赛道红' },
  { id: 'ferrari_f40', brand: 'ferrari', brandLabel: '法拉利', name: 'F40 复古黑橙' },
  { id: 'classic_testarossa', brand: 'ferrari', brandLabel: '法拉利', name: 'Testarossa (1984)' },
  { id: 'modern_sf90', brand: 'ferrari', brandLabel: '法拉利', name: 'SF90 曲面屏' },
  // Lamborghini
  { id: 'lambo_aventador', brand: 'lambo', brandLabel: '兰博基尼', name: 'Aventador 战斗机' },
  { id: 'lambo_huracan', brand: 'lambo', brandLabel: '兰博基尼', name: 'Huracán CORSA' },
  { id: 'lambo_countach', brand: 'lambo', brandLabel: '兰博基尼', name: 'Countach 复古' },
  { id: 'classic_miura', brand: 'lambo', brandLabel: '兰博基尼', name: 'Miura (1966)' },
  { id: 'modern_revuelto', brand: 'lambo', brandLabel: '兰博基尼', name: 'Revuelto 数字' },
  // Classic sports cars
  { id: 'classic_300sl', brand: 'classic', brandLabel: '经典跑车', name: '奔驰 300SL 鸥翼' },
  { id: 'classic_etype', brand: 'classic', brandLabel: '经典跑车', name: '捷豹 E-Type' },
  { id: 'classic_db5', brand: 'classic', brandLabel: '经典跑车', name: '阿斯顿·马丁 DB5' },
  { id: 'classic_cobra', brand: 'classic', brandLabel: '经典跑车', name: '谢尔比 Cobra 427' },
  { id: 'classic_gt40', brand: 'classic', brandLabel: '经典跑车', name: '福特 GT40 Gulf' },
  { id: 'classic_e30', brand: 'classic', brandLabel: '经典跑车', name: '宝马 E30 M3' },
  // Modern sports cars
  { id: 'modern_r8', brand: 'modern', brandLabel: '现代跑车', name: '奥迪 R8 虚拟座舱' },
  { id: 'modern_amg', brand: 'modern', brandLabel: '现代跑车', name: '奔驰 AMG GT' },
  { id: 'modern_bmw_m', brand: 'modern', brandLabel: '现代跑车', name: '宝马 M4 数字' },
  { id: 'modern_c8', brand: 'modern', brandLabel: '现代跑车', name: '科尔维特 C8' },
  { id: 'modern_720s', brand: 'modern', brandLabel: '现代跑车', name: '迈凯伦 720S' },
  { id: 'modern_fordgt', brand: 'modern', brandLabel: '现代跑车', name: '福特 GT (2017)' },
  { id: 'modern_koenigsegg', brand: 'modern', brandLabel: '现代跑车', name: '柯尼塞格 Jesko' },
  // Hypercars & JDM
  { id: 'lfa', brand: 'other', brandLabel: '超跑/JDM', name: '雷克萨斯 LFA' },
  { id: 'mclaren_p1', brand: 'other', brandLabel: '超跑/JDM', name: '迈凯伦 P1 折叠赛道' },
  { id: 'pagani', brand: 'other', brandLabel: '超跑/JDM', name: '帕加尼 Huayra 腕表' },
  { id: 'bugatti', brand: 'other', brandLabel: '超跑/JDM', name: '布加迪 Chiron 深蓝' },
  { id: 'gtr_r34', brand: 'other', brandLabel: '超跑/JDM', name: 'GT-R R34 Nismo 白' },
  { id: 'supra_mk4', brand: 'other', brandLabel: '超跑/JDM', name: '丰田 Supra MK4' },
  { id: 'nsx_na1', brand: 'other', brandLabel: '超跑/JDM', name: '本田 NSX NA1' },
  { id: 'rx7_fd', brand: 'other', brandLabel: '超跑/JDM', name: '马自达 RX-7 FD' },
  { id: 's2000', brand: 'other', brandLabel: '超跑/JDM', name: '本田 S2000 数显' },
];

export const CLUSTER_BRANDS = [
  { id: 'all', label: '全部' },
  { id: 'porsche', label: '保时捷' },
  { id: 'ferrari', label: '法拉利' },
  { id: 'lambo', label: '兰博基尼' },
  { id: 'classic', label: '经典跑车' },
  { id: 'modern', label: '现代跑车' },
  { id: 'other', label: '超跑 / JDM' },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawShiftLeds(ctx, cx, y, rpmFrac, redlineFrac, count = 11) {
  const spacing = 16;
  const startX = cx - ((count - 1) * spacing) / 2;
  const activeStart = redlineFrac * 0.72;
  const flash = Math.floor(performance.now() / 70) % 2 === 0;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const thresh = activeStart + (redlineFrac - activeStart) * t;
    const on = rpmFrac >= thresh && (rpmFrac < redlineFrac || flash);
    const color = i < Math.floor(count * 0.36) ? '#22c55e' : i < Math.floor(count * 0.72) ? '#ff3b30' : '#38bdf8';

    ctx.save();
    ctx.beginPath();
    ctx.arc(startX + i * spacing, y, 4.2, 0, Math.PI * 2);
    if (on) {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = '#232a3a';
    }
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Shared high-precision round analog dial builder for Porsche / Ferrari / Pagani / Bugatti / GT-R / Countach
 */
function drawClassicRoundDial(ctx, w, h, state, theme) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const cy = h / 2 + (theme.shiftLeds ? 10 : 4);
  const R = theme.shiftLeds ? 148 : 152;
  const startAngle = theme.startAngle ?? Math.PI * 0.73;
  const endAngle = theme.endAngle ?? Math.PI * 2.27;
  const totalAngle = endAngle - startAngle;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;

  if (theme.shiftLeds) {
    drawShiftLeds(ctx, cx, 12, rpmFrac, redFrac, theme.shiftLedCount || 11);
  }

  // Outer bezel
  const bezelGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  bezelGrad.addColorStop(0, theme.bezel[0]);
  bezelGrad.addColorStop(0.45, theme.bezel[1]);
  bezelGrad.addColorStop(1, theme.bezel[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = bezelGrad;
  ctx.fill();

  // Dial face
  const faceGrad = ctx.createRadialGradient(cx, cy - 32, 10, cx, cy, R - 8);
  faceGrad.addColorStop(0, theme.face[0]);
  faceGrad.addColorStop(0.72, theme.face[1]);
  faceGrad.addColorStop(1, theme.face[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R - 8, 0, Math.PI * 2);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Optional outer hybrid/accent ring (e.g. Porsche 918 Acid Green, Bugatti Blue)
  if (theme.accentRing) {
    ctx.save();
    ctx.strokeStyle = theme.accentRing;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = theme.accentRing;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 11, startAngle, startAngle + totalAngle * rpmFrac);
    ctx.stroke();
    ctx.restore();
  }

  // Subtle inner track circle
  ctx.strokeStyle = theme.innerRing || 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, R - 13, 0, Math.PI * 2);
  ctx.stroke();

  // Redline zone band
  ctx.save();
  ctx.strokeStyle = theme.redZone;
  ctx.lineWidth = theme.redZoneWidth || 10;
  ctx.beginPath();
  ctx.arc(cx, cy, R - 20, startAngle + totalAngle * redFrac, endAngle);
  ctx.stroke();
  ctx.restore();

  // Optional amber warning band just before redline (e.g. RX-7)
  if (theme.warnZone) {
    const warnFrac = Math.max(0, (redline - 1000) / maxRpm);
    ctx.save();
    ctx.strokeStyle = theme.warnZone;
    ctx.lineWidth = theme.redZoneWidth || 10;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 20, startAngle + totalAngle * warnFrac, startAngle + totalAngle * redFrac);
    ctx.stroke();
    ctx.restore();
  }

  // Ticks & numerals
  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  const minorDiv = theme.minorDiv || 5;
  const minorStep = majorStep / minorDiv;

  for (let v = 0; v <= maxRpm; v += minorStep) {
    const ang = startAngle + totalAngle * (v / maxRpm);
    const isMajor = Math.abs(v % majorStep) < 0.01;
    const isRed = v >= redline;
    const rOut = R - 14;
    const rIn = isMajor ? R - 32 : R - 23;

    ctx.strokeStyle = isRed ? theme.redTick : isMajor ? theme.majorTick : theme.minorTick;
    ctx.lineWidth = isMajor ? 3 : 1.3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
    ctx.lineTo(cx + Math.cos(ang) * rOut, cy + Math.sin(ang) * rOut);
    ctx.stroke();

    if (isMajor) {
      const tr = R - 50;
      ctx.font = theme.numFont || '700 20px -apple-system, "Helvetica Neue", sans-serif';
      ctx.fillStyle = isRed ? theme.redNum : theme.numColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(Math.round(v / 1000)), cx + Math.cos(ang) * tr, cy + Math.sin(ang) * tr);
    }
  }

  // Dial branding & unit
  ctx.font = theme.titleFont || '800 13px -apple-system, sans-serif';
  ctx.fillStyle = theme.titleColor;
  ctx.textAlign = 'center';
  ctx.fillText(theme.title, cx, cy - 42);
  ctx.font = '600 9px -apple-system, sans-serif';
  ctx.fillStyle = theme.subColor;
  ctx.fillText(theme.sub || '1/min × 1000', cx, cy - 26);

  // Optional French tricolor micro-badge for Bugatti
  if (theme.tricolor) {
    const bx = cx - 15;
    const by = cy - 60;
    ctx.fillStyle = '#0055a4';
    ctx.fillRect(bx, by, 10, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 10, by, 10, 3);
    ctx.fillStyle = '#ef4135';
    ctx.fillRect(bx + 20, by, 10, 3);
  }

  // BMW M tri-color stripe
  if (theme.mStripe) {
    const sx = cx - 15;
    const sy = cy - 62;
    ctx.fillStyle = '#81c4ff';
    ctx.fillRect(sx, sy, 10, 3);
    ctx.fillStyle = '#16588e';
    ctx.fillRect(sx + 10, sy, 10, 3);
    ctx.fillStyle = '#e7222e';
    ctx.fillRect(sx + 20, sy, 10, 3);
  }

  if (theme.noLcd) {
    // Vintage cars: small mechanical-style gear window only
    roundRect(ctx, cx - 20, cy + 58, 40, 30, 4);
    ctx.fillStyle = '#050505';
    ctx.fill();
    ctx.strokeStyle = theme.capRing || '#9ca3af';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.font = '800 19px Georgia, serif';
    ctx.fillStyle = '#f5f5f4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gear === 0 ? 'N' : String(gear), cx, cy + 74);
  } else {
  // Bottom LCD window
  const lcdW = 114;
  const lcdH = 42;
  roundRect(ctx, cx - lcdW / 2, cy + 54, lcdW, lcdH, 6);
  ctx.fillStyle = theme.lcdBg || '#0a0d12';
  ctx.fill();
  ctx.strokeStyle = theme.lcdBorder || '#334155';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.font = '900 22px -apple-system, sans-serif';
  ctx.fillStyle = theme.lcdGear || '#ff3b30';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(gear === 0 ? 'N' : String(gear), cx - lcdW / 2 + 12, cy + 75);

  ctx.font = '700 18px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = theme.lcdRpm || '#f8fafc';
  ctx.textAlign = 'right';
  ctx.fillText(String(Math.round(rpm)), cx + lcdW / 2 - 10, cy + 75);
  }

  // Tapered Needle
  const needleAng = startAngle + totalAngle * rpmFrac;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(needleAng);
  ctx.shadowColor = theme.needleGlow || 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(-26, -(theme.needleWidth || 3.6));
  ctx.lineTo(R - 17, -1.2);
  ctx.lineTo(R - 17, 1.2);
  ctx.lineTo(-26, theme.needleWidth || 3.6);
  ctx.closePath();
  ctx.fillStyle = theme.needleColor;
  ctx.fill();
  ctx.restore();

  // Center cap
  ctx.beginPath();
  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
  ctx.fillStyle = theme.capFill || '#141820';
  ctx.fill();
  ctx.strokeStyle = theme.capRing || '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ---------- Specialized Digital / Hypercar Clusters ----------

function drawLamboAventador(ctx, w, h, state) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const cy = h / 2 + 12;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;
  const flash = Math.floor(performance.now() / 65) % 2 === 0;

  // Hexagonal fighter-jet housing
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 145, 22);
  ctx.lineTo(cx + 145, 22);
  ctx.lineTo(cx + 190, 95);
  ctx.lineTo(cx + 165, h - 22);
  ctx.lineTo(cx - 165, h - 22);
  ctx.lineTo(cx - 190, 95);
  ctx.closePath();
  ctx.fillStyle = '#090b0f';
  ctx.fill();
  ctx.strokeStyle = '#333b4d';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // CORSA mode badge top
  roundRect(ctx, cx - 42, 30, 84, 20, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.font = '900 11px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CORSA', cx, 40);

  // Iconic Aventador bold yellow segmented arc
  const segs = 36;
  const R = 128;
  const startA = Math.PI * 0.85;
  const endA = Math.PI * 2.15;
  const span = endA - startA;

  for (let i = 0; i < segs; i++) {
    const f = i / (segs - 1);
    const a0 = startA + span * f;
    const a1 = a0 + (span / segs) * 0.74;
    const isRed = f >= redFrac;
    const lit = f <= rpmFrac && (!isRed || rpm < redline || flash);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy + 16, R, a0, a1);
    ctx.lineWidth = 18;
    ctx.strokeStyle = lit
      ? isRed
        ? '#ff2020'
        : '#facc15'
      : isRed
        ? 'rgba(255,32,32,0.2)'
        : 'rgba(250,204,21,0.14)';
    if (lit) {
      ctx.shadowColor = isRed ? '#ff2020' : '#facc15';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Numerals inside arc
  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  ctx.font = 'italic 800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const a = startA + span * (v / maxRpm);
    ctx.fillStyle = v >= redline ? '#ff4444' : '#fef08a';
    ctx.fillText(String(v / 1000), cx + Math.cos(a) * (R - 26), cy + 16 + Math.sin(a) * (R - 26));
  }

  // Huge fighter-jet central gear
  ctx.font = 'italic 900 74px -apple-system, sans-serif';
  ctx.fillStyle = rpm >= redline ? '#ff3b30' : '#ffffff';
  ctx.fillText(gear === 0 ? 'N' : String(gear), cx, cy + 12);

  // Digital RPM strip at bottom
  ctx.font = '700 22px ui-monospace, monospace';
  ctx.fillStyle = '#facc15';
  ctx.fillText(`${Math.round(rpm)} RPM`, cx, cy + 80);
}

function drawLamboHuracan(ctx, w, h, state) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;
  const flash = Math.floor(performance.now() / 65) % 2 === 0;

  roundRect(ctx, 12, 18, w - 24, h - 36, 16);
  ctx.fillStyle = '#07090d';
  ctx.fill();
  ctx.strokeStyle = '#252c3b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top header
  ctx.font = 'italic 900 12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'left';
  ctx.fillText('HURACÁN · V10', 30, 44);
  roundRect(ctx, w - 104, 30, 74, 20, 4);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.font = '900 10px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('CORSA', w - 67, 43);

  // Iconic Huracán angled rising bargraph (32 slanted bars)
  const bars = 32;
  const leftX = 32;
  const totalW = w - 64;
  const gap = totalW / bars;

  for (let i = 0; i < bars; i++) {
    const f = i / (bars - 1);
    const x = leftX + i * gap;
    const baseY = 172;
    // Signature rising ramp curve
    const barH = 26 + Math.pow(f, 1.35) * 78;
    const isRed = f >= redFrac;
    const isYellow = f >= redFrac * 0.72 && !isRed;
    const lit = f <= rpmFrac && (!isRed || rpm < redline || flash);

    ctx.save();
    ctx.fillStyle = lit
      ? isRed
        ? '#ff2020'
        : isYellow
          ? '#facc15'
          : '#22c55e'
      : isRed
        ? 'rgba(255,32,32,0.18)'
        : 'rgba(148,163,184,0.14)';
    if (lit) {
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
    }
    // Slanted parallelogram bar
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + gap * 0.72, baseY);
    ctx.lineTo(x + gap * 0.72 + 5, baseY - barH);
    ctx.lineTo(x + 5, baseY - barH);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Scale numbers along baseline
  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  ctx.font = 'italic 700 12px sans-serif';
  ctx.textAlign = 'center';
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const x = leftX + (v / maxRpm) * totalW;
    ctx.fillStyle = v >= redline ? '#ff4444' : '#94a3b8';
    ctx.fillText(String(v / 1000), x, 190);
  }

  // Bottom giant Gear + RPM split HUD
  roundRect(ctx, 32, 214, 110, 82, 10);
  ctx.fillStyle = '#121620';
  ctx.fill();
  ctx.strokeStyle = rpm >= redline ? '#ff2020' : '#facc15';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'italic 900 56px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(gear === 0 ? 'N' : String(gear), 87, 256);

  ctx.font = '900 46px ui-monospace, monospace';
  ctx.fillStyle = rpm >= redline ? '#ff3b30' : '#f8fafc';
  ctx.textAlign = 'right';
  ctx.fillText(String(Math.round(rpm)), w - 34, 248);
  ctx.font = '700 12px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('RPM × 1', w - 34, 282);
}

function drawLexusLFA(ctx, w, h, state) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const cy = h / 2 + 4;
  const R = 152;
  const startAngle = Math.PI * 0.78;
  const endAngle = Math.PI * 2.22;
  const totalAngle = endAngle - startAngle;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;
  const inRed = rpm >= redline * 0.92;

  const ringGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  ringGrad.addColorStop(0, '#9ca3af');
  ringGrad.addColorStop(0.5, '#374151');
  ringGrad.addColorStop(1, '#d1d5db');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  const bgGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, R - 10);
  if (inRed) {
    bgGrad.addColorStop(0, '#7f1d1d');
    bgGrad.addColorStop(0.7, '#3b0a0a');
    bgGrad.addColorStop(1, '#090d14');
  } else {
    bgGrad.addColorStop(0, '#162032');
    bgGrad.addColorStop(0.7, '#0d131f');
    bgGrad.addColorStop(1, '#070a10');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, R - 10, 0, Math.PI * 2);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  ctx.save();
  ctx.lineWidth = 18;
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.beginPath();
  ctx.arc(cx, cy, R - 26, startAngle, endAngle);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
  ctx.beginPath();
  ctx.arc(cx, cy, R - 26, startAngle + totalAngle * redFrac, endAngle);
  ctx.stroke();

  if (rpmFrac > 0.002) {
    ctx.strokeStyle = inRed ? '#ff2a2a' : '#e0f2fe';
    ctx.shadowColor = inRed ? '#ff2a2a' : '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 26, startAngle, startAngle + totalAngle * rpmFrac);
    ctx.stroke();
  }
  ctx.restore();

  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const ang = startAngle + totalAngle * (v / maxRpm);
    const isRed = v >= redline;
    const tr = R - 52;
    ctx.font = '700 15px -apple-system, sans-serif';
    ctx.fillStyle = isRed ? '#ff4d4d' : '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(v / 1000), cx + Math.cos(ang) * tr, cy + Math.sin(ang) * tr);
  }

  ctx.font = '900 72px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(gear === 0 ? 'N' : String(gear), cx, cy - 6);

  ctx.font = '800 11px sans-serif';
  ctx.fillStyle = inRed ? '#fca5a5' : '#38bdf8';
  ctx.fillText('LFA · SPORT', cx, cy + 44);

  ctx.font = '700 22px ui-monospace, monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${Math.round(rpm)} RPM`, cx, cy + 74);

  const needleAng = startAngle + totalAngle * rpmFrac;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(needleAng);
  ctx.fillStyle = '#ff3b30';
  ctx.shadowColor = '#ff3b30';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(R - 42, -3);
  ctx.lineTo(R - 14, 0);
  ctx.lineTo(R - 42, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMcLarenP1(ctx, w, h, state) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;
  const flash = Math.floor(performance.now() / 65) % 2 === 0;

  // Slim folded track-mode carbon display
  roundRect(ctx, 12, 46, w - 24, h - 92, 16);
  ctx.fillStyle = '#0a0c10';
  ctx.fill();
  ctx.strokeStyle = '#ff6b00';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Top F1 shift LED strip
  drawShiftLeds(ctx, cx, 72, rpmFrac, redFrac, 15);

  // Horizontal precision LED RPM strip
  const segs = 36;
  const sx = 32;
  const sw = w - 64;
  const segW = sw / segs;

  for (let i = 0; i < segs; i++) {
    const f = i / (segs - 1);
    const isRed = f >= redFrac;
    const lit = f <= rpmFrac && (!isRed || rpm < redline || flash);
    const color = isRed ? '#ff2020' : f > redFrac * 0.72 ? '#ff7b00' : '#38bdf8';

    ctx.save();
    ctx.fillStyle = lit ? color : 'rgba(148,163,184,0.14)';
    if (lit) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
    }
    ctx.fillRect(sx + i * segW, 102, segW - 2.5, 36);
    ctx.restore();
  }

  // Scale ticks
  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  ctx.font = '700 11px ui-monospace, monospace';
  ctx.textAlign = 'center';
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const x = sx + (v / maxRpm) * sw;
    ctx.fillStyle = v >= redline ? '#ff4444' : '#94a3b8';
    ctx.fillText(String(v / 1000), x, 154);
  }

  // Left: Giant Papaya-bordered Gear | Right: Crisp Digital RPM + Track badge
  roundRect(ctx, 34, 174, 92, 88, 10);
  ctx.fillStyle = '#151922';
  ctx.fill();
  ctx.strokeStyle = '#ff6b00';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = '900 58px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(gear === 0 ? 'N' : String(gear), 80, 220);

  ctx.font = '800 11px sans-serif';
  ctx.fillStyle = '#ff6b00';
  ctx.textAlign = 'right';
  ctx.fillText('McLAREN · TRACK MODE', w - 34, 190);

  ctx.font = '900 46px ui-monospace, monospace';
  ctx.fillStyle = rpm >= redline ? '#ff3b30' : '#f8fafc';
  ctx.fillText(String(Math.round(rpm)), w - 34, 232);

  ctx.font = '700 11px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('RPM · IPAS READY', w - 34, 260);
}

function drawHondaS2000(ctx, w, h, state) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const rpmFrac = Math.max(0, Math.min(1, rpm / maxRpm));
  const redFrac = redline / maxRpm;
  const flash = Math.floor(performance.now() / 75) % 2 === 0;

  roundRect(ctx, 14, 20, w - 28, h - 40, 18);
  ctx.fillStyle = '#080a0f';
  ctx.fill();
  ctx.strokeStyle = '#272f40';
  ctx.lineWidth = 2;
  ctx.stroke();

  const segments = 45;
  const arcCx = cx;
  const arcCy = h * 0.94;
  const arcR = 235;
  const startAng = Math.PI * 1.18;
  const endAng = Math.PI * 1.82;
  const span = endAng - startAng;

  for (let i = 0; i < segments; i++) {
    const frac = i / (segments - 1);
    const ang = startAng + span * frac;
    const isRed = frac >= redFrac;
    const lit = frac <= rpmFrac && (!isRed || rpm < redline || flash);
    const barH = 18 + frac * 14;
    const rIn = arcR - barH;
    const rOut = arcR;

    ctx.save();
    ctx.strokeStyle = lit
      ? isRed
        ? '#ff2222'
        : frac > redFrac * 0.78
          ? '#ff7a00'
          : '#ffaa00'
      : isRed
        ? 'rgba(255, 40, 40, 0.18)'
        : 'rgba(255, 160, 0, 0.14)';
    if (lit) {
      ctx.shadowColor = isRed ? '#ff2222' : '#ff8c00';
      ctx.shadowBlur = 7;
    }
    ctx.lineWidth = 4.6;
    ctx.beginPath();
    ctx.moveTo(arcCx + Math.cos(ang) * rIn, arcCy + Math.sin(ang) * rIn);
    ctx.lineTo(arcCx + Math.cos(ang) * rOut, arcCy + Math.sin(ang) * rOut);
    ctx.stroke();
    ctx.restore();
  }

  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  ctx.font = '700 12px ui-monospace, monospace';
  ctx.textAlign = 'center';
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const frac = v / maxRpm;
    const ang = startAng + span * frac;
    const tr = arcR - 46 - frac * 6;
    ctx.fillStyle = v >= redline ? '#ff4444' : '#f59e0b';
    ctx.fillText(String(v / 1000), arcCx + Math.cos(ang) * tr, arcCy + Math.sin(ang) * tr);
  }

  ctx.font = '700 11px ui-monospace, monospace';
  ctx.fillStyle = '#92400e';
  ctx.textAlign = 'center';
  ctx.fillText('AP1 DIGITAL CLUSTER · ×1000 r/min', cx, 164);

  ctx.save();
  ctx.font = '900 58px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = rpm >= redline ? '#ff3333' : '#ff9f1c';
  ctx.shadowColor = rpm >= redline ? 'rgba(255,51,51,0.5)' : 'rgba(255,159,28,0.45)';
  ctx.shadowBlur = 12;
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.round(rpm)).padStart(4, '0'), cx - 34, 232);
  ctx.restore();

  roundRect(ctx, cx + 82, 188, 52, 56, 8);
  ctx.fillStyle = 'rgba(255, 159, 28, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#ff9f1c';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = '900 34px ui-monospace, monospace';
  ctx.fillStyle = '#ffbe0b';
  ctx.textAlign = 'center';
  ctx.fillText(gear === 0 ? 'N' : String(gear), cx + 108, 228);

  const vtecOn = rpm >= Math.min(6000, redline * 0.72);
  roundRect(ctx, cx - 44, 266, 88, 24, 5);
  ctx.fillStyle = vtecOn ? 'rgba(255, 59, 48, 0.25)' : '#12161f';
  ctx.fill();
  ctx.strokeStyle = vtecOn ? '#ff3b30' : '#262d3d';
  ctx.stroke();
  ctx.font = '800 11px sans-serif';
  ctx.fillStyle = vtecOn ? '#ff5c54' : '#4b5563';
  ctx.fillText('VTEC ZONE', cx, 282);
}

// ---------- Round Dial Themes ----------

const CHROME = ['#f9fafb', '#9ca3af', '#374151'];
const BLACK_FACE = ['#1a1a1a', '#0e0e0e', '#060606'];

const ROUND_THEMES = {
  // ---------- Classic analog ----------
  classic_930: {
    bezel: CHROME, face: BLACK_FACE, noLcd: true,
    redZone: '#dc2626', majorTick: '#f5f5f5', minorTick: '#a3a3a3', redTick: '#ef4444',
    numColor: '#f5f5f5', redNum: '#ef4444', numFont: '700 20px "Helvetica Neue", sans-serif',
    title: 'TURBO', titleColor: '#e5e5e5', sub: 'U/min × 1000', subColor: '#9ca3af',
    needleColor: '#f97316', capFill: '#111111', capRing: '#9ca3af',
  },
  classic_testarossa: {
    bezel: ['#52525b', '#18181b', '#09090b'], face: BLACK_FACE, noLcd: true, minorDiv: 4,
    redZone: '#ef4444', majorTick: '#fafafa', minorTick: '#a1a1aa', redTick: '#ef4444',
    numColor: '#fafafa', redNum: '#ef4444', numFont: '700 19px "Helvetica Neue", sans-serif',
    title: 'TESTAROSSA', titleFont: 'italic 800 11px sans-serif', titleColor: '#fafafa',
    sub: 'GIRI × 1000', subColor: '#a1a1aa', needleColor: '#ff5a1f', capFill: '#18181b', capRing: '#52525b',
  },
  classic_miura: {
    bezel: CHROME, face: ['#141414', '#0a0a0a', '#030303'], noLcd: true, minorDiv: 2,
    redZone: '#dc2626', redZoneWidth: 7, majorTick: '#f5f5f4', minorTick: '#a8a29e', redTick: '#ef4444',
    numColor: '#f5f5f4', redNum: '#ef4444', numFont: '600 19px Georgia, serif',
    title: 'MIURA', titleFont: 'italic 700 12px Georgia, serif', titleColor: '#f5f5f4',
    sub: 'JAEGER · GIRI × 1000', subColor: '#a8a29e', needleColor: '#f8fafc', needleWidth: 2.6,
    capFill: '#1c1917', capRing: '#d6d3d1',
  },
  classic_300sl: {
    bezel: CHROME, face: ['#f5efe0', '#e8dfc8', '#cbbf9f'], noLcd: true, innerRing: 'rgba(60,40,20,0.3)',
    redZone: '#b91c1c', redZoneWidth: 7, majorTick: '#1c1917', minorTick: '#78716c', redTick: '#b91c1c',
    numColor: '#1c1917', redNum: '#b91c1c', numFont: '700 19px Georgia, serif',
    title: 'MERCEDES-BENZ', titleFont: 'italic 700 11px Georgia, serif', titleColor: '#292524',
    sub: 'U/min × 1000', subColor: '#78716c', needleColor: '#111827', needleWidth: 2.8,
    capFill: '#d6d3d1', capRing: '#57534e',
  },
  classic_etype: {
    bezel: CHROME, face: BLACK_FACE, noLcd: true,
    redZone: '#dc2626', redZoneWidth: 7, majorTick: '#fafaf9', minorTick: '#a8a29e', redTick: '#ef4444',
    numColor: '#fafaf9', redNum: '#ef4444', numFont: '600 19px Georgia, serif',
    title: 'SMITHS', titleFont: '700 12px Georgia, serif', titleColor: '#fafaf9',
    sub: 'JAGUAR · R.P.M. × 1000', subColor: '#a8a29e', needleColor: '#f8fafc', needleWidth: 2.6,
    capFill: '#0c0a09', capRing: '#d6d3d1',
  },
  classic_db5: {
    bezel: CHROME, face: ['#333333', '#242424', '#141414'], noLcd: true,
    redZone: '#b91c1c', redZoneWidth: 7, majorTick: '#f5f5f4', minorTick: '#a8a29e', redTick: '#ef4444',
    numColor: '#f5f5f4', redNum: '#f87171', numFont: '600 19px Georgia, serif',
    title: 'ASTON MARTIN', titleFont: 'italic 700 11px Georgia, serif', titleColor: '#f5f5f4',
    sub: 'SMITHS · R.P.M.', subColor: '#a8a29e', needleColor: '#f5f5f4', needleWidth: 2.6,
    capFill: '#1c1917', capRing: '#e7e5e4',
  },
  classic_cobra: {
    bezel: CHROME, face: BLACK_FACE, noLcd: true, minorDiv: 2,
    redZone: '#ef4444', redZoneWidth: 8, majorTick: '#ffffff', minorTick: '#d4d4d4', redTick: '#ef4444',
    numColor: '#ffffff', redNum: '#ef4444', numFont: '800 21px "Helvetica Neue", Arial, sans-serif',
    title: 'COBRA', titleFont: '900 13px sans-serif', titleColor: '#ffffff',
    sub: 'STEWART WARNER', subColor: '#a3a3a3', needleColor: '#f8fafc', needleWidth: 3.2,
    capFill: '#0a0a0a', capRing: '#d4d4d4',
  },
  classic_gt40: {
    bezel: ['#e5e7eb', '#4b5563', '#111827'], face: ['#1f2933', '#111827', '#05080c'], noLcd: true,
    redZone: '#f97316', redZoneWidth: 10, majorTick: '#e5e7eb', minorTick: '#94a3b8', redTick: '#f97316',
    numColor: '#e5e7eb', redNum: '#fb923c', numFont: '700 20px "Helvetica Neue", sans-serif',
    title: 'GT40', titleFont: '900 14px sans-serif', titleColor: '#7dd3fc',
    sub: 'GULF · SMITHS', subColor: '#fb923c', needleColor: '#f8fafc', capFill: '#0f172a', capRing: '#7dd3fc',
  },
  classic_e30: {
    bezel: ['#6b7280', '#1f2937', '#030712'], face: BLACK_FACE, noLcd: true, mStripe: true,
    redZone: '#ef4444', majorTick: '#f3f4f6', minorTick: '#9ca3af', redTick: '#ef4444',
    numColor: '#f3f4f6', redNum: '#ef4444', numFont: '600 19px "Helvetica Neue", sans-serif',
    title: 'M3', titleFont: 'italic 900 14px sans-serif', titleColor: '#f3f4f6',
    sub: '1/min × 1000', subColor: '#9ca3af', needleColor: '#ff4d1a', capFill: '#111827', capRing: '#6b7280',
  },
  supra_mk4: {
    bezel: ['#4b5563', '#111827', '#030712'], face: BLACK_FACE, noLcd: true,
    redZone: '#ef4444', majorTick: '#ffffff', minorTick: '#9ca3af', redTick: '#ef4444',
    numColor: '#ffffff', redNum: '#ef4444', numFont: 'italic 800 20px "Helvetica Neue", sans-serif',
    title: 'TURBO', titleFont: 'italic 900 12px sans-serif', titleColor: '#f87171',
    sub: 'SUPRA · r/min × 1000', subColor: '#9ca3af', needleColor: '#ff3b1f', capFill: '#111827', capRing: '#4b5563',
  },
  nsx_na1: {
    bezel: ['#4b5563', '#111827', '#030712'], face: BLACK_FACE, noLcd: true,
    redZone: '#ef4444', majorTick: '#ffffff', minorTick: '#9ca3af', redTick: '#ef4444',
    numColor: '#ffffff', redNum: '#ef4444', numFont: '600 20px "Helvetica Neue", sans-serif',
    title: 'NSX', titleFont: '900 14px sans-serif', titleColor: '#ffffff',
    sub: 'VTEC · r/min × 1000', subColor: '#9ca3af', needleColor: '#ef4444', capFill: '#111827', capRing: '#ef4444',
  },
  rx7_fd: {
    bezel: ['#4b5563', '#111827', '#030712'], face: BLACK_FACE, noLcd: true, warnZone: '#facc15',
    redZone: '#ef4444', majorTick: '#ffffff', minorTick: '#9ca3af', redTick: '#ef4444',
    numColor: '#ffffff', redNum: '#ef4444', numFont: '600 20px "Helvetica Neue", sans-serif',
    title: 'ROTARY ENGINE', titleFont: '800 11px sans-serif', titleColor: '#ffffff',
    sub: '× 1000 r/min', subColor: '#9ca3af', needleColor: '#ef4444', capFill: '#111827', capRing: '#9ca3af',
  },
  porsche_gt3: {
    bezel: ['#cfd6e2', '#596273', '#2c3340'],
    face: ['#2a303c', '#171b24', '#0e1117'],
    redZone: '#e62222',
    majorTick: '#f8fafc',
    minorTick: '#94a3b8',
    redTick: '#ff3333',
    numColor: '#f1f5f9',
    redNum: '#ff4444',
    title: 'GT3',
    titleColor: '#cbd5e1',
    sub: '1/min × 1000',
    subColor: '#64748b',
    needleColor: '#ff2a20',
    lcdGear: '#f8fafc',
    lcdRpm: '#fbbf24',
  },
  porsche_heritage: {
    bezel: ['#e2e8f0', '#94a3b8', '#475569'],
    face: ['#16181c', '#0c0e11', '#050608'],
    redZone: '#dc2626',
    redZoneWidth: 8,
    majorTick: '#4ade80',
    minorTick: '#22c55e',
    redTick: '#ef4444',
    numColor: '#4ade80',
    redNum: '#ef4444',
    title: '911 S/T',
    titleColor: '#86efac',
    sub: 'HERITAGE · U/min × 1000',
    subColor: '#4ade80',
    needleColor: '#f8fafc',
    needleWidth: 3,
    capFill: '#0f1115',
    capRing: '#cbd5e1',
    lcdGear: '#4ade80',
    lcdRpm: '#86efac',
    lcdBorder: '#166534',
  },
  porsche_gt3rs: {
    shiftLeds: true,
    bezel: ['#cbd5e1', '#475569', '#1e293b'],
    face: ['#fde047', '#eab308', '#ca8a04'],
    innerRing: 'rgba(0,0,0,0.28)',
    redZone: '#dc2626',
    majorTick: '#0f172a',
    minorTick: '#334155',
    redTick: '#b91c1c',
    numColor: '#0f172a',
    redNum: '#b91c1c',
    title: 'GT3 RS',
    titleColor: '#0f172a',
    sub: 'RACING YELLOW · ×1000',
    subColor: '#422006',
    needleColor: '#111827',
    capFill: '#111827',
    capRing: '#facc15',
    lcdBg: '#0b0d12',
    lcdGear: '#facc15',
    lcdRpm: '#f8fafc',
  },
  porsche_918: {
    bezel: ['#64748b', '#1e293b', '#0f172a'],
    face: ['#18202c', '#0d121a', '#06080d'],
    accentRing: '#a3e635',
    redZone: '#ef4444',
    majorTick: '#f8fafc',
    minorTick: '#64748b',
    redTick: '#ef4444',
    numColor: '#f8fafc',
    redNum: '#ff4444',
    title: '918 SPYDER',
    titleColor: '#bef264',
    sub: 'E-HYBRID · ×1000',
    subColor: '#84cc16',
    needleColor: '#a3e635',
    needleGlow: 'rgba(163,230,53,0.65)',
    capFill: '#0f172a',
    capRing: '#a3e635',
    lcdGear: '#a3e635',
    lcdRpm: '#ecfccb',
    lcdBorder: '#4d7c0f',
  },
  ferrari_yellow: {
    shiftLeds: true,
    bezel: ['#475569', '#1e293b', '#0f172a'],
    face: ['#ffe14d', '#f5c518', '#c99700'],
    innerRing: 'rgba(0,0,0,0.32)',
    redZone: '#d91616',
    redZoneWidth: 11,
    minorDiv: 4,
    majorTick: '#111827',
    minorTick: '#374151',
    redTick: '#b91c1c',
    numColor: '#0f172a',
    redNum: '#c81010',
    numFont: 'italic 900 21px "Helvetica Neue", Arial, sans-serif',
    title: 'MODENA',
    titleFont: 'italic 900 12px Georgia, serif',
    titleColor: '#111827',
    sub: 'GIRI × 1000',
    subColor: '#422006',
    needleColor: '#dc1414',
    capFill: '#111827',
    capRing: '#4b5563',
    lcdGear: '#ff3b30',
    lcdRpm: '#fef08a',
  },
  ferrari_red: {
    shiftLeds: true,
    bezel: ['#334155', '#111827', '#020617'],
    face: ['#ef4444', '#b91c1c', '#7f1d1d'],
    innerRing: 'rgba(255,255,255,0.2)',
    redZone: '#fef08a',
    redZoneWidth: 9,
    minorDiv: 4,
    majorTick: '#ffffff',
    minorTick: '#fecaca',
    redTick: '#fde047',
    numColor: '#ffffff',
    redNum: '#fde047',
    numFont: 'italic 900 21px "Helvetica Neue", Arial, sans-serif',
    title: 'PISTA',
    titleFont: 'italic 900 13px Georgia, serif',
    titleColor: '#ffffff',
    sub: 'ROSSO CORSA · ×1000',
    subColor: '#fecaca',
    needleColor: '#facc15',
    capFill: '#111827',
    capRing: '#facc15',
    lcdBg: '#0b0d12',
    lcdGear: '#facc15',
    lcdRpm: '#ffffff',
  },
  ferrari_f40: {
    bezel: ['#3f3f46', '#18181b', '#09090b'],
    face: ['#141416', '#0b0b0c', '#050505'],
    redZone: '#ff4500',
    redZoneWidth: 9,
    minorDiv: 2,
    majorTick: '#ff7b00',
    minorTick: '#c2410c',
    redTick: '#ff2200',
    numColor: '#ff8c1a',
    redNum: '#ff2a00',
    numFont: '800 20px ui-monospace, monospace',
    title: 'F40 · VEGLIA',
    titleColor: '#fb923c',
    sub: 'GIRI × 1000',
    subColor: '#9a3412',
    needleColor: '#ff4500',
    needleWidth: 4,
    capFill: '#18181b',
    capRing: '#52525b',
    lcdGear: '#ff6b00',
    lcdRpm: '#fdba74',
    lcdBorder: '#7c2d12',
  },
  lambo_countach: {
    bezel: ['#52525b', '#27272a', '#09090b'],
    face: ['#18181b', '#0d0d10', '#050507'],
    redZone: '#ef4444',
    redZoneWidth: 11,
    minorDiv: 4,
    majorTick: '#f4f4f5',
    minorTick: '#71717a',
    redTick: '#ef4444',
    numColor: '#f4f4f5',
    redNum: '#ef4444',
    numFont: 'italic 800 20px Arial, sans-serif',
    title: 'COUNTACH',
    titleFont: 'italic 900 12px sans-serif',
    titleColor: '#e4e4e7',
    sub: 'V12 · ×1000',
    subColor: '#a1a1aa',
    needleColor: '#ff5500',
    needleWidth: 4.5,
    capFill: '#18181b',
    capRing: '#71717a',
    lcdGear: '#ff5500',
    lcdRpm: '#f4f4f5',
  },
  gtr_r34: {
    bezel: ['#94a3b8', '#334155', '#0f172a'],
    face: ['#ffffff', '#f1f5f9', '#cbd5e1'],
    innerRing: 'rgba(15,23,42,0.18)',
    redZone: '#e11d48',
    redZoneWidth: 10,
    majorTick: '#0f172a',
    minorTick: '#64748b',
    redTick: '#e11d48',
    numColor: '#0f172a',
    redNum: '#e11d48',
    numFont: 'italic 800 20px "Helvetica Neue", sans-serif',
    title: 'NISMO',
    titleFont: 'italic 900 14px sans-serif',
    titleColor: '#e11d48',
    sub: 'RB26DETT · ×1000',
    subColor: '#475569',
    needleColor: '#ff4d00',
    capFill: '#1e293b',
    capRing: '#cbd5e1',
    lcdBg: '#091510',
    lcdGear: '#4ade80',
    lcdRpm: '#86efac',
    lcdBorder: '#166534',
  },
  pagani: {
    bezel: ['#f8fafc', '#94a3b8', '#475569'],
    face: ['#faf6ee', '#e7dfd0', '#cfc3ad'],
    innerRing: 'rgba(120,100,70,0.35)',
    redZone: '#b91c1c',
    redZoneWidth: 7,
    majorTick: '#1c1917',
    minorTick: '#78716c',
    redTick: '#b91c1c',
    numColor: '#1c1917',
    redNum: '#b91c1c',
    numFont: '700 19px Georgia, "Times New Roman", serif',
    title: 'PAGANI',
    titleFont: 'italic 700 13px Georgia, serif',
    titleColor: '#292524',
    sub: 'MODENA · ×1000',
    subColor: '#78716c',
    needleColor: '#1d4ed8',
    needleWidth: 2.8,
    capFill: '#e2e8f0',
    capRing: '#475569',
    lcdBg: '#1c1917',
    lcdGear: '#f59e0b',
    lcdRpm: '#fef3c7',
    lcdBorder: '#a8a29e',
  },
  bugatti: {
    bezel: ['#e2e8f0', '#64748b', '#1e293b'],
    face: ['#1e3a8a', '#172554', '#0b132b'],
    accentRing: '#38bdf8',
    tricolor: true,
    redZone: '#ef4444',
    redZoneWidth: 8,
    majorTick: '#f8fafc',
    minorTick: '#93c5fd',
    redTick: '#f87171',
    numColor: '#f8fafc',
    redNum: '#f87171',
    numFont: '600 19px -apple-system, sans-serif',
    title: 'BUGATTI',
    titleFont: '800 12px -apple-system, sans-serif',
    titleColor: '#e0f2fe',
    sub: 'W16 · ×1000',
    subColor: '#7dd3fc',
    needleColor: '#f8fafc',
    needleWidth: 2.6,
    capFill: '#1e3a8a',
    capRing: '#e2e8f0',
    lcdBg: '#091124',
    lcdGear: '#38bdf8',
    lcdRpm: '#f8fafc',
    lcdBorder: '#1d4ed8',
  },
};

// ---------- Modern full-digital ring clusters ----------

const DIGITAL_THEMES = {
  modern_992: { accent: '#f8fafc', red: '#ef4444', label: 'PORSCHE 992 · SPORT', labelColor: '#cbd5e1', bg: ['#151922', '#0b0e14', '#05070a'] },
  modern_sf90: { accent: '#ef4444', red: '#facc15', label: 'SF90 · QUALIFY', labelColor: '#facc15', fullTint: true, bg: ['#1a0f10', '#0e0809', '#050303'] },
  modern_revuelto: { accent: '#facc15', red: '#ef4444', label: 'REVUELTO · CORSA', labelColor: '#facc15', segments: 36, bg: ['#141410', '#0a0a08', '#040403'] },
  modern_r8: { accent: '#e11d48', red: '#ffffff', label: 'AUDI R8 · PERFORMANCE', labelColor: '#fda4af', bg: ['#141416', '#0b0b0d', '#040405'] },
  modern_amg: { accent: '#e5e7eb', red: '#ef4444', label: 'AMG · RACE', labelColor: '#ef4444', ring: CHROME, bg: ['#1c1e22', '#101215', '#050607'] },
  modern_bmw_m: { accent: '#1c69d4', red: '#ef4444', label: 'M · SPORT PLUS', labelColor: '#60a5fa', segments: 40, mStripe: true, bg: ['#0f1622', '#090d15', '#04060a'] },
  modern_c8: { accent: '#facc15', red: '#ef4444', label: 'CORVETTE · TRACK', labelColor: '#facc15', segments: 30, bg: ['#16140c', '#0c0b07', '#040403'] },
  modern_720s: { accent: '#ff7a00', red: '#ef4444', label: 'McLAREN 720S · TRACK', labelColor: '#ff7a00', fullTint: true, bg: ['#17110b', '#0d0906', '#050302'] },
  modern_fordgt: { accent: '#38bdf8', red: '#ef4444', label: 'FORD GT · TRACK', labelColor: '#38bdf8', segments: 24, bg: ['#0c1620', '#070d14', '#03060a'] },
  modern_koenigsegg: { accent: '#f97316', red: '#ef4444', label: 'KOENIGSEGG · JESKO', labelColor: '#fdba74', segments: 60, ring: ['#fcd34d', '#78350f', '#1c1917'], bg: ['#17120d', '#0c0907', '#040302'] },
};

function drawDigitalRing(ctx, w, h, state, t) {
  const { rpm, gear, maxRpm, redline } = state;
  const cx = w / 2;
  const cy = h / 2 + 6;
  const R = 152;
  const startA = Math.PI * 0.75;
  const endA = Math.PI * 2.25;
  const span = endA - startA;
  const f = Math.max(0, Math.min(1, rpm / maxRpm));
  const rf = redline / maxRpm;
  const inRed = rpm >= redline * 0.97;
  const flash = Math.floor(performance.now() / 70) % 2 === 0;

  let faceR = R;
  if (t.ring) {
    const g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    g.addColorStop(0, t.ring[0]);
    g.addColorStop(0.5, t.ring[1]);
    g.addColorStop(1, t.ring[2]);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    faceR = R - 8;
  }

  const bg = ctx.createRadialGradient(cx, cy, 12, cx, cy, faceR);
  if (t.fullTint && inRed) {
    bg.addColorStop(0, '#7f1d1d');
    bg.addColorStop(0.7, '#3b0a0a');
    bg.addColorStop(1, '#0a0505');
  } else {
    bg.addColorStop(0, t.bg[0]);
    bg.addColorStop(0.7, t.bg[1]);
    bg.addColorStop(1, t.bg[2]);
  }
  ctx.beginPath();
  ctx.arc(cx, cy, faceR, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  const arcR = R - 30;
  if (t.segments) {
    const n = t.segments;
    for (let i = 0; i < n; i++) {
      const frac = i / (n - 1);
      const a0 = startA + span * (i / n);
      const a1 = a0 + (span / n) * 0.72;
      const isRed = frac >= rf;
      const lit = frac <= f && (!isRed || rpm < redline || flash);
      const col = isRed ? t.red : t.accent;
      ctx.save();
      ctx.lineWidth = 16;
      ctx.strokeStyle = lit ? col : 'rgba(255,255,255,0.07)';
      if (lit) {
        ctx.shadowColor = col;
        ctx.shadowBlur = 10;
      }
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, a0, a1);
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.save();
    ctx.lineWidth = 16;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.arc(cx, cy, arcR, startA, endA);
    ctx.stroke();
    ctx.strokeStyle = t.red;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(cx, cy, arcR, startA + span * rf, endA);
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (f > 0.002) {
      const col = f >= rf ? t.red : t.accent;
      ctx.strokeStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, startA, startA + span * f);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ticks + numerals
  const majorStep = maxRpm > 10500 ? 2000 : 1000;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let v = 0; v <= maxRpm; v += majorStep) {
    const a = startA + span * (v / maxRpm);
    const isRed = v >= redline;
    ctx.strokeStyle = isRed ? t.red : 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (arcR + 11), cy + Math.sin(a) * (arcR + 11));
    ctx.lineTo(cx + Math.cos(a) * (arcR + 17), cy + Math.sin(a) * (arcR + 17));
    ctx.stroke();
    ctx.font = '700 14px -apple-system, sans-serif';
    ctx.fillStyle = isRed ? t.red : '#e5e7eb';
    ctx.fillText(String(v / 1000), cx + Math.cos(a) * (arcR - 26), cy + Math.sin(a) * (arcR - 26));
  }

  // Edge pointer
  const pa = startA + span * f;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(pa);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = t.accent;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(arcR - 12, -3);
  ctx.lineTo(arcR + 12, 0);
  ctx.lineTo(arcR - 12, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (t.mStripe) {
    const sx = cx - 18;
    const sy = cy - 62;
    ctx.fillStyle = '#81c4ff';
    ctx.fillRect(sx, sy, 12, 3);
    ctx.fillStyle = '#16588e';
    ctx.fillRect(sx + 12, sy, 12, 3);
    ctx.fillStyle = '#e7222e';
    ctx.fillRect(sx + 24, sy, 12, 3);
  }

  // Center gear, label, digital RPM
  ctx.font = '900 70px -apple-system, sans-serif';
  ctx.fillStyle = inRed && flash ? t.red : '#ffffff';
  ctx.fillText(gear === 0 ? 'N' : String(gear), cx, cy - 8);
  ctx.font = '800 11px -apple-system, sans-serif';
  ctx.fillStyle = t.labelColor;
  ctx.fillText(t.label, cx, cy + 40);
  ctx.font = '700 22px ui-monospace, SFMono-Regular, monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${Math.round(rpm)} RPM`, cx, cy + 70);
}

export function drawCluster(ctx, w, h, clusterId, state) {
  ctx.clearRect(0, 0, w, h);
  if (DIGITAL_THEMES[clusterId]) {
    drawDigitalRing(ctx, w, h, state, DIGITAL_THEMES[clusterId]);
    return;
  }
  if (ROUND_THEMES[clusterId]) {
    drawClassicRoundDial(ctx, w, h, state, ROUND_THEMES[clusterId]);
    return;
  }
  switch (clusterId) {
    case 'lambo_aventador':
      drawLamboAventador(ctx, w, h, state);
      break;
    case 'lambo_huracan':
      drawLamboHuracan(ctx, w, h, state);
      break;
    case 'lfa':
      drawLexusLFA(ctx, w, h, state);
      break;
    case 'mclaren_p1':
      drawMcLarenP1(ctx, w, h, state);
      break;
    case 's2000':
      drawHondaS2000(ctx, w, h, state);
      break;
    default:
      drawClassicRoundDial(ctx, w, h, state, ROUND_THEMES.porsche_gt3);
      break;
  }
}
