import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, NormalBlending, ShaderMaterial } from 'three';
import { sculptures } from './config';
import { bubblesShader } from './shaders';
import { underwaterUniforms } from './underwater';
import { createRandom, floorHeightAt } from '../lib/random';

const PER_STREAM = 45;
// Emitters: the treasure chest plus a few vents near the dive path.
const EMITTERS: [number, number][] = [
  [sculptures.treasure.position.x + 1, sculptures.treasure.position.z],
  [74, 52],
  [92, 78],
  [48, 64],
  [66, 30],
];

export function Bubbles() {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rand = createRandom('bubbles');
    const positions: number[] = [];
    const seeds: number[] = [];
    for (const [x, z] of EMITTERS) {
      const y = floorHeightAt(x, z) + 0.5;
      for (let i = 0; i < PER_STREAM; i++) {
        positions.push(x, y, z);
        seeds.push(rand());
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    geo.setAttribute('aSeed', new BufferAttribute(new Float32Array(seeds), 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...bubblesShader,
        uniforms: {
          uTime: underwaterUniforms.uTime,
          uUnderwater: underwaterUniforms.uUnderwater,
          uPixelRatio: { value: 1 },
        },
        blending: NormalBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  material.uniforms.uPixelRatio.value = dpr;

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}
