import { useMemo } from 'react';
import { AdditiveBlending, DoubleSide, ShaderMaterial } from 'three';
import { floor } from './config';
import { godraysShader } from './shaders';
import { underwaterUniforms } from './underwater';

// Concentric open cones hanging from the surface around the camera's dive path.
const SHAFTS = [
  { radiusTop: 22, radiusBottom: 40, seed: 1.3, intensity: 0.22 },
  { radiusTop: 38, radiusBottom: 62, seed: 7.9, intensity: 0.18 },
  { radiusTop: 60, radiusBottom: 92, seed: 4.2, intensity: 0.14 },
];
const CENTER = [66, 0, 58] as const;
const HEIGHT = -floor.depth + 2;

function Shaft({ radiusTop, radiusBottom, seed, intensity }: (typeof SHAFTS)[number]) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...godraysShader,
        uniforms: {
          uTime: underwaterUniforms.uTime,
          uUnderwater: underwaterUniforms.uUnderwater,
          uSeed: { value: seed },
          uIntensity: { value: intensity },
        },
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [seed, intensity],
  );

  return (
    <mesh material={material} position={[CENTER[0], -HEIGHT / 2 - 0.5, CENTER[2]]} renderOrder={2}>
      <cylinderGeometry args={[radiusTop, radiusBottom, HEIGHT, 96, 1, true]} />
    </mesh>
  );
}

export function GodRays() {
  return (
    <>
      {SHAFTS.map((s) => (
        <Shaft key={s.seed} {...s} />
      ))}
    </>
  );
}
