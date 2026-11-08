import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { cameraPath } from './config';
import { useScrollStore } from '../lib/scrollStore';

const point = new Vector3();
const target = new Vector3();

/** Moves the camera along `cameraPath` according to page scroll progress. */
export function CameraRig() {
  useFrame(({ camera }) => {
    const t = useScrollStore.getState().progress;
    cameraPath.getPointAt(t, point);
    cameraPath.getTangentAt(t, target);
    camera.position.copy(point);
    camera.lookAt(target.add(point));
  });
  return null;
}
