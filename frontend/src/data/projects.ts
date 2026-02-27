export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stack: string[];
  highlights: string[];
  github?: string;
  demo?: string;
  accentColor: string;   /* Tailwind/CSS color string */
  accentGlow: string;    /* rgba glow string */
  gradient: string;      /* CSS gradient for card border + hero */
}

const projects: Project[] = [
  {
    id: "ai-portfolio-assistant",
    title: "AI Portfolio Assistant",
    shortDesc: "Full-stack portfolio with a resume-aware AI chat powered by FastAPI & GroqCloud.",
    longDesc:
      "A production-ready portfolio website with a built-in AI chatbot that answers recruiter questions about Shreyash's background, skills, and projects. The backend runs on FastAPI with SQLite for message persistence and uses GroqCloud's LLM API (via OpenRouter) with a structured resume context injected into every prompt, ensuring accurate and relevant responses. The frontend is a React + TypeScript SPA with smooth animations and a floating chat widget.",
    stack: ["React", "TypeScript", "FastAPI", "Python", "GroqCloud", "OpenRouter", "SQLite", "Tailwind CSS"],
    highlights: [
      "Integrated GroqCloud LLM with backend context injection for accurate resume-aware answers",
      "Built FastAPI backend with SQLite message persistence and CORS-safe REST endpoints",
      "Designed floating chat widget with typing indicators and smooth Framer Motion transitions",
      "Resume context is injected server-side, keeping API keys and data secure",
      "Structured for production deployment — backend hosted on Render",
    ],
    github: "https://github.com/ShreyashLondhe31",
    demo: undefined,
    accentColor: "#6C63FF",
    accentGlow: "rgba(108,99,255,0.35)",
    gradient: "linear-gradient(135deg, #6C63FF, #00E5FF)",
  },
  {
    id: "hakimi-establishment-website",
    title: "Hakimi Establishment Website",
    shortDesc: "Responsive business website with modern UI, smooth animations, and clean layout architecture.",
    longDesc:
      "A fully responsive business website built for Hakimi Establishment. The site features a polished hero section, service cards, a contact form, and a mobile-first layout. Special attention was paid to performance and accessibility — images are lazily loaded and all interactive elements have clear focus states. Framer Motion drives all transitions, making the site feel alive without heavy JavaScript bundles.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    highlights: [
      "Designed and implemented a responsive layout covering mobile, tablet, and desktop breakpoints",
      "Built reusable component library (cards, buttons, sections) following DRY principles",
      "Implemented smooth page and scroll-linked animations with Framer Motion",
      "Optimized Lighthouse score — fast load time on mobile networks",
      "Clean component hierarchy making future content updates straightforward",
    ],
    github: "https://github.com/ShreyashLondhe31",
    demo: undefined,
    accentColor: "#FF2D78",
    accentGlow: "rgba(255,45,120,0.35)",
    gradient: "linear-gradient(135deg, #FF2D78, #FF8C42)",
  },
];

export default projects;
