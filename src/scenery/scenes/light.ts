/** Warm-light scenes: misty dawn lake, amber orchard, lantern bridge, summer meadow. */
import type { Ctx, SceneDef } from '../types';
import {
  H, RIGHT_CLEAR_X, TAU, W, between, createLayer, drawGlow, drawReflection, drawRipples,
  fillRidge, fogSprite, glowSprite, hGrad, lerp, makeRng, pick, ridgeY, roundedRectPath, smooth, softBlob,
  vGrad, wrap, type Rng,
} from '../util';

/* ─────────────────────────────── 8. Sun Breaks the Mist ──────────────────── */

export const mistyLakeDawn: SceneDef = {
  id: 'misty-lake-dawn',
  title: 'Sun Breaks the Mist',
  build(env) {
    const rnd = makeRng(808);
    const HOR = 520;
    const SUN = { x: 600, y: 470 };
    const glow = glowSprite(env, '255,214,140', 256);

    const sky = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, HOR, [[0, '#8e9fd0'], [0.45, '#d8b4c6'], [0.8, '#ffc98a'], [1, '#ffe4aa']]);
      g.fillRect(0, 0, W, HOR);
      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, glow, SUN.x, SUN.y, 560, 0.85);
      g.restore();
      g.fillStyle = '#fff6d6';
      g.beginPath();
      g.arc(SUN.x, SUN.y, 40, 0, TAU);
      g.fill();
      const ridges = [
        { o: { baseY: 468, amp: 30, seed: 3, freq: 0.0034 }, a: '#e0a8b0', b: '#b88aa4' },
        { o: { baseY: 498, amp: 26, seed: 8, freq: 0.0042 }, a: '#a98aa8', b: '#7e78a0' },
        { o: { baseY: 518, amp: 14, seed: 12, freq: 0.0055 }, a: '#5a6688', b: '#46557a' },
      ];
      g.save();
      g.beginPath();
      g.rect(0, 0, W, HOR);
      g.clip();
      for (const r of ridges) {
        fillRidge(g, r.o, vGrad(g, r.o.baseY - 30, r.o.baseY + 40, [[0, r.a], [1, r.b]]));
        g.fillStyle = vGrad(g, r.o.baseY - 10, r.o.baseY + 36, [[0, 'rgba(255,224,170,0)'], [1, 'rgba(255,228,176,0.7)']]);
        g.fillRect(0, r.o.baseY - 10, W, 50); // mist pooled in the valleys
      }
      g.restore();
      for (let x = 0; x < W; x += between(rnd, 10, 20)) { // far shoreline conifers
        const y = ridgeY(ridges[2].o, x);
        g.fillStyle = '#3f4e72';
        g.beginPath();
        g.moveTo(x, y - between(rnd, 10, 24));
        g.lineTo(x + 5, y + 2);
        g.lineTo(x - 5, y + 2);
        g.closePath();
        g.fill();
      }
    });

    const water = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, HOR, H, [[0, '#f0c9a0'], [0.4, '#b9a2ba'], [1, '#4c6690']]);
      g.fillRect(0, HOR, W, H - HOR);
    });
    const shade = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 640, H, [[0, 'rgba(24,40,76,0)'], [1, 'rgba(24,40,76,0.45)']]);
      g.fillRect(0, 640, W, H - 640);
      for (const bank of [
        { pts: [[0, 780], [140, 800], [360, 860], [520, H], [0, H]], c: '#1b3040' },
        { pts: [[860, H], [1010, 868], [1150, 880], [1250, H]], c: '#223a48' },
      ]) {
        g.fillStyle = bank.c;
        g.beginPath();
        bank.pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.closePath();
        g.fill();
      }
    });

    const reeds = Array.from({ length: 64 }, (_, i) => {
      const left = i < 48;
      return {
        x: left ? between(rnd, -10, 440) : between(rnd, 900, 1160),
        base: left ? between(rnd, 820, 920) : between(rnd, 880, 920),
        h: left ? between(rnd, 100, 270) : between(rnd, 70, 160),
        lean: between(rnd, -26, 26), ph: rnd() * TAU, cat: rnd() < 0.35, dark: rnd() < 0.5,
      };
    });
    const fog = fogSprite(env, '255,228,176');
    const mist = Array.from({ length: 10 }, (_, i) => ({
      off: i * 170, v: between(rnd, 6, 18), w: between(rnd, 520, 900), h: between(rnd, 90, 150),
      ph: i / 10, a: between(rnd, 0.3, 0.5),
    }));
    const glints = Array.from({ length: 80 }, () => ({
      u: rnd(), s: rnd() - 0.5, ph: rnd() * TAU, w: between(rnd, 12, 60),
    }));

    return (g, t) => {
      g.drawImage(water, 0, 0, W, H);
      g.drawImage(sky, 0, 0, W, H);
      drawReflection(g, sky, env.pixelRatio, HOR, t, { depth: 380, amp: 2.4, alpha: 0.9, speed: 1.0 });
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const gl of glints) { // sun glints under the sun
        const y = HOR + 6 + gl.u * 330;
        const a = Math.max(0, Math.sin(t * 1.7 + gl.ph)) ** 3 * 0.75;
        g.fillStyle = `rgba(255,238,196,${a})`;
        g.fillRect(SUN.x + gl.s * (90 + (y - HOR) * 0.95), y, gl.w, 1.4 + gl.u * 1.4);
      }
      for (let i = 0; i < 7; i++) { // soft rays rising from the sun
        const ang = -Math.PI / 2 + (i - 3) * 0.2 + 0.03 * Math.sin(t * 0.3 + i);
        const gr = g.createLinearGradient(SUN.x, SUN.y, SUN.x + Math.cos(ang) * 520, SUN.y + Math.sin(ang) * 520);
        gr.addColorStop(0, 'rgba(255,230,170,0.09)');
        gr.addColorStop(1, 'rgba(255,230,170,0)');
        g.fillStyle = gr;
        g.globalAlpha = 0.6 + 0.4 * Math.sin(t * 0.5 + i * 1.3);
        g.beginPath();
        g.moveTo(SUN.x, SUN.y);
        g.lineTo(SUN.x + Math.cos(ang - 0.09) * 520, SUN.y + Math.sin(ang - 0.09) * 520);
        g.lineTo(SUN.x + Math.cos(ang + 0.09) * 520, SUN.y + Math.sin(ang + 0.09) * 520);
        g.closePath();
        g.fill();
      }
      g.restore();
      g.drawImage(shade, 0, 0, W, H);
      drawRipples(g, { x0: 200, x1: 1000, y0: 610, y1: 840, count: 6, period: [4, 8], maxR: 90, squash: 0.25, seed: 4 }, t, '255,240,210', 0.35);

      for (const m of mist) { // mist drifting and lifting off the water
        const p = wrap(t * 0.028 + m.ph, 1);
        const x = wrap(m.off + t * m.v, W + m.w) - m.w;
        g.globalAlpha = Math.sin(Math.PI * p) * m.a;
        g.drawImage(fog, x, 600 - p * 150 - m.h / 2, m.w, m.h);
      }
      g.globalAlpha = 1;

      for (const r of reeds) { // swaying reeds and cattails
        const sway = Math.sin(t * 0.9 + r.ph) * 7 + Math.sin(t * 0.37 + r.ph * 2) * 4;
        const tx = r.x + r.lean + sway;
        const ty = r.base - r.h;
        g.strokeStyle = r.dark ? '#1f3a42' : '#34565a';
        g.lineWidth = r.cat ? 2.4 : 1.9;
        g.lineCap = 'round';
        g.beginPath();
        g.moveTo(r.x, r.base);
        g.quadraticCurveTo(r.x + r.lean * 0.3 + sway * 0.2, r.base - r.h * 0.55, tx, ty);
        g.stroke();
        if (r.cat) {
          g.fillStyle = '#3d2c26';
          g.beginPath();
          g.ellipse(tx, ty + 8, 3.6, 12, Math.atan2(sway, 40) * 0.6, 0, TAU);
          g.fill();
        }
      }
    };
  },
};

