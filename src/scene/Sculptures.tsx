import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import { sculptures, sunPosition } from './config';

export function Crown() {
  const { scene } = useGLTF(sculptures.crown.url);
  const crown = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((o) => {
      if (o instanceof Mesh && !(o.material instanceof MeshStandardMaterial)) {
        o.material = new MeshStandardMaterial({ color: o.material.color ?? 0xffffff, metalness: 0.8, roughness: 0.2 });
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={crown} position={sunPosition} rotation-y={-Math.PI / 2} scale={sculptures.crown.scale} />;
}

export function TreasureChest() {
  const { scene } = useGLTF(sculptures.treasure.url);
  const { position, scale } = sculptures.treasure;
  return <primitive object={scene} position={position} rotation-y={Math.PI / 4} scale={scale} />;
}
