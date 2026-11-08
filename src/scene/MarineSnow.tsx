import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from 'three';
import { particlesShader } from './shaders';
import { underwaterUniforms } from './underwater';
import { createRandom } from '../lib/random';

const COUNT = 3500;
const BOX = 70;

/** Drifting organic particles that give the water volume and a sense of motion. */
export function MarineSnow() {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rand = createRandom('snow');
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions.set([rand() * BOX, rand() * BOX, rand() * BOX], i * 3);
      sizes[i] = 0.4 + rand() * rand() * 1.6;
      seeds[i] = rand();
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new BufferAttribute(sizes, 1));
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...particlesShader,
        uniforms: {
          uTime: underwaterUniforms.uTime,
          uUnderwater: underwaterUniforms.uUnderwater,
          uBox: { value: BOX },
          uPixelRatio: { value: 1 },
        },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  material.uniforms.uPixelRatio.value = dpr;

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}
