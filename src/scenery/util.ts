/**
 * Drawing, noise and particle helpers shared by all scenes.
 *
 * Design rules used throughout:
 *  - Static art is baked once into offscreen layers (`createLayer`).
 *  - Animation is stateless: positions are closed-form functions of time
 *    (`wrap`, `hash2`, sines), so there is no per-frame bookkeeping.
 */
import type { Ctx, SceneEnv } from './types';

import { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants';

export const W = LOGICAL_WIDTH;
export const H = LOGICAL_HEIGHT;
/** Scenery right of this x stays quiet: the site's interactive tree lives there. */
export const RIGHT_CLEAR_X = W * 0.82;
export const TAU = Math.PI * 2;

/* ───────────────────────────── canvas creation ───────────────────────────── */

type CanvasFactory = (w: number, h: number) => HTMLCanvasElement;

let canvasFactory: CanvasFactory = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

/** Override canvas creation (used by headless preview/tests). */
export function setCanvasFactory(factory: CanvasFactory): void {
  canvasFactory = factory;
}

/** Bakes `paint` into an offscreen canvas; `paint` draws in logical units. */
export function createLayer(
  env: SceneEnv,
  paint: (g: Ctx) => void,
  w = W,
  h = H,
): HTMLCanvasElement {
  const c = canvasFactory(Math.ceil(w * env.pixelRatio), Math.ceil(h * env.pixelRatio));
  const g = c.getContext('2d') as Ctx;
  g.scale(env.pixelRatio, env.pixelRatio);
  paint(g);
  return c;
}

/* ──────────────────────────────── math & rng ─────────────────────────────── */

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const wrap = (v: number, m: number): number => ((v % m) + m) % m;
export const smooth = (a: number, b: number, v: number): number => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export type Rng = () => number;

/** Deterministic PRNG (mulberry32) so every build looks identical. */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const between = (r: Rng, a: number, b: number): number => a + (b - a) * r();
export const pick = <T>(r: Rng, items: readonly T[]): T => items[Math.floor(r() * items.length)];

/** Stateless integer hash -> [0, 1). Used for per-cycle randomness. */
export function hash2(a: number, b: number): number {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth 1D noise-like signal in [-1, 1] built from detuned sines. */
export function fbm(x: number, seed: number, octaves = 4): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * Math.sin(x * freq + seed * (i + 1) * 12.9898 + i * 1.7);
    norm += amp;
    amp *= 0.5;
    freq *= 2.13;
  }
  return sum / norm;
}

/* ─────────────────────────────── paint helpers ───────────────────────────── */

export type Stops = ReadonlyArray<readonly [number, string]>;

export function vGrad(g: Ctx, y0: number, y1: number, stops: Stops): CanvasGradient {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}

export function hGrad(g: Ctx, x0: number, x1: number, stops: Stops): CanvasGradient {
  const gr = g.createLinearGradient(x0, 0, x1, 0);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}

/** Soft radial blob (fog, haze, glow) drawn directly. `rgb` is "r,g,b". */
export function softBlob(
  g: Ctx, x: number, y: number, rx: number, ry: number, rgb: string, a: number,
): void {
  g.save();
  g.translate(x, y);
  g.scale(1, ry / rx);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  gr.addColorStop(0, `rgba(${rgb},${a})`);
  gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr;
  g.beginPath();
  g.arc(0, 0, rx, 0, TAU);
  g.fill();
  g.restore();
}

/** Reusable radial glow bitmap; draw with `drawGlow` (usually with 'lighter'). */
export function glowSprite(env: SceneEnv, rgb: string, size = 128): HTMLCanvasElement {
  return createLayer(
    env,
    (g) => {
      const r = size / 2;
      const gr = g.createRadialGradient(r, r, 0, r, r, r);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(0.2, `rgba(${rgb},0.55)`);
      gr.addColorStop(0.55, `rgba(${rgb},0.14)`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, size, size);
    },
    size,
    size,
  );
}

export function drawGlow(
  g: Ctx, sprite: HTMLCanvasElement, x: number, y: number, r: number, alpha = 1,
): void {
  g.globalAlpha = alpha;
  g.drawImage(sprite, x - r, y - r, r * 2, r * 2);
  g.globalAlpha = 1;
}

/** Wide, flat fog bitmap for drifting mist layers. */
export function fogSprite(env: SceneEnv, rgb: string): HTMLCanvasElement {
  return createLayer(env, (g) => softBlob(g, 256, 80, 250, 76, rgb, 1), 512, 160);
}

