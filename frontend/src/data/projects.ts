export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stack: string[];
  highlights: string[];
  github?: string;
  demo?: string;
  accentColor: string; /* Tailwind/CSS color string */
  accentGlow: string; /* rgba glow string */
  gradient: string; /* CSS gradient for card border + hero */
}

const projects: Project[] = [
  {
    id: "ai-portfolio-assistant",
    title: "AI Portfolio Assistant",
    shortDesc:
      "Full-stack portfolio with a resume-aware AI chat powered by FastAPI & GroqCloud.",
    longDesc:
      "A production-ready portfolio website with a built-in AI chatbot that answers recruiter questions about Shreyash's background, skills, and projects. The backend runs on FastAPI with SQLite for message persistence and uses GroqCloud's LLM API (via OpenRouter) with a structured resume context injected into every prompt, ensuring accurate and relevant responses. The frontend is a React + TypeScript SPA with smooth animations and a floating chat widget.",
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "Python",
      "GroqCloud",
      "OpenRouter",
      "SQLite",
      "Tailwind CSS",
    ],
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
    shortDesc:
      "Performance-optimised React e-commerce frontend with three-tier lazy loading, Intersection Observer-driven API calls, and a 66% faster initial load.",
    longDesc:
      "A production-ready e-commerce frontend built for Hakimi Establishment. The architecture centres on three independent layers of lazy loading: React.lazy code splitting so pages are bundled separately and only downloaded on navigation; a custom useIntersectionTrigger hook that defers the products API call until the Best Sellers section enters the viewport, cutting initial API calls from 3 to 2 and initial data transfer from 150 KB to 50 KB; and a LazyImage component backed by useLazyLoad for media visibility detection so images are never fetched off-screen. On page load only the categories and brands endpoints fire, making the page interactive at 0.6 seconds versus 2 seconds before. When the user scrolls to the product section the Intersection Observer fires with a 100 px preload buffer, shows five animated ProductSkeleton placeholder cards, fetches the product data, and then animates the real cards in with a slideUp effect via AnimateOnScroll. A two-flag state pattern — loadingProducts and productsLoaded — prevents skeleton flicker and eliminates redundant re-fetches on scroll. The cart is managed globally with Zustand, a WebSocket hook useAdminSocket keeps admin views in sync with live order updates, and the layout is fully responsive across 375 px mobile through 1920 px desktop. Dead code was identified and removed (LazyVideo.jsx, AdminNotifications.jsx) leaving a clean, auditable codebase with comprehensive inline documentation.",
    stack: [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Zustand",
      "Axios",
      "Intersection Observer API",
      "WebSockets",
      "Framer Motion",
    ],
    highlights: [
      "Three-tier lazy loading: code splitting (React.lazy) + API lazy loading (useIntersectionTrigger) + media lazy loading (LazyImage + useLazyLoad)",
      "Custom useIntersectionTrigger hook defers the products API call until scroll — initial load drops from 1.5s to 0.5s (−66%) and data transfer from 150 KB to 50 KB (−67%)",
      "ProductSkeleton with CSS pulse animation renders 5 placeholder cards during fetch — no layout shift and no JS animation overhead",
      "Two-flag state pattern (loadingProducts / productsLoaded) prevents skeleton flicker and guarantees the products endpoint is called exactly once",
      "Products animate in with staggered slideUp via AnimateOnScroll (delay = index % 5 × 50 ms) after data arrives",
      "Zustand cart state shared globally; useAdminSocket WebSocket hook keeps admin views live without polling",
      "Fully responsive grid: 2-column at 375 px, 3-column at 768 px, 5-column at 1920 px — verified across breakpoints",
      "Dead code audit removed LazyVideo.jsx and AdminNotifications.jsx (~65 lines), leaving every remaining file active and used",
    ],
    github: "https://github.com/ShreyashLondhe31",
    demo: undefined,
    accentColor: "#FF2D78",
    accentGlow: "rgba(255,45,120,0.35)",
    gradient: "linear-gradient(135deg, #FF2D78, #FF8C42)",
  },
  {
    id: "aurastream",
    title: "AuraStream",
    shortDesc:
      "Netflix-inspired MERN streaming platform with multi-profile JWT auth, TMDB content, Cloudinary image uploads, and per-profile watch history.",
    longDesc:
      "AuraStream is a production-grade MERN streaming application modelled after Netflix. Users sign up, receive a JWT session cookie, and can create up to five independent profiles — each with its own search history, continue-watching list, and avatar image stored on Cloudinary. Every protected route is guarded by a custom JWT middleware that decodes both the userId and the active profileId from a single cookie, automatically scoping all data to the correct profile without extra round-trips. Content (movies, TV shows, trailers, similar titles, categories) is fetched on-demand from the TMDB API through a shared service layer, keeping credentials server-side and providing a clean abstraction over third-party calls. Watch progress is tracked per profile with a dedicated continueWatching collection that stores current time, season and episode for TV shows, total duration, and last-watched timestamp — enabling resume-from-where-you-left-off across sessions. The Express 5 backend is fully modular: separate route files, controllers, models, middleware, and a unified token utility. File uploads go through Multer (memory storage) before being streamed to Cloudinary, so no disk I/O touches the server.",
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Cloudinary",
      "Multer",
      "TMDB API",
      "bcryptjs",
      "REST API",
    ],
    highlights: [
      "Multi-profile system: up to 5 profiles per account, each fully isolated by profileId in every database query",
      "Single JWT cookie carries both userId and profileId — profile switch regenerates the token instantly via a dedicated /switchprofile endpoint",
      "TMDB integration: trending, trailers, details, similar titles, and category browsing via a shared fetchFromTMDB service layer",
      "Per-profile continue-watching with real-time progress tracking — currentTime, season, episode, and totalDuration persisted in MongoDB",
      "Cloudinary image pipeline: Multer memory-buffers the upload, converts to base64 data URI, then streams directly to Cloudinary — zero disk I/O on the server",
      "Modular Express 5 architecture: routes → controllers → models → middleware, with zero business logic in route files",
      "Per-profile search history with atomic $push / $pull on the User document and an indexed profileId for fast per-profile filtering",
      "bcryptjs password hashing (salt rounds = 10) and HTTP-only, SameSite-strict, secure-in-prod JWT cookies",
    ],
    github: "https://github.com/ShreyashLondhe31/AuraStream",
    demo: undefined,
    accentColor: "#E50914",
    accentGlow: "rgba(229,9,20,0.35)",
    gradient: "linear-gradient(135deg, #E50914, #FF6B35)",
  },
  {
    id: "osiris-level-editor",
    title: "Osiris Level Editor",
    shortDesc:
      "Team-built isometric tile-based level editor in C++ and SDL3 — 6-layer system, per-tile scaling, collider editor, and CSV save/load pipeline.",
    longDesc:
      "Osiris Level Editor is a feature-complete, isometric tile-based level editor built in C++ using SDL3, SDL3_ttf, and SDL3_image. The editor implements a full isometric projection system with bidirectional cartesian-to-screen and screen-to-cartesian coordinate conversion, enabling accurate tile placement on a diamond-grid map of configurable size (5×5 up to 500×500). The scene is organised into six independent named layers — Terrain, Player, Furniture, Enemy, NPCs, and Portal — each with individual visibility toggling and alpha blending so designers can isolate any layer without losing context. Every tile stores both a tileID and a per-tile scale factor, and a global brush scale can be adjusted in real time using keyboard shortcuts, allowing assets of different visual sizes to coexist on the same grid. The collider editor overlays a pixel-accurate bounding box on a zoomed tile preview and lets designers drag-click to set per-edge offsets (top, bottom, left, right), with all collider data persisted to a dedicated CSV file. The save/load pipeline serialises each layer's tile IDs and scale values into separate CSV files per level, along with a metadata CSV recording zoom level, camera offset, grid size, active layer, and level name — making the output directly consumable by a game engine. The camera supports smooth inertia-based snapping to the nearest tile on demand, right-click pan, and scroll-wheel zoom between 0.5× and 3×. Dynamic texture loading scans the asset directory at startup and tolerates gaps in tile numbering, keeping the editor decoupled from a fixed tile manifest.",
    stack: [
      "C++",
      "SDL3",
      "SDL3_ttf",
      "SDL3_image",
      "Isometric Rendering",
      "CSV I/O",
      "CMake",
    ],
    highlights: [
      "Isometric coordinate engine: bidirectional cartesian↔screen projection with zoom and pan — right-click drag pans the camera, scroll wheel zooms 0.5×–3×",
      "6-layer system (Terrain, Player, Furniture, Enemy, NPCs, Portal) with per-layer visibility toggling and alpha compositing for non-active layers",
      "Per-tile scale: every placed tile stores an independent scale factor; a global brush scale is adjusted live with [ / ] hotkeys and applied on paint or drag",
      "Pixel-accurate collider editor: click-to-set per-edge offsets (T/B/L/R) rendered as a red bounding box overlay on a fit-scaled tile preview",
      "CSV save/load pipeline: tile IDs, scale values, collider data, and level metadata (zoom, offset, grid size, layer, name) all round-trip through flat CSV files",
      "Dynamic tile loader: scans the asset directory at startup, tolerates gaps in tile numbering (up to 20 consecutive misses), and auto-registers new tiles without config changes",
      "Smooth tile-snap camera: pressing Space lerps the viewport to the nearest isometric tile center using a configurable SNAP_SPEED interpolation loop",
      "Multi-level workflow: Ctrl+N adds a level, Ctrl+D deletes the current one, arrow keys switch between levels — all levels save together on Ctrl+S",
    ],
    github: "https://github.com/RohitAkulwar380/level-editor-SDL3-osiris",
    demo: undefined,
    accentColor: "#F0A500",
    accentGlow: "rgba(240,165,0,0.35)",
    gradient: "linear-gradient(135deg, #F0A500, #E05C00)",
  },
];

export default projects;
