import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PlaneGeometry, ShaderMaterial } from 'three';
import { floor, sunPosition } from './config';
import { floorShader } from './shaders';
import { terrainOffset } from '../lib/random';

export function SeaFloor() {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(floor.size, floor.size, floor.segments, floor.segments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, terrainOffset(pos.getX(i), pos.getY(i)));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...floorShader,
        uniforms: {
          uTime: { value: 0 },
          uSunPosition: { value: sunPosition },
          uElevation: { value: floor.elevation },
        },
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  return <mesh geometry={geometry} material={material} rotation-x={-Math.PI / 2} position-y={floor.depth} />;
}
