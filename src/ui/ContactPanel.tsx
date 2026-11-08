import { contacts, sections } from '../content/portfolio';
import { Panel } from './Panel';

export function ContactPanel() {
  return (
    <Panel id="contact-ui" range={sections.contact} label="Contact">
      <div className="contact-container">
        {contacts.map((c) => (
          <article className="contact-card" key={c.label}>
            <a href={c.url} target={c.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              <img src={c.icon} alt="" />
              <h2>{c.label}</h2>
            </a>
            <p>{c.description}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
