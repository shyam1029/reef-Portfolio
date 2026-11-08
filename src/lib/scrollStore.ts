import { create } from 'zustand';

type ScrollState = {
  /** Page scroll progress, 0 at the top and 1 at the bottom. */
  progress: number;
  setProgress: (progress: number) => void;
};

// Read `useScrollStore.getState().progress` inside useFrame (no re-render);
// use a selector like `useScrollStore((s) => s.progress > 0.5)` in UI so it
// re-renders only when the derived value flips.
export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

export const useInRange = ([from, to]: readonly [number, number]) =>
  useScrollStore((s) => s.progress > from && s.progress < to);
