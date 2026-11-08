import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, ShaderMaterial, UniformsLib } from 'three';
import { floor, water } from './config';
import { underwaterUniforms } from './underwater';
import { waterShader } from './shaders';

export function Water() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...waterShader,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: water.amplitude },
          uNoiseScale: { value: water.noiseScale },
          uSunDir: underwaterUniforms.uSunDir,
          uDepth: underwaterUniforms.uDepth,
          ...UniformsLib.fog,
        },
        side: DoubleSide,
        transparent: true,
        fog: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime * water.speed;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} material={material}>
      <planeGeometry args={[floor.size, floor.size, water.segments, water.segments]} />
    </mesh>
  );
}