/* ─────────────────────────────── 9. Amber Orchard ────────────────────────── */

const LEAF_COLORS = ['#e8a21e', '#d9501c', '#f2c230', '#b8321a', '#e47b1c', '#a36a14', '#c9871e'];

function appleTree(g: Ctx, rnd: Rng, x: number, base: number, s: number): void {
  g.fillStyle = '#3a261a';
  g.beginPath();
  g.moveTo(x - 14 * s, base);
  g.quadraticCurveTo(x - 8 * s, base - 90 * s, x - 7 * s, base - 150 * s);
  g.lineTo(x + 8 * s, base - 150 * s);
  g.quadraticCurveTo(x + 10 * s, base - 80 * s, x + 16 * s, base);
  g.closePath();
  g.fill();
  const cx = x;
  const cy = base - 250 * s;
  const rx = 150 * s;
  const ry = 112 * s;
  g.strokeStyle = '#3a261a';
  g.lineWidth = 7 * s;
  for (let i = -2; i <= 2; i++) { // limbs
    g.beginPath();
    g.moveTo(x, base - 140 * s);
    g.quadraticCurveTo(x + i * 24 * s, base - 190 * s, cx + i * 62 * s, cy + 18 * s);
    g.stroke();
  }
  softBlob(g, cx, cy + 12 * s, rx * 1.05, ry * 0.95, '88,30,12', 0.65);
  const count = Math.round(520 * s * s + 40);
  for (let i = 0; i < count; i++) {
    const a = rnd() * TAU;
    const d = Math.sqrt(rnd());
    const px = cx + Math.cos(a) * d * rx;
    const py = cy + Math.sin(a) * d * ry;
    // Blotchy patches of similar colour (like leaded glass), jittered so edges mix.
    const band = 0.5 + 0.5 * Math.sin(px * 0.03 / s + 1.4 * Math.sin(py * 0.04 / s)) * Math.cos(py * 0.025 / s + px * 0.01 / s);
    const idx = Math.floor(band * LEAF_COLORS.length + (rnd() - 0.5) * 2.4);
    const col = LEAF_COLORS[Math.max(0, Math.min(LEAF_COLORS.length - 1, idx))];
    const ls = between(rnd, 8, 15) * s;
    g.save();
    g.translate(px, py);
    g.rotate(rnd() * Math.PI);
    g.globalAlpha = between(rnd, 0.82, 0.97);
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(0, 0, ls, ls * 0.48, 0, 0, TAU);
    g.fill();
    g.fillStyle = 'rgba(255,236,150,0.34)'; // light shining through the leaf
    g.beginPath();
    g.ellipse(-ls * 0.1, 0, ls * 0.55, ls * 0.2, 0, 0, TAU);
    g.fill();
    g.restore();
  }
  g.globalAlpha = 1;
  for (let i = 0; i < Math.round(9 * s); i++) { // apples still on the branch
    const a = rnd() * TAU;
    const d = Math.sqrt(rnd()) * 0.8;
    g.fillStyle = '#c4301c';
    g.beginPath();
    g.arc(cx + Math.cos(a) * d * rx, cy + Math.sin(a) * d * ry, between(rnd, 5, 8) * s, 0, TAU);
    g.fill();
  }
}

