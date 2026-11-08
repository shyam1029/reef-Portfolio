uniform float uUnderwater;
uniform float uDepth;
uniform vec3 uSunDir;
varying vec3 vDir;

void main() {
  vec3 d = normalize(vDir);
  float sunAmount = max(dot(d, uSunDir), 0.0);

  // Under water: dark below, light filtering down from above.
  vec3 deep = vec3(0.004, 0.06, 0.1);
  vec3 mid = vec3(0.03, 0.3, 0.4); // keep in sync with waterHorizon in underwater.ts
  vec3 shallow = vec3(0.3, 0.68, 0.75);
  vec3 water = mix(deep, mid, smoothstep(-0.6, 0.0, d.y));
  water = mix(water, shallow, smoothstep(0.2, 0.95, d.y)); // flat near the horizon so it matches the fog
  water += vec3(0.5, 0.75, 0.65) * pow(sunAmount, 6.0) * 0.3;
  water *= mix(1.0, 0.55, uDepth);

  // Above water: sky gradient with the sea below the horizon.
  vec3 horizon = vec3(0.75, 0.88, 0.95); // keep in sync with skyHorizon in underwater.ts
  vec3 zenith = vec3(0.3, 0.56, 0.88);
  vec3 sky = mix(horizon, zenith, smoothstep(0.0, 0.6, d.y));
  sky = mix(vec3(0.03, 0.3, 0.42), sky, smoothstep(-0.03, 0.01, d.y));
  sky += vec3(1.0, 0.95, 0.8) * (pow(sunAmount, 400.0) * 4.0 + pow(sunAmount, 12.0) * 0.25);

  gl_FragColor = sRGBTransferEOTF(vec4(mix(sky, water, uUnderwater), 1.0));
}
