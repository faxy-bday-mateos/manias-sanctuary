/** Rain scenes: cherry-blossom garden, glass greenhouse, monsoon lighthouse. */
import type { Ctx, SceneDef } from '../types';
import {
  H, TAU, W, between, createLayer, drawGlow, drawReflection, drawRipples,
  drawStreaks, fbm, fillRidge, glowSprite, hash2, lerp, makeRng, makeStreaks, pick,
  softBlob, vGrad, wrap, type Rng,
} from '../util';

/* ─────────────────────────── 6. Cherry Blossom Rain ──────────────────────── */

const BLOSSOM = ['#f8c4d3', '#f3a9c0', '#fbd9e3', '#ee94b3', '#ffeef3', '#f6b5ca'];

/** Soft cloud of blossoms centred on (cx, cy). */
function blossomCluster(g: Ctx, rnd: Rng, cx: number, cy: number, r: number, n: number, s: number): void {
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU;
    const d = r * Math.sqrt(rnd());
    g.globalAlpha = between(rnd, 0.72, 0.95);
    g.fillStyle = pick(rnd, BLOSSOM);
    g.beginPath();
    g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.82, between(rnd, 4, 10) * s, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
}

/** Cherry tree: curved trunk, recursive limbs, then a dense blossom canopy. */
function cherryTree(g: Ctx, rnd: Rng, x: number, base: number, s: number, bark: string, density: number): void {
  const topY = base - 230 * s;
  g.fillStyle = bark;
  g.beginPath();
  g.moveTo(x - 24 * s, base);
  g.quadraticCurveTo(x - 14 * s, base - 130 * s, x - 9 * s, topY);
  g.lineTo(x + 12 * s, topY);
  g.quadraticCurveTo(x + 18 * s, base - 120 * s, x + 26 * s, base);
  g.closePath();
  g.fill();
  const ends: Array<{ x: number; y: number }> = [];
  const limb = (px: number, py: number, ang: number, len: number, w: number, depth: number): void => {
    const x2 = px + Math.cos(ang) * len;
    const y2 = py + Math.sin(ang) * len;
    g.strokeStyle = bark;
    g.lineWidth = w;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(px, py);
    g.quadraticCurveTo((px + x2) / 2 + between(rnd, -12, 12), (py + y2) / 2 + between(rnd, -10, 6), x2, y2);
    g.stroke();
    if (depth === 0) { ends.push({ x: x2, y: y2 }); return; }
    for (let i = 0; i < 2; i++) limb(x2, y2, ang + (i - 0.5) * 0.9 + between(rnd, -0.25, 0.25), len * 0.76, w * 0.66, depth - 1);
  };
  for (const off of [-1.2, -0.5, 0.3, 1.05]) limb(x + 2 * s, topY + 6, -Math.PI / 2 + off, 82 * s, 15 * s, 3);
  for (const e of ends) blossomCluster(g, rnd, e.x, e.y, 62 * s, Math.round(48 * density), s);
  for (let i = 0; i < 10; i++) { // fill gaps between limbs
    const e = ends[Math.floor(rnd() * ends.length)];
    blossomCluster(g, rnd, e.x + between(rnd, -60, 60) * s, e.y + between(rnd, 0, 70) * s, 70 * s, Math.round(46 * density), s);
  }
}

