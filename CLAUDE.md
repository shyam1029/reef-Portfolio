# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page, scroll-driven 3D portfolio (underwater coral reef theme). Vite + React 19 + TypeScript, with the scene built in React Three Fiber (`@react-three/fiber` + `drei`) on three.js 0.187. It was migrated from a single vanilla `main.js`; the phased plan for further work is in `docs/ROADMAP.md`.

## Commands

```bash
npm install
npm run dev              # Vite dev server on :5173
npm run build            # tsc -b, then vite build into dist/
npm run typecheck
npm run lint             # ESLint (typescript-eslint + react-hooks)
npm run optimize:models  # compress GLBs in public/models in place (gltf-transform)
```

There is no test suite yet.

## Architecture

- **`src/content/portfolio.ts`**: all editable content (profile, projects, contact links) and the scroll ranges for each HTML panel. Change copy here, not in components.
- **`src/scene/config.ts`**: world constants (floor/water params, sun position), the camera spline `cameraPath`, and the model lists with per-model scales. Model URLs are relative to `public/`.
- **Scroll drives everything through one store.** `useSmoothScroll` (Lenis on the window) writes progress `0..1` into the zustand `useScrollStore`. The page height comes from `.scroll-container` (`height: 4000px` in `src/global.css`).
  - Inside `useFrame`, read `useScrollStore.getState().progress` so nothing re-renders. `CameraRig` maps it onto `cameraPath`, and `IntroCard` damps between two poses at `t >= 0.99`.
  - In React UI, use a boolean selector (`useInRange(range)`) so a component re-renders only when the boolean flips. `Panel` toggles the `is-visible` class this way.
- **Rendering.** `Effects.tsx` uses three's own `EffectComposer` with `useFrame(..., 1)`, which takes over R3F's render loop. The passes run RenderPass → UnrealBloomPass → underwater lens ShaderPass (wobble, chromatic aberration, vignette) → OutputPass. `@react-three/postprocessing` was removed because it tinted the frame red with this three version. The Canvas is `flat` (no tone mapping) and uses adaptive DPR through drei's `PerformanceMonitor`.
- **Underwater state is centralised.** `scene/underwater.ts` exports shared uniform objects (`uTime`, `uUnderwater` 0..1, `uDepth`, `uSunDir`). Materials reference these same objects instead of copying them. `Environment.tsx` updates them once per frame (priority -1) from the camera's height, and also drives the `FogExp2` and the background sphere. New underwater effects should read these uniforms rather than computing their own state.
  - The fog is attached declaratively (`<fogExp2 attach="fog" ref>`). Don't create it inside `useMemo`: StrictMode runs `useMemo` twice and you end up updating a detached fog.
  - A custom `ShaderMaterial` that should fade into the water needs three things: `fog: true`, `...UniformsLib.fog` in its uniforms, and the `fog_*` chunks in its GLSL. See `floor.*` and `kelp.*`.
- **Caustics** live in the shared `caustics.glsl` chunk. The sea floor and kelp use it directly. GLTF models get it through `lib/caustics.ts` (`addCaustics(root)`), which patches `MeshStandardMaterial`s with `onBeforeCompile` so the effect only shows below the waterline and on up-facing surfaces.
- **Shaders** are files in `src/scene/shaders/`, imported with `?raw` through `shaders/index.ts`. A `// #include <name>` line is replaced with a chunk from `chunks` (`noise`, `caustics`). Colors are written in sRGB and the shaders end with `sRGBTransferEOTF(...)`, followed by `#include <fog_fragment>`, so OutputPass converts them back to the same on-screen values. Keep that convention for new shaders.
- **Background and fog colors must agree.** `background.frag` hard-codes the water and sky horizon colors, which are mirrored in `waterHorizon` and `skyHorizon` in `underwater.ts`. If they drift apart, a visible band appears at the horizon.
- **Deterministic world.** `src/lib/random.ts` provides seeded PRNGs (`createRandom(salt)`) and the terrain function. Anything placed on the floor must use `floorHeightAt(x, z)` so it uses the same noise as `SeaFloor`. The floor plane is rotated -90° about X, so plane-space y equals world -z. Corals also stay `pathClearance` away from the camera path.
- **Models** load through `useGLTF`, which caches, so each file is fetched and parsed once. All of them are preloaded in `Experience.tsx`, and the drei `useProgress` hook drives `ui/Loader.tsx`. Fish are cloned with `SkeletonUtils.clone`, and each clone has its own `AnimationMixer`. Coral clones are static (`matrixAutoUpdate = false`).

## Assets

- GLBs in `public/models` are already meshopt-compressed, with WebP textures. Loading them needs drei's `useGLTF`, whose meshopt decoder is on by default; a bare `GLTFLoader` can't read them.
- Run any new model through `npm run optimize:models -- path/to/model.glb`. The script also converts spec-gloss materials, which three.js no longer supports.
- The uncompressed originals are only in git history.
