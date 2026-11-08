import { Material, MeshStandardMaterial, Object3D, Mesh } from 'three';
import { chunks } from '../scene/shaders';
import { underwaterUniforms } from '../scene/underwater';

const patched = new WeakSet<Material>();

/** Adds animated caustic light to a standard material (only below the waterline, on up-facing sides). */
function patchMaterial(material: Material) {
  if (!(material instanceof MeshStandardMaterial) || patched.has(material)) return;
  patched.add(material);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = underwaterUniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCausticWorld;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvCausticWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uTime;\nvarying vec3 vCausticWorld;\n${chunks.caustics}`)
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
        {
          vec3 worldNormal = inverseTransformDirection(normal, viewMatrix);
          float up = clamp(worldNormal.y * 0.7 + 0.3, 0.0, 1.0);
          float below = 1.0 - smoothstep(-1.0, 0.5, vCausticWorld.y);
          reflectedLight.directDiffuse += diffuseColor.rgb * caustics(vCausticWorld.xz, uTime) * 0.9 * up * below;
        }`,
      );
  };
  material.customProgramCacheKey = () => 'caustics';
}

export function addCaustics(root: Object3D) {
  root.traverse((o) => {
    if (o instanceof Mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(patchMaterial);
  });
}
