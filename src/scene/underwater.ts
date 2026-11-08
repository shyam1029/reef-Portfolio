import { Vector3 } from 'three';
import { sunPosition } from './config';

/**
 * Uniform objects shared by every underwater material. `Environment` updates them once per frame;
 * materials reference the same objects, so there is no per-material bookkeeping.
 */
export const underwaterUniforms = {
  uTime: { value: 0 },
  /** 1 when the camera is below the surface, 0 above, blended across the waterline. */
  uUnderwater: { value: 1 },
  /** 0 at the surface, 1 at 40 units deep. Darkens the water as you descend. */
  uDepth: { value: 0 },
  uSunDir: { value: sunPosition.clone().normalize() as Vector3 },
};

export const fogDensity = { underwater: 0.016, above: 0.0012 };

// Colors used by both the background shader and the fog, authored in sRGB.
export const waterHorizon = [0.03, 0.3, 0.4] as const;
export const skyHorizon = [0.75, 0.88, 0.95] as const;
