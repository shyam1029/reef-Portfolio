varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha * 0.55;
  gl_FragColor = vec4(vec3(0.82, 0.95, 0.9) * a, a);
}
