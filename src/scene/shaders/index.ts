import noise from './noise.glsl?raw';
import waterVert from './water.vert?raw';
import waterFrag from './water.frag?raw';
import floorVert from './floor.vert?raw';
import floorFrag from './floor.frag?raw';
import cardVert from './card.vert?raw';
import cardFrag from './card.frag?raw';

const withNoise = (src: string) => src.replace('// #include noise', noise);

export const waterShader = { vertexShader: withNoise(waterVert), fragmentShader: waterFrag };
export const floorShader = { vertexShader: floorVert, fragmentShader: withNoise(floorFrag) };
export const cardShader = { vertexShader: cardVert, fragmentShader: cardFrag };
