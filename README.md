# Portfolio — Coral Reef Experience

An interactive, scroll-driven 3D portfolio. Scroll to dive from the sea floor, past the reef and a treasure chest, up through the water surface to an iridescent business card in the sky.

Originally built by hand in vanilla Three.js during college, now rebuilt on React.

## Features
- Custom GLSL water surface, sea floor caustics and an iridescent card shader
- Camera travels along a spline as you scroll, with Lenis smooth scrolling
- A seeded, procedurally placed reef with animated fish
- Bloom post-processing
- Glassmorphism overlays for projects and contact links

## Tech stack
React 19 · TypeScript · Vite · Three.js · React Three Fiber · drei · Lenis · zustand

## Getting started
```bash
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` produces a static site in `dist/` (relative paths, so it's GitHub Pages friendly).

To change portfolio content, edit `src/content/portfolio.ts`. Planned improvements are in [docs/ROADMAP.md](docs/ROADMAP.md).
