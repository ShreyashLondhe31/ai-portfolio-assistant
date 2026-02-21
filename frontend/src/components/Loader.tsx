import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-[#0b0f19] flex items-center justify-center z-[2000]">
            <div className="flex flex-col items-center gap-6 text-center">

                {/* NAME */}
                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-4xl font-semibold tracking-wide text-white"
                >
                    Shreyash Londhe
                </motion.h1>

                {/* SUBTEXT */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs tracking-[0.25em] text-white/50"
                >
                    LOADING PORTFOLIO
                </motion.p>

                {/* LINE LOADER */}
                <div className="w-48 h-[2px] bg-white/10 overflow-hidden rounded">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            ease: "linear",
                        }}
                        className="h-full w-1/2 bg-gradient-to-r from-violet-500 to-indigo-500"
                    />
                </div>

            </div>
        </div >
    );
}