function apple(g: Ctx, x: number, y: number, r: number): void {
  g.fillStyle = 'rgba(30,20,0,0.35)';
  g.beginPath();
  g.ellipse(x + r * 0.2, y + r * 0.8, r * 1.1, r * 0.4, 0, 0, TAU);
  g.fill();
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  gr.addColorStop(0, '#f0623a');
  gr.addColorStop(0.6, '#c3281a');
  gr.addColorStop(1, '#7c1410');
  g.fillStyle = gr;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.beginPath();
  g.ellipse(x - r * 0.38, y - r * 0.4, r * 0.22, r * 0.13, -0.6, 0, TAU);
  g.fill();
}

function crate(g: Ctx, rnd: Rng, x: number, y: number, w: number, h: number): void {
  const d = 14;
  g.fillStyle = '#4a2f18'; // inside
  g.beginPath();
  g.moveTo(x, y - h);
  g.lineTo(x + w, y - h);
  g.lineTo(x + w + d, y - h - d * 0.8);
  g.lineTo(x + d, y - h - d * 0.8);
  g.closePath();
  g.fill();
  for (let i = 0; i < Math.round(w / 17); i++) apple(g, x + 10 + i * 17 + between(rnd, -2, 2) + d * 0.5, y - h - 4 - between(rnd, 0, 8), 9);
  g.fillStyle = vGrad(g, y - h, y, [[0, '#b27a3e'], [1, '#6e4624']]); // front face
  g.fillRect(x, y - h, w, h);
  g.fillStyle = '#5a3a1e'; // side face
  g.beginPath();
  g.moveTo(x + w, y - h);
  g.lineTo(x + w + d, y - h - d * 0.8);
  g.lineTo(x + w + d, y - d * 0.8);
  g.lineTo(x + w, y);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(30,16,6,0.55)';
  for (let k = 1; k < 3; k++) g.fillRect(x, y - h + (h / 3) * k - 1, w, 2.5);
  g.fillRect(x + 4, y - h, 6, h);
  g.fillRect(x + w - 10, y - h, 6, h);
  g.fillStyle = 'rgba(255,210,140,0.2)';
  g.fillRect(x, y - h, w, 3);
  g.fillStyle = 'rgba(20,12,0,0.3)';
  g.beginPath();
  g.ellipse(x + w / 2 + 8, y + 2, w * 0.62, 8, 0, 0, TAU);
  g.fill();
}

