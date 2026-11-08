// Bubble streams: each bubble rises from its emitter, wobbles, grows, and loops back.
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
uniform float uUnderwater;
varying float vAlpha;

void main() {
  float speed = 2.2 + aSeed * 2.0;
  float height = -position.y; // emitter depth below the surface
  float rise = mod(aSeed * 97.0 + uTime * speed, height);
  float k = rise / height;
  vec3 p = position;
  p.y += rise;
  p.x += sin(uTime * 3.0 + aSeed * 40.0) * 0.25 * (0.3 + k) + (aSeed - 0.5) * 1.2;
  p.z += cos(uTime * 2.6 + aSeed * 31.0) * 0.25 * (0.3 + k) + (fract(aSeed * 7.3) - 0.5) * 1.2;

  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (0.25 + 0.35 * k + 0.2 * aSeed) * uPixelRatio * 140.0 / max(-mvPosition.z, 0.1);
  vAlpha = uUnderwater * smoothstep(0.0, 0.05, k) * (1.0 - smoothstep(0.92, 1.0, k));
}