export const cherryBlossomRain: SceneDef = {
  id: 'cherry-blossom-rain',
  title: 'Cherry Blossom Rain',
  build(env) {
    const rnd = makeRng(606);
    const AXIS = 620; // mirror axis for puddle reflections
    const puddles = [
      { cx: 560, cy: 772, rx: 500, ry: 88 },
      { cx: 1000, cy: 818, rx: 170, ry: 36 },
    ];
    const puddlePath = (g: Ctx): void => {
      g.beginPath();
      for (const p of puddles) { g.moveTo(p.cx + p.rx, p.cy); g.ellipse(p.cx, p.cy, p.rx, p.ry, 0, 0, TAU); }
    };

    const main = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 580, [[0, '#c4bad0'], [0.55, '#e8cdd6'], [1, '#f6e0e0']]);
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { // distant blossoming trees dissolved in rain
        softBlob(g, between(rnd, -50, 1480), between(rnd, 360, 520), between(rnd, 90, 190), between(rnd, 50, 90),
          pick(rnd, ['236,170,196', '244,196,214', '200,190,200', '170,196,170']), 0.5);
      }
      g.fillStyle = vGrad(g, 540, H, [[0, '#9ab68e'], [0.4, '#65906a'], [1, '#3f6a4c']]);
      g.fillRect(0, 560, W, H - 560);
      cherryTree(g, rnd, 600, 600, 0.55, '#5c4a52', 0.7);
      cherryTree(g, rnd, 1090, 590, 0.5, '#5c4a52', 0.7);
      g.fillStyle = vGrad(g, 380, 620, [[0, 'rgba(246,224,228,0.6)'], [1, 'rgba(246,224,228,0)']]);
      g.fillRect(0, 380, W, 240); // rain haze separating depth planes

      // Wet stone path.
      g.fillStyle = vGrad(g, 580, H, [[0, '#cfc6c6'], [1, '#9c98a6']]);
      g.beginPath();
      g.moveTo(560, 590);
      g.lineTo(700, 590);
      g.bezierCurveTo(780, 700, 980, 790, 1120, 900);
      g.lineTo(240, 900);
      g.bezierCurveTo(420, 790, 520, 700, 560, 590);
      g.closePath();
      g.fill();
      for (let i = 0; i < 160; i++) { // flagstones
        const y = between(rnd, 600, 890);
        const k = (y - 590) / 310;
        const x = lerp(630, 680, rnd()) + (rnd() - 0.5) * (140 + 760 * k);
        g.fillStyle = `rgba(${rnd() < 0.5 ? '120,116,130' : '240,236,240'},${between(rnd, 0.1, 0.25)})`;
        g.beginPath();
        g.ellipse(x, y, between(rnd, 10, 28) * (0.5 + k), between(rnd, 5, 12) * (0.5 + k), 0, 0, TAU);
        g.fill();
      }
      for (let i = 0; i < 40; i++) { // mossy rocks
        const x = between(rnd, 0, 1300);
        const y = between(rnd, 640, 890);
        g.fillStyle = `rgba(52,84,60,${between(rnd, 0.3, 0.6)})`;
        g.beginPath();
        g.ellipse(x, y, between(rnd, 10, 34), between(rnd, 6, 14), 0, 0, TAU);
        g.fill();
      }
      for (let i = 0; i < 520; i++) { // fallen petals
        g.fillStyle = `rgba(${pick(rnd, ['248,190,208', '255,226,234', '238,148,180'])},${between(rnd, 0.5, 0.95)})`;
        g.beginPath();
        g.ellipse(between(rnd, 0, W), between(rnd, 600, 895), between(rnd, 2.5, 5), between(rnd, 1.4, 2.6), rnd() * Math.PI, 0, TAU);
        g.fill();
      }
      cherryTree(g, rnd, 290, 664, 1.2, '#3a2a30', 1);
      cherryTree(g, rnd, 900, 646, 0.95, '#3a2a30', 1);
    });

    const puddle = createLayer(env, (g) => {
      puddlePath(g);
      g.fillStyle = vGrad(g, 680, 880, [[0, '#d9c5d2'], [1, '#a9a0bc']]);
      g.fill();
      g.save();
      puddlePath(g);
      g.clip();
      g.globalAlpha = 0.85;
      g.translate(0, 2 * AXIS);
      g.scale(1, -1);
      g.drawImage(main, 0, 0, W, H);
      g.restore();
      g.save();
      puddlePath(g);
      g.clip();
      g.fillStyle = vGrad(g, 680, 880, [[0, 'rgba(255,255,255,0.22)'], [1, 'rgba(255,255,255,0)']]);
      g.fillRect(0, 680, W, 200);
      g.restore();
      puddlePath(g);
      g.strokeStyle = 'rgba(255,255,255,0.35)';
      g.lineWidth = 2;
      g.stroke();
    });

    const petals = Array.from({ length: 120 }, () => ({
      x: rnd() * W, y: rnd() * H, v: between(rnd, 22, 52), ph: rnd() * TAU, spin: between(rnd, -2, 2),
      s: between(rnd, 0.8, 1.5), c: pick(rnd, ['255,196,214', '255,230,238', '244,160,190']),
    }));
    const floaters = Array.from({ length: 46 }, () => {
      const a = rnd() * TAU;
      const d = Math.sqrt(rnd());
      return { x: puddles[0].cx + Math.cos(a) * d * 430, y: puddles[0].cy + Math.sin(a) * d * 70, ph: rnd() * TAU, r: between(rnd, 0.8, 1.4) };
    });
    const rainFar = makeStreaks(rnd, 260, 14, 26, 780, 980);
    const rainNear = makeStreaks(rnd, 110, 30, 52, 1200, 1500);

    return (g, t) => {
      g.drawImage(main, 0, 0, W, H);
      g.drawImage(puddle, 0, 0, W, H);
      g.save();
      puddlePath(g);
      g.clip();
      for (const f of floaters) {
        g.fillStyle = 'rgba(250,190,210,0.9)';
        g.beginPath();
        g.ellipse(f.x + Math.sin(t * 0.25 + f.ph) * 16, f.y + Math.cos(t * 0.2 + f.ph) * 3, 4.2 * f.r, 2 * f.r, f.ph, 0, TAU);
        g.fill();
      }
      drawRipples(g, { x0: 130, x1: 1010, y0: 700, y1: 850, count: 18, period: [1.1, 2.2], maxR: 70, squash: 0.26, seed: 1 }, t, '255,255,255', 0.55);
      drawRipples(g, { x0: 860, x1: 1140, y0: 800, y1: 830, count: 5, period: [1.2, 2.4], maxR: 36, squash: 0.28, seed: 2 }, t, '255,255,255', 0.5);
      g.restore();
      for (const p of petals) { // drifting blossom petals
        const x = wrap(p.x + t * 18 * (p.v / 40) + Math.sin(t * 0.7 + p.ph) * 26, W + 60) - 30;
        const y = wrap(p.y + t * p.v, H + 60) - 30;
        g.fillStyle = `rgba(${p.c},0.9)`;
        g.beginPath();
        g.ellipse(x, y, 4.6 * p.s, 2.4 * p.s, p.ph + t * p.spin, 0, TAU);
        g.fill();
      }
      drawStreaks(g, rainFar, t, { dx: 0.16, dy: 1, color: 'rgba(120,108,140,0.2)', width: 1 });
      drawStreaks(g, rainNear, t, { dx: 0.16, dy: 1, color: 'rgba(255,255,255,0.4)', width: 1.4 });
    };
  },
};

