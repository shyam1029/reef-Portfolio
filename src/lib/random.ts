import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { WORLD_SEED, floor } from '../scene/config';

/** Seeded PRNG so the reef layout is identical on every visit. */
export const createRandom = (salt: string) => alea(`${WORLD_SEED}:${salt}`);

const terrainNoise = createNoise2D(createRandom('terrain'));

/** Local height of the sea floor plane at (x, y) in plane space (before rotation). */
export const terrainOffset = (x: number, y: number) =>
  terrainNoise(x * 0.05, y * 0.05) * floor.elevation;

/**
 * World-space Y of the sea floor surface at world (x, z).
 * The floor plane is rotated -90° about X, so plane-space y maps to world -z.
 */
export const floorHeightAt = (x: number, z: number) => floor.depth + terrainOffset(x, -z);
