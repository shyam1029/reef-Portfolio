import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { underwaterPassShader } from './shaders';
import { underwaterUniforms } from './underwater';

/**
 * Post-processing with three's own EffectComposer:
 * render -> bloom -> underwater lens (wobble, chromatic aberration, vignette) -> output.
 * Rendering at priority 1 takes over R3F's default render loop.
 * (@react-three/postprocessing tinted the whole frame red with three 0.187.)
 */
export function Effects() {
  const { gl, scene, camera, size } = useThree();

  const { composer, bloom } = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new Vector2(256, 256), 1.5, 0.4, 0.85);
    c.addPass(bloomPass);
    c.addPass(
      new ShaderPass({
        ...underwaterPassShader,
        uniforms: {
          tDiffuse: { value: null },
          uTime: underwaterUniforms.uTime,
          uUnderwater: underwaterUniforms.uUnderwater,
        },
      }),
    );
    c.addPass(new OutputPass()); // sRGB conversion
    return { composer: c, bloom: bloomPass };
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);

  useEffect(() => () => composer.dispose(), [composer]);

  useFrame((_, delta) => {
    // Softer bloom under water so caustics shimmer instead of blowing out.
    bloom.strength = MathUtils.lerp(1.5, 0.55, underwaterUniforms.uUnderwater.value);
    composer.render(delta);
  }, 1);
  return null;
}
