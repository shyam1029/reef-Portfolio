uniform float uTime;
varying float vHeight;
varying vec3 vWorldPosition;
varying vec3 vNormal;
#include <fog_pars_vertex>

void main() {
  vec3 p = position;
  float h = p.y; // 0 at the root, 1 at the tip
  p.xz *= 1.0 - h * 0.65; // taper toward the tip

  vec4 world = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vec3 root = (modelMatrix * instanceMatrix[3]).xyz;
  float phase = root.x * 0.15 + root.z * 0.11;
  float bend = h * h;
  world.x += sin(uTime * 0.8 + phase + h * 2.5) * 1.8 * bend;
  world.z += cos(uTime * 0.6 + phase * 1.3 + h * 2.0) * 1.3 * bend;

  vHeight = h;
  vWorldPosition = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vec4 mvPosition = viewMatrix * world;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
