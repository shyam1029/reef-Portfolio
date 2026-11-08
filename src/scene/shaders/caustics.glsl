// Animated caustics: thin bright lines along the edges of two drifting, domain-warped
// Voronoi layers, approximating sunlight focused by surface waves.
vec2 causticHash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float causticCells(vec2 p, float t) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = 0.5 + 0.45 * sin(t + 6.2831 * causticHash(i + g));
      float d = length(g + o - f);
      if (d < d1) { d2 = d1; d1 = d; }
      else if (d < d2) { d2 = d; }
    }
  }
  return d2 - d1;
}

float caustics(vec2 xz, float t) {
  vec2 p = xz * 0.2;
  // Strong, layered warping turns the Voronoi cells into wobbly, curved light lines.
  p += 0.55 * vec2(
    sin(p.y * 0.9 + t * 0.4) + 0.5 * sin(p.y * 2.3 - t * 0.3),
    cos(p.x * 0.8 - t * 0.35) + 0.5 * cos(p.x * 2.1 + t * 0.45)
  );
  // Cell-scale warp bends each straight Voronoi edge into a curve.
  p += 0.18 * vec2(sin(p.y * 3.1 + t * 0.9), cos(p.x * 2.9 - t * 0.8));
  p += 0.08 * vec2(sin(p.y * 6.3 - t * 1.1), cos(p.x * 5.7 + t));
  float a = causticCells(p, t * 0.7);
  float b = causticCells(mat2(0.77, -0.64, 0.64, 0.77) * p * 1.4 + 3.1, -t * 0.5);
  float la = pow(1.0 - smoothstep(0.0, 0.14, a), 2.0);
  float lb = pow(1.0 - smoothstep(0.0, 0.14, b), 2.0);
  return la * 0.6 + lb * 0.6 + la * lb * 1.5; // crossings focus the most light
}
