import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, useGLTF } from '@react-three/drei';
import { Effects } from './Effects';
import { allModelUrls, cameraPath } from './config';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { Water } from './Water';
import { SeaFloor } from './SeaFloor';
import { IntroCard } from './IntroCard';
import { Corals } from './Corals';
import { Fish } from './Fish';
import { Crown, TreasureChest } from './Sculptures';

allModelUrls.forEach((url) => useGLTF.preload(url));

const start = cameraPath.getPointAt(0);

export function Experience() {
  return (
    <Canvas
      className="webgl"
      flat // no tone mapping, matching the original colors
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 1000, position: [start.x, start.y, start.z] }}
    >
      <color attach="background" args={['#87ceeb']} />
      <CameraRig />
      <Lights />
      <Water />
      <SeaFloor />
      <IntroCard />
      <Suspense fallback={null}>
        <Corals />
        <Fish />
        <Crown />
        <TreasureChest />
        <Preload all />
      </Suspense>
      <Effects />
    </Canvas>
  );
}
