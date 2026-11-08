// Compresses every GLB under public/models in place:
// meshopt geometry compression, WebP textures capped at 1024px, deduped/pruned data.
// Originals live in git history; re-running on already-optimized files is safe.
// Usage: npm run optimize:models [-- path/to/file.glb ...]
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const root = 'public/models';
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.glb') ? [p] : [];
  });

const files = process.argv.slice(2).length ? process.argv.slice(2) : walk(root);
const kb = (p) => Math.round(statSync(p).size / 1024);

for (const file of files) {
  const tmp = `${file}.tmp.glb`;
  const before = kb(file);
  // three.js dropped KHR_materials_pbrSpecularGlossiness; convert to metal-rough first.
  execFileSync('npx', ['gltf-transform', 'metalrough', file, tmp], { stdio: 'inherit' });
  renameSync(tmp, file);
  execFileSync(
    'npx',
    [
      'gltf-transform', 'optimize', file, tmp,
      '--compress', 'meshopt',
      '--texture-compress', 'webp',
      '--texture-size', '1024',
    ],
    { stdio: 'inherit' },
  );
  renameSync(tmp, file);
  console.log(`${file}: ${before} KB -> ${kb(file)} KB`);
}
