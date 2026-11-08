uniform float uTime;
uniform vec3 uSunDir;
uniform float uElevation;
varying float vElevation;
varying vec3 vWorldPosition;
varying vec3 vNormal;

// #include noise
// #include caustics
#include <fog_pars_fragment>

// Wind-blown sand ripples, bent by low-frequency noise so they don't look ruled.
float ripples(vec2 p) {
  float warp = snoise(vec3(p * 0.04, 0.0)) * 5.0;
  return sin(dot(p, vec2(0.9, 0.42)) * 1.4 + warp) * 0.5 + 0.5;
}

void main() {
  vec2 p = vWorldPosition.xz;

  float e = 0.2;
  float h = ripples(p);
  vec3 bump = vec3(ripples(p + vec2(e, 0.0)) - h, 0.0, ripples(p + vec2(0.0, e)) - h) / e;
  vec3 n = normalize(normalize(vNormal) - bump * 0.18);

  float grain = snoise(vec3(p * 1.3, 1.0)) * 0.5 + 0.5;
  float patches = snoise(vec3(p * 0.025, 2.0)) * 0.5 + 0.5;
  vec3 sand = vec3(0.92, 0.79, 0.58);
  vec3 dark = vec3(0.5, 0.44, 0.34);
  float t = clamp(0.5 + 0.3 * patches + 0.15 * (vElevation / uElevation), 0.0, 1.0);
  vec3 albedo = mix(dark, sand, t) * (0.9 + 0.1 * grain);

  float diffuse = max(dot(n, uSunDir), 0.0);
  vec3 color = albedo * (0.55 + 0.6 * diffuse);
  // Caustics come and go in patches, like light through an uneven surface.
  float patchy = smoothstep(-0.4, 0.8, snoise(vec3(p * 0.02, uTime * 0.05)));
  color += vec3(0.8, 1.0, 0.92) * caustics(p, uTime) * (0.15 + 0.3 * patchy) * (0.5 + 0.5 * diffuse);
  // Red light is absorbed first under water; everything picks up the water's teal.
  color *= vec3(0.92, 0.97, 1.0);
  color = mix(color, vec3(0.1, 0.42, 0.48), 0.05);

  gl_FragColor = sRGBTransferEOTF(vec4(color, 1.0));
  #include <fog_fragment>
}
