varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float rim = smoothstep(0.32, 0.48, d) * (1.0 - smoothstep(0.48, 0.5, d));
  float highlight = smoothstep(0.14, 0.0, length(c - vec2(-0.15, -0.15)));
  float a = (0.08 + rim * 0.7 + highlight * 0.9) * vAlpha;
  gl_FragColor = vec4(vec3(0.85, 0.97, 1.0) * a, a);
}
