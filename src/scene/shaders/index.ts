import noise from './noise.glsl?raw';
import caustics from './caustics.glsl?raw';
import waterVert from './water.vert?raw';
import waterFrag from './water.frag?raw';
import floorVert from './floor.vert?raw';
import floorFrag from './floor.frag?raw';
import cardVert from './card.vert?raw';
import cardFrag from './card.frag?raw';
import backgroundVert from './background.vert?raw';
import backgroundFrag from './background.frag?raw';
import godraysVert from './godrays.vert?raw';
import godraysFrag from './godrays.frag?raw';
import particlesVert from './particles.vert?raw';
import particlesFrag from './particles.frag?raw';
import bubblesVert from './bubbles.vert?raw';
import bubblesFrag from './bubbles.frag?raw';
import kelpVert from './kelp.vert?raw';
import kelpFrag from './kelp.frag?raw';
import fullscreenVert from './fullscreen.vert?raw';
import underwaterPassFrag from './underwaterPass.frag?raw';

/** Shared GLSL chunks, pulled in with a `// #include <name>` line. */
export const chunks = { noise, caustics };

const resolve = (src: string) =>
  src.replace(/\/\/ #include (\w+)/g, (line, name: keyof typeof chunks) => chunks[name] ?? line);

const shader = (vertex: string, fragment: string) => ({
  vertexShader: resolve(vertex),
  fragmentShader: resolve(fragment),
});

export const waterShader = shader(waterVert, waterFrag);
export const floorShader = shader(floorVert, floorFrag);
export const cardShader = shader(cardVert, cardFrag);
export const backgroundShader = shader(backgroundVert, backgroundFrag);
export const godraysShader = shader(godraysVert, godraysFrag);
export const particlesShader = shader(particlesVert, particlesFrag);
export const bubblesShader = shader(bubblesVert, bubblesFrag);
export const kelpShader = shader(kelpVert, kelpFrag);
export const underwaterPassShader = shader(fullscreenVert, underwaterPassFrag);
