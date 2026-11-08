import { useMemo } from 'react';
import { PlaneGeometry, ShaderMaterial, UniformsLib } from 'three';
import { floor } from './config';
import { underwaterUniforms } from './underwater';
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
          ...UniformsLib.fog,
          uTime: underwaterUniforms.uTime,
          uSunDir: underwaterUniforms.uSunDir,
          uElevation: { value: floor.elevation },
        },
        fog: true,
      }),
    [],
  );

  return <mesh geometry={geometry} material={material} rotation-x={-Math.PI / 2} position-y={floor.depth} />;
}
