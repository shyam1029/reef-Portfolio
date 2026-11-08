import type { ReactNode } from 'react';
import { useInRange } from '../lib/scrollStore';

/** Glass overlay panel that fades in while scroll progress is inside `range`. */
export function Panel({ id, range, label, children }: { id: string; range: readonly [number, number]; label: string; children: ReactNode }) {
  const visible = useInRange(range);
  return (
    <section id={id} className={`panel${visible ? ' is-visible' : ''}`} aria-label={label} aria-hidden={!visible} inert={!visible}>
      {children}
    </section>
  );
}
