uniform float uTime;
uniform sampler2D uDetails;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec3 hueToRGB(float hue) {
  float r = abs(hue * 6.0 - 3.0) - 1.0;
  float g = 2.0 - abs(hue * 6.0 - 2.0);
  float b = 2.0 - abs(hue * 6.0 - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

// Cheap value noise replaces the old CPU-baked rainbow/noise texture.
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(gl_FrontFacing ? vNormal : -vNormal);
  float fresnel = clamp(pow(1.0 - dot(normal, viewDir), 3.0), 0.0, 1.0);

  float hue = fract((vUv.x + vUv.y) * 0.5 + uTime * 0.5);
  vec3 iridescent = hueToRGB(hue);
  vec3 color = mix(vec3(0.9, 0.9, 1.0), iridescent, 0.7);
  color = mix(color, vec3(100.0, 150.0, 200.0) / 255.0, 0.4); // flat "environment" tint
  color *= 0.85 + 0.15 * valueNoise(vUv * 10.0);
  color += vec3(0.5, 0.6, 1.0) * fresnel * 0.5;
  color += iridescent * 0.2 * (sin(uTime * 0.5) * 0.5 + 0.5);

  vec4 details = texture2D(uDetails, vUv);
  color = mix(color, details.rgb, details.a * 0.9);

  gl_FragColor = sRGBTransferEOTF(vec4(color, 1.0));
}
