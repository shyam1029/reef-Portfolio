# Portfolio Revamp Roadmap

Goal: keep the core idea (an underwater 3D reef you travel through by scrolling) and make it fast, maintainable and more impressive.

## What the original does well

- Hand-written GLSL for the water surface, the sea floor caustics and the iridescent intro card.
- Scroll-driven camera on a spline: a simple idea that's easy to tune.
- Glassmorphism overlays that suit the ocean theme.

## Problems found in the original

### Performance (biggest wins)
| Issue | Where | Impact |
|---|---|---|
| 41 MB of GLB assets; `crescent_moon_coral.glb` alone is 15 MB, `treasure.glb` 7 MB | `assets/` | Long first load, especially on mobile |
| Each fish GLB is downloaded and **parsed 20 times** (one `loader.load` per instance) | fish loading | 40 parses instead of 2 |
| 180 coral clones = 180+ separate draw calls | coral placement | Low FPS on weaker GPUs |
| Shadows enabled on everything, but the shader floor/water ignore shadows | renderer + `ShaderMaterial`s | Paying for shadow maps that are never seen |
| 128×128 water plane recomputes 3D simplex noise 3× per vertex every frame | water shader | Heavy vertex work |
| Rainbow card texture baked pixel-by-pixel on the CPU (262k iterations) | `bakeCardRainbowTexture` | Main-thread stall at start |
| Bloom pass runs at full resolution | `UnrealBloomPass` | GPU cost on hi-DPI screens |

### Correctness / UX
- Coral, fish and the floor are randomised on every load (unseeded noise + `Math.random`), so the camera path can clip through coral.
- GSAP tweens are fired on **every scroll event**, stacking hundreds of tweens.
- Fish swim in straight lines and only bounce at the map edge; animation uses a hard-coded `delta = 0.016`, so speed depends on frame rate.
- LinkedIn link is missing `https://` and resolves to a local path.
- No reduced-motion, keyboard or screen-reader support; content is invisible if WebGL fails.
- Coral "colonies" placeholders with empty titles are rendered but show nothing.

### Maintainability
- One 1100-line file with globals, duplicated shader noise code, duplicated card-drawing code.
- CDN-only dependencies with no lockfile; no build, no type checking, no linting.

## Phased plan

### Phase 1 — React foundation ✅
- Vite + React + TypeScript, dependencies via npm with a lockfile.
- Scene rewritten with React Three Fiber + drei; one component per scene element.
- Shaders moved to `.glsl` files with a shared noise chunk.
- Content (projects, contact links, scroll sections) in one typed data file.
- Fixes: load each GLB once (`useGLTF` caching), seeded placement, frame-rate independent animation, no tween stacking, LinkedIn URL.
- Compressed GLBs (meshopt + WebP textures) via `gltf-transform`.

### Phase 1.5 — Realistic underwater ✅
- Depth fog with blue-green absorption, plus a depth-graded background that matches the fog at the horizon.
- Animated caustics on the sand, kelp and every GLTF model (patched standard materials).
- Sand with ripples, grain, patches and real diffuse lighting.
- Water surface with Fresnel and sun glint from above, and Snell's window plus total internal reflection from below.
- Volumetric-looking light shafts, marine snow, bubble streams, and instanced swaying kelp.
- Underwater lens pass (refraction wobble, chromatic aberration, vignette); bloom softens below the surface.
- Adaptive DPR via `PerformanceMonitor`.

### Phase 2 — Performance polish
- Instanced corals and fish (`<Instances>` / `InstancedMesh`), so each model type is one draw call.
- Adaptive quality: `PerformanceMonitor` lowers DPR / disables bloom on slow devices.
- Lazy-load far-away corals; progressive loading with a real asset-based loader.
- Lighthouse / bundle-size budget in CI.

### Phase 3 — Experience upgrades
- Scroll timeline with named "stations" (Intro → About → Projects → Skills → Contact) instead of hard-coded `t` ranges.
- Projects as interactive 3D objects on the reef (hover/click opens details), not just an HTML popup.
- Boids-style fish schooling, god rays, floating particles (marine snow), depth fog that changes with depth.
- Underwater ambient audio (muted by default).
- About / Skills / Experience sections, resume download.

### Phase 4 — Production
- Accessible fallback page (no-WebGL / reduced motion) with the same content.
- SEO meta, Open Graph image, favicon.
- GitHub Pages / Vercel deploy via GitHub Actions.
- ESLint + Prettier, basic Playwright smoke test (page loads, canvas renders, sections reachable).
