import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Preload, useGLTF } from '@react-three/drei';
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
import { Environment } from './Environment';
import { GodRays } from './GodRays';
import { MarineSnow } from './MarineSnow';
import { Bubbles } from './Bubbles';
import { Kelp } from './Kelp';

allModelUrls.forEach((url) => useGLTF.preload(url));

const start = cameraPath.getPointAt(0);

export function Experience() {
  // Adaptive resolution: start at device DPR (max 2) and step down on slow GPUs.
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2));

  return (
    <Canvas
      className="webgl"
      flat // no tone mapping, matching the original colors
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 1000, position: [start.x, start.y, start.z] }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
        onIncline={() => setDpr((d) => Math.min(window.devicePixelRatio, 2, d + 0.25))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Environment />
      <CameraRig />
      <Lights />
      <Water />
      <SeaFloor />
      <IntroCard />
      <Kelp />
      <GodRays />
      <MarineSnow />
      <Bubbles />
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
