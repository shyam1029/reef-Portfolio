import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box3, CanvasTexture, DoubleSide, ExtrudeGeometry, Group, MathUtils, NoColorSpace, ShaderMaterial, Shape, Vector3 } from 'three';
import { cardShader } from './shaders';
import { profile } from '../content/portfolio';
import { useScrollStore } from '../lib/scrollStore';

const WIDTH = 4;
const HEIGHT = 2.52;
const THICKNESS = 0.01;
const RADIUS = 0.2;
const TEXTURE_SIZE = 512;

/** Rounded-rectangle slab with UVs spanning the full face (so the details texture fills it). */
function createCardGeometry() {
  const w = WIDTH / 2;
  const h = HEIGHT / 2;
  const shape = new Shape()
    .moveTo(-w + RADIUS, -h)
    .lineTo(w - RADIUS, -h)
    .quadraticCurveTo(w, -h, w, -h + RADIUS)
    .lineTo(w, h - RADIUS)
    .quadraticCurveTo(w, h, w - RADIUS, h)
    .lineTo(-w + RADIUS, h)
    .quadraticCurveTo(-w, h, -w, h - RADIUS)
    .lineTo(-w, -h + RADIUS)
    .quadraticCurveTo(-w, -h, -w + RADIUS, -h);

  const geometry = new ExtrudeGeometry(shape, { depth: THICKNESS, bevelEnabled: false, steps: 1 });
  geometry.translate(0, 0, -THICKNESS / 2);

  const box = new Box3().setFromBufferAttribute(geometry.attributes.position as never);
  const size = box.getSize(new Vector3());
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const isFace = Math.abs(Math.abs(pos.getZ(i)) - THICKNESS / 2) < 0.001;
    uv.setXY(
      i,
      (pos.getX(i) - box.min.x) / size.x,
      isFace ? (pos.getY(i) - box.min.y) / size.y : (pos.getZ(i) + THICKNESS / 2) / THICKNESS,
    );
  }
  return geometry;
}

/** Draws the photo + contact text onto a transparent canvas used as the card's overlay. */
function drawDetails(ctx: CanvasRenderingContext2D, photo: HTMLImageElement | null) {
  const x = 190;
  if (photo) {
    const s = Math.min(180 / photo.width, 180 / photo.height, 1);
    const pw = photo.width * s;
    const ph = photo.height * s;
    ctx.drawImage(photo, 10, (TEXTURE_SIZE - ph) / 2, pw, ph);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px "Courier New", monospace';
  ctx.fillText(profile.name, x, 210);
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText(profile.role, x, 250);
  ctx.font = '18px "Courier New", monospace';
  ctx.fillText(profile.email, x, 290);
  ctx.font = '16px "Courier New", monospace';
  ctx.fillStyle = '#0a66c2';
  ctx.fillText('LinkedIn', x, 330);
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`GitHub - ${profile.github}`, x + 100, 330);
}

// Two poses: floating in the sky, and flipped overhead once the user reaches the end of the page.
const restPose = { position: new Vector3(70, 110, 71), rotation: new Vector3(0, Math.PI / 4, 0) };
const endPose = { position: new Vector3(70, 150, 70), rotation: new Vector3(Math.PI / 2, Math.PI / 10, Math.PI) };

export function IntroCard() {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => createCardGeometry(), []);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = TEXTURE_SIZE;
    const tex = new CanvasTexture(canvas);
    // Kept as raw sRGB values: the shader mixes in sRGB space and converts at the end.
    tex.colorSpace = NoColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    const ctx = (texture.image as HTMLCanvasElement).getContext('2d')!;
    const render = (photo: HTMLImageElement | null) => {
      drawDetails(ctx, photo);
      texture.needsUpdate = true;
    };
    const img = new Image();
    img.onload = () => render(img);
    img.onerror = () => render(null);
    img.src = profile.photo;
  }, [texture]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        ...cardShader,
        uniforms: { uTime: { value: 0 }, uDetails: { value: texture } },
        side: DoubleSide,
      }),
    [texture],
  );

  useFrame(({ clock }, delta) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    const pose = useScrollStore.getState().progress >= 0.99 ? endPose : restPose;
    const k = 8; // damping: higher = snappier
    g.position.x = MathUtils.damp(g.position.x, pose.position.x, k, delta);
    g.position.y = MathUtils.damp(g.position.y, pose.position.y, k, delta);
    g.position.z = MathUtils.damp(g.position.z, pose.position.z, k, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, pose.rotation.x, k, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, pose.rotation.y, k, delta);
    g.rotation.z = MathUtils.damp(g.rotation.z, pose.rotation.z, k, delta);
  });

  return (
    <group ref={group} position={restPose.position} rotation={[0, Math.PI / 4, 0]} scale={5}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}
