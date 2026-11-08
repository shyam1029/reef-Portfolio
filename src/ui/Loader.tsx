import { useProgress } from '@react-three/drei';

/** Full-screen progress bar while models load, then the "scroll to explore" hint. */
export function Loader({ hidden }: { hidden: boolean }) {
  const { progress, active } = useProgress();
  const done = !active && progress === 100;

  return (
    <>
      <div className={`progress-bar-container${done ? ' is-hidden' : ''}`} aria-hidden={done}>
        <label className="progress-bar" htmlFor="progress-bar">
          {progress < 60 ? 'Diving in…' : 'Almost done…'}
        </label>
        <progress id="progress-bar" value={progress} max={100} />
      </div>
      <div className={`intro-gesture${done && !hidden ? ' visible' : ''}`} aria-hidden={!done || hidden}>
        <span className="gesture-text">Scroll to Explore</span>
        <div className="scroll-arrow" />
      </div>
    </>
  );
}
