import { Experience } from './scene/Experience';
import { Loader } from './ui/Loader';
import { ProjectsPanel } from './ui/ProjectsPanel';
import { ContactPanel } from './ui/ContactPanel';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { useScrollStore } from './lib/scrollStore';

export default function App() {
  useSmoothScroll();
  const hasScrolled = useScrollStore((s) => s.progress > 0);

  return (
    <>
      <Loader hidden={hasScrolled} />
      <Experience />
      <main className="scroll-container">
        <ProjectsPanel />
        <ContactPanel />
      </main>
    </>
  );
}