export const amberOrchard: SceneDef = {
  id: 'amber-orchard',
  title: 'Amber Orchard',
  build(env) {
    const rnd = makeRng(909);
    const SUN = { x: 760, y: 350 };
    const sunGlow = glowSprite(env, '255,205,120', 256);

    const main = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 520, [[0, '#f0b868'], [0.55, '#ffd592'], [1, '#ffe8bc']]);
      g.fillRect(0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, sunGlow, SUN.x, SUN.y, 640, 0.9);
      g.restore();
      g.fillStyle = '#fff4cf';
      g.beginPath();
      g.arc(SUN.x, SUN.y, 30, 0, TAU);
      g.fill();
      fillRidge(g, { baseY: 400, amp: 26, seed: 4, freq: 0.0034 }, vGrad(g, 370, 480, [[0, '#d99a58'], [1, '#c2824a']]));
      g.fillStyle = vGrad(g, 430, H, [[0, '#dcb85e'], [0.3, '#aca243'], [1, '#4f6030']]);
      g.fillRect(0, 440, W, H - 440);

      const row = (n: number, y: number, s: number, x0: number, x1: number): void => {
        for (let i = 0; i < n; i++) appleTree(g, rnd, lerp(x0, x1, (i + between(rnd, 0.1, 0.9)) / n), y + between(rnd, -6, 6), s);
      };
      row(15, 472, 0.26, 20, 1260);
      g.fillStyle = vGrad(g, 420, 560, [[0, 'rgba(255,214,150,0)'], [1, 'rgba(255,214,150,0.32)']]);
      g.fillRect(0, 420, W, 140);
      row(6, 600, 0.6, 120, 1200);
      g.fillStyle = vGrad(g, 480, 640, [[0, 'rgba(255,214,150,0)'], [1, 'rgba(255,214,150,0.2)']]);
      g.fillRect(0, 480, W, 160);

      // Long tree shadows raking away from the sun.
      const shadow = (x: number, base: number, s: number): void => {
        const vx = x - SUN.x;
        const vy = base - SUN.y;
        const n = Math.hypot(vx, vy);
        const L = 230 * s;
        g.fillStyle = 'rgba(46,44,10,0.26)';
        g.beginPath();
        g.moveTo(x - 30 * s, base);
        g.lineTo(x + 30 * s, base);
        g.lineTo(x + (vx / n) * L + 70 * s, base + (vy / n) * L * 0.55);
        g.lineTo(x + (vx / n) * L - 70 * s, base + (vy / n) * L * 0.55);
        g.closePath();
        g.fill();
      };
      shadow(170, 760, 1.25);
      shadow(520, 780, 1.25);
      shadow(1040, 760, 1.15);

      appleTree(g, rnd, 170, 760, 1.25);
      appleTree(g, rnd, 520, 780, 1.25);
      appleTree(g, rnd, 1040, 760, 1.15);

      for (let i = 0; i < 46; i++) { // windfall apples
        const near = pick(rnd, [170, 520, 1040]);
        apple(g, Math.min(1170, near + between(rnd, -190, 190)), between(rnd, 730, 890), between(rnd, 7, 11));
      }
      crate(g, rnd, 650, 836, 150, 66);
      crate(g, rnd, 850, 800, 112, 52);
      for (let i = 0; i < 300; i++) { // fallen leaves on the grass
        g.fillStyle = `rgba(${pick(rnd, ['232,162,30', '217,80,28', '242,194,48'])},${between(rnd, 0.4, 0.9)})`;
        g.beginPath();
        g.ellipse(between(rnd, 0, W), between(rnd, 620, 895), between(rnd, 3, 6), between(rnd, 1.5, 3), rnd() * Math.PI, 0, TAU);
        g.fill();
      }
    });

    const warm = glowSprite(env, '255,214,140');
    const leaves = Array.from({ length: 52 }, () => ({
      x: rnd() * W, y: rnd() * H, v: between(rnd, 18, 42), ph: rnd() * TAU, spin: between(rnd, -2.5, 2.5),
      s: between(rnd, 0.8, 1.6), c: pick(rnd, LEAF_COLORS),
    }));
    const motes = Array.from({ length: 80 }, () => ({
      x: between(rnd, 300, 1100), y: between(rnd, 260, 760), ph: rnd() * TAU, r: between(rnd, 0.8, 2),
    }));
    const dapple = Array.from({ length: 16 }, () => ({
      x: between(rnd, 20, 1180), y: between(rnd, 250, 640), r: between(rnd, 60, 120), ph: rnd() * TAU,
    }));

    return (g, t) => {
      g.drawImage(main, 0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) { // shafts of low sun through the trees
        const ang = Math.PI / 2 + (i - 2.5) * 0.3;
        const half = 0.055;
        const gr = g.createLinearGradient(SUN.x, SUN.y, SUN.x + Math.cos(ang) * 900, SUN.y + Math.sin(ang) * 900);
        gr.addColorStop(0, 'rgba(255,214,140,0.2)');
        gr.addColorStop(1, 'rgba(255,214,140,0)');
        g.fillStyle = gr;
        g.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.4 + i * 1.9);
        g.beginPath();
        g.moveTo(SUN.x, SUN.y);
        g.lineTo(SUN.x + Math.cos(ang - half) * 900, SUN.y + Math.sin(ang - half) * 900);
        g.lineTo(SUN.x + Math.cos(ang + half) * 900, SUN.y + Math.sin(ang + half) * 900);
        g.closePath();
        g.fill();
      }
      for (const d of dapple) { // wind-stirred dapples shimmering over the foliage
        drawGlow(g, warm, d.x + Math.sin(t * 0.35 + d.ph) * 26, d.y + Math.cos(t * 0.3 + d.ph) * 14, d.r, 0.1 + 0.06 * Math.sin(t * 0.8 + d.ph));
      }
      for (const m of motes) { // dust motes floating in the light
        const a = 0.25 + 0.55 * Math.max(0, Math.sin(t * 0.9 + m.ph));
        g.fillStyle = `rgba(255,236,170,${a * 0.7})`;
        g.beginPath();
        g.arc(m.x + Math.sin(t * 0.25 + m.ph) * 18, wrap(m.y - t * 5, 520) + 240, m.r, 0, TAU);
        g.fill();
      }
      g.restore();
      for (const l of leaves) { // leaves tumbling down
        const x = wrap(l.x + t * 16 + Math.sin(t * 0.8 + l.ph) * 34, W + 60) - 30;
        const y = wrap(l.y + t * l.v, H + 60) - 30;
        g.fillStyle = l.c;
        g.globalAlpha = 0.92;
        g.beginPath();
        g.ellipse(x, y, 8 * l.s, 3.6 * l.s * Math.abs(Math.cos(t * l.spin + l.ph)) + 0.8, l.ph + t * 0.6, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
    };
  },
};

