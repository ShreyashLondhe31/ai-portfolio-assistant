import { motion } from "framer-motion";
import { Briefcase, Brain, Code2, MapPin } from "lucide-react";

export default function TopIntroBar() {
    return (
        <div className="w-full sm:mt-10 px-4 pt-20">
            <div className="max-w-6xl mx-auto space-y-3">

                {/* Availability Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-blue-500/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 text-sm">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-white/80">
                            Open to internships & AI engineer roles
                        </p>
                    </div>

                    <span className="text-xs text-white/40 flex items-center gap-1">
                        <MapPin size={14} />
                        Mumbai / Pune
                    </span>
                </motion.div>

                {/* Stats Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <Stat icon={<Code2 size={16} />} label="Projects" value="4+" />
                    {/* <Stat icon={<Brain size={16} />} label="AI Apps" value="3+" /> */}
                    <Stat icon={<Briefcase size={16} />} label="Intern Ready" value="2026" />
                </motion.div>

            </div>
        </div>
    );
}

function Stat({ icon, label, value }: any) {
    return (
        <div className="px-4 py-3 rounded-xl border border-white/8 bg-white/5 backdrop-blur-xl text-center">
            <div className="flex items-center justify-center gap-1 text-violet-400 mb-1">
                {icon}
                <span className="font-semibold text-white">{value}</span>
            </div>
            <p className="text-[11px] text-white/50">{label}</p>
        </div>
    );
}