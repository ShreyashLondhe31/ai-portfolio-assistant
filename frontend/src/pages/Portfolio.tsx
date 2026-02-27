import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChatWidget from "../components/ChatWidget";
import Navbar from "../components/Navbar";
import TopIntroBar from "../components/TopIntroBar";
import projects from "../data/projects";
import { ExternalLink, Github, ArrowRight, GitBranch, Code2, Cpu, Database, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Interactive Hex/Code Grid Background ──────────────────────────────────────
function useHexGridCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let w = canvas.clientWidth;
        let h = canvas.clientHeight;
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const fontSize = 16;
        let cols = Math.floor(w / fontSize) + 1;
        let rows = Math.floor(h / fontSize) + 1;

        const charset = "0123456789ABCDEF<>{}[]/\\=-+*".split("");

        let chars: string[][] = [];
        let timers: number[][] = [];

        const initGrid = () => {
            cols = Math.floor(w / fontSize) + 1;
            rows = Math.floor(h / fontSize) + 1;
            chars = [];
            timers = [];
            for (let i = 0; i < cols; i++) {
                chars[i] = [];
                timers[i] = [];
                for (let j = 0; j < rows; j++) {
                    chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                    timers[i][j] = 0;
                }
            }
        };
        initGrid();

        const mouse = { x: -999, y: -999 };
        const onMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        window.addEventListener("mousemove", onMouse);

        const onResize = () => {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
            initGrid();
        };
        window.addEventListener("resize", onResize);

        let frame: number;
        const animate = () => {
            frame = requestAnimationFrame(animate);

            // Background fill
            ctx.fillStyle = "#010409"; // var(--bg2)
            ctx.fillRect(0, 0, w, h);

            ctx.font = `${fontSize * 0.8}px "JetBrains Mono", monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * fontSize + fontSize / 2;
                    const cy = j * fontSize + fontSize / 2;

                    const dx = cx - mouse.x;
                    const dy = cy - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Mouse interaction
                    if (dist < 60) {
                        timers[i][j] = 1.0;
                        if (Math.random() < 0.15) {
                            chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                        }
                    } else {
                        timers[i][j] *= 0.94; // Fade out
                    }

                    // Random ambient flipping
                    if (Math.random() < 0.0005) {
                        chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                        timers[i][j] = Math.max(timers[i][j], 0.3);
                    }

                    const t = timers[i][j];
                    if (t > 0.01) {
                        // Electric blue transition
                        const r = Math.floor(47 * t + 22 * (1 - t));
                        const g = Math.floor(129 * t + 27 * (1 - t));
                        const b = Math.floor(247 * t + 34 * (1 - t));
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.15 + t * 0.85})`;
                    } else {
                        ctx.fillStyle = `rgba(48, 54, 61, 0.15)`; // Dim gray
                    }

                    ctx.fillText(chars[i][j], cx, cy);
                }
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
        };
    }, [canvasRef]);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const skills = [
    { label: "React / TypeScript", pct: 88 },
    { label: "Python / FastAPI", pct: 82 },
    { label: "AI / LLM Integration", pct: 75 },
    { label: "Node.js / REST APIs", pct: 78 },
    { label: "SQL / SQLite / DB Design", pct: 70 },
];

