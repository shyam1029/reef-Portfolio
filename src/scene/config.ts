import { CatmullRomCurve3, Vector3 } from 'three';

export const WORLD_SEED = 'reef-portfolio';

export const floor = { depth: -25, elevation: 3, size: 500, segments: 128 };
export const water = { amplitude: 0.75, speed: 1.2, noiseScale: 0.15, segments: 128 };
export const sunPosition = new Vector3(70, 50, 70);

/** Camera travels along this spline as the page scrolls from top (t=0) to bottom (t=1). */
export const cameraPath = new CatmullRomCurve3([
  new Vector3(85, -16, 70), // start, on the sea floor
  new Vector3(58, -20, 46), // treasure chest
  new Vector3(70, 50, 70), // rise past the crown, through the surface
  new Vector3(70, 120, 71), // intro card in the sky
]);

/** Corals keep this distance from the camera path so the camera never clips through them. */
export const pathClearance = 12;

export const corals = {
  instancesPerModel: 20,
  minSpacing: 10,
  models: [
    { url: 'models/corals/crescent_moon_coral.glb', scale: 20 },
    { url: 'models/corals/coral_piece.glb', scale: 1.6 },
    { url: 'models/corals/coral_reef_3_l.glb', scale: 6.8 },
    { url: 'models/corals/coral_tree.glb', scale: 0.7 },
    { url: 'models/corals/coral_azul.glb', scale: 1.6 },
    { url: 'models/corals/coral_flower.glb', scale: 1.8 },
    { url: 'models/corals/coral_l.glb', scale: 5.7 },
    { url: 'models/corals/coral-coral_roof.glb', scale: 0.1 },
    { url: 'models/corals/corals.glb', scale: 2.7 },
  ],
};

export const fish = {
  instancesPerModel: 20,
  models: [
    { url: 'models/fish/fish_1.glb', scale: 10 },
    { url: 'models/fish/fish_2.glb', scale: 5 },
  ],
};

export const sculptures = {
  crown: { url: 'models/sculptures/crown.glb', scale: 2 },
  treasure: { url: 'models/sculptures/treasure.glb', scale: 0.04, position: new Vector3(52, -20, 46) },
};

export const allModelUrls = [
  ...corals.models.map((m) => m.url),
  ...fish.models.map((m) => m.url),
  sculptures.crown.url,
  sculptures.treasure.url,
];
