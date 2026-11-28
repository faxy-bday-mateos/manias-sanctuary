import { useEffect, useRef } from 'react';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, getScene } from './index';
import type { SceneId, SceneRenderer } from './types';

export interface SceneCanvasProps {
  sceneId: SceneId;
  /** Freeze animation (a still frame is drawn instead). */
  paused?: boolean;
  className?: string;
  /** Cap on layer sharpness; 2 is plenty for retina screens. */
  maxPixelRatio?: number;
  onError?: (error: unknown) => void;
}

/**
 * Renders an animated scene full-bleed inside its parent.
 *
 * - "Cover" fit: the 1440x900 scene scales to fill the box and is centred,
 *   so only the outer edges are ever cropped (key content sits in the
 *   central 80% by design).
 * - Honors `prefers-reduced-motion` by drawing a single still frame.
 */
export function SceneCanvas({ sceneId, paused = false, className, maxPixelRatio = 2, onError }: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let ctx: CanvasRenderingContext2D | null;
    try {
      ctx = canvas.getContext('2d');
    } catch (error) {
      onError?.(error);
      return undefined;
    }
    if (!ctx) {
      onError?.(new Error('Canvas rendering is not available in this browser.'));
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STILL_FRAME_TIME = 6; // seconds; a pleasant mid-animation pose
    let renderer: SceneRenderer | null = null;
    let builtRatio = 0;
    let raf = 0;
    let start = performance.now();
    let pausedAt: number | null = null;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let observer: ResizeObserver | null = null;
    let failed = false;

    const reportError = (error: unknown): void => {
      if (failed) return;
      failed = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      onError?.(error);
    };

    const coverScale = (): number => Math.max(cssW / LOGICAL_WIDTH, cssH / LOGICAL_HEIGHT);

    const rebuildIfNeeded = (): void => {
      // Static layers are baked at the on-screen pixel density; only rebuild on meaningful change.
      const wanted = Math.min(maxPixelRatio, Math.max(0.5, dpr * coverScale()));
      if (renderer && Math.abs(wanted - builtRatio) / builtRatio < 0.15) return;
      renderer = getScene(sceneId).build({ pixelRatio: wanted });
      builtRatio = wanted;
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      rebuildIfNeeded();
    };

    const draw = (t: number): void => {
      if (!renderer) return;
      const s = coverScale() * dpr;
      const ox = (canvas.width - LOGICAL_WIDTH * s) / 2;
      const oy = (canvas.height - LOGICAL_HEIGHT * s) / 2;
      ctx.setTransform(s, 0, 0, s, ox, oy);
      renderer(ctx, t);
    };

    const frame = (now: number): void => {
      try {
        draw((now - start) / 1000);
      } catch (error) {
        reportError(error);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    try {
      resize();
      observer = new ResizeObserver(() => {
        try {
          resize();
          if (reducedMotion || paused) draw(pausedAt ?? STILL_FRAME_TIME);
        } catch (error) {
          reportError(error);
        }
      });
      observer.observe(canvas);

      if (reducedMotion || paused) {
        pausedAt = paused ? (performance.now() - start) / 1000 : STILL_FRAME_TIME;
        draw(pausedAt);
      } else {
        start = performance.now();
        raf = requestAnimationFrame(frame);
      }
    } catch (error) {
      reportError(error);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [sceneId, paused, maxPixelRatio, onError]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
