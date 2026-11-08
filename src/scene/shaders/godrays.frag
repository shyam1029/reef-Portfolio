uniform float uTime;
uniform float uUnderwater;
uniform float uSeed;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

// #include noise

void main() {
  // Shafts are bands around the cone (uv.x = angle) that drift and flicker slowly.
  float bands = snoise(vec3(vUv.x * 28.0 + uSeed, uSeed, uTime * 0.12)) * 0.5 + 0.5;
  bands *= snoise(vec3(vUv.x * 9.0 - uSeed, uTime * 0.07, uSeed)) * 0.5 + 0.5;
  bands = smoothstep(0.15, 0.6, bands);

  float fromTop = smoothstep(0.0, 1.0, vUv.y); // bright under the surface, fading toward the floor
  vec3 toCamera = cameraPosition - vWorldPosition;
  float facing = pow(abs(dot(normalize(vNormal), normalize(toCamera))), 1.5); // soften silhouettes
  float nearFade = smoothstep(3.0, 18.0, length(toCamera)); // no blobs right in front of the lens

  float a = bands * fromTop * facing * nearFade * uUnderwater * uIntensity;
  gl_FragColor = vec4(vec3(0.75, 0.95, 0.9) * a, 1.0); // additive blending
}
