uniform float uTime;
uniform vec3 uSunDir;
varying float vHeight;
varying vec3 vWorldPosition;
varying vec3 vNormal;

// #include caustics
#include <fog_pars_fragment>

void main() {
  vec3 base = mix(vec3(0.1, 0.18, 0.05), vec3(0.42, 0.5, 0.16), vHeight);
  vec3 toCamera = normalize(cameraPosition - vWorldPosition);
  // Thin leaves glow when light comes through them toward the viewer.
  float backlight = pow(max(dot(-toCamera, uSunDir), 0.0), 3.0);
  float diffuse = abs(dot(normalize(vNormal), uSunDir));
  vec3 color = base * (0.45 + 0.5 * diffuse) + vec3(0.35, 0.45, 0.08) * backlight * vHeight;
  color += vec3(0.5, 0.6, 0.4) * caustics(vWorldPosition.xz + vWorldPosition.y, uTime) * 0.15;
  color *= vec3(0.75, 0.95, 1.0);

  gl_FragColor = sRGBTransferEOTF(vec4(color, 1.0));
  #include <fog_fragment>
}
