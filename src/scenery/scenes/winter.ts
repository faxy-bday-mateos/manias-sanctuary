/** Winter scenes: cabin, aurora lake, golden pines, whiteout pass, village. */
import type { SceneDef } from '../types';
import {
  H, RIGHT_CLEAR_X, TAU, W, between, createLayer, drawFlakes, drawGlow, drawPine, drawReflection,
  drawSmoke, drawStreaks, fbm, fillRidge, glowSprite, hGrad, lerp, makeFlakes, makeRng,
  makeStreaks, pick, smooth, softBlob, vGrad, wrap, fogSprite, } from '../util';

/* ─────────────────────────── 1. Chimney-Warm ─────────────────────────────── */

export const snowboundCabin: SceneDef = {
  id: 'snowbound-cabin',
  title: 'Chimney-Warm',
  build(env) {
    const rnd = makeRng(101);
    const cabin = { x: 360, base: 604, w: 300, h: 128 };
    const win = { x: cabin.x - 76, y: cabin.base - cabin.h + 34, w: 58, h: 46 };

    const backdrop = createLayer(env, (g) => {
      // Blue-hour sky with a few faint stars.
      g.fillStyle = vGrad(g, 0, 600, [[0, '#0a1131'], [0.55, '#1b2f68'], [1, '#4b78ab']]);
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 110; i++) {
        g.fillStyle = `rgba(220,230,255,${between(rnd, 0.15, 0.6)})`;
        g.fillRect(rnd() * W, rnd() * 330, between(rnd, 0.8, 1.8), between(rnd, 0.8, 1.8));
      }
      fillRidge(g, { baseY: 500, amp: 46, seed: 3, freq: 0.003 }, '#2a4375');
      fillRidge(g, { baseY: 548, amp: 30, seed: 7, freq: 0.004 }, '#1d3260');
      for (let x = -10; x < 1220; x += between(rnd, 14, 26)) {
        drawPine(g, x, 584 + between(rnd, -6, 6), between(rnd, 44, 92), { body: '#122148', snow: '#35568a' });
      }

      // Frozen lake with long, faint sheen lines.
      g.fillStyle = vGrad(g, 570, 780, [[0, '#4f7ab0'], [1, '#1a2c58']]);
      g.fillRect(0, 570, W, 330);
      for (let i = 0; i < 70; i++) {
        const y = between(rnd, 590, 740);
        const x = between(rnd, 380, 1380);
        g.strokeStyle = `rgba(190,215,255,${between(rnd, 0.05, 0.14)})`;
        g.lineWidth = between(rnd, 1, 2.2);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + between(rnd, 40, 160), y + between(rnd, -2, 2));
        g.stroke();
      }

      // Snowy bank in the foreground.
      g.beginPath();
      g.moveTo(0, H);
      g.lineTo(0, 592);
      g.bezierCurveTo(200, 560, 420, 585, 560, 640);
      g.bezierCurveTo(760, 722, 1000, 706, W, 740);
      g.lineTo(W, H);
      g.closePath();
      g.fillStyle = vGrad(g, 560, 900, [[0, '#93b4e0'], [0.35, '#5c7db6'], [1, '#2a4274']]);
      g.fill();
      g.strokeStyle = 'rgba(200,222,250,0.5)';
      g.lineWidth = 3;
      g.stroke();
      for (let i = 0; i < 9; i++) {
        softBlob(g, between(rnd, 0, 1300), between(rnd, 680, 880), between(rnd, 120, 260), 30, '170,200,238', 0.35);
        softBlob(g, between(rnd, 0, 1300), between(rnd, 700, 890), between(rnd, 100, 220), 26, '20,36,84', 0.35);
      }

      // Pines flanking the cabin.
      drawPine(g, 70, 640, 330, { body: '#0f1d44', snow: '#9dbbe6' });
      drawPine(g, 175, 622, 250, { body: '#12244f', snow: '#9dbbe6' });
      drawPine(g, 610, 628, 190, { body: '#12244f', snow: '#8fb0de' });
      drawPine(g, 690, 650, 120, { body: '#14285a', snow: '#8fb0de' });

      // Cabin: chimney first so the roof overlaps it.
      const { x, base, w, h } = cabin;
      g.fillStyle = vGrad(g, base - h, base, [[0, '#5d3b2a'], [1, '#33200f']]);
      g.fillRect(x - w / 2, base - h, w, h);
      for (let y = base - h + 14; y < base; y += 16) {
        g.fillStyle = 'rgba(15,8,4,0.55)';
        g.fillRect(x - w / 2, y, w, 2);
        g.fillStyle = 'rgba(255,190,120,0.08)';
        g.fillRect(x - w / 2, y + 2, w, 1.5);
      }
      for (let i = 0; i < 10; i++) { // log ends at the corners
        g.fillStyle = '#6d4630';
        g.beginPath();
        g.ellipse(x - w / 2, base - h + 8 + i * 12.8, 5, 6, 0, 0, TAU);
        g.ellipse(x + w / 2, base - h + 8 + i * 12.8, 5, 6, 0, 0, TAU);
        g.fill();
      }
      g.fillStyle = '#463836'; // chimney
      g.fillRect(x + 56, base - h - 118, 36, 90);
      g.fillStyle = '#d4e3f7';
      g.fillRect(x + 52, base - h - 126, 44, 12);
      const apex = base - h - 98;
      g.fillStyle = '#2b1b14'; // roof
      g.beginPath();
      g.moveTo(x - w / 2 - 28, base - h + 6);
      g.lineTo(x, apex);
      g.lineTo(x + w / 2 + 28, base - h + 6);
      g.closePath();
      g.fill();
      g.fillStyle = '#cfe0f6'; // roof snow
      g.beginPath();
      g.moveTo(x - w / 2 - 34, base - h + 10);
      g.lineTo(x, apex - 10);
      g.lineTo(x + w / 2 + 34, base - h + 10);
      for (let i = 0; i <= 12; i++) {
        const px = x + w / 2 + 34 - (i / 12) * (w + 68);
        g.lineTo(px, base - h + 10 - 18 + (i % 2) * 14 + 8);
      }
      g.closePath();
      g.fill();
      g.fillStyle = 'rgba(90,120,180,0.35)';
      g.beginPath();
      g.moveTo(x, apex - 10);
      g.lineTo(x + w / 2 + 34, base - h + 10);
      g.lineTo(x + 10, base - h - 4);
      g.closePath();
      g.fill();

      g.fillStyle = vGrad(g, win.y, win.y + win.h, [[0, '#ffd37a'], [1, '#ff9a3c']]); // window
      g.fillRect(win.x, win.y, win.w, win.h);
      g.strokeStyle = '#2a170d';
      g.lineWidth = 4;
      g.strokeRect(win.x, win.y, win.w, win.h);
      g.beginPath();
      g.moveTo(win.x + win.w / 2, win.y);
      g.lineTo(win.x + win.w / 2, win.y + win.h);
      g.moveTo(win.x, win.y + win.h / 2);
      g.lineTo(win.x + win.w, win.y + win.h / 2);
      g.stroke();
      g.fillStyle = '#e4eefb'; // sill snow
      g.fillRect(win.x - 6, win.y + win.h, win.w + 12, 7);
      g.fillStyle = '#2b180f'; // door
      g.fillRect(x + 36, base - 84, 50, 84);
      g.fillStyle = '#d8a24a';
      g.beginPath();
      g.arc(x + 78, base - 42, 2.6, 0, TAU);
      g.fill();
      // Snow drifts hugging the walls.
      softBlob(g, x - 60, base + 6, 220, 24, '150,182,226', 0.95);
      softBlob(g, x + 80, base + 10, 200, 22, '165,195,236', 0.95);
      g.fillStyle = '#a9c6ec';
      g.beginPath();
      g.ellipse(x - 10, base + 12, 190, 14, 0, 0, TAU);
      g.fill();
    });

    const glow = glowSprite(env, '255,176,80');
    const far = makeFlakes(rnd, 190, 0.8, 1.7, 22, 40);
    const near = makeFlakes(rnd, 70, 1.8, 3.4, 55, 90);

    return (g, t) => {
      g.drawImage(backdrop, 0, 0, W, H);
      const flick = 0.82 + 0.1 * Math.sin(t * 7.3) + 0.08 * Math.sin(t * 3.1 + 1);
      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, glow, win.x + win.w / 2, win.y + win.h / 2, 150, 0.55 * flick);
      g.translate(win.x + 20, cabin.base + 24); // warm pool of light on the snow
      g.scale(1, 0.32);
      drawGlow(g, glow, 0, 0, 230, 0.55 * flick);
      g.restore();
      drawSmoke(g, cabin.x + 74, cabin.base - cabin.h - 128, t, { rgb: '205,215,235', alpha: 0.3, drift: 46 });
      drawFlakes(g, far, t, '225,235,255', 14);
      drawFlakes(g, near, t, '245,250,255', 22);
    };
  },
};