const stackCategories = [
    { icon: <Code2 size={15} />, title: "Frontend", body: "React · TypeScript · TailwindCSS" },
    { icon: <Database size={15} />, title: "Backend", body: "FastAPI · Node.js · SQLite · REST" },
    { icon: <Cpu size={15} />, title: "AI / LLM", body: "GroqCloud · OpenRouter · RAG" },
    { icon: <Layers size={15} />, title: "Infra / Tools", body: "Vite · Git · Render · Linux" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Portfolio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    useHexGridCanvas(canvasRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero — clean slide up, no stagger on individual letters
            gsap.from(".hero-line", {
                y: 28, opacity: 0, duration: 0.7,
                stagger: 0.12, ease: "power3.out", delay: 0.2,
            });

            // About
            gsap.from(".about-card", {
                scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
                y: 32, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power2.out",
            });

            // Skill bars
            document.querySelectorAll<HTMLElement>(".skill-fill").forEach((bar) => {
                gsap.to(bar, {
                    scrollTrigger: { trigger: skillsRef.current, start: "top 80%" },
                    width: `${bar.dataset.pct}%`,
                    duration: 1.1, ease: "power2.out",
                });
            });

            // Project cards
            gsap.from(".project-card", {
                scrollTrigger: { trigger: projectsRef.current, start: "top 80%" },
                y: 40, opacity: 0, duration: 0.6, stagger: 0.14, ease: "power2.out",
            });

            // Contact
            gsap.from(".contact-inner", {
                scrollTrigger: { trigger: contactRef.current, start: "top 85%" },
                y: 24, opacity: 0, duration: 0.55, ease: "power2.out",
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>
            <Navbar />

            {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
            <section
                className="relative min-h-[100vh] flex items-center overflow-hidden dot-grid"
                style={{ background: "var(--bg2)" }}
            >
                {/* Network graph canvas */}
                <canvas ref={canvasRef} id="hero-canvas" />

                {/* Single subtle radial glow — blue only */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        inset: 0,
                        background: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(47,129,247,0.07), transparent 70%)",
                    }}
                />

                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10">
                    <TopIntroBar />

                    <div className="mt-14 grid md:grid-cols-2 gap-16 items-start">

                        {/* Left */}
                        <div>
                            {/* Terminal prompt */}
                            <p
                                className="hero-line text-xs mb-4"
                                style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}
                            >
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--green)" }}>C:\Users\shreyash</span>
                                <span style={{ color: "var(--text-3)" }}>{'> whoami'}</span>
                            </p>

                            <h1
                                className="hero-line text-5xl sm:text-6xl font-extrabold leading-none mb-2"
                                style={{ letterSpacing: "-0.02em" }}
                            >
                                Shreyash
                            </h1>
                            <h1
                                className="hero-line text-5xl sm:text-6xl font-extrabold leading-none mb-5"
                                style={{ color: "var(--accent)", letterSpacing: "-0.02em" }}
                            >
                                Londhe
                            </h1>

                            <p
                                className="hero-line text-sm mb-1"
                                style={{ fontFamily: "var(--mono)", color: "var(--green)" }}
                            >
                                {">"} Full Stack Developer &amp; AI Engineer
                            </p>
                            <p
                                className="hero-line text-base max-w-md leading-relaxed mb-8"
                                style={{ color: "var(--text-2)" }}
                            >
                                MCA student building modern web apps with clean backend
                                architecture and real-world AI integration.
                            </p>

                            {/* Tech tokens */}
                            <div className="hero-line flex flex-wrap gap-2 mb-8">
                                {["React", "TypeScript", "Python", "FastAPI", "Node.js", "SQL", "Git"].map((t) => (
                                    <span key={t} className="token">{t}</span>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="hero-line flex flex-wrap gap-3">
                                <button
                                    className="btn-primary flex items-center gap-2"
                                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    <GitBranch size={15} /> View Projects
                                </button>
                                <button
                                    className="btn-ghost"
                                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    Contact Me
                                </button>
                            </div>
                        </div>

                        {/* Right — code card */}
                        <div
                            className="hero-line hidden md:block glass rounded-lg overflow-hidden"
                            style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}
                        >
                            {/* Editor title bar — Windows style */}
                            <div
                                className="flex items-center justify-between px-3 py-2"
                                style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
                            >
                                {/* Left: icon + filename */}
                                <div className="flex items-center gap-2">
                                    <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>📄</span>
                                    <span className="text-xs" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>profile.ts — Code Editor</span>
                                </div>
                                {/* Right: Windows ─ □ × */}
                                <div className="flex items-center" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
                                    <span
                                        className="px-3 py-1 hover:bg-[#30363D] cursor-pointer select-none"
                                        style={{ color: "var(--text-3)" }}
                                        title="Minimize"
                                    >─</span>
                                    <span
                                        className="px-3 py-1 hover:bg-[#30363D] cursor-pointer select-none"
                                        style={{ color: "var(--text-3)" }}
                                        title="Maximize"
                                    >□</span>
                                    <span
                                        className="px-3 py-1 hover:bg-[#F85149] hover:text-white cursor-pointer select-none rounded-tr-lg"
                                        style={{ color: "var(--text-3)" }}
                                        title="Close"
                                    >✕</span>
                                </div>
                            </div>

                            {/* Code content */}
                            <div className="p-6 space-y-1 text-xs leading-relaxed">
                                <p><span style={{ color: "var(--purple)" }}>const</span>{" "}
                                    <span style={{ color: "var(--accent)" }}>developer</span>
                                    <span style={{ color: "var(--text-2)" }}>{" = {"}</span></p>

                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>name</span>
                                    <span style={{ color: "var(--text-2)" }}>: </span>
                                    <span style={{ color: "var(--green)" }}>"Shreyash Londhe"</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>role</span>
                                    <span style={{ color: "var(--text-2)" }}>: </span>
                                    <span style={{ color: "var(--green)" }}>"Full Stack Dev"</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>education</span>
                                    <span style={{ color: "var(--text-2)" }}>: </span>
                                    <span style={{ color: "var(--green)" }}>"MCA"</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>location</span>
                                    <span style={{ color: "var(--text-2)" }}>: </span>
                                    <span style={{ color: "var(--green)" }}>"Mumbai / Pune"</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>available</span>
                                    <span style={{ color: "var(--text-2)" }}>: </span>
                                    <span style={{ color: "var(--purple)" }}>true</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--orange)" }}>stack</span>
                                    <span style={{ color: "var(--text-2)" }}>: [</span>
                                </p>
                                <p style={{ paddingLeft: "3rem" }}>
                                    <span style={{ color: "var(--green)" }}>"React"</span>
                                    <span style={{ color: "var(--text-2)" }}>, </span>
                                    <span style={{ color: "var(--green)" }}>"FastAPI"</span>
                                    <span style={{ color: "var(--text-2)" }}>, </span>
                                    <span style={{ color: "var(--green)" }}>"Python"</span>
                                    <span style={{ color: "var(--text-2)" }}>,</span>
                                </p>
                                <p style={{ paddingLeft: "3rem" }}>
                                    <span style={{ color: "var(--green)" }}>"TypeScript"</span>
                                    <span style={{ color: "var(--text-2)" }}>, </span>
                                    <span style={{ color: "var(--green)" }}>"SQL"</span>
                                    <span style={{ color: "var(--text-2)" }}>, </span>
                                    <span style={{ color: "var(--green)" }}>"AI/LLM"</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--text-2)" }}>],</span>
                                </p>
                                <p><span style={{ color: "var(--text-2)" }}>{"}"}</span>
                                    <span style={{ color: "var(--text-2)" }}>;</span></p>

                                <br />
                                <p style={{ color: "var(--text-3)" }}>{"// Currently building:"}</p>
                                <p>
                                    <span style={{ color: "var(--purple)" }}>console</span>
                                    <span style={{ color: "var(--text-2)" }}>.</span>
                                    <span style={{ color: "var(--accent)" }}>log</span>
                                    <span style={{ color: "var(--text-2)" }}>(</span>
                                    <span style={{ color: "var(--green)" }}>"AI Portfolio Assistant"</span>
                                    <span style={{ color: "var(--text-2)" }}>);</span>
                                </p>
                                <p>
                                    <span style={{ color: "var(--text-2)" }}>&gt; </span>
                                    <span className="cursor" style={{ color: "var(--accent)" }} />
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div
                    className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
                />
            </section>

            {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
            <section id="about" ref={aboutRef as any} className="py-20 px-6" style={{ background: "var(--bg)" }}>
                <div className="max-w-6xl mx-auto">

                    {/* Section header — code comment style */}
                    <p className="code-comment mb-1">{"// 01. about"}</p>
                    <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text)" }}>About Me</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">

                        {/* Bio */}
                        <div
                            className="about-card glass rounded-lg p-7"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>
                                <span className="code-comment mr-2">{"/**"}</span>
                                Who I am
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                                I'm an MCA student passionate about building full-stack and AI-powered
                                applications that solve real problems. I enjoy clean backend architecture,
                                modern UI, and integrating AI into practical systems.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-5">
                                {["Problem Solver", "Fast Learner", "Team Player", "Detail Oriented"].map(t => (
                                    <span key={t} className="token token-green">{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* Stack grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {stackCategories.map(({ icon, title, body }) => (
                                <div
                                    key={title}
                                    className="about-card glass rounded-lg p-4 hover:border-[var(--accent)] transition-colors duration-200"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
                                        {icon}
                                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--mono)" }}>{title}</span>
                                    </div>
                                    <p className="text-xs" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill bars */}
                    <div
                        ref={skillsRef}
                        className="about-card glass rounded-lg p-7"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <p className="code-comment mb-1">{"// proficiency"}</p>
                        <h3 className="text-base font-semibold mb-6" style={{ color: "var(--text)" }}>Skills</h3>
                        <div className="space-y-4">
                            {skills.map(({ label, pct }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span style={{ fontFamily: "var(--mono)", color: "var(--text)" }}>{label}</span>
                                        <span style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>{pct}%</span>
                                    </div>
                                    <div className="skill-bar">
                                        <div className="skill-fill" data-pct={pct} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ══════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════ */}
            <section
                id="projects"
                ref={projectsRef as any}
                className="py-20 px-6 dot-grid"
                style={{ background: "var(--bg2)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <p className="code-comment mb-1">{"// 02. projects"}</p>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                        Featured Projects
                    </h2>
                    <p className="text-sm mb-10" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                        {"const projects = ["} <span style={{ color: "var(--accent)" }}>{projects.length}</span>{" items ]"}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, idx) => (
                            <div
                                key={project.id}
                                className="project-card glass rounded-lg p-6 flex flex-col hover:border-[color:var(--accent)] transition-colors duration-200"
                                style={{ borderColor: "var(--border)" }}
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="text-xs"
                                        style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}
                                    >
                                        {String(idx + 1).padStart(2, "0")}.
                                    </span>
                                    <span className="token">{project.stack[0]}</span>
                                </div>

                                <h3
                                    className="text-lg font-bold mb-2"
                                    style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
                                >
                                    {project.title}
                                </h3>
                                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>
                                    {project.shortDesc}
                                </p>

                                <ul className="space-y-1 text-xs mb-5 flex-1" style={{ color: "var(--text-2)" }}>
                                    {project.highlights.slice(0, 3).map((h, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span style={{ color: "var(--accent)", flexShrink: 0 }}>+</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                {/* Stack tokens */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {project.stack.slice(0, 5).map(t => (
                                        <span key={t} className="token">{t}</span>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        className="btn-primary flex items-center gap-2 text-xs px-4 py-2"
                                    >
                                        View Details <ArrowRight size={13} />
                                    </button>
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ghost flex items-center gap-2 text-xs px-4 py-2"
                                        >
                                            <Github size={13} /> GitHub
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ghost flex items-center gap-2 text-xs px-4 py-2"
                                        >
                                            <ExternalLink size={13} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ══════════════════════════════════════
          CONTACT
      ══════════════════════════════════════ */}
            <section
                id="contact"
                ref={contactRef as any}
                className="py-20 px-6"
                style={{ background: "var(--bg)" }}
            >
                <div className="max-w-3xl mx-auto">
                    <div className="contact-inner glass rounded-lg p-10" style={{ borderColor: "var(--border)" }}>

                        <p className="code-comment mb-1">{"// 03. contact"}</p>
                        <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>
                            Let's Work Together
                        </h2>
                        <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>
                            I'm actively looking for internship opportunities. If you think I'd be a good fit, reach out.
                        </p>

                        {/* Terminal-style contact lines — Windows PowerShell */}
                        <div
                            className="rounded-md p-5 mb-8 text-xs space-y-2"
                            style={{ background: "var(--bg2)", border: "1px solid var(--border)", fontFamily: "var(--mono)" }}
                        >
                            <p>
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--text-3)" }}>{'C:\Users\shreyash> '}</span>
                                <span style={{ color: "var(--green)" }}>Start-Process</span>
                                <span style={{ color: "var(--text-2)" }}>{" mailto:shreyash.londhe@gmail.com"}</span>
                            </p>
                            <p>
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--text-3)" }}>{'C:\Users\shreyash> '}</span>
                                <span style={{ color: "var(--green)" }}>Start-Process</span>
                                <span style={{ color: "var(--text-2)" }}>{" linkedin.com/in/shreyashlondhe"}</span>
                            </p>
                            <p>
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--text-3)" }}>{'C:\Users\shreyash> '}</span>
                                <span style={{ color: "var(--green)" }}>Start-Process</span>
                                <span style={{ color: "var(--text-2)" }}>{" wa.me/+919987603016"}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="mailto:shreyash.londhe@gmail.com"
                                className="btn-primary text-center"
                            >
                                Send Email
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shreyashlondhe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-center"
                            >
                                LinkedIn Profile
                            </a>
                            <a
                                href="https://wa.me/+919987603016"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-center"
                                style={{ color: "var(--green)", borderColor: "rgba(63,185,80,0.35)" }}
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="py-5 text-center text-xs"
                style={{
                    fontFamily: "var(--mono)",
                    color: "var(--text-3)",
                    borderTop: "1px solid var(--border)",
                    background: "var(--bg2)",
                }}
            >
                <span style={{ color: "var(--text-3)" }}>{"// "}</span>
                shreyash londhe © {new Date().getFullYear()}
                <span style={{ color: "var(--accent)", marginLeft: 8 }}>·</span>
                <span style={{ color: "var(--text-3)", marginLeft: 8 }}>built with React, TypeScript, GSAP &amp; Three.js</span>
            </footer>

            <ChatWidget />
        </div>
    );
}