/* ─────────────────────────────── 10. Lantern Bridge ──────────────────────── */

export const lanternBridge: SceneDef = {
  id: 'lantern-bridge',
  title: 'Lantern Bridge',
  build(env) {
    const rnd = makeRng(1010);
    const WL = 590;
    const B = { cx: 640, R: 178, ring: 30, deck: 382, x0: 222, x1: 1058 };
    const posts = [250, 380, 510, 640, 770, 900, 1030].map((x) => ({ x, y: B.deck - 52, ph: rnd() * TAU }));

    const above = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, WL, [[0, '#2b2358'], [0.45, '#7a4a86'], [0.8, '#e07a5f'], [1, '#ffb35e']]);
      g.fillRect(0, 0, W, WL);
      for (let i = 0; i < 20; i++) { // streaky dusk clouds
        const y = between(rnd, 170, 440);
        g.fillStyle = `rgba(${rnd() < 0.5 ? '255,150,120' : '112,66,150'},${between(rnd, 0.18, 0.34)})`;
        g.beginPath();
        g.ellipse(between(rnd, -100, 1500), y, between(rnd, 120, 300), between(rnd, 7, 18), 0, 0, TAU);
        g.fill();
      }
      fillRidge(g, { baseY: 468, amp: 40, seed: 5, freq: 0.0034 }, '#4c3568');
      fillRidge(g, { baseY: 516, amp: 30, seed: 9, freq: 0.0046 }, '#3a2a58');
      for (let i = 0; i < 24; i++) { // distant village lights
        g.fillStyle = `rgba(255,190,110,${between(rnd, 0.4, 0.9)})`;
        g.fillRect(between(rnd, 20, 1180), between(rnd, 505, 540), 2, 2);
      }

      // The arch bridge: body with a semicircular opening, stone courses, voussoirs.
      const body = (): void => {
        g.beginPath();
        g.rect(B.x0, B.deck, B.x1 - B.x0, WL - B.deck);
        g.arc(B.cx, WL, B.R, 0, TAU);
      };
      body();
      g.fillStyle = vGrad(g, B.deck, WL, [[0, '#54406a'], [1, '#2a2042']]);
      g.fill('evenodd');
      g.save();
      body();
      g.clip('evenodd');
      for (let y = B.deck + 6, row = 0; y < WL; y += 22, row++) {
        g.fillStyle = 'rgba(20,12,36,0.45)';
        g.fillRect(B.x0, y, B.x1 - B.x0, 2);
        for (let x = B.x0 + (row % 2) * 36; x < B.x1; x += 72) g.fillRect(x, y, 2, 22);
        g.fillStyle = 'rgba(255,170,120,0.07)';
        g.fillRect(B.x0, y + 2, B.x1 - B.x0, 2);
      }
      g.restore();
      g.fillStyle = '#5a4666'; // voussoir ring around the opening
      g.beginPath();
      g.arc(B.cx, WL, B.R + B.ring, Math.PI, 0);
      g.arc(B.cx, WL, B.R, 0, Math.PI, true);
      g.closePath();
      g.fill();
      g.strokeStyle = 'rgba(20,12,36,0.7)';
      g.lineWidth = 2;
      for (let a = Math.PI; a <= TAU + 0.001; a += Math.PI / 30) {
        g.beginPath();
        g.moveTo(B.cx + Math.cos(a) * B.R, WL + Math.sin(a) * B.R);
        g.lineTo(B.cx + Math.cos(a) * (B.R + B.ring), WL + Math.sin(a) * (B.R + B.ring));
        g.stroke();
      }
      g.strokeStyle = 'rgba(255,176,110,0.7)'; // lit inner lip of the arch
      g.lineWidth = 4;
      g.beginPath();
      g.arc(B.cx, WL, B.R - 1, Math.PI, TAU);
      g.stroke();
      g.fillStyle = '#4a3860'; // parapet, coping and posts
      g.fillRect(B.x0 - 10, B.deck - 30, B.x1 - B.x0 + 20, 30);
      g.fillStyle = '#6a5478';
      g.fillRect(B.x0 - 14, B.deck - 38, B.x1 - B.x0 + 28, 9);
      for (const p of posts) {
        g.fillStyle = '#4a3860';
        g.fillRect(p.x - 9, p.y + 12, 18, 40);
        g.fillStyle = '#6a5478';
        g.fillRect(p.x - 12, p.y + 8, 24, 7);
        g.fillStyle = '#ffb35e';
        g.fillRect(p.x - 6, p.y - 8, 12, 17);
        g.fillStyle = '#2a2042';
        g.fillRect(p.x - 8, p.y - 11, 16, 4);
        g.fillRect(p.x - 8, p.y + 8, 16, 3);
      }

      // Banks and autumn trees.
      const bank = (pts: number[][], c: string): void => {
        g.fillStyle = c;
        g.beginPath();
        pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
        g.closePath();
        g.fill();
      };
      bank([[0, WL], [0, 428], [150, 402], [250, 384], [320, WL]], '#241a3a');
      bank([[1000, WL], [1020, 384], [1120, 404], [1300, 436], [W, 450], [W, WL]], '#1d1632');
      const tree = (x: number, base: number, h: number): void => {
        g.strokeStyle = '#1c1228';
        g.lineWidth = Math.max(4, h * 0.035);
        g.beginPath();
        g.moveTo(x, base);
        g.quadraticCurveTo(x + between(rnd, -8, 8), base - h * 0.5, x, base - h * 0.78);
        g.stroke();
        for (let i = 0; i < Math.round(h * 0.9); i++) {
          const a = rnd() * TAU;
          const d = Math.sqrt(rnd());
          g.fillStyle = `rgba(${pick(rnd, ['180,72,31', '217,112,42', '138,46,34', '230,154,58', '107,42,46'])},${between(rnd, 0.8, 0.97)})`;
          g.beginPath();
          g.arc(x + Math.cos(a) * d * h * 0.36, base - h * 0.72 + Math.sin(a) * d * h * 0.3, between(rnd, 5, 11), 0, TAU);
          g.fill();
        }
      };
      [[40, 470, 300], [150, 440, 250], [260, 412, 210], [20, 560, 330]].forEach(([x, b, h]) => tree(x, b + 120, h));
      [[1090, 430, 200], [1150, 440, 150]].forEach(([x, b, h]) => tree(x, b + 100, h));
    });

    const water = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, WL, H, [[0, '#d4686a'], [0.35, '#703f7c'], [1, '#262150']]);
      g.fillRect(0, WL, W, H - WL);
    });
    const shade = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 700, H, [[0, 'rgba(18,12,40,0)'], [1, 'rgba(18,12,40,0.4)']]);
      g.fillRect(0, 700, W, H - 700);
    });

    const glowWarm = glowSprite(env, '255,184,100');
    const lanterns = Array.from({ length: 26 }, (_, i) => ({
      x: i < 18 ? between(rnd, 330, 960) : between(rnd, 110, 1150), v: between(rnd, 14, 30), off: rnd() * 700,
      w: between(rnd, 13, 24), ph: rnd() * TAU,
    }));
    const leaves = Array.from({ length: 20 }, () => ({
      x: rnd() * W, y: rnd() * H, v: between(rnd, 16, 34), ph: rnd() * TAU,
      c: pick(rnd, ['#d9702a', '#b4481f', '#e69a3a', '#8a2e22']), s: between(rnd, 0.8, 1.5),
    }));
    const floaters = Array.from({ length: 9 }, () => ({
      x: between(rnd, 120, 1150), y: between(rnd, 640, 860), ph: rnd() * TAU, c: pick(rnd, ['#d9702a', '#b4481f', '#e69a3a']),
    }));

    const lanternAt = (l: (typeof lanterns)[number], t: number): { x: number; y: number; a: number } => {
      const y = 640 - wrap(t * l.v + l.off, 700);
      return { x: l.x + Math.sin(t * 0.6 + l.ph) * 12 + (640 - y) * 0.03, y, a: smooth(-30, 90, y) * smooth(640, 540, y) };
    };
    const drawLantern = (g: Ctx, x: number, y: number, w: number, a: number): void => {
      g.globalAlpha = a;
      g.fillStyle = vGrad(g, y - w, y + w * 0.4, [[0, '#ffe79a'], [1, '#ff8d3c']]);
      roundedRectPath(g, x - w / 2, y - w * 0.62, w, w * 1.15, w * 0.3);
      g.fill();
      g.fillStyle = 'rgba(120,50,20,0.7)';
      g.fillRect(x - w * 0.3, y - w * 0.66, w * 0.6, 2);
      g.fillRect(x - w * 0.3, y + w * 0.5, w * 0.6, 2);
      g.globalAlpha = 1;
    };

    return (g, t) => {
      g.drawImage(water, 0, 0, W, H);
      g.drawImage(above, 0, 0, W, H);
      drawReflection(g, above, env.pixelRatio, WL, t, { depth: 310, amp: 2.2, alpha: 0.92, speed: 1.0 });
      g.drawImage(shade, 0, 0, W, H);

      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, glowWarm, B.cx, WL, 300, 0.16 + 0.03 * Math.sin(t * 0.9)); // glow pooling in the ring
      for (const p of posts) {
        const f = 0.8 + 0.2 * Math.sin(t * 5 + p.ph) * Math.sin(t * 1.7 + p.ph);
        drawGlow(g, glowWarm, p.x, p.y, 64, 0.6 * f);
        drawGlow(g, glowWarm, p.x, 2 * WL - p.y, 50, 0.22 * f); // its reflection
      }
      for (const l of lanterns) {
        const p = lanternAt(l, t);
        drawGlow(g, glowWarm, p.x, p.y, l.w * 4.5, 0.55 * p.a);
        if (p.y < WL && 2 * WL - p.y < H) drawGlow(g, glowWarm, p.x + Math.sin(t * 1.4 + l.ph) * 3, 2 * WL - p.y, l.w * 3.5, 0.24 * p.a);
      }
      g.restore();
      for (const l of lanterns) {
        const p = lanternAt(l, t);
        drawLantern(g, p.x, p.y, l.w, p.a);
      }

      drawRipples(g, { x0: 100, x1: 1180, y0: 620, y1: 880, count: 12, period: [2.5, 5], maxR: 64, squash: 0.26, seed: 5 }, t, '255,200,150', 0.32);
      for (const f of floaters) {
        g.fillStyle = f.c;
        g.globalAlpha = 0.85;
        g.beginPath();
        g.ellipse(f.x + Math.sin(t * 0.2 + f.ph) * 22, f.y + Math.cos(t * 0.17 + f.ph) * 4, 8, 3, f.ph, 0, TAU);
        g.fill();
      }
      g.globalAlpha = 1;
      for (const l of leaves) { // leaves drifting through the dusk air
        const x = wrap(l.x + t * 14 + Math.sin(t * 0.7 + l.ph) * 30, W + 60) - 30;
        const y = wrap(l.y + t * l.v, H + 60) - 30;
        g.fillStyle = l.c;
        g.beginPath();
        g.ellipse(x, y, 7 * l.s, 3 * l.s * Math.abs(Math.cos(t * 1.6 + l.ph)) + 0.8, l.ph + t * 0.5, 0, TAU);
        g.fill();
      }
    };
  },
};