/* ─────────────────────────── 2. Aurora Frozen Lake ───────────────────────── */

interface Curtain { rgb: string; baseY: number; ampY: number; height: number; k: number; speed: number; phase: number; alpha: number; seed: number }

export const auroraFrozenLake: SceneDef = {
  id: 'aurora-frozen-lake',
  title: 'Aurora Frozen Lake',
  build(env) {
    const rnd = makeRng(202);
    const HORIZON = 560;

    const sky = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, HORIZON, [[0, '#02040d'], [0.6, '#08142e'], [1, '#12304a']]);
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 330; i++) {
        g.fillStyle = `rgba(235,240,255,${between(rnd, 0.2, 0.9)})`;
        const s = between(rnd, 0.5, 1.5);
        g.fillRect(rnd() * W, rnd() * (HORIZON - 40), s, s);
      }
      fillRidge(g, { baseY: 515, amp: 82, seed: 9, freq: 0.0032, oct: 5 }, '#050914');
      fillRidge(g, { baseY: 548, amp: 36, seed: 4, freq: 0.0045 }, '#0a1226');
      g.fillStyle = vGrad(g, HORIZON - 12, HORIZON + 8, [[0, 'rgba(60,160,150,0)'], [1, 'rgba(60,160,150,0.28)']]);
      g.fillRect(0, HORIZON - 12, W, 20);
    });

    const ice = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, HORIZON, H, [[0, '#0e2236'], [1, '#050c18']]);
      g.fillRect(0, HORIZON, W, H - HORIZON);
      for (let i = 0; i < 38; i++) { // hairline cracks
        let x = between(rnd, 0, W);
        let y = between(rnd, HORIZON + 20, H);
        g.strokeStyle = `rgba(180,230,240,${between(rnd, 0.04, 0.12)})`;
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(x, y);
        for (let s = 0; s < 6; s++) {
          x += between(rnd, 20, 70);
          y += between(rnd, -14, 22);
          g.lineTo(x, y);
        }
        g.stroke();
      }
    });

    // Each curtain strip is feathered horizontally so neighbours blend without banding.
    const makeSprite = (rgb: string): HTMLCanvasElement => createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 256, [
        [0, `rgba(${rgb},0)`], [0.45, `rgba(${rgb},0.22)`], [0.82, `rgba(${rgb},0.75)`],
        [0.96, `rgba(${rgb},1)`], [1, `rgba(${rgb},0.1)`],
      ]);
      g.fillRect(0, 0, 32, 256);
      g.globalCompositeOperation = 'destination-in';
      g.fillStyle = hGrad(g, 0, 32, [[0, 'rgba(0,0,0,0)'], [0.5, 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,0)']]);
      g.fillRect(0, 0, 32, 256);
    }, 32, 256);

    const curtains: Array<Curtain & { sprite: HTMLCanvasElement }> = [
      { rgb: '80,255,160', baseY: 392, ampY: 50, height: 300, k: 0.0034, speed: 0.11, phase: 0.4, alpha: 0.95, seed: 1 },
      { rgb: '70,225,225', baseY: 346, ampY: 44, height: 250, k: 0.0042, speed: 0.15, phase: 2.1, alpha: 0.6, seed: 2 },
      { rgb: '175,110,255', baseY: 312, ampY: 40, height: 230, k: 0.0029, speed: 0.09, phase: 4.2, alpha: 0.7, seed: 3 },
    ].map((c) => ({ ...c, sprite: makeSprite(c.rgb) }));

    const twinkle = Array.from({ length: 46 }, () => ({
      x: rnd() * W, y: rnd() * 420, ph: rnd() * TAU, r: between(rnd, 0.8, 1.7),
    }));
    const sparkle = Array.from({ length: 60 }, () => ({
      x: between(rnd, 80, 1180), y: between(rnd, HORIZON + 30, 880), ph: rnd() * TAU,
    }));
    const glowGreen = glowSprite(env, '80,255,170');
    const glowViolet = glowSprite(env, '170,110,255');

    const drawCurtains = (g: CanvasRenderingContext2D, t: number, mul: number, step: number): void => {
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const c of curtains) {
        for (let x = -20; x < W + 20; x += step) {
          const n = fbm(x * c.k + t * c.speed + c.phase, c.seed, 3);
          const m = fbm(x * c.k * 2.3 - t * c.speed * 1.4 + c.phase * 2, c.seed + 3, 2);
          const bottom = c.baseY + n * c.ampY;
          const h = c.height * (0.55 + 0.45 * (0.5 + 0.5 * m));
          const fade = 1 - 0.9 * smooth(RIGHT_CLEAR_X - 140, W, x); // quiet on the right
          g.globalAlpha = mul * c.alpha * (0.55 + 0.45 * Math.sin(x * 0.011 + t * 0.6 + c.phase)) * fade;
          g.drawImage(c.sprite, x - step, bottom - h, step * 2, h);
        }
      }
      g.restore();
    };

    return (g, t) => {
      g.drawImage(sky, 0, 0, W, H);
      for (const s of twinkle) {
        g.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * Math.sin(t * 1.6 + s.ph)})`;
        g.fillRect(s.x, s.y, s.r, s.r);
      }
      drawCurtains(g, t, 1, 8);

      g.drawImage(ice, 0, 0, W, H);
      g.save();
      g.beginPath();
      g.rect(0, HORIZON, W, H - HORIZON);
      g.clip();
      g.globalCompositeOperation = 'lighter';
      g.translate(0, HORIZON); // compressed mirror of the sky on the ice
      g.scale(1, -0.7);
      g.translate(0, -HORIZON);
      drawCurtains(g, t, 0.45, 14);
      g.restore();
      drawReflection(g, sky, env.pixelRatio, HORIZON, t, { depth: 120, amp: 0.8, alpha: 0.16, speed: 0.5 });

      g.save();
      g.globalCompositeOperation = 'lighter';
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.35);
      drawGlow(g, glowGreen, 520, HORIZON + 90, 420, 0.12 + 0.06 * pulse);
      drawGlow(g, glowViolet, 860, HORIZON + 120, 360, 0.1 + 0.05 * (1 - pulse));
      g.restore();
      for (const s of sparkle) { // jewel-like glints on the ice
        const a = Math.max(0, Math.sin(t * 0.9 + s.ph)) ** 6;
        if (a < 0.05) continue;
        g.fillStyle = `rgba(190,255,235,${a * 0.8})`;
        g.fillRect(s.x - 3, s.y, 6, 1);
        g.fillRect(s.x, s.y - 3, 1, 6);
      }
    };
  },
};

/* ─────────────────────────── 3. Light Through the Pines ──────────────────── */

export const pineForestFlurry: SceneDef = {
  id: 'pine-forest-flurry',
  title: 'Light Through the Pines',
  build(env) {
    const rnd = makeRng(303);
    const SUN = { x: 430, y: 372 };
    const glow = glowSprite(env, '255,214,140', 256);

    const backdrop = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 560, [[0, '#6f83bb'], [0.5, '#e4b48e'], [1, '#ffd88e']]);
      g.fillRect(0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      drawGlow(g, glow, SUN.x, SUN.y, 640, 0.9);
      g.restore();
      g.fillStyle = '#fff5cc';
      g.beginPath();
      g.arc(SUN.x, SUN.y, 34, 0, TAU);
      g.fill();

      const hills = [
        { o: { baseY: 436, amp: 52, seed: 2, freq: 0.0028 }, a: '#ffe2b0', b: '#d79aa2' },
        { o: { baseY: 484, amp: 44, seed: 5, freq: 0.0034 }, a: '#f2c59c', b: '#a8758e' },
        { o: { baseY: 526, amp: 34, seed: 8, freq: 0.0041 }, a: '#d7a2a4', b: '#7d6490' },
      ];
      for (const h of hills) fillRidge(g, h.o, vGrad(g, h.o.baseY - 60, h.o.baseY + 140, [[0, h.a], [1, h.b]]));

      // Snowfield, with warm light fading into blue shade.
      g.fillStyle = vGrad(g, 540, 900, [[0, '#f6d7b4'], [0.35, '#c8b4d0'], [1, '#5a6aa8']]);
      g.fillRect(0, 548, W, H - 548);

      const trees: Array<{ x: number; y: number; h: number; body: string; snow: string }> = [];
      const addRow = (n: number, y: number, hMin: number, hMax: number, xMax: number, body: string, snow: string): void => {
        for (let i = 0; i < n; i++) {
          trees.push({ x: between(rnd, -20, xMax), y: y + between(rnd, -8, 10), h: between(rnd, hMin, hMax), body, snow });
        }
      };
      addRow(60, 566, 90, 170, 1440, '#59728a', '#f9e2c6'); // hazy far row (small trees reach the right edge)
      addRow(30, 600, 190, 300, 1190, '#2a4752', '#f6dcb8');
      addRow(9, 664, 360, 470, 1190, '#17302f', '#ffe3b8');
      trees.sort((a, b) => a.y - b.y);

      // Long blue shadows raking away from the sun.
      for (const tr of trees.filter((t) => t.h > 250)) {
        const dx = (tr.x - SUN.x) * 0.55;
        g.fillStyle = 'rgba(56,70,140,0.16)';
        g.beginPath();
        g.moveTo(tr.x - 6, tr.y);
        g.lineTo(tr.x + 6, tr.y);
        g.lineTo(tr.x + dx + 40, tr.y + 260);
        g.lineTo(tr.x + dx - 40, tr.y + 260);
        g.closePath();
        g.fill();
      }
      for (const tr of trees) drawPine(g, tr.x, tr.y, tr.h, { body: tr.body, snow: tr.snow, tiers: tr.h > 250 ? 9 : 6, snowCover: 0.55 });
      for (let i = 0; i < 70; i++) { // snow sparkle on the ground
        g.fillStyle = `rgba(255,244,214,${between(rnd, 0.2, 0.7)})`;
        g.fillRect(rnd() * W, between(rnd, 640, 890), between(rnd, 1, 2.4), 1.5);
      }
    });

    const flakes = makeFlakes(rnd, 170, 1, 2.8, 24, 52);

    return (g, t) => {
      g.drawImage(backdrop, 0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) { // slowly breathing shafts of light
        const ang = lerp(0.2, 1.15, i / 5) + 0.04 * Math.sin(t * 0.2 + i);
        const half = 0.05 + 0.02 * ((i * 7) % 3);
        const len = 1100;
        const gr = g.createLinearGradient(SUN.x, SUN.y, SUN.x + Math.cos(ang) * len, SUN.y + Math.sin(ang) * len);
        gr.addColorStop(0, 'rgba(255,224,150,0.2)');
        gr.addColorStop(1, 'rgba(255,224,150,0)');
        g.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.45 + i * 1.7);
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(SUN.x, SUN.y);
        g.lineTo(SUN.x + Math.cos(ang - half) * len, SUN.y + Math.sin(ang - half) * len);
        g.lineTo(SUN.x + Math.cos(ang + half) * len, SUN.y + Math.sin(ang + half) * len);
        g.closePath();
        g.fill();
      }
      g.restore();
      drawFlakes(g, flakes, t, '255,226,160', 18);
    };
  },
};

/* ─────────────────────────────── 4. Fading Trail ─────────────────────────── */

export const whiteoutPass: SceneDef = {
  id: 'whiteout-pass',
  title: 'Fading Trail',
  build(env) {
    const rnd = makeRng(404);
    const trail = (u: number): { x: number; y: number; w: number } => ({
      x: 560 + 130 * Math.sin(u * 5.2) + 120 * u,
      y: 890 - 400 * u,
      w: 120 * (1 - u) ** 1.4 + 6,
    });

    const backdrop = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, H, [[0, '#d9e1ea'], [0.5, '#f1f5f8'], [1, '#e3eaf1']]);
      g.fillRect(0, 0, W, H);
      const ridges = [
        { o: { baseY: 350, amp: 90, seed: 11, freq: 0.0036, oct: 5 }, c: 'rgba(150,166,190,0.55)' },
        { o: { baseY: 432, amp: 66, seed: 14, freq: 0.0042, oct: 5 }, c: 'rgba(130,148,174,0.55)' },
        { o: { baseY: 508, amp: 52, seed: 17, freq: 0.0049, oct: 4 }, c: 'rgba(110,128,158,0.6)' },
      ];
      for (const r of ridges) {
        fillRidge(g, r.o, r.c);
        g.fillStyle = vGrad(g, r.o.baseY - 70, r.o.baseY + 90, [[0, 'rgba(245,248,251,0.1)'], [1, 'rgba(245,248,251,0.78)']]);
        g.fillRect(0, r.o.baseY - 70, W, 190);
      }
      // Dark crags near the path, half-swallowed by the storm.
      const crag = (cx: number, base: number, w: number, h: number, seed: number, a: number): void => {
        g.fillStyle = `rgba(70,82,104,${a})`;
        g.beginPath();
        g.moveTo(cx - w / 2, base);
        for (let i = 0; i <= 14; i++) {
          const u = i / 14;
          g.lineTo(cx - w / 2 + u * w, base - h * (1 - Math.abs(u - 0.5) * 1.7) * (0.7 + 0.3 * fbm(u * 9, seed)));
        }
        g.lineTo(cx + w / 2, base);
        g.closePath();
        g.fill();
      };
      crag(230, 640, 360, 250, 3, 0.8);
      crag(1010, 610, 300, 190, 5, 0.55);
      crag(1130, 650, 220, 120, 8, 0.4);

      // Windswept slope.
      g.fillStyle = vGrad(g, 480, H, [[0, '#e8eef4'], [1, '#c3cfdd']]);
      g.beginPath();
      g.moveTo(0, H);
      g.lineTo(0, 600);
      g.bezierCurveTo(300, 520, 700, 500, W, 560);
      g.lineTo(W, H);
      g.closePath();
      g.fill();
      for (let i = 0; i < 16; i++) {
        softBlob(g, between(rnd, 0, W), between(rnd, 560, 880), between(rnd, 100, 260), 22, '255,255,255', 0.6);
        softBlob(g, between(rnd, 0, W), between(rnd, 600, 890), between(rnd, 90, 200), 18, '120,138,170', 0.2);
      }

      // The trail: packed snow with a lighter crown, fading with distance.
      for (let u = 0; u <= 1; u += 0.004) {
        const p = trail(u);
        g.strokeStyle = `rgba(146,162,190,${0.85 * (1 - u * 0.85)})`;
        g.lineWidth = p.w;
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(trail(u + 0.004).x, trail(u + 0.004).y);
        g.stroke();
        g.strokeStyle = `rgba(232,239,246,${0.7 * (1 - u * 0.85)})`;
        g.lineWidth = p.w * 0.55;
        g.stroke();
      }
      // Red trail markers receding into the white.
      [0.08, 0.22, 0.36, 0.5, 0.64, 0.78].forEach((u, i) => {
        const p = trail(u);
        const side = i % 2 ? 1 : -1;
        const x = p.x + side * (p.w / 2 + 12);
        const h = 100 * (1 - u) ** 1.2 + 14;
        const a = Math.max(0.12, 1 - u * 1.05);
        g.lineCap = 'round';
        g.strokeStyle = `rgba(62,56,52,${a})`;
        g.lineWidth = 5 * (1 - u) + 1.5;
        g.beginPath();
        g.moveTo(x, p.y);
        g.lineTo(x, p.y - h);
        g.stroke();
        g.strokeStyle = `rgba(214,52,42,${a})`;
        g.lineWidth = 7 * (1 - u) + 2;
        g.beginPath();
        g.moveTo(x, p.y - h * 0.62);
        g.lineTo(x, p.y - h);
        g.stroke();
        softBlob(g, x, p.y + 3, 22 * (1 - u) + 8, 5, '255,255,255', 0.8);
      });
      [0.18, 0.4, 0.6].forEach((u) => softBlob(g, trail(u).x, trail(u).y, 120 * (1 - u) + 20, 10 * (1 - u) + 3, '255,255,255', 0.7));
    });

    const fog = fogSprite(env, '246,249,252');
    const bands = Array.from({ length: 7 }, (_, i) => ({
      y: between(rnd, 250, 760), w: between(rnd, 900, 1500), h: between(rnd, 220, 360),
      v: between(rnd, 28, 70), off: i * 330, a: between(rnd, 0.32, 0.55),
    }));
    const far = makeStreaks(rnd, 160, 24, 60, 520, 800);
    const near = makeStreaks(rnd, 90, 50, 120, 900, 1400);

    return (g, t) => {
      g.drawImage(backdrop, 0, 0, W, H);
      const gust = 0.65 + 0.35 * Math.sin(t * 0.42) * Math.sin(t * 0.17 + 1);
      for (const b of bands) {
        const x = wrap(b.off + t * b.v, W + b.w) - b.w;
        g.globalAlpha = b.a * gust;
        g.drawImage(fog, x, b.y - b.h / 2, b.w, b.h);
      }
      g.globalAlpha = 1;
      drawStreaks(g, far, t, { dx: 1, dy: 0.2, color: `rgba(255,255,255,${0.5 * gust})`, width: 1.3 });
      drawStreaks(g, near, t, { dx: 1, dy: 0.22, color: `rgba(255,255,255,${0.55 * gust})`, width: 2.1 });
    };
  },
};

/* ─────────────────────────────── 5. Blue-Hour Windows ────────────────────── */

interface LitWindow { x: number; y: number; w: number; h: number; ph: number }

export const winterVillage: SceneDef = {
  id: 'winter-village',
  title: 'Blue-Hour Windows',
  build(env) {
    const rnd = makeRng(505);
    const windows: LitWindow[] = [];
    const chimneys: Array<{ x: number; y: number }> = [];

    const house = (g: CanvasRenderingContext2D, x: number, base: number, w: number, h: number, roofH: number, wall: string, lit: number): void => {
      g.fillStyle = vGrad(g, base - h, base, [[0, wall], [1, '#151c44']]);
      g.fillRect(x, base - h, w, h);
      if (rnd() < 0.7) { // chimney behind the roof
        const cx = x + w * between(rnd, 0.58, 0.8);
        g.fillStyle = '#242a5a';
        g.fillRect(cx, base - h - roofH - 8, 16, roofH * 0.7);
        chimneys.push({ x: cx + 8, y: base - h - roofH - 10 });
      }
      g.fillStyle = '#1b2250'; // roof
      g.beginPath();
      g.moveTo(x - 10, base - h + 4);
      g.lineTo(x + w / 2, base - h - roofH);
      g.lineTo(x + w + 10, base - h + 4);
      g.closePath();
      g.fill();
      g.fillStyle = '#b9ccee'; // snow on the roof
      g.beginPath();
      g.moveTo(x - 14, base - h + 6);
      g.lineTo(x + w / 2, base - h - roofH - 7);
      g.lineTo(x + w + 14, base - h + 6);
      g.lineTo(x + w + 14, base - h - 2);
      g.lineTo(x + w / 2, base - h - roofH + 8);
      g.lineTo(x - 14, base - h - 2);
      g.closePath();
      g.fill();
      const cols = Math.max(1, Math.floor(w / 44));
      for (let i = 0; i < cols; i++) {
        const ww = 18;
        const wx = x + (w / cols) * (i + 0.5) - ww / 2;
        const wy = base - h * 0.62;
        const on = i < lit || rnd() < 0.55;
        g.fillStyle = on ? vGrad(g, wy, wy + 26, [[0, '#ffd88a'], [1, '#ff9b4a']]) : '#1f2860';
        g.fillRect(wx, wy, ww, 26);
        g.strokeStyle = '#141a40';
        g.lineWidth = 2;
        g.strokeRect(wx, wy, ww, 26);
        g.beginPath();
        g.moveTo(wx + ww / 2, wy);
        g.lineTo(wx + ww / 2, wy + 26);
        g.stroke();
        if (on) windows.push({ x: wx + ww / 2, y: wy + 13, w: ww, h: 26, ph: rnd() * TAU });
      }
      g.fillStyle = '#2c2216'; // door
      g.fillRect(x + w * 0.5 - 9, base - 38, 18, 38);
    };

    const POLES = [{ x: 64, y: 470 }, { x: 612, y: 430 }, { x: 1150, y: 470 }];
    const bulbs: Array<{ x: number; y: number; rgb: string; ph: number }> = [];

    const backdrop = createLayer(env, (g) => {
      g.fillStyle = vGrad(g, 0, 560, [[0, '#0c1442'], [0.55, '#2b3a86'], [0.9, '#8777b0'], [1, '#e29a94']]);
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) {
        g.fillStyle = `rgba(220,226,255,${between(rnd, 0.15, 0.55)})`;
        g.fillRect(rnd() * W, rnd() * 260, 1.4, 1.4);
      }
      fillRidge(g, { baseY: 462, amp: 50, seed: 6, freq: 0.003 }, vGrad(g, 400, 560, [[0, '#6272aa'], [1, '#2c3a73']]));
      fillRidge(g, { baseY: 520, amp: 30, seed: 12, freq: 0.0045 }, '#23306a');
      for (let x = 0; x < 1440; x += between(rnd, 12, 24)) drawPine(g, x, 560, between(rnd, 36, 84), { body: '#161f52', snow: '#4a5b97' });

      g.fillStyle = vGrad(g, 560, H, [[0, '#6075b0'], [0.4, '#33407f'], [1, '#1b2551']]);
      g.fillRect(0, 580, W, H - 580);
      // Road curving into the village.
      g.fillStyle = vGrad(g, 600, H, [[0, 'rgba(160,176,225,0.25)'], [1, 'rgba(190,205,245,0.5)']]);
      g.beginPath();
      g.moveTo(560, 610);
      g.lineTo(700, 610);
      g.bezierCurveTo(760, 700, 900, 780, 1080, 900);
      g.lineTo(380, 900);
      g.bezierCurveTo(500, 780, 540, 700, 560, 610);
      g.closePath();
      g.fill();

      // Back row (smaller, dimmer), then front row.
      let x = 40;
      while (x < 1150) {
        const w = between(rnd, 90, 130);
        house(g, x, 612, w, between(rnd, 56, 84), between(rnd, 36, 54), pick(rnd, ['#2a3070', '#32306c', '#26386e']), 1);
        x += w + between(rnd, 10, 34);
      }
      house(g, 90, 760, 190, 130, 84, '#3a3478', 2);
      house(g, 320, 730, 150, 112, 70, '#2b3d72', 2);
      house(g, 820, 724, 170, 120, 76, '#392f70', 2);
      house(g, 1010, 752, 150, 108, 66, '#2d3a74', 1);

      // Festival lamp wires.
      g.strokeStyle = '#0d1236';
      g.lineWidth = 3;
      for (const p of POLES) {
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(p.x, 790);
        g.stroke();
      }
      const palette = ['255,214,120', '255,170,90', '255,200,150', '255,140,120'];
      g.lineWidth = 1.6;
      for (let s = 0; s < POLES.length - 1; s++) {
        const a = POLES[s];
        const b = POLES[s + 1];
        const cy = Math.max(a.y, b.y) + 90;
        g.strokeStyle = '#0a0f2e';
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.quadraticCurveTo((a.x + b.x) / 2, cy, b.x, b.y);
        g.stroke();
        for (let i = 1; i < 18; i++) {
          const u = i / 18;
          bulbs.push({
            x: lerp(lerp(a.x, (a.x + b.x) / 2, u), lerp((a.x + b.x) / 2, b.x, u), u),
            y: lerp(lerp(a.y, cy, u), lerp(cy, b.y, u), u) + 5,
            rgb: palette[(i + s) % palette.length], ph: rnd() * TAU,
          });
        }
      }
    });

    const glowWarm = glowSprite(env, '255,190,100');
    const bulbGlow = glowSprite(env, '255,205,130');
    const flakes = makeFlakes(rnd, 150, 1, 2.6, 24, 56);

    return (g, t) => {
      g.drawImage(backdrop, 0, 0, W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const w of windows) {
        drawGlow(g, glowWarm, w.x, w.y, 44 + w.h, 0.35 + 0.08 * Math.sin(t * 2.2 + w.ph));
      }
      for (const b of bulbs) {
        const a = 0.55 + 0.45 * Math.sin(t * 2.4 + b.ph);
        drawGlow(g, bulbGlow, b.x, b.y, 22, 0.45 * a);
      }
      g.restore();
      for (const b of bulbs) {
        g.fillStyle = `rgba(${b.rgb},${0.7 + 0.3 * Math.sin(t * 2.4 + b.ph)})`;
        g.beginPath();
        g.arc(b.x, b.y, 3.1, 0, TAU);
        g.fill();
      }
      chimneys.forEach((c, i) => drawSmoke(g, c.x, c.y, t, { n: 6, rise: 90, maxR: 16, alpha: 0.22, seed: i, drift: 24, speed: 0.1 }));
      drawFlakes(g, flakes, t, '225,232,255', 16);
    };
  },
};
