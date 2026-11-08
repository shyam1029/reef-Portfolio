import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer, Group, Object3D, Vector3 } from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { fish, floor } from './config';
import { createRandom } from '../lib/random';

type Swimmer = { object: Object3D; mixer: AnimationMixer | null; speed: number; direction: Vector3 };

const BOUNDS = floor.size / 2;
const step = new Vector3();

/** A school of fish: each model is loaded once, then cloned with its own animation mixer. */
export function Fish() {
  const gltfs = useGLTF(fish.models.map((m) => m.url));

  const { group, swimmers } = useMemo(() => {
    const rand = createRandom('fish');
    const group = new Group();
    const swimmers: Swimmer[] = [];
    const spread = floor.size * 0.8;

    gltfs.forEach(({ scene, animations }, modelIndex) => {
      const clip = animations.find((c) => c.name.toLowerCase().includes('swim')) ?? animations[0];
      for (let i = 0; i < fish.instancesPerModel; i++) {
        const object = cloneSkinned(scene);
        object.position.set((rand() - 0.5) * spread, rand() * 15 - 20, (rand() - 0.5) * spread);
        object.scale.setScalar(fish.models[modelIndex].scale);
        const mixer = clip ? new AnimationMixer(object) : null;
        mixer?.clipAction(clip).startAt(-rand() * clip.duration).play();
        group.add(object);
        swimmers.push({
          object,
          mixer,
          // Units per second (the original moved 0.1 * speed per frame at ~60 fps).
          speed: (rand() * 0.5 + 0.2) * 6,
          direction: new Vector3(rand() - 0.5, 0, rand() - 0.5).normalize(),
        });
      }
    });
    return { group, swimmers };
  }, [gltfs]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1); // avoid big jumps after a background tab
    for (const s of swimmers) {
      s.object.position.add(step.copy(s.direction).multiplyScalar(s.speed * dt));
      // Reflect off the edges only when heading outward, so fish never get stuck jittering.
      const { x, z } = s.object.position;
      if (Math.abs(x) > BOUNDS && Math.sign(x) === Math.sign(s.direction.x)) s.direction.x *= -1;
      if (Math.abs(z) > BOUNDS && Math.sign(z) === Math.sign(s.direction.z)) s.direction.z *= -1;
      s.object.rotation.y = Math.atan2(s.direction.x, s.direction.z);
      s.mixer?.update(dt);
    }
  });

  return <primitive object={group} />;
}
