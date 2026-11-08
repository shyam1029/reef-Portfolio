import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Color, FogExp2, MathUtils, Mesh, SRGBColorSpace, ShaderMaterial } from 'three';
import { backgroundShader } from './shaders';
import { fogDensity, skyHorizon, underwaterUniforms, waterHorizon } from './underwater';

const fogWater = new Color();
const fogSky = new Color().setRGB(...skyHorizon, SRGBColorSpace);

/**
 * Background, fog and the shared underwater uniforms. Everything that changes when the camera
 * crosses the waterline is driven from here, once per frame.
 */
export function Environment() {
  const sphere = useRef<Mesh>(null);

  const fogRef = useRef<FogExp2>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...backgroundShader,
        uniforms: {
          uUnderwater: underwaterUniforms.uUnderwater,
          uDepth: underwaterUniforms.uDepth,
          uSunDir: underwaterUniforms.uSunDir,
        },
        side: BackSide,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  // Priority -1: update uniforms before anything else reads them this frame.
  useFrame(({ camera, clock }) => {
    const y = camera.position.y;
    const underwater = 1 - MathUtils.smoothstep(y, -0.8, 0.8);
    const depth = MathUtils.clamp(-y / 40, 0, 1);
    underwaterUniforms.uTime.value = clock.elapsedTime;
    underwaterUniforms.uUnderwater.value = underwater;
    underwaterUniforms.uDepth.value = depth;

    const k = MathUtils.lerp(1, 0.55, depth);
    fogWater.setRGB(waterHorizon[0] * k, waterHorizon[1] * k, waterHorizon[2] * k, SRGBColorSpace);
    const fog = fogRef.current;
    if (fog) {
      fog.color.lerpColors(fogSky, fogWater, underwater);
      fog.density = MathUtils.lerp(fogDensity.above, fogDensity.underwater, underwater);
    }

    sphere.current?.position.copy(camera.position);
  }, -1);

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={[0x000000, fogDensity.underwater]} />
      <mesh ref={sphere} material={material} renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[500, 32, 16]} />
      </mesh>
    </>
  );
}