/** Rounded-rectangle path (avoids relying on newer `CanvasRenderingContext2D.roundRect`). */
export function roundedRectPath(g: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ──────────────────────────────── landforms ──────────────────────────────── */

export interface RidgeOpts {
  baseY: number;
  amp: number;
  seed: number;
  freq?: number;
  oct?: number;
  step?: number;
}

export function ridgeY(o: RidgeOpts, x: number): number {
  return o.baseY + o.amp * fbm(x * (o.freq ?? 0.0045), o.seed, o.oct ?? 4);
}

/** Closed path of a ridge line filled down to the bottom of the canvas. */
export function ridgePath(g: Ctx, o: RidgeOpts): void {
  g.beginPath();
  g.moveTo(-10, H + 10);
  for (let x = -10; x <= W + 10; x += o.step ?? 6) g.lineTo(x, ridgeY(o, x));
  g.lineTo(W + 10, H + 10);
  g.closePath();
}

export function fillRidge(g: Ctx, o: RidgeOpts, fill: string | CanvasGradient): void {
  ridgePath(g, o);
  g.fillStyle = fill;
  g.fill();
}

export interface PineOpts {
  body: string;
  snow?: string;
  trunk?: string;
  tiers?: number;
  /** Total width as a fraction of height. */
  width?: number;
  /** 0..1 share of each tier covered by snow (default 1). */
  snowCover?: number;
}

/** Layered conifer; `snow` adds snow-laden tiers, shading adds volume. */
export function drawPine(g: Ctx, x: number, baseY: number, h: number, o: PineOpts): void {
  const tiers = o.tiers ?? 7;
  const w = h * (o.width ?? 0.42);
  g.fillStyle = o.trunk ?? '#2a1d16';
  g.fillRect(x - w * 0.035, baseY - h * 0.1, w * 0.07, h * 0.1);
  for (let i = 0; i < tiers; i++) {
    const k = i / (tiers - 1);
    const apex = baseY - h * 0.94 + k * h * 0.6;
    const bot = apex + h * 0.3 + k * h * 0.05;
    const tw = w * (0.3 + 0.7 * k);
    const dy = bot - apex;
    g.fillStyle = o.body;
    g.beginPath();
    g.moveTo(x, apex);
    g.lineTo(x + tw / 2, bot);
    g.quadraticCurveTo(x, bot - h * 0.04, x - tw / 2, bot);
    g.closePath();
    g.fill();
    g.fillStyle = 'rgba(0,0,0,0.2)'; // shaded flank
    g.beginPath();
    g.moveTo(x, apex);
    g.lineTo(x + tw / 2, bot);
    g.lineTo(x, bot - h * 0.03);
    g.closePath();
    g.fill();
    if (o.snow) {
      g.fillStyle = o.snow;
      g.beginPath();
      const k = o.snowCover ?? 1;
      g.moveTo(x, apex);
      g.lineTo(x + tw * 0.35 * k, apex + dy * 0.7 * k);
      g.lineTo(x + tw * 0.17 * k, apex + dy * 0.6 * k);
      g.lineTo(x + tw * 0.07 * k, apex + dy * 0.78 * k);
      g.lineTo(x - tw * 0.1 * k, apex + dy * 0.62 * k);
      g.lineTo(x - tw * 0.22 * k, apex + dy * 0.74 * k);
      g.lineTo(x - tw * 0.35 * k, apex + dy * 0.7 * k);
      g.closePath();
      g.fill();
    }
  }
}

/* ──────────────────────────── stateless particles ────────────────────────── */

export interface Flake { x: number; y: number; r: number; v: number; ph: number; a: number }

export function makeFlakes(
  r: Rng, n: number, rMin: number, rMax: number, vMin: number, vMax: number,
): Flake[] {
  return Array.from({ length: n }, () => ({
    x: r() * W, y: r() * H, r: between(r, rMin, rMax), v: between(r, vMin, vMax),
    ph: r() * TAU, a: between(r, 0.4, 0.95),
  }));
}

/** Falling, swaying, wrapping snow (or petals, dust...). `rgb` is "r,g,b". */
export function drawFlakes(g: Ctx, flakes: Flake[], t: number, rgb = '255,255,255', wind = 24): void {
  for (const f of flakes) {
    const x = wrap(f.x + t * wind * (f.v / 60) + Math.sin(t * 0.8 + f.ph) * 16, W + 40) - 20;
    const y = wrap(f.y + t * f.v, H + 40) - 20;
    g.fillStyle = `rgba(${rgb},${f.a})`;
    g.beginPath();
    g.arc(x, y, f.r, 0, TAU);
    g.fill();
  }
}

export interface Streak { x: number; y: number; len: number; v: number }

export function makeStreaks(
  r: Rng, n: number, lenMin: number, lenMax: number, vMin: number, vMax: number,
): Streak[] {
  return Array.from({ length: n }, () => ({
    x: r() * (W + 240), y: r() * (H + 240), len: between(r, lenMin, lenMax), v: between(r, vMin, vMax),
  }));
}

/** Rain / blown snow: one batched stroke moving along direction (dx, dy). */
export function drawStreaks(
  g: Ctx, streaks: Streak[], t: number,
  o: { dx: number; dy: number; color: string; width: number },
): void {
  const n = Math.hypot(o.dx, o.dy);
  const ux = o.dx / n;
  const uy = o.dy / n;
  g.strokeStyle = o.color;
  g.lineWidth = o.width;
  g.lineCap = 'round';
  g.beginPath();
  for (const s of streaks) {
    const x = wrap(s.x + t * s.v * ux, W + 240) - 120;
    const y = wrap(s.y + t * s.v * uy, H + 240) - 120;
    g.moveTo(x, y);
    g.lineTo(x - ux * s.len, y - uy * s.len);
  }
  g.stroke();
}

export interface RippleField {
  x0: number; x1: number; y0: number; y1: number;
  count: number; period: [number, number]; maxR: number; squash: number; seed: number;
}

/** Expanding ellipse rings at hashed positions; each cycle picks a new spot. */
export function drawRipples(g: Ctx, f: RippleField, t: number, rgb: string, strength = 0.5): void {
  for (let i = 0; i < f.count; i++) {
    const id = i + f.seed * 131;
    const period = lerp(f.period[0], f.period[1], hash2(id, 7));
    const tt = t + hash2(id, 3) * period;
    const cycle = Math.floor(tt / period);
    const p = tt / period - cycle;
    const x = lerp(f.x0, f.x1, hash2(id, cycle * 2 + 11));
    const y = lerp(f.y0, f.y1, hash2(id, cycle * 2 + 12));
    const depth = (y - f.y0) / (f.y1 - f.y0 || 1);
    const r = f.maxR * (0.35 + 0.65 * depth) * p;
    g.strokeStyle = `rgba(${rgb},${strength * (1 - p) * (1 - p)})`;
    g.lineWidth = 1 + depth * 1.3;
    g.beginPath();
    g.ellipse(x, y, Math.max(r, 0.1), Math.max(r * f.squash, 0.05), 0, 0, TAU);
    g.stroke();
  }
}

export interface SmokeOpts {
  n?: number; rise?: number; speed?: number; drift?: number;
  maxR?: number; rgb?: string; alpha?: number; seed?: number;
}

/** Rising, widening, fading smoke puffs from (x, y). */
export function drawSmoke(g: Ctx, x: number, y: number, t: number, o: SmokeOpts = {}): void {
  const n = o.n ?? 9;
  for (let i = 0; i < n; i++) {
    const p = wrap(t * (o.speed ?? 0.12) + i / n, 1);
    const px = x + Math.sin(p * 5 + i * 2.1 + (o.seed ?? 0)) * 10 * p + (o.drift ?? 30) * p * p;
    const py = y - p * (o.rise ?? 140);
    const r = 5 + p * (o.maxR ?? 26);
    g.fillStyle = `rgba(${o.rgb ?? '200,205,220'},${(o.alpha ?? 0.32) * (1 - p) * Math.min(1, p * 8)})`;
    g.beginPath();
    g.arc(px, py, r, 0, TAU);
    g.fill();
  }
}

/* ───────────────────────────────── water ─────────────────────────────────── */

export interface ReflectOpts {
  /** Reflection depth in logical px below the horizon. */
  depth: number;
  /** Horizontal wobble in px. */
  amp: number;
  alpha: number;
  speed?: number;
  slice?: number;
}

/**
 * Animated water reflection: mirrors `src` (a pre-rendered layer) about
 * `horizonY` in thin rows, each nudged sideways by a travelling sine.
 */
export function drawReflection(
  g: Ctx, src: HTMLCanvasElement, pixelRatio: number, horizonY: number, t: number, o: ReflectOpts,
): void {
  const slice = o.slice ?? 3;
  g.save();
  g.globalAlpha = o.alpha;
  for (let y = 0; y < o.depth; y += slice) {
    const srcY = horizonY - y - slice;
    if (srcY < 0) break;
    const dx = Math.sin(y * 0.09 + t * (o.speed ?? 1.2)) * o.amp * (0.3 + y / o.depth);
    g.drawImage(src, 0, srcY * pixelRatio, W * pixelRatio, slice * pixelRatio,
      dx - 12, horizonY + y, W + 24, slice);
  }
  g.restore();
}
