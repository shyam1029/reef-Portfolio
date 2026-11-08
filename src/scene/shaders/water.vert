uniform float uTime;
uniform float uAmplitude;
uniform float uNoiseScale;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vWorldPosition;
#include <fog_pars_vertex>

// #include noise

float heightAt(vec2 p) {
  return snoise(vec3(p * uNoiseScale, uTime)) * uAmplitude;
}

void main() {
  vec3 pos = position;
  pos.z += heightAt(pos.xy);
  vElevation = pos.z;
  vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

  float e = 0.5;
  float dx = (heightAt(pos.xy + vec2(e, 0.0)) - pos.z) / e;
  float dy = (heightAt(pos.xy + vec2(0.0, e)) - pos.z) / e;
  vNormal = normalize(mat3(modelMatrix) * normalize(vec3(-dx, -dy, 1.0)));

  vec4 mvPosition = viewMatrix * vec4(vWorldPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
