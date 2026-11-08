/// <reference types="vite/client" />
declare module 'alea' {
  export default function alea(...seed: unknown[]): () => number;
}
