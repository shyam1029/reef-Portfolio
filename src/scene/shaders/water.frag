uniform float uTime;
uniform vec3 uSunDir;
uniform float uDepth;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vWorldPosition;

// #include noise
#include <fog_pars_fragment>

void main() {
  // Fine ripples on top of the vertex waves.
  vec2 p = vWorldPosition.xz * 0.5;
  float t = uTime * 1.4;
  float h = snoise(vec3(p, t));
  vec3 ripple = vec3(snoise(vec3(p + vec2(0.1, 0.0), t)) - h, 0.0, snoise(vec3(p + vec2(0.0, 0.1), t)) - h) * 10.0;
  vec3 n = normalize(normalize(vNormal) - ripple * 0.12);

  vec3 toCamera = normalize(cameraPosition - vWorldPosition);
  vec3 color;
  float alpha;

  if (gl_FrontFacing) {
    // Seen from above: deep teal body, sky reflection by Fresnel, sun glint.
    float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(n, toCamera), 0.0), 5.0);
    vec3 body = mix(vec3(0.0, 0.28, 0.42), vec3(0.0, 0.5, 0.65), vElevation * 0.5 + 0.5);
    vec3 sky = vec3(0.75, 0.88, 0.95);
    float glint = pow(max(dot(reflect(-toCamera, n), uSunDir), 0.0), 250.0);
    color = mix(body, sky, fresnel) + vec3(1.0, 0.95, 0.85) * glint * 3.0;
    alpha = mix(0.8, 1.0, fresnel);
  } else {
    // Seen from below: Snell's window. Inside ~48° of vertical you see the bright sky;
    // outside it the surface is a dark mirror (total internal reflection).
    vec3 ray = -toCamera;
    float c = dot(ray, n);
    float window = smoothstep(0.62, 0.74, c);
    vec3 skyThrough = mix(vec3(0.3, 0.6, 0.7), vec3(0.62, 0.84, 0.9), smoothstep(0.8, 1.0, c));
    vec3 mirror = vec3(0.07, 0.36, 0.44) * mix(1.0, 0.6, uDepth);
    float sun = pow(max(dot(ray, uSunDir), 0.0), 60.0);
    float rim = 1.0 - abs(window * 2.0 - 1.0);
    color = mix(mirror, skyThrough, window) + vec3(1.0, 0.97, 0.85) * pow(sun, 2.0) * 1.2 * window;
    color += vec3(0.6, 0.9, 1.0) * rim * 0.2;
    alpha = 0.97;
  }

  gl_FragColor = sRGBTransferEOTF(vec4(color, alpha));
  #include <fog_fragment>
}
