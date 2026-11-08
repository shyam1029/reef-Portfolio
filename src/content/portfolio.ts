// All editable portfolio content lives here. The 3D scene and UI read from this file.

export const profile = {
  name: 'Syam Satish P',
  role: 'Creative Developer',
  email: 'syamsatishpolipalli@gmail.com',
  github: 'Shyam1029',
  photo: 'images/profile.png',
};

export type Project = { title: string; description: string; url: string; image: string };

export const projects: Project[] = [
  {
    title: 'AetherRush',
    description:
      'A thrilling sci-fi adventure game set in a futuristic universe. Players navigate through asteroid fields and battle enemy ships. Hosted on GitHub with live demo available.',
    url: 'https://shyam1029.github.io/Three.js---6/',
    image: 'images/ar.jpeg',
  },
  {
    title: 'Endless Space Runner',
    description:
      'An infinite runner game set in space, where players dodge obstacles and collect power-ups. Built with JavaScript and hosted on GitHub.',
    url: 'https://shyam1029.github.io/Three.js---4/',
    image: 'images/elp.png',
  },
  {
    title: 'Luxe Cars',
    description:
      'A showcase of luxury cars with interactive 3D models and detailed specifications. Explore high-end vehicles in this GitHub-hosted project.',
    url: 'https://shyam1029.github.io/Three.js---3.2/',
    image: 'images/car.png',
  },
];

export type ContactLink = { label: string; description: string; url: string; icon: string };

export const contacts: ContactLink[] = [
  {
    label: 'LinkedIn',
    description: 'Connect with me on LinkedIn for professional updates and networking.',
    url: 'https://www.linkedin.com/in/syam-satish-polipalli-507864250',
    icon: 'images/linkedin.png',
  },
  {
    label: 'GitHub',
    description: 'Explore my open-source projects and code repositories on GitHub.',
    url: 'https://github.com/shyam1029',
    icon: 'images/github.png',
  },
  {
    label: 'Email',
    description: 'Send me an email for inquiries, collaborations, or just to say hello!',
    url: 'mailto:syamsatishpolipalli@gmail.com',
    icon: 'images/gmail.png',
  },
];

// Scroll progress ranges (0 = top, 1 = bottom) during which each HTML panel is visible.
export const sections = {
  projects: [0.15, 0.3],
  contact: [0.4, 0.6],
} as const satisfies Record<string, readonly [number, number]>;
