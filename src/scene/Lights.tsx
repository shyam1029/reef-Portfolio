import { sunPosition } from './config';

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={sunPosition} intensity={1.8} />
    </>
  );
}
