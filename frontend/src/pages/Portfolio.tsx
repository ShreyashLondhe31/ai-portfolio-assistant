import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChatWidget from "../components/ChatWidget";
import type { ChatWidgetHandle } from "../components/ChatWidget";
import Navbar from "../components/Navbar";
import TopIntroBar from "../components/TopIntroBar";
import projects from "../data/projects";
import {
    ExternalLink, Github, ArrowRight,
    Code2, Cpu, Database, Layers,
    Zap, ShieldCheck, Eye, FileCode2, Lock,
    Server, Globe, MessageSquare
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Interactive Code Grid Background ──────────────────────────────────────────
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

        // ── Detect touch / mobile ─────────────────────────────────────────────
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        // ── Desktop: mouse follow ─────────────────────────────────────────────
        const mouse = { x: -999, y: -999 };
        const onMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        if (!isTouch) window.addEventListener("mousemove", onMouse, { passive: true });

        // ── Mobile: horizontal scan-line every 4s ─────────────────────────────
        let scanX = -999;
        let scanActive = false;
        const SCAN_DURATION = 1400;     // ms — beam crosses full canvas width
        const SCAN_INTERVAL = 4000;     // ms — pause between scans
        const BEAM_HALF = fontSize * 2.5; // half-width of the glow cone
        let scanStart = 0;

        const startScan = () => {
            scanActive = true;
            scanStart = performance.now();
            scanX = 0;
        };

        let scanTimer: ReturnType<typeof setTimeout> | null = null;
        let scanLoop: ReturnType<typeof setInterval> | null = null;
        if (isTouch) {
            scanTimer = setTimeout(() => {
                startScan();
                scanLoop = setInterval(startScan, SCAN_INTERVAL);
            }, 800);
        }

        const onResize = () => {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
            initGrid();
        };
        window.addEventListener("resize", onResize, { passive: true });

        let frame: number;
        const animate = () => {
            frame = requestAnimationFrame(animate);
            ctx.fillStyle = "#010409";
            ctx.fillRect(0, 0, w, h);
            ctx.font = `${fontSize * 0.8}px "JetBrains Mono", monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Advance scan beam on mobile
            if (isTouch && scanActive) {
                const elapsed = performance.now() - scanStart;
                scanX = (elapsed / SCAN_DURATION) * w;
                if (scanX > w + BEAM_HALF) {
                    scanActive = false;
                    scanX = -999;
                }
            }

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * fontSize + fontSize / 2;
                    const cy = j * fontSize + fontSize / 2;

                    if (isTouch) {
                        // Mobile: light up chars within the beam cone
                        if (scanActive) {
                            const dx = Math.abs(cx - scanX);
                            if (dx < BEAM_HALF) {
                                const intensity = 1 - dx / BEAM_HALF;
                                timers[i][j] = Math.max(timers[i][j], intensity);
                                if (Math.random() < 0.35 * intensity)
                                    chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                            }
                        }
                        timers[i][j] *= 0.97; // slower decay on mobile for trailing glow
                    } else {
                        // Desktop: mouse circle highlight
                        const dx = cx - mouse.x;
                        const dy = cy - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 60) {
                            timers[i][j] = 1.0;
                            if (Math.random() < 0.15)
                                chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                        } else {
                            timers[i][j] *= 0.94;
                        }
                    }

                    // Ambient random flicker
                    if (Math.random() < 0.0005) {
                        chars[i][j] = charset[Math.floor(Math.random() * charset.length)];
                        timers[i][j] = Math.max(timers[i][j], 0.3);
                    }

                    const t = timers[i][j];
                    if (t > 0.01) {
                        const r = Math.floor(99 * t + 22 * (1 - t));
                        const g = Math.floor(102 * t + 27 * (1 - t));
                        const b = Math.floor(241 * t + 34 * (1 - t));
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.12 + t * 0.75})`;
                    } else {
                        ctx.fillStyle = `rgba(48, 54, 61, 0.12)`;
                    }
                    ctx.fillText(chars[i][j], cx, cy);
                }
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(frame);
            if (!isTouch) window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            if (scanTimer) clearTimeout(scanTimer);
            if (scanLoop) clearInterval(scanLoop);
        };
    }, [canvasRef]);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const skills = [
    { label: "React / TypeScript", pct: 88 },
    { label: "Python / FastAPI", pct: 82 },
    { label: "AI / LLM Integration", pct: 75 },
    { label: "Node.js / REST APIs", pct: 78 },
    { label: "SQL / DB Design", pct: 70 },
];

