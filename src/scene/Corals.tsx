import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, Vector2 } from 'three';
import { cameraPath, corals, floor, pathClearance } from './config';
import { createRandom, floorHeightAt } from '../lib/random';

const MAX_ATTEMPTS = 100;

/** Camera path projected onto the floor plane, used to keep corals out of the camera's way. */
const pathSamples = cameraPath.getSpacedPoints(64).map((p) => new Vector2(p.x, p.z));

/** Scatters every coral model across the floor with a seeded, non-overlapping layout. */
export function Corals() {
  const gltfs = useGLTF(corals.models.map((m) => m.url));

  const group = useMemo(() => {
    const rand = createRandom('corals');
    const root = new Group();
    const placed: Vector2[] = [];
    const spread = floor.size * 0.8;

    gltfs.forEach(({ scene }, modelIndex) => {
      const { scale } = corals.models[modelIndex];
      for (let i = 0; i < corals.instancesPerModel; i++) {
        const p = new Vector2();
        let ok = false;
        for (let attempt = 0; attempt < MAX_ATTEMPTS && !ok; attempt++) {
          p.set((rand() - 0.5) * spread, (rand() - 0.5) * spread);
          ok =
            placed.every((q) => q.distanceTo(p) >= corals.minSpacing) &&
            pathSamples.every((q) => q.distanceTo(p) >= pathClearance);
        }
        if (!ok) continue;

        const instance = scene.clone();
        instance.position.set(p.x, floorHeightAt(p.x, p.y), p.y);
        instance.rotation.y = rand() * Math.PI * 2;
        instance.scale.setScalar(scale);
        // Static: compute matrices once instead of every frame.
        instance.updateMatrixWorld(true);
        instance.traverse((o) => (o.matrixAutoUpdate = false));
        root.add(instance);
        placed.push(p);
      }
    });
    return root;
  }, [gltfs]);

  return <primitive object={group} />;
}
