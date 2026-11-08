import { sunPosition } from './config';

/** Light filtered through water: cool sky fill, warm sand bounce, slightly warm sun. */
export function Lights() {
  return (
    <>
      <hemisphereLight args={['#8fe0ea', '#7a7458', 1.1]} />
      <directionalLight position={sunPosition} intensity={1.6} color="#fff1dc" />
    </>
  );
}
