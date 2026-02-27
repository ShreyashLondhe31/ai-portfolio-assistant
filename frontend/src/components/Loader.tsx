import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Loader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Terminal lines stagger in
            tl.from(".boot-line", {
                opacity: 0, x: -10,
                duration: 0.25, stagger: 0.12, ease: "none",
            });

            // Bar fills
            tl.to(barRef.current, {
                width: "100%", duration: 0.6, ease: "power2.inOut",
            }, "-=0.1");

            // Fade out
            tl.to(containerRef.current, {
                opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.2,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const bootLines = [
        "> Initializing portfolio...",
        "> Loading projects...",
        "> Starting dev server...",
        "> Ready.",
    ];

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "var(--bg)" }}
        >
            {/* ASCII logo */}
            <div
                className="text-xl font-bold mb-6 tracking-widest"
                style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}
            >
                SL /
                <span style={{ color: "var(--text-2)", fontWeight: 400 }}> shreyash londhe</span>
            </div>

            {/* Terminal boot lines */}
            <div
                ref={linesRef}
                className="mb-6 text-left w-72 space-y-1"
            >
                {bootLines.map((line, i) => (
                    <p
                        key={i}
                        className="boot-line text-xs"
                        style={{
                            fontFamily: "var(--mono)",
                            color: i === bootLines.length - 1 ? "var(--green)" : "var(--text-3)",
                        }}
                    >
                        {line}
                    </p>
                ))}
            </div>

            {/* Progress bar — terminal style */}
            <div
                className="w-72 h-[2px] rounded-full overflow-hidden"
                style={{ background: "var(--surface2)" }}
            >
                <div
                    ref={barRef}
                    className="h-full rounded-full"
                    style={{ width: "0%", background: "var(--accent)" }}
                />
            </div>
        </div>
    );
}