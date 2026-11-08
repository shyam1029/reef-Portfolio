uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uUnderwater;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  // Gentle refraction wobble.
  uv += vec2(sin(uv.y * 16.0 + uTime * 1.5), cos(uv.x * 12.0 + uTime * 1.2)) * 0.0012 * uUnderwater;

  vec2 dir = uv - 0.5;
  float r = length(dir);
  float ca = 0.006 * r * uUnderwater; // chromatic aberration toward the edges
  vec3 color = vec3(
    texture2D(tDiffuse, uv + dir * ca).r,
    texture2D(tDiffuse, uv).g,
    texture2D(tDiffuse, uv - dir * ca).b
  );

  float vignette = smoothstep(0.9, 0.3, r);
  color *= mix(1.0, mix(0.45, 1.0, vignette), uUnderwater);
  gl_FragColor = vec4(color, 1.0);
}
