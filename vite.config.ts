import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset URLs relative so the build works on GitHub Pages sub-paths.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // three + drei + postprocessing form one large vendor chunk; splitting is a Phase 2 item.
    chunkSizeWarningLimit: 1500,
  },
});
