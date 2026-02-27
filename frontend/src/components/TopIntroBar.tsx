import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Wifi, Code2, MapPin } from "lucide-react";

export default function TopIntroBar() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(rootRef.current!.children, {
                y: 14, opacity: 0, duration: 0.45,
                stagger: 0.1, ease: "power2.out", delay: 0.5,
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full px-4 pt-20 sm:pt-24" ref={rootRef}>
            <div className="max-w-6xl mx-auto space-y-2">

                {/* Status bar — like a terminal status line */}
                <div
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-md"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        fontFamily: "var(--mono)",
                    }}
                >
                    <div className="flex items-center gap-3 text-xs">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }}
                        />
                        <span style={{ color: "var(--text-2)" }}>status:</span>
                        <span style={{ color: "var(--green)", fontWeight: 600 }}>open_to_work</span>
                        <span style={{ color: "var(--text-3)" }}>// internships &amp; AI engineer roles</span>
                    </div>

                    <span className="hidden sm:flex items-center gap-1 text-xs" style={{ color: "var(--text-3)" }}>
                        <MapPin size={12} />
                        Mumbai / Pune
                    </span>
                </div>

                {/* Stat pills */}
                <div className="grid grid-cols-2 gap-2">
                    <Stat icon={<Code2 size={13} />} label="projects_built" value="4" />
                    <Stat icon={<Wifi size={13} />} label="intern_ready" value="2026" />
                </div>

            </div>
        </div>
    );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div
            className="px-4 py-2.5 rounded-md flex items-center justify-between"
            style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                fontFamily: "var(--mono)",
            }}
        >
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-2)" }}>
                <span style={{ color: "var(--accent)" }}>{icon}</span>
                {label}
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{value}</span>
        </div>
    );
}