const stackCategories = [
    { icon: <Code2 size={14} />, title: "Frontend", body: "React · TypeScript · Vite · Framer Motion" },
    { icon: <Database size={14} />, title: "Backend", body: "FastAPI · Node.js · SQLite · REST" },
    { icon: <Cpu size={14} />, title: "AI / LLM", body: "GroqCloud · OpenRouter · RAG · Prompting" },
    { icon: <Layers size={14} />, title: "Infra", body: "Render · Git · Linux · Vite" },
];

const principles = [
    {
        icon: <Zap size={15} />,
        label: "fail_fast_recover",
        title: "Fail Fast, Recover Gracefully",
        desc: "Surface errors at the boundary, not deep in the call stack. Validate inputs early, return structured errors, and never let exceptions leak silently.",
    },
    {
        icon: <Eye size={15} />,
        label: "observability_first",
        title: "Observability First",
        desc: "If you can't measure it, you can't improve it. Every service should emit structured logs, clear status signals, and predictable latency profiles.",
    },
    {
        icon: <FileCode2 size={15} />,
        label: "schema_before_code",
        title: "Schema Before Code",
        desc: "Define data contracts — API schemas, DB schemas, type interfaces — before writing logic. The shape of data is the shape of the system.",
    },
    {
        icon: <Lock size={15} />,
        label: "security_by_default",
        title: "Security by Default",
        desc: "API keys belong on the server. Context injection happens server-side. CORS is explicit, not permissive. Security is a design constraint, not an afterthought.",
    },
    {
        icon: <ShieldCheck size={15} />,
        label: "type_safety_endtoend",
        title: "Type Safety End-to-End",
        desc: "TypeScript on the client, Pydantic on the server. Shared type contracts across boundaries eliminate entire classes of runtime bugs.",
    },
];

const archLayers = [
    {
        label: "Client",
        sublabel: "React + TypeScript",
        detail: "Vite SPA · Framer Motion · GSAP · TailwindCSS",
        color: "rgba(99,102,241,0.12)",
        border: "rgba(99,102,241,0.30)",
        textColor: "var(--accent)",
    },
    {
        label: "API Layer",
        sublabel: "FastAPI (Python)",
        detail: "Pydantic validation · CORS middleware · /chat endpoint",
        color: "rgba(163,113,247,0.10)",
        border: "rgba(163,113,247,0.28)",
        textColor: "var(--purple)",
    },
    {
        label: "AI Service",
        sublabel: "GroqCloud / OpenRouter",
        detail: "Resume context injected server-side · LLM inference · structured response cleaning",
        color: "rgba(210,153,34,0.10)",
        border: "rgba(210,153,34,0.28)",
        textColor: "var(--orange)",
    },
    {
        label: "Persistence",
        sublabel: "SQLite (dev) → PostgreSQL (prod)",
        detail: "Message persistence · session management · migration path defined",
        color: "rgba(63,185,80,0.08)",
        border: "rgba(63,185,80,0.25)",
        textColor: "var(--green)",
    },
];

