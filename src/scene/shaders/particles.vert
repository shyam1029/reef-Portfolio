// Marine snow: particles wrapped in a box that follows the camera, so it never runs out.
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform float uBox;
uniform float uPixelRatio;
uniform float uUnderwater;
varying float vAlpha;

void main() {
  vec3 p = position;
  p += vec3(
    sin(uTime * 0.3 + aSeed * 6.2831) * 0.8,
    -uTime * 0.18 * (0.4 + aSeed),
    cos(uTime * 0.23 + aSeed * 4.0) * 0.8
  );
  p = mod(p - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5 + cameraPosition;

  vec4 mvPosition = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float dist = -mvPosition.z;
  gl_PointSize = aSize * uPixelRatio * 40.0 / max(dist, 0.1);
  vAlpha = smoothstep(uBox * 0.5, uBox * 0.15, dist) * smoothstep(0.3, 1.5, dist)
    * uUnderwater * (1.0 - smoothstep(-1.0, 0.0, p.y));
}
