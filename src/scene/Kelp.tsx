import { useLayoutEffect, useMemo, useRef } from 'react';
import { DoubleSide, InstancedMesh, Object3D, PlaneGeometry, ShaderMaterial, UniformsLib, Vector2 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { cameraPath, pathClearance } from './config';
import { kelpShader } from './shaders';
import { underwaterUniforms } from './underwater';
import { createRandom, floorHeightAt } from '../lib/random';

const CLUMPS = 170;
const AREA_RADIUS = 140;
const pathSamples = cameraPath.getSpacedPoints(64).map((p) => new Vector2(p.x, p.z));
const center = pathSamples[0];

/** A blade made of two crossed planes, rooted at y = 0 and 1 unit tall. */
function bladeGeometry() {
  const a = new PlaneGeometry(1, 1, 1, 14).translate(0, 0.5, 0);
  const b = a.clone().rotateY(Math.PI / 2);
  return mergeGeometries([a, b]);
}

/** Swaying kelp clumps scattered around the dive path, all drawn in one instanced call. */
export function Kelp() {
  const mesh = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => bladeGeometry(), []);

  const transforms = useMemo(() => {
    const rand = createRandom('kelp');
    const dummy = new Object3D();
    const list: Object3D['matrix'][] = [];
    const p = new Vector2();
    for (let c = 0; c < CLUMPS; c++) {
      const angle = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * AREA_RADIUS;
      p.set(center.x + Math.cos(angle) * r, center.y + Math.sin(angle) * r);
      if (pathSamples.some((q) => q.distanceTo(p) < pathClearance * 0.6)) continue;
      const blades = 3 + Math.floor(rand() * 5);
      for (let b = 0; b < blades; b++) {
        const x = p.x + (rand() - 0.5) * 3;
        const z = p.y + (rand() - 0.5) * 3;
        dummy.position.set(x, floorHeightAt(x, z) - 0.3, z);
        dummy.rotation.set(0, rand() * Math.PI, 0);
        dummy.scale.set(0.5 + rand() * 0.7, 7 + rand() * 15, 0.5 + rand() * 0.7);
        dummy.updateMatrix();
        list.push(dummy.matrix.clone());
      }
    }
    return list;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...kelpShader,
        uniforms: {
          ...UniformsLib.fog,
          uTime: underwaterUniforms.uTime,
          uSunDir: underwaterUniforms.uSunDir,
        },
        side: DoubleSide,
        fog: true,
      }),
    [],
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    transforms.forEach((matrix, i) => m.setMatrixAt(i, matrix));
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [transforms]);

  return <instancedMesh ref={mesh} args={[geometry, material, transforms.length]} frustumCulled={false} />;
}
