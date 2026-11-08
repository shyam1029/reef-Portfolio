uniform float uTime;
uniform vec3 uSunPosition;
uniform float uElevation;
varying float vElevation;
varying vec3 vWorldPosition;

// #include noise

void main() {
  vec3 sand = vec3(210.0, 180.0, 140.0) / 255.0;
  vec3 mud = vec3(139.0, 69.0, 19.0) / 255.0;
  vec3 color = mix(sand, mud, (vElevation + uElevation) / (uElevation * 2.0));

  vec3 toSun = uSunPosition - vWorldPosition;
  float caustic = 1.0 - smoothstep(0.0, 50.0, length(toSun.xz));
  vec3 refractPos = vWorldPosition + toSun * 0.1;
  caustic *= snoise(vec3(refractPos.xz * 0.1, uTime * 0.5)) * 0.5 + 0.5;
  color += vec3(1.0, 1.0, 0.9) * caustic * 0.5;

  gl_FragColor = sRGBTransferEOTF(vec4(color, 1.0));
}
