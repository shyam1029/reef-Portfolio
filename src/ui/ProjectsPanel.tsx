import { projects, sections } from '../content/portfolio';
import { Panel } from './Panel';

export function ProjectsPanel() {
  return (
    <Panel id="project-ui" range={sections.projects} label="Projects">
      <h1>Projects</h1>
      <div className="project-container">
        {projects.map((p) => (
          <article className="project-card" key={p.title}>
            <a href={p.url} target="_blank" rel="noreferrer">
              <img src={p.image} alt={p.title} loading="lazy" />
            </a>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