/* ─────────────────────────────── 7. Rainlit Greenhouse ───────────────────── */

const GH = { x0: 250, x1: 970, wallTop: 480, base: 646, ridge: 350, cx: 610 };
const roofLine = (x: number): number =>
  x < GH.cx ? lerp(GH.wallTop, GH.ridge, (x - GH.x0) / (GH.cx - GH.x0)) : lerp(GH.ridge, GH.wallTop, (x - GH.cx) / (GH.x1 - GH.cx));

/** Arching fern/palm frond with paired leaflets. */
function frond(g: Ctx, x: number, y: number, len: number, ang: number, droop: number, leaf: number, cols: readonly string[], rnd: Rng): void {
  const ex = x + Math.cos(ang) * len;
  const ey = y + Math.sin(ang) * len + droop;
  const cx = x + Math.cos(ang) * len * 0.55;
  const cy = y + Math.sin(ang) * len * 0.55 - droop * 0.2;
  const steps = Math.round(len / 9);
  g.lineCap = 'round';
  g.strokeStyle = cols[0];
  g.lineWidth = 2.4;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(cx, cy, ex, ey);
  g.stroke();
  for (let i = 2; i <= steps; i++) {
    const u = i / steps;
    const px = (1 - u) ** 2 * x + 2 * (1 - u) * u * cx + u * u * ex;
    const py = (1 - u) ** 2 * y + 2 * (1 - u) * u * cy + u * u * ey;
    const tx = 2 * (1 - u) * (cx - x) + 2 * u * (ex - cx);
    const ty = 2 * (1 - u) * (cy - y) + 2 * u * (ey - cy);
    const tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl;
    const ny = tx / tl;
    const l = leaf * Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.1)) * between(rnd, 0.85, 1.1);
    g.strokeStyle = cols[1 + Math.floor(rnd() * (cols.length - 1))];
    g.lineWidth = 2.6;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(px + nx * l + (tx / tl) * l * 0.4, py + ny * l + (ty / tl) * l * 0.4);
    g.moveTo(px, py);
    g.lineTo(px - nx * l + (tx / tl) * l * 0.4, py - ny * l + (ty / tl) * l * 0.4);
    g.stroke();
  }
}

/** Broad tropical leaf with a lighter midrib. */
function broadLeaf(g: Ctx, x: number, y: number, len: number, wid: number, ang: number, col: string): void {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = col;
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(len * 0.25, -wid, len * 0.8, -wid * 0.8, len, 0);
  g.bezierCurveTo(len * 0.8, wid * 0.8, len * 0.25, wid, 0, 0);
  g.fill();
  g.strokeStyle = 'rgba(210,255,170,0.4)';
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(len * 0.95, 0);
  g.stroke();
  g.restore();
}

