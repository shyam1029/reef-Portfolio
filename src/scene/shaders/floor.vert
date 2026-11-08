varying float vElevation;
varying vec3 vWorldPosition;
varying vec3 vNormal;
#include <fog_pars_vertex>

void main() {
  vElevation = position.z;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * vec4(vWorldPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
