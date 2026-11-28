/** Scene registry: one entry per background, in display order. */
import type { SceneDef, SceneId } from './types';
import { auroraFrozenLake, pineForestFlurry, snowboundCabin, whiteoutPass, winterVillage } from './scenes/winter';
import { cherryBlossomRain, monsoonLighthouse, rainlitGreenhouse } from './scenes/rain';
import { amberOrchard, lanternBridge, mistyLakeDawn, summerMeadow } from './scenes/light';

export type { SceneDef, SceneEnv, SceneId, SceneRenderer } from './types';
export { LOGICAL_HEIGHT, LOGICAL_WIDTH } from './constants';

export const SCENES: readonly SceneDef[] = [
  snowboundCabin,
  auroraFrozenLake,
  pineForestFlurry,
  whiteoutPass,
  winterVillage,
  cherryBlossomRain,
  rainlitGreenhouse,
  mistyLakeDawn,
  amberOrchard,
  lanternBridge,
  summerMeadow,
  monsoonLighthouse,
];

const byId = new Map<SceneId, SceneDef>(SCENES.map((s) => [s.id, s]));

export function getScene(id: SceneId): SceneDef {
  const scene = byId.get(id);
  if (!scene) throw new Error(`Unknown scene: ${id}`);
  return scene;
}