export const rainlitGreenhouse: SceneDef = {
  id: 'rainlit-greenhouse',
  title: 'Rainlit Greenhouse',
  build(env) {
    const rnd = makeRng(707);
    const greens = {
      deep: ['#12482a', '#1b5e33', '#237a3a'],
      mid: ['#1f6b3a', '#2f8a43', '#3f9e48'],
      lit: ['#3f9e48', '#6bbb4e', '#9ad45c'],
    };

    const main = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 640, [[0, '#0e2830'], [0.6, '#1c4a52'], [1, '#2d6f68']]);
      g.fillRect(0, 0, W, H);
      fillRidge(g, { baseY: 520, amp: 70, seed: 21, freq: 0.0034, oct: 5 }, '#0b2026');
      for (let i = 0; i < 24; i++) { // tree masses behind the glass house
        softBlob(g, between(rnd, -30, 1470), between(rnd, 440, 600), between(rnd, 70, 150), between(rnd, 70, 130), '8,28,32', 0.9);
      }
      g.fillStyle = vGrad(g, 620, H, [[0, '#10281f'], [1, '#07130f']]);
      g.fillRect(0, 630, W, H - 630);
      for (let i = 0; i < 260; i++) { // wet lawn texture
        g.strokeStyle = `rgba(80,140,100,${between(rnd, 0.05, 0.16)})`;
        g.lineWidth = 1.2;
        const x = between(rnd, 0, W);
        const y = between(rnd, 640, 890);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + between(rnd, -3, 3), y - between(rnd, 5, 12));
        g.stroke();
      }
      // Wet path.
      g.fillStyle = vGrad(g, 646, H, [[0, '#26404a'], [1, '#162a33']]);
      g.beginPath();
      g.moveTo(560, 646);
      g.lineTo(660, 646);
      g.lineTo(1060, 900);
      g.lineTo(160, 900);
      g.closePath();
      g.fill();

      // Greenhouse: glowing interior.
      const glass = (): void => {
        g.beginPath();
        g.moveTo(GH.x0, GH.base);
        g.lineTo(GH.x0, GH.wallTop);
        g.lineTo(GH.cx, GH.ridge);
        g.lineTo(GH.x1, GH.wallTop);
        g.lineTo(GH.x1, GH.base);
        g.closePath();
      };
      g.save();
      glass();
      g.clip();
      const gr = g.createRadialGradient(GH.cx, 560, 20, GH.cx, 560, 440);
      gr.addColorStop(0, '#fff2c0');
      gr.addColorStop(0.5, '#f4bd6c');
      gr.addColorStop(1, '#b07a3c');
      g.fillStyle = gr;
      g.fillRect(GH.x0, GH.ridge, GH.x1 - GH.x0, GH.base - GH.ridge);

      for (let i = 0; i < 10; i++) { // back row: tall palms
        const x = GH.x0 + 60 + i * 70 + between(rnd, -14, 14);
        g.strokeStyle = '#5a3d22';
        g.lineWidth = 7;
        g.beginPath();
        g.moveTo(x, GH.base - 24);
        g.lineTo(x + between(rnd, -10, 10), GH.base - between(rnd, 120, 200));
        g.stroke();
        const top = GH.base - between(rnd, 120, 200);
        for (let f = 0; f < 7; f++) {
          frond(g, x, top, between(rnd, 70, 120), -Math.PI / 2 + (f - 3) * 0.5 + between(rnd, -0.1, 0.1), between(rnd, 10, 40), 22, greens.deep, rnd);
        }
      }
      for (let i = 0; i < 12; i++) { // middle: ferns and broad leaves
        const x = GH.x0 + 30 + i * 60 + between(rnd, -16, 16);
        const y = GH.base - 28;
        for (let f = 0; f < 6; f++) frond(g, x, y, between(rnd, 55, 100), -Math.PI / 2 + (f - 2.5) * 0.45, between(rnd, 20, 50), 16, greens.mid, rnd);
        broadLeaf(g, x, y, between(rnd, 70, 110), between(rnd, 22, 34), -Math.PI / 2 + between(rnd, -0.9, 0.9), pick(rnd, greens.mid));
      }
      // Potting bench with terracotta pots, foliage and blooms.
      g.fillStyle = '#6b4a2c';
      g.fillRect(GH.x0 + 24, 592, GH.x1 - GH.x0 - 48, 10);
      g.fillStyle = '#4a321c';
      g.fillRect(GH.x0 + 24, 602, GH.x1 - GH.x0 - 48, 5);
      for (let x = GH.x0 + 50; x < GH.x1 - 40; x += between(rnd, 46, 72)) {
        const pw = between(rnd, 22, 32);
        for (let f = 0; f < 4; f++) frond(g, x, 590, between(rnd, 26, 48), -Math.PI / 2 + (f - 1.5) * 0.7, 10, 10, greens.lit, rnd);
        if (rnd() < 0.55) {
          for (let k = 0; k < 4; k++) {
            g.fillStyle = pick(rnd, ['#ff7a8a', '#ffd34d', '#ff9a52', '#ffffff']);
            g.beginPath();
            g.arc(x + between(rnd, -16, 16), 560 + between(rnd, -14, 10), between(rnd, 3, 5.5), 0, TAU);
            g.fill();
          }
        }
        g.fillStyle = '#b8582e';
        g.beginPath();
        g.moveTo(x - pw / 2, 590);
        g.lineTo(x + pw / 2, 590);
        g.lineTo(x + pw / 2 - 4, 612);
        g.lineTo(x - pw / 2 + 4, 612);
        g.closePath();
        g.fill();
      }
      for (let i = 0; i < 7; i++) { // hanging baskets with trailing vines
        const x = GH.x0 + 90 + i * 95 + between(rnd, -12, 12);
        const y = between(rnd, 470, 520);
        g.strokeStyle = 'rgba(60,40,24,0.7)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(x, roofLine(x) + 4);
        g.lineTo(x, y);
        g.stroke();
        g.fillStyle = '#5a3a24';
        g.beginPath();
        g.ellipse(x, y + 4, 16, 8, 0, 0, TAU);
        g.fill();
        for (let v = 0; v < 6; v++) frond(g, x + between(rnd, -12, 12), y, between(rnd, 34, 80), Math.PI / 2 + between(rnd, -0.6, 0.6), 6, 8, greens.lit, rnd);
      }
      for (let i = 0; i < 5; i++) broadLeaf(g, GH.x0 + 40 + i * 160, GH.base - 10, between(rnd, 90, 130), between(rnd, 30, 44), -Math.PI / 2 + between(rnd, -1, 1), pick(rnd, greens.lit));
      g.fillStyle = 'rgba(170,225,225,0.1)'; // glass tint
      g.fillRect(GH.x0, GH.ridge, GH.x1 - GH.x0, GH.base - GH.ridge);
      g.fillStyle = 'rgba(255,255,255,0.07)'; // diagonal glare
      for (let k = 0; k < 4; k++) {
        const gx = GH.x0 + 60 + k * 190;
        g.beginPath();
        g.moveTo(gx, GH.ridge);
        g.lineTo(gx + 40, GH.ridge);
        g.lineTo(gx - 120, GH.base);
        g.lineTo(gx - 160, GH.base);
        g.closePath();
        g.fill();
      }
      // White-painted iron frame.
      g.strokeStyle = 'rgba(232,244,238,0.78)';
      g.lineWidth = 3;
      for (let x = GH.x0 + 48; x < GH.x1; x += 48) {
        g.beginPath();
        g.moveTo(x, roofLine(x));
        g.lineTo(x, GH.base);
        g.stroke();
      }
      for (const d of [0, 46, 92]) {
        g.beginPath();
        g.moveTo(GH.x0, GH.wallTop + d);
        g.lineTo(GH.cx, GH.ridge + d);
        g.lineTo(GH.x1, GH.wallTop + d);
        g.stroke();
      }
      for (const y of [GH.wallTop, 560]) {
        g.beginPath();
        g.moveTo(GH.x0, y);
        g.lineTo(GH.x1, y);
        g.stroke();
      }
      g.restore();
      g.strokeStyle = '#eaf4ee'; // outline, ridge cap and cupola
      g.lineWidth = 5;
      glass();
      g.stroke();
      g.fillStyle = '#f0f7f2';
      g.fillRect(GH.cx - 30, GH.ridge - 34, 60, 34);
      g.fillStyle = '#ffe9a8';
      g.fillRect(GH.cx - 24, GH.ridge - 28, 48, 28);
      g.strokeStyle = '#eaf4ee';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(GH.cx - 36, GH.ridge - 34);
      g.lineTo(GH.cx, GH.ridge - 64);
      g.lineTo(GH.cx + 36, GH.ridge - 34);
      g.closePath();
      g.stroke();
      g.fillStyle = '#3c2b2c'; // brick plinth
      g.fillRect(GH.x0 - 8, GH.base - 24, GH.x1 - GH.x0 + 16, 28);
      g.fillStyle = 'rgba(0,0,0,0.25)';
      for (let x = GH.x0 - 8; x < GH.x1 + 8; x += 26) g.fillRect(x, GH.base - 24, 2, 28);
      g.fillRect(GH.x0 - 8, GH.base - 11, GH.x1 - GH.x0 + 16, 2);
      g.fillStyle = '#f3f8f4'; // door frame
      g.fillRect(GH.cx - 38, GH.base - 118, 76, 118);
      g.fillStyle = vGrad(g, GH.base - 112, GH.base, [[0, '#e8b25c'], [1, '#c98a3e']]);
      g.fillRect(GH.cx - 32, GH.base - 112, 64, 112);
      g.fillStyle = '#f3f8f4';
      g.fillRect(GH.cx - 2, GH.base - 112, 4, 112);
    });

    const warm = glowSprite(env, '255,205,120', 256);
    const drops = Array.from({ length: 78 }, () => {
      const x = between(rnd, GH.x0 + 8, GH.x1 - 8);
      const top = roofLine(x) + 8;
      return { x, top, span: GH.base - 34 - top, v: between(rnd, 8, 24), ph: rnd() * TAU, w: between(rnd, 0.8, 1.5) };
    });
    const rainFar = makeStreaks(rnd, 280, 12, 22, 820, 1000);
    const rainNear = makeStreaks(rnd, 110, 26, 44, 1200, 1500);
    const pathPath = (g: Ctx): void => {
      g.beginPath();
      g.moveTo(560, 646);
      g.lineTo(660, 646);
      g.lineTo(1060, 900);
      g.lineTo(160, 900);
      g.closePath();
    };

    return (g, t) => {
      g.drawImage(main, 0, 0, W, H);
      g.save(); // reflected glow on the wet path
      pathPath(g);
      g.clip();
      drawReflection(g, main, env.pixelRatio, GH.base, t, { depth: 254, amp: 1.8, alpha: 0.55, speed: 1.4 });
      drawRipples(g, { x0: 300, x1: 940, y0: 664, y1: 880, count: 22, period: [0.9, 1.8], maxR: 44, squash: 0.3, seed: 3 }, t, '255,232,180', 0.45);
      g.restore();
      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, warm, GH.cx, 540, 560, 0.2 + 0.03 * Math.sin(t * 1.3) + 0.02 * Math.sin(t * 4.1));
      g.restore();
      for (const d of drops) { // droplets creeping down the glass
        const w = 0.55 * t - (0.45 / 0.9) * Math.cos(0.9 * t + d.ph);
        const y = d.top + wrap(d.v * w + d.ph * 40, d.span);
        g.strokeStyle = 'rgba(235,250,250,0.22)';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(d.x, y - 16);
        g.lineTo(d.x, y);
        g.stroke();
        g.fillStyle = 'rgba(240,252,252,0.7)';
        g.beginPath();
        g.ellipse(d.x, y, 1.8 * d.w, 3.2 * d.w, 0, 0, TAU);
        g.fill();
      }
      drawStreaks(g, rainFar, t, { dx: 0.12, dy: 1, color: 'rgba(190,225,230,0.26)', width: 1 });
      drawStreaks(g, rainNear, t, { dx: 0.12, dy: 1, color: 'rgba(220,240,245,0.38)', width: 1.5 });
    };
  },
};

