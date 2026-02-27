import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import projects from "../data/projects";
import { ArrowLeft, ExternalLink, Github, CheckSquare } from "lucide-react";

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const pageRef = useRef<HTMLDivElement>(null);

    const project = projects.find((p) => p.id === id);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".detail-animate", {
                y: 28, opacity: 0, duration: 0.6,
                stagger: 0.1, ease: "power2.out", delay: 0.05,
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    if (!project) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
                style={{ background: "var(--bg)", color: "var(--text)" }}
            >
                <p className="code-comment">{"// 404 — not found"}</p>
                <h1 className="text-3xl font-bold">Project Not Found</h1>
                <button onClick={() => navigate("/")} className="btn-primary">← Back to Portfolio</button>
            </div>
        );
    }

    return (
        <div
            ref={pageRef}
            style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}
        >
            {/* Hero */}
            <div
                className="relative px-6 pt-20 pb-14 dot-grid"
                style={{
                    background: "var(--bg2)",
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate("/")}
                        className="detail-animate flex items-center gap-2 text-sm mb-8 btn-ghost px-3 py-1.5 rounded-md"
                    >
                        <ArrowLeft size={14} /> Back to Portfolio
                    </button>

                    <p className="detail-animate code-comment mb-2">
                        {"// 02. projects / "}{project.id}
                    </p>
                    <h1
                        className="detail-animate text-4xl sm:text-5xl font-extrabold mb-4"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {project.title}
                    </h1>
                    <p className="detail-animate text-base mb-6" style={{ color: "var(--text-2)" }}>
                        {project.shortDesc}
                    </p>

                    <div className="detail-animate flex flex-wrap gap-3">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center gap-2"
                            >
                                <Github size={15} /> View on GitHub
                            </a>
                        )}
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost flex items-center gap-2"
                            >
                                <ExternalLink size={15} /> Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-14 space-y-10">

                {/* About */}
                <div
                    className="detail-animate glass rounded-lg p-7"
                    style={{ borderColor: "var(--border)" }}
                >
                    <p className="code-comment mb-2">{"/** project description */"}</p>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>About the Project</h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{project.longDesc}</p>
                </div>

                {/* Key highlights */}
                <div className="detail-animate">
                    <p className="code-comment mb-2">{"// highlights"}</p>
                    <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--text)" }}>Key Highlights</h2>
                    <div className="space-y-2.5">
                        {project.highlights.map((h, i) => (
                            <div
                                key={i}
                                className="flex gap-3 items-start glass rounded-md px-5 py-3.5"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <CheckSquare
                                    size={16}
                                    className="flex-shrink-0 mt-0.5"
                                    style={{ color: "var(--accent)" }}
                                />
                                <p className="text-sm" style={{ color: "var(--text-2)" }}>{h}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech stack */}
                <div className="detail-animate">
                    <p className="code-comment mb-2">{"// tech_stack = ["}</p>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                            <span key={tech} className="token">{tech}</span>
                        ))}
                    </div>
                    <p className="code-comment mt-2">{"]"}</p>
                </div>

                {/* Back */}
                <div className="detail-animate pt-2">
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary"
                    >
                        ← Back to Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
}