const perfMetrics = [
    { label: "context_injection", value: "server-side", desc: "Zero API key / resume data exposed to the client" },
    { label: "response_target", value: "< 300ms p95", desc: "FastAPI endpoint latency goal — excluding LLM inference time" },
    { label: "db_upgrade_path", value: "SQLite → PG", desc: "Structured migration path documented; schema designed for both runtimes" },
    { label: "bundle_strategy", value: "code-split", desc: "Vite code-splitting per route; GSAP / Framer loaded lazily" },
    { label: "scroll_animations", value: "once: true", desc: "ScrollTrigger plays once — no rewind on scroll-up for consistent 60fps" },
    { label: "render_hosting", value: "cold-start aware", desc: "Backend on Render free tier; retry logic built into the frontend fetch" },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function Portfolio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLElement>(null);
    const principlesRef = useRef<HTMLElement>(null);
    const archRef = useRef<HTMLElement>(null);
    const perfRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    const chatRef = useRef<ChatWidgetHandle>(null);
    const codeCardRef = useRef<HTMLDivElement>(null);

    const handleMaximize = () => {
        const card = codeCardRef.current;
        if (!card) { window.open('/resume.pdf', '_blank'); return; }

        // Target: top-right corner where the open_resume() navbar button lives
        const cardRect = card.getBoundingClientRect();
        const targetX = window.innerWidth - cardRect.right + cardRect.width * 0.5;
        const targetY = -(cardRect.top - 12); // 12px = rough navbar center offset

        gsap.timeline()
            .to(card, {
                scale: 0.08,
                x: targetX,
                y: targetY,
                opacity: 0,
                duration: 0.55,
                ease: "power3.in",
            })
            .call(() => {
                window.open('/resume.pdf', '_blank');
                // Reset card state without a visible flash
                gsap.set(card, { scale: 1, x: 0, y: 0, opacity: 0 });
                gsap.to(card, { opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out" });
            });
    };

    useHexGridCanvas(canvasRef);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-line", {
                y: 24, opacity: 0, duration: 0.65,
                stagger: 0.1, ease: "power3.out", delay: 0.2,
            });

            gsap.from(".about-card", {
                scrollTrigger: { trigger: aboutRef.current, start: "top 80%", once: true },
                y: 28, opacity: 0, duration: 0.5, stagger: 0.09, ease: "power2.out",
            });

            document.querySelectorAll<HTMLElement>(".skill-fill").forEach((bar) => {
                gsap.to(bar, {
                    scrollTrigger: { trigger: skillsRef.current, start: "top 80%", once: true },
                    width: `${bar.dataset.pct}%`,
                    duration: 1.1, ease: "power2.out",
                });
            });

            gsap.from(".project-card", {
                scrollTrigger: { trigger: projectsRef.current, start: "top 80%", once: true },
                y: 36, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power2.out",
            });

            gsap.from(".principle-card", {
                scrollTrigger: { trigger: principlesRef.current, start: "top 80%", once: true },
                y: 28, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
            });

            gsap.from(".arch-layer", {
                scrollTrigger: { trigger: archRef.current, start: "top 80%", once: true },
                y: 20, opacity: 0, duration: 0.45, stagger: 0.1, ease: "power2.out",
            });

            gsap.from(".perf-card", {
                scrollTrigger: { trigger: perfRef.current, start: "top 80%", once: true },
                y: 20, opacity: 0, duration: 0.45, stagger: 0.07, ease: "power2.out",
            });

            gsap.from(".contact-inner", {
                scrollTrigger: { trigger: contactRef.current, start: "top 85%", once: true },
                y: 20, opacity: 0, duration: 0.5, ease: "power2.out",
            });
        });

        return () => ctx.revert();
    }, []);

    const handleAskAI = (projectTitle: string) => {
        chatRef.current?.openWithPrompt(
            `Tell me about the ${projectTitle} project — its architecture, core engineering decisions, and how the tech stack was chosen.`
        );
    };

    return (
        <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>
            <Navbar />



            {/* ═══════ HERO ═══════ */}
            <section
                className="relative min-h-[100vh] flex items-center overflow-hidden dot-grid"
                style={{ background: "var(--bg2)" }}
            >
                <canvas ref={canvasRef} id="hero-canvas" />

                <div
                    className="absolute pointer-events-none"
                    style={{
                        inset: 0,
                        background: "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(99,102,241,0.06), transparent 70%)",
                    }}
                />

                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10">
                    <TopIntroBar />

                    <div className="mt-14 grid md:grid-cols-2 gap-16 items-start">

                        {/* Left */}
                        <div>
                            <p
                                className="hero-line text-xs mb-4"
                                style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}
                            >
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--green)" }}>C:\Users\shreyash</span>
                                <span style={{ color: "var(--text-3)" }}>{"> whoami"}</span>
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
                                className="hero-line text-xs mb-1"
                                style={{ fontFamily: "var(--mono)", color: "var(--green)" }}
                            >
                                {">"} Full Stack Developer · AI Engineer
                            </p>
                            <p
                                className="hero-line text-sm max-w-md leading-relaxed mb-8"
                                style={{ color: "var(--text-2)", lineHeight: 1.7 }}
                            >
                                Building production-grade systems at the intersection of full-stack engineering
                                and applied AI. Backend depth, architectural thinking, and a strong bias for
                                clean, maintainable systems.
                            </p>

                            <div className="hero-line flex flex-wrap gap-2 mb-8">
                                {["React", "TypeScript", "Python", "FastAPI", "LLM Integration", "SQL", "REST APIs"].map((t) => (
                                    <span key={t} className="token">{t}</span>
                                ))}
                            </div>

                            <div className="hero-line flex flex-wrap gap-3">
                                <button
                                    className="btn-ghost flex items-center gap-2 text-sm"
                                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    View Projects <ArrowRight size={14} />
                                </button>
                                <button
                                    className="btn-fn"
                                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    init_contact()
                                </button>
                            </div>
                        </div>

                        {/* Right — code card */}
                        <div
                            ref={codeCardRef}
                            className="hero-line hidden md:block glass rounded-lg overflow-hidden"
                            style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}
                        >
                            {/* Editor title bar */}
                            <div
                                className="flex items-center justify-between px-3 py-2"
                                style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>&gt;_</span>
                                    <span className="text-xs" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>profile.ts — Code Editor</span>
                                </div>
                                <div className="flex items-center" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
                                    <span
                                        className="px-3 py-1 hover:bg-[#30363D] cursor-pointer select-none transition-colors"
                                        style={{ color: "var(--text-3)" }}
                                        title="Minimize"
                                    >─</span>
                                    <span
                                        className="px-3 py-1 hover:bg-[#30363D] cursor-pointer select-none transition-colors"
                                        style={{ color: "var(--text-3)" }}
                                        title="Maximize — Open Resume"
                                        onClick={handleMaximize}
                                    >□</span>
                                    <span
                                        className="px-3 py-1 hover:bg-[#F85149] hover:text-white cursor-pointer select-none transition-colors rounded-tr-lg"
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

                                {[
                                    ["name", `"Shreyash Londhe"`, false],
                                    ["role", `"Full Stack Dev · AI Engineer"`, false],
                                    ["education", `"MCA"`, false],
                                    ["location", `"Mumbai / Pune"`, false],
                                    ["available", "true", true],
                                ].map(([key, val, isBool]) => (
                                    <p key={key as string} style={{ paddingLeft: "1.5rem" }}>
                                        <span style={{ color: "var(--orange)" }}>{key}</span>
                                        <span style={{ color: "var(--text-2)" }}>: </span>
                                        <span style={{ color: isBool ? "var(--purple)" : "var(--green)" }}>{val}</span>
                                        <span style={{ color: "var(--text-2)" }}>,</span>
                                    </p>
                                ))}

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
                                    <span style={{ color: "var(--green)" }}>"LLM Integration"</span>
                                </p>
                                <p style={{ paddingLeft: "1.5rem" }}>
                                    <span style={{ color: "var(--text-2)" }}>],</span>
                                </p>
                                <p><span style={{ color: "var(--text-2)" }}>{"}"}</span>
                                    <span style={{ color: "var(--text-2)" }}>;</span></p>

                                <br />
                                <p style={{ color: "var(--text-3)" }}>{`// click □ above to view full resume`}</p>
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

            {/* ═══════ ABOUT ═══════ */}
            <section id="about" ref={aboutRef as any} className="py-20 px-6" style={{ background: "var(--bg)" }}>
                <div className="max-w-6xl mx-auto">

                    <p className="code-comment mb-1">{"// 01. about"}</p>
                    <h2 className="text-2xl font-bold mb-10" style={{ color: "var(--text)" }}>About</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <div className="about-card glass rounded-lg p-7" style={{ borderColor: "var(--border)" }}>
                            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>
                                <span className="code-comment mr-2">{"/**"}</span>
                                developer.bio
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
                                MCA student building production-grade full-stack and AI-powered systems.
                                Focus areas: clean backend architecture, type-safe APIs, and applied LLM integration.
                                I care about systems that are observable, maintainable, and fast to iterate on.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-5">
                                {["Systems Thinking", "API Design", "Production Mindset", "Clean Architecture"].map(t => (
                                    <span key={t} className="token token-muted">{t}</span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {stackCategories.map(({ icon, title, body }) => (
                                <div
                                    key={title}
                                    className="about-card glass rounded-lg p-4 hover:border-[color:var(--accent)] transition-colors duration-200"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--accent)" }}>
                                        {icon}
                                        <span className="text-xs font-semibold" style={{ fontFamily: "var(--mono)" }}>{title}</span>
                                    </div>
                                    <p className="text-xs" style={{ color: "var(--text-2)", lineHeight: 1.65 }}>{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div ref={skillsRef} className="about-card glass rounded-lg p-7" style={{ borderColor: "var(--border)" }}>
                        <p className="code-comment mb-1">{"// proficiency"}</p>
                        <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>technical_skills</h3>
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

            {/* ═══════ PROJECTS ═══════ */}
            <section
                id="projects"
                ref={projectsRef as any}
                className="py-20 px-6 dot-grid"
                style={{ background: "var(--bg2)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <p className="code-comment mb-1">{"// 02. projects"}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Featured Projects</h2>
                    <p className="text-xs mb-10" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                        {"const projects = ["}<span style={{ color: "var(--accent)" }}>{projects.length}</span>{" items ]"}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project, idx) => (
                            <div
                                key={project.id}
                                className="project-card glass rounded-lg p-6 flex flex-col hover:border-[color:var(--accent)] transition-colors duration-200"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>
                                        {String(idx + 1).padStart(2, "0")}.
                                    </span>
                                    <span className="token">{project.stack[0]}</span>
                                </div>

                                <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                                    {project.title}
                                </h3>
                                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
                                    {project.shortDesc}
                                </p>

                                <ul className="space-y-1.5 text-xs mb-5 flex-1" style={{ color: "var(--text-2)" }}>
                                    {project.highlights.slice(0, 3).map((h, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span style={{ color: "var(--accent)", flexShrink: 0 }}>+</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {project.stack.slice(0, 5).map(t => (
                                        <span key={t} className="token">{t}</span>
                                    ))}
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleAskAI(project.title)}
                                        className="btn-fn flex items-center gap-1.5 text-xs"
                                        style={{ padding: "5px 12px" }}
                                    >
                                        <MessageSquare size={11} /> Ask AI
                                    </button>
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                                        >
                                            <Github size={12} /> GitHub
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
                                        >
                                            <ExternalLink size={12} /> Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ═══════ ENGINEERING PRINCIPLES ═══════ */}
            <section
                id="principles"
                ref={principlesRef as any}
                className="py-20 px-6"
                style={{ background: "var(--bg)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <p className="code-comment mb-1">{"// 03. engineering_principles"}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Engineering Principles</h2>
                    <p className="text-xs mb-10" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                        Constraints I build under, not just values I aspire to.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {principles.map((p) => (
                            <div
                                key={p.label}
                                className="principle-card glass rounded-lg p-5 hover:border-[color:var(--accent)] transition-colors duration-200"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span style={{ color: "var(--accent)" }}>{p.icon}</span>
                                    <span className="text-xs" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>{p.label}</span>
                                </div>
                                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{p.title}</h3>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ═══════ SYSTEM ARCHITECTURE ═══════ */}
            <section
                id="architecture"
                ref={archRef as any}
                className="py-20 px-6 dot-grid"
                style={{ background: "var(--bg2)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <p className="code-comment mb-1">{"// 04. system_architecture"}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>System Architecture</h2>
                    <p className="text-xs mb-10" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                        {"// AI Portfolio Assistant — request flow"}
                    </p>

                    <div className="space-y-2 mb-10">
                        {archLayers.map((layer, i) => (
                            <div key={layer.label} className="arch-layer">
                                <div
                                    className="glass rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                    style={{ borderColor: layer.border, background: layer.color }}
                                >
                                    <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
                                        <span
                                            className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                            style={{
                                                background: layer.color,
                                                border: `1px solid ${layer.border}`,
                                                color: layer.textColor,
                                                fontFamily: "var(--mono)",
                                            }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold" style={{ color: layer.textColor, fontFamily: "var(--mono)" }}>{layer.label}</p>
                                            <p className="text-[10px]" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>{layer.sublabel}</p>
                                        </div>
                                    </div>
                                    <div className="h-px sm:h-auto sm:w-px flex-shrink-0" style={{ background: layer.border, minHeight: "1px" }} />
                                    <p className="text-xs flex-1" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{layer.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass rounded-lg p-6" style={{ borderColor: "var(--border)" }}>
                        <p className="code-comment mb-4">{"// key_design_decisions"}</p>
                        <div className="grid sm:grid-cols-2 gap-4 text-xs">
                            {[
                                { icon: <Lock size={13} />, title: "Server-Side Context Injection", desc: "Resume data and system prompt are injected on the FastAPI server — the LLM API key never touches the client." },
                                { icon: <Server size={13} />, title: "Stateless-First Endpoints", desc: "/chat is stateless by design; session context is passed explicitly in the request body, enabling horizontal scale." },
                                { icon: <Globe size={13} />, title: "CORS Explicitly Controlled", desc: "Only the known frontend origin is allowlisted in FastAPI CORS middleware — not a wildcard." },
                                { icon: <Database size={13} />, title: "SQLite → PostgreSQL Migration Path", desc: "Schema and ORM queries are written to be compatible with both. Switching datastores requires one env change." },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} className="flex gap-3">
                                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>{icon}</span>
                                    <div>
                                        <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</p>
                                        <p style={{ color: "var(--text-2)", lineHeight: 1.65 }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ═══════ PERFORMANCE & SCALABILITY ═══════ */}
            <section
                id="performance"
                ref={perfRef as any}
                className="py-20 px-6"
                style={{ background: "var(--bg)" }}
            >
                <div className="max-w-6xl mx-auto">
                    <p className="code-comment mb-1">{"// 05. performance_and_scalability"}</p>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Performance & Scalability</h2>
                    <p className="text-xs mb-10" style={{ color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                        Engineering decisions that make this system fast, resilient, and ready to grow.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {perfMetrics.map((m) => (
                            <div
                                key={m.label}
                                className="perf-card glass rounded-lg p-5 hover:border-[color:var(--accent)] transition-colors duration-200"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <p className="text-[10px] mb-2" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>{m.label}</p>
                                <p className="text-xl font-bold mb-2" style={{ color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>{m.value}</p>
                                <p className="text-xs" style={{ color: "var(--text-2)", lineHeight: 1.65 }}>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto border-t" style={{ borderColor: "var(--border)" }} />

            {/* ═══════ CONTACT ═══════ */}
            <section
                id="contact"
                ref={contactRef as any}
                className="py-20 px-6"
                style={{ background: "var(--bg2)" }}
            >
                <div className="max-w-3xl mx-auto">
                    <div className="contact-inner glass rounded-lg p-10" style={{ borderColor: "var(--border)" }}>

                        <p className="code-comment mb-1">{"// 06. contact"}</p>
                        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>
                            init_contact()
                        </h2>
                        <p className="text-sm mb-8" style={{ color: "var(--text-2)", lineHeight: 1.75, maxWidth: "38rem" }}>
                            I'm looking for engineering roles where I can contribute to backend systems,
                            AI integrations, and production infrastructure — not just UI work.
                            If you're building something with real architecture decisions behind it, I'd like to hear about it.
                        </p>

                        <div
                            className="rounded-md p-5 mb-8 text-xs space-y-2"
                            style={{ background: "var(--bg)", border: "1px solid var(--border)", fontFamily: "var(--mono)" }}
                        >
                            {[
                                { key: "status", val: "open_to_work", color: "var(--green)" },
                                { key: "available_for", val: "internships · full-time · contract", color: "var(--text-2)" },
                                { key: "response_time", val: "< 24h", color: "var(--accent)" },
                                { key: "timezone", val: "IST (UTC+5:30)", color: "var(--text-2)" },
                                { key: "primary_contact", val: "shreyash.londhe@gmail.com", color: "var(--text-2)" },
                            ].map(({ key, val, color }) => (
                                <div key={key} className="flex gap-3">
                                    <span style={{ color: "var(--text-3)", width: "130px", flexShrink: 0 }}>{key}:</span>
                                    <span style={{ color }}>{val}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            className="rounded-md p-4 mb-8 text-xs space-y-2"
                            style={{ background: "var(--bg)", border: "1px solid var(--border)", fontFamily: "var(--mono)" }}
                        >
                            <p>
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--text-3)" }}>{"C:\\Users\\shreyash> "}</span>
                                <span style={{ color: "var(--green)" }}>Start-Process</span>
                                <span style={{ color: "var(--text-2)" }}>{" mailto:shreyash.londhe@gmail.com"}</span>
                            </p>
                            <p>
                                <span style={{ color: "var(--accent)" }}>PS </span>
                                <span style={{ color: "var(--text-3)" }}>{"C:\\Users\\shreyash> "}</span>
                                <span style={{ color: "var(--green)" }}>Start-Process</span>
                                <span style={{ color: "var(--text-2)" }}>{" linkedin.com/in/shreyashlondhe"}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="mailto:shreyash.londhe@gmail.com"
                                className="btn-fn text-center"
                                style={{ padding: "10px 24px", fontSize: "0.78rem" }}
                            >
                                send_message()
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shreyashlondhe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-center text-xs"
                            >
                                connect()
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
                    background: "var(--bg)",
                }}
            >
                <span style={{ color: "var(--text-3)" }}>{"// "}</span>
                shreyash londhe © {new Date().getFullYear()}
                <span style={{ color: "var(--accent)", marginLeft: 8 }}>·</span>
                <span style={{ color: "var(--text-3)", marginLeft: 8 }}>React · TypeScript · FastAPI · GSAP · Framer Motion</span>
            </footer>

            <ChatWidget ref={chatRef} />
        </div>
    );
}