/* ─────────────────────────────── 12. Monsoon Lighthouse ──────────────────── */

export const monsoonLighthouse: SceneDef = {
  id: 'monsoon-lighthouse',
  title: 'Monsoon Lighthouse',
  build(env) {
    const rnd = makeRng(1212);
    const HOR = 470;
    const TOWER = { x: 470, base: 584, top: 340 };
    const LANTERN = { x: TOWER.x, y: 312 };
    const rockTop = (x: number): number =>
      724 - 148 * Math.exp(-(((x - 470) / 210) ** 2)) - 70 * Math.exp(-(((x - 120) / 200) ** 2)) + 12 * fbm(x * 0.05, 4, 3);

    const sky = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, HOR, [[0, '#080c26'], [0.55, '#1a2050'], [1, '#4c3d76']]);
      g.fillRect(0, 0, W, HOR + 2);
      g.fillStyle = vGrad(g, 330, HOR, [[0, 'rgba(160,96,120,0)'], [1, 'rgba(176,104,120,0.55)']]);
      g.fillRect(0, 330, W, HOR - 330);
    });

    const cloud = (rgb: string): HTMLCanvasElement => createLayer(env, (g) => {
      for (let i = 0; i < 16; i++) softBlob(g, between(rnd, 90, 510), between(rnd, 70, 170), between(rnd, 60, 120), between(rnd, 40, 80), rgb, 0.7);
    }, 600, 240);
    const cloudDark = cloud('16,20,54');
    const cloudMid = cloud('44,48,98');
    const cloudLit = cloud('120,94,150');
    const clouds = Array.from({ length: 9 }, (_, i) => ({
      sprite: i % 3 === 0 ? cloudLit : i % 3 === 1 ? cloudMid : cloudDark,
      y: between(rnd, -20, 340), w: between(rnd, 760, 1200), h: between(rnd, 230, 340),
      v: between(rnd, 7, 20), off: i * 260, a: between(rnd, 0.5, 0.9),
    })).sort((a, b) => a.y - b.y);

    const rocks = createLayer(env, (g) => {
      g.beginPath();
      g.moveTo(-10, H + 10);
      for (let x = -10; x <= 800; x += 6) g.lineTo(x, rockTop(x));
      g.lineTo(790, 760);
      g.lineTo(770, H + 10);
      g.closePath();
      g.fillStyle = vGrad(g, 560, H, [[0, '#161a38'], [1, '#05070f']]);
      g.fill();
      g.strokeStyle = 'rgba(140,150,220,0.28)'; // sky rim light
      g.lineWidth = 2;
      g.beginPath();
      for (let x = -10; x <= 800; x += 6) (x === -10 ? g.moveTo(x, rockTop(x) + 1) : g.lineTo(x, rockTop(x) + 1));
      g.stroke();
      for (let i = 0; i < 60; i++) { // cracks and wet sheen
        const x = between(rnd, 0, 760);
        const y = rockTop(x) + between(rnd, 12, 150);
        g.strokeStyle = `rgba(110,120,190,${between(rnd, 0.05, 0.16)})`;
        g.lineWidth = between(rnd, 1, 2);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + between(rnd, 10, 40), y + between(rnd, -6, 8));
        g.stroke();
      }
      // Lighthouse tower.
      const { x, base, top } = TOWER;
      const halfW = (y: number): number => lerp(36, 22, (base - y) / (base - top));
      const bands = 6;
      for (let i = 0; i < bands; i++) {
        const y0 = base - ((base - top) * i) / bands;
        const y1 = base - ((base - top) * (i + 1)) / bands;
        g.fillStyle = i % 2 === 0 ? '#c9c4dc' : '#a8302f';
        g.beginPath();
        g.moveTo(x - halfW(y0), y0);
        g.lineTo(x + halfW(y0), y0);
        g.lineTo(x + halfW(y1), y1);
        g.lineTo(x - halfW(y1), y1);
        g.closePath();
        g.fill();
      }
      g.fillStyle = 'rgba(8,10,40,0.42)'; // shaded flank
      g.beginPath();
      g.moveTo(x + 2, base);
      g.lineTo(x + halfW(base), base);
      g.lineTo(x + halfW(top), top);
      g.lineTo(x + 2, top);
      g.closePath();
      g.fill();
      g.fillStyle = '#1b1c36'; // gallery and railing
      g.fillRect(x - 40, top - 10, 80, 10);
      g.strokeStyle = '#1b1c36';
      g.lineWidth = 2;
      for (let i = 0; i <= 8; i++) {
        g.beginPath();
        g.moveTo(x - 38 + i * 9.5, top - 10);
        g.lineTo(x - 38 + i * 9.5, top - 26);
        g.stroke();
      }
      g.beginPath();
      g.moveTo(x - 38, top - 26);
      g.lineTo(x + 38, top - 26);
      g.stroke();
      g.fillStyle = '#ffe2a0'; // lantern room
      g.fillRect(x - 16, top - 54, 32, 28);
      g.strokeStyle = '#1b1c36';
      g.lineWidth = 3;
      g.strokeRect(x - 16, top - 54, 32, 28);
      g.beginPath();
      g.moveTo(x, top - 54);
      g.lineTo(x, top - 26);
      g.stroke();
      g.fillStyle = '#7e2428'; // cap
      g.beginPath();
      g.moveTo(x - 24, top - 54);
      g.lineTo(x, top - 82);
      g.lineTo(x + 24, top - 54);
      g.closePath();
      g.fill();
      g.strokeStyle = '#1b1c36';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x, top - 82);
      g.lineTo(x, top - 100);
      g.stroke();
      g.fillStyle = '#2a1c18'; // door
      g.fillRect(x - 8, base - 34, 16, 34);
    });

    const waves = Array.from({ length: 16 }, (_, i) => {
      const k = i / 15;
      return {
        y: 478 + 424 * k ** 1.7, amp: 2 + 15 * k ** 1.2, f: lerp(0.013, 0.005, k), sp: lerp(0.5, 1.2, k),
        ph: rnd() * TAU, col: [Math.round(lerp(46, 8, k)), Math.round(lerp(56, 12, k)), Math.round(lerp(116, 36, k))],
      };
    });
    const drawWave = (g: Ctx, i: number, t: number): void => {
      const w = waves[i];
      const k = i / 15;
      g.beginPath();
      g.moveTo(-10, H + 10);
      for (let x = -10; x <= W + 10; x += 8) {
        g.lineTo(x, w.y + w.amp * Math.sin(x * w.f + t * w.sp + w.ph) + w.amp * 0.5 * Math.sin(x * w.f * 2.3 - t * w.sp * 1.3));
      }
      g.lineTo(W + 10, H + 10);
      g.closePath();
      g.fillStyle = `rgb(${w.col[0]},${w.col[1]},${w.col[2]})`;
      g.fill();
      if (k > 0.25) { // foam along the crest
        g.save();
        g.setLineDash([10 + i * 2, 18 + i * 3]);
        g.lineDashOffset = -t * (14 + i * 6);
        g.strokeStyle = `rgba(226,234,255,${0.14 + 0.4 * k})`;
        g.lineWidth = 1 + 3 * k;
        g.beginPath();
        for (let x = -10; x <= W + 10; x += 8) {
          const y = w.y + w.amp * Math.sin(x * w.f + t * w.sp + w.ph) + w.amp * 0.5 * Math.sin(x * w.f * 2.3 - t * w.sp * 1.3);
          if (x === -10) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
        g.restore();
      }
    };

    const lanternGlow = glowSprite(env, '255,224,150', 256);
    const sprays = [
      { x: 330, y: 706, p: 3.4 }, { x: 590, y: 700, p: 2.9 }, { x: 735, y: 722, p: 3.8 },
      { x: 200, y: 676, p: 4.1 }, { x: 80, y: 664, p: 3.2 },
    ];
    const rainFar = makeStreaks(rnd, 340, 14, 24, 880, 1080);
    const rainNear = makeStreaks(rnd, 150, 30, 52, 1300, 1650);

    return (g, t) => {
      g.drawImage(sky, 0, 0, W, H);
      for (const c of clouds) {
        const x = wrap(c.off + t * c.v, W + c.w) - c.w;
        g.globalAlpha = c.a;
        g.drawImage(c.sprite, x, c.y, c.w, c.h);
      }
      g.globalAlpha = 1;
      const ph = t % 11; // occasional double-flash of lightning
      const flash = ph > 6 && ph < 6.14 ? 1 - (ph - 6) / 0.14 : ph > 6.3 && ph < 6.42 ? 0.7 * (1 - (ph - 6.3) / 0.12) : 0;
      if (flash > 0) {
        g.fillStyle = `rgba(190,200,255,${flash * 0.2})`;
        g.fillRect(0, 0, W, HOR + 2);
      }

      for (let i = 0; i < 10; i++) drawWave(g, i, t);
      g.drawImage(rocks, 0, 0, W, H);
      for (let i = 10; i < 16; i++) drawWave(g, i, t);

      // Sweeping beam: seen edge-on, it grows and shrinks as the lamp turns.
      const theta = t * 0.55;
      const c = Math.cos(theta);
      const faceOn = 1 - Math.abs(c);
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const dir of [1, -1]) {
        const f = Math.max(0, c * dir);
        if (f < 0.02) continue;
        const len = 1100 * f ** 0.6;
        const gr = g.createLinearGradient(LANTERN.x, 0, LANTERN.x + dir * len, 0);
        gr.addColorStop(0, `rgba(255,226,150,${0.5 * f ** 0.5})`);
        gr.addColorStop(1, 'rgba(255,226,150,0)');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(LANTERN.x, LANTERN.y - 5);
        g.lineTo(LANTERN.x + dir * len, LANTERN.y - 70 * f - 14);
        g.lineTo(LANTERN.x + dir * len, LANTERN.y + 100 * f + 8);
        g.lineTo(LANTERN.x, LANTERN.y + 5);
        g.closePath();
        g.fill();
      }
      drawGlow(g, lanternGlow, LANTERN.x, LANTERN.y, 200, 0.5 + 0.4 * faceOn);
      g.restore();

      for (const s of sprays) { // sea spray bursting off the rocks
        const period = s.p;
        const cyc = Math.floor(t / period);
        const p = t / period - cyc;
        for (let i = 0; i < 10; i++) {
          const vx = (hash2(cyc * 7 + i, 5) - 0.5) * 120;
          const vy = 70 + hash2(cyc * 7 + i, 9) * 110;
          const tt = p * 1.4;
          g.fillStyle = `rgba(230,238,255,${(1 - p) * 0.7})`;
          g.beginPath();
          g.arc(s.x + vx * tt, s.y - (vy * tt - 130 * tt * tt), 1.5 + hash2(i, cyc) * 2.6, 0, TAU);
          g.fill();
        }
        softBlob(g, s.x, s.y - 14 * Math.sin(Math.PI * p), 40, 12, '230,238,255', 0.5 * Math.sin(Math.PI * p));
      }
      drawStreaks(g, rainFar, t, { dx: -0.38, dy: 1, color: 'rgba(190,205,255,0.22)', width: 1 });
      drawStreaks(g, rainNear, t, { dx: -0.38, dy: 1, color: 'rgba(215,226,255,0.34)', width: 1.5 });
    };
  },
};
