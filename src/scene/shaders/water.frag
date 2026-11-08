uniform vec3 uSunPosition;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 color = mix(vec3(0.0, 0.5, 0.8), vec3(0.0, 0.8, 1.0), vElevation * 0.5 + 0.5);
  vec3 toSun = normalize(uSunPosition - vWorldPosition);
  float highlight = pow(max(dot(normalize(vNormal), toSun), 0.0), 10.0);
  color = mix(color, vec3(1.0, 1.0, 0.9), highlight * 0.2);
  float glow = 1.0 - smoothstep(0.0, 50.0, length(uSunPosition.xz - vWorldPosition.xz));
  color += vec3(0.2, 0.2, 0.1) * glow;
  gl_FragColor = sRGBTransferEOTF(vec4(color, 0.7));
}
