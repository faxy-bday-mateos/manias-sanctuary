/**
 * Shared types for the Butterfly Garden procedural scenes.
 *
 * Every scene is authored in a fixed LOGICAL space of 1440 x 900 (16:10).
 * `SceneCanvas` scales that space to the real canvas with "cover" fit, so
 * scene code never needs to know the display size.
 */

export type Ctx = CanvasRenderingContext2D;

export type SceneId =
  | 'snowbound-cabin'
  | 'aurora-frozen-lake'
  | 'pine-forest-flurry'
  | 'whiteout-pass'
  | 'winter-village'
  | 'cherry-blossom-rain'
  | 'rainlit-greenhouse'
  | 'misty-lake-dawn'
  | 'amber-orchard'
  | 'lantern-bridge'
  | 'summer-meadow'
  | 'monsoon-lighthouse';

/** Build-time environment handed to a scene. */
export interface SceneEnv {
  /**
   * Device pixels per logical pixel. Static layers are pre-rendered at this
   * density so they stay crisp without redrawing every frame.
   */
  pixelRatio: number;
}

/**
 * Draws one frame. The context is already transformed into logical space.
 * `t` is elapsed seconds. Renderers are pure functions of `t`: they keep no
 * mutable state, so any frame can be drawn at any time (pause, seek, tests).
 */
export type SceneRenderer = (g: Ctx, t: number) => void;

export interface SceneDef {
  id: SceneId;
  title: string;
  /** Pre-renders static layers once and returns the per-frame renderer. */
  build(env: SceneEnv): SceneRenderer;
}