/* ─────────────────────────────── 11. Wind Across the Wildflowers ─────────── */

interface Bloom { x: number; y: number; h: number; s: number; kind: number; ph: number }

export const summerMeadow: SceneDef = {
  id: 'summer-meadow',
  title: 'Wind Across the Wildflowers',
  build(env) {
    const rnd = makeRng(1111);

    const cloudSprite = createLayer(env, (g) => {
      for (let i = 0; i < 16; i++) {
        const cx = 70 + rnd() * 280;
        const cy = 120 - Math.sin((cx / 420) * Math.PI) * 38 * rnd();
        const r = between(rnd, 34, 70);
        g.fillStyle = vGrad(g, cy - r, cy + r, [[0, '#ffffff'], [1, '#e6f1fb']]);
        g.beginPath();
        g.arc(cx, cy, r, 0, TAU);
        g.fill();
      }
      g.globalCompositeOperation = 'source-atop';
      g.fillStyle = vGrad(g, 80, 190, [[0, 'rgba(150,180,215,0)'], [1, 'rgba(140,172,212,0.6)']]);
      g.fillRect(0, 0, 420, 200);
    }, 420, 200);
    const clouds = [
      { x: 80, y: 90, w: 420, v: 7 }, { x: 760, y: 150, w: 300, v: 5 }, { x: 1180, y: 60, w: 360, v: 9 },
      { x: 470, y: 230, w: 240, v: 6 }, { x: 1000, y: 260, w: 220, v: 8 },
    ];

    const hills = [
      { o: { baseY: 440, amp: 40, seed: 31, freq: 0.0030 }, a: '#7cb872', b: '#4f9a55', dots: 260, r: [0.8, 1.6] },
      { o: { baseY: 490, amp: 38, seed: 33, freq: 0.0036 }, a: '#6bb85c', b: '#3f8e44', dots: 800, r: [1.2, 2.6] },
      { o: { baseY: 560, amp: 36, seed: 36, freq: 0.0042 }, a: '#6fc450', b: '#3f9d3d', dots: 1300, r: [1.6, 3.2] },
      { o: { baseY: 650, amp: 30, seed: 39, freq: 0.0050 }, a: '#80d03e', b: '#3b9a30', dots: 1000, r: [2.4, 4.4] },
    ];
    const FLOWER = ['#ff3d3d', '#ffd23a', '#ffffff', '#6a7bff', '#c46bff', '#ff8a2a', '#ff7fb0'];

    const backdrop = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 520, [[0, '#2f7fe0'], [0.55, '#5fb0f0'], [1, '#c2e6fa']]);
      g.fillRect(0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      softBlob(g, 120, 40, 520, 340, '255,244,200', 0.5);
      g.restore();
      for (const h of hills) {
        fillRidge(g, h.o, vGrad(g, h.o.baseY - 40, h.o.baseY + 200, [[0, h.a], [1, h.b]]));
        // Drifts of one colour read as painted swaths when seen from afar.
        const swaths = Array.from({ length: 9 }, () => ({ x: between(rnd, 0, W), y: between(rnd, h.o.baseY + 20, h.o.baseY + 140), c: pick(rnd, FLOWER) }));
        for (let i = 0; i < h.dots; i++) { // distant flowers as colour specks
          const sw = swaths[Math.floor(rnd() * swaths.length)];
          const inSwath = rnd() < 0.6;
          const x = inSwath ? sw.x + (rnd() - 0.5) * 260 : between(rnd, 0, W);
          const y = inSwath ? sw.y + (rnd() - 0.5) * 60 : between(rnd, ridgeY(h.o, x) + 6, h.o.baseY + 150);
          if (y > H || y < ridgeY(h.o, x) + 4) continue;
          g.fillStyle = inSwath ? sw.c : pick(rnd, FLOWER);
          g.globalAlpha = between(rnd, 0.5, 0.9);
          g.beginPath();
          g.arc(x, y, between(rnd, h.r[0], h.r[1]), 0, TAU);
          g.fill();
        }
        g.globalAlpha = 1;
      }
    });

    // Foreground blooms, thinned out on the right to keep it quiet.
    const blooms: Bloom[] = [];
    while (blooms.length < 380) {
      const x = between(rnd, -10, W);
      if (x > RIGHT_CLEAR_X + 40 && rnd() < 0.7) continue;
      const y = between(rnd, 640, 905);
      const s = 0.55 + ((y - 640) / 265) * 1.05;
      blooms.push({ x, y, h: between(rnd, 22, 62) * s, s, kind: Math.floor(rnd() * 6), ph: rnd() * TAU });
    }
    blooms.sort((a, b) => a.y - b.y);
    const blades = Array.from({ length: 640 }, () => {
      const y = between(rnd, 650, 910);
      return { x: between(rnd, -10, W + 10), y, h: between(rnd, 16, 60) * (0.5 + (y - 650) / 260), ph: rnd() * TAU, c: Math.floor(rnd() * 3) };
    });
    const bladeColors = ['#2f8a26', '#4aa832', '#6cc23e'];
    const shadowBlob = glowSprite(env, '10,50,40');

    const drawBloom = (g: Ctx, b: Bloom, t: number): void => {
      const sway = Math.sin(t * 1.5 + b.x * 0.012 + b.y * 0.005) * 6 * b.s + Math.sin(t * 0.6 + b.ph) * 2 * b.s;
      const hx = b.x + sway;
      const hy = b.y - b.h;
      g.strokeStyle = '#3d8a2c';
      g.lineWidth = 1.6 * b.s + 0.4;
      g.beginPath();
      g.moveTo(b.x, b.y);
      g.quadraticCurveTo(b.x + sway * 0.2, b.y - b.h * 0.5, hx, hy);
      g.stroke();
      const s = b.s;
      const petals = (n: number, dist: number, rx: number, ry: number, col: string): void => {
        g.fillStyle = col;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + b.ph;
          g.beginPath();
          g.ellipse(hx + Math.cos(a) * dist * s, hy + Math.sin(a) * dist * s, rx * s, ry * s, a, 0, TAU);
          g.fill();
        }
      };
      const dot = (r: number, col: string): void => {
        g.fillStyle = col;
        g.beginPath();
        g.arc(hx, hy, r * s, 0, TAU);
        g.fill();
      };
      switch (b.kind) {
        case 0: petals(9, 5, 4.6, 2, '#ffffff'); dot(3, '#ffc928'); break; // daisy
        case 1: petals(5, 4, 5.2, 5.2, '#e8261f'); dot(2.2, '#2a1010'); break; // poppy
        case 2: petals(7, 4, 4.6, 1.8, '#4f6bff'); dot(2, '#232a8a'); break; // cornflower
        case 3: for (let j = 0; j < 5; j++) { g.fillStyle = '#a45cf0'; g.beginPath(); g.arc(hx + (j % 2) * 2 * s, hy + j * 4.2 * s, 3.2 * s, 0, TAU); g.fill(); } break; // lupin
        case 4: petals(5, 3, 3.6, 3.6, '#ffd62b'); dot(2, '#c28a00'); break; // buttercup
        default: petals(8, 4.4, 4.4, 2.2, '#ff7fb0'); dot(2.4, '#ffd34d'); break; // cosmos
      }
    };

    return (g, t) => {
      g.drawImage(backdrop, 0, 0, W, H);
      for (const c of clouds) { // slow, drifting cumulus
        const x = wrap(c.x + t * c.v, W + c.w * 1.4) - c.w * 0.7;
        g.drawImage(cloudSprite, x, c.y, c.w, c.w * (200 / 420));
      }
      // Cloud shadows gliding over the hills.
      for (let i = 0; i < 4; i++) {
        const x = wrap(i * 420 + t * 26, W + 700) - 350;
        g.globalAlpha = 0.22;
        g.drawImage(shadowBlob, x - 260, 480 + (i % 2) * 120 + i * 20, 520, 180);
      }
      g.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { // blades swaying in the wind
        g.strokeStyle = bladeColors[i];
        g.lineWidth = 1.5;
        g.beginPath();
        for (const b of blades) {
          if (b.c !== i) continue;
          const sway = Math.sin(t * 1.7 + b.x * 0.013 + b.y * 0.004) * 7 * (b.h / 50);
          g.moveTo(b.x, b.y);
          g.quadraticCurveTo(b.x + sway * 0.3, b.y - b.h * 0.55, b.x + sway, b.y - b.h);
        }
        g.stroke();
      }
      for (const b of blooms) drawBloom(g, b, t);

      g.save(); // bands of sunlight racing across the grass
      g.globalCompositeOperation = 'lighter';
      for (const band of [{ v: 70, w: 520, a: 0.15, o: 0 }, { v: 46, w: 380, a: 0.1, o: 700 }]) {
        const x = wrap(t * band.v + band.o, W + band.w * 2) - band.w;
        g.fillStyle = hGrad(g, x - band.w, x + band.w, [[0, 'rgba(255,240,170,0)'], [0.5, `rgba(255,244,180,${band.a})`], [1, 'rgba(255,240,170,0)']]);
        g.fillRect(x - band.w, 440, band.w * 2, H - 440);
      }
      g.restore();
    };
  },
};
