import ChatWidget from "../components/ChatWidget";
import Navbar from "../components/Navbar";
import TopIntroBar from "../components/TopIntroBar";


// ─── Component ────────────────────────────────────────────────────────────────

export default function Portfolio() {
    return (
        <div className="bg-[#0b0f19] text-white min-h-screen relative overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_60%)]"></div>

            <div className="relative">
                <Navbar />
                <TopIntroBar />

                {/* ══════════════════════════
          HERO — two-column split
      ══════════════════════════ */}
                <section className="min-h-[65vh] flex items-center pt-24 md:pt-28">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

                        {/* LEFT SIDE */}
                        <div>
                            <p className="text-gray-400 mb-3">Hi, I'm</p>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                                Shreyash <br /> Londhe
                            </h1>

                            <p className="text-gray-400 mt-4 text-lg max-w-lg">
                                Full Stack Developer & AI Enthusiast building modern, intelligent web applications.
                                MCA student focused on clean backend systems and real-world AI integration.
                            </p>

                            {/* TECH BADGES */}
                            <div className="flex flex-wrap gap-2 mt-6">
                                {["React", "TypeScript", "Python", "FastAPI", "Node.js", "Tailwind"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-4 mt-8">
                                <a href="#projects" className="bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition">
                                    View Projects
                                </a>
                                <a href="#contact" className="bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition">
                                    Contact Me
                                </a>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="relative flex justify-center">

                            {/* glow */}
                            <div className="absolute w-[320px] h-[320px] bg-blue-500/20 blur-[120px] rounded-full"></div>

                            {/* card */}
                            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl animate-[float_6s_ease-in-out_infinite]">

                                <img
                                    src="/profile-placeholder.png"
                                    className="w-72 h-80 object-cover rounded-2xl"
                                />

                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-4 py-2 rounded-full text-sm">
                                    Open To Work
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-[#0b0f19]"></div>
                </section>

                <div className="max-w-7xl mx-auto border-t border-white/5 my-12"></div>

                {/* ══════════════════════════
          ABOUT
      ══════════════════════════ */}
                <section id="about" className="py-16 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">

                        {/* LEFT VISUAL BLOCK */}
                        <div className="relative">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-semibold mb-4">Who I am</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    I'm an MCA student passionate about building full-stack and AI-powered
                                    applications that solve real problems. I enjoy clean backend architecture,
                                    modern UI, and integrating AI into practical systems.
                                </p>

                                <div className="flex flex-wrap gap-2 mt-6">
                                    {["Problem Solver", "Fast Learner", "Team Player", "Detail Oriented"].map(t => (
                                        <span key={t} className="px-3 py-1 text-sm border border-white/10 rounded-full bg-white/5">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SKILLS */}
                        <div className="space-y-4">

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-semibold mb-1">Frontend</h4>
                                <p className="text-gray-400">React · TypeScript · TailwindCSS</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-semibold mb-1">Backend</h4>
                                <p className="text-gray-400">FastAPI · Node.js · REST APIs</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-semibold mb-1">AI / LLM</h4>
                                <p className="text-gray-400">OpenRouter · LLM Integration</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h4 className="font-semibold mb-1">Architecture</h4>
                                <p className="text-gray-400">Full-stack system design</p>
                            </div>

                        </div>

                    </div>
                </section>

                <div className="max-w-7xl mx-auto border-t border-white/5 my-12"></div>

                {/* ══════════════════════════
          PROJECTS
      ══════════════════════════ */}
                <section id="projects" className="py-16">
                    <div className="max-w-7xl mx-auto px-6">

                        <h2 className="text-3xl font-bold mb-10">Projects</h2>

                        <div className="grid md:grid-cols-2 gap-8">

                            {/* PROJECT 1 */}
                            <div className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition duration-300">

                                <h3 className="text-xl font-semibold">AI Portfolio Assistant</h3>

                                <p className="text-gray-400 mt-3">
                                    Full-stack portfolio with AI chat powered by FastAPI and OpenRouter.
                                </p>
                                <h4 className="text-sm font-semibold mt-4 text-white/80">Key Work</h4>
                                {/* BULLET POINTS */}
                                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                                    <li>• Integrated OpenRouter LLM with backend context injection</li>
                                    <li>• Built FastAPI backend with SQLite message storage</li>
                                    <li>• Designed modern animated UI with React + Tailwind</li>
                                    <li>• Resume-aware assistant answering recruiter questions</li>
                                    <li>• Structured for production-ready deployment</li>
                                </ul>

                                {/* TECH */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {["React", "FastAPI", "OpenRouter", "TypeScript", "Tailwind", "SQLite"].map(t => (
                                        <span key={t} className="text-xs border border-white/10 px-2 py-1 rounded-md">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* BUTTONS */}
                                {/* <div className="flex gap-4 mt-6">
                                    <a href="YOUR_GITHUB" target="_blank" className="border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10">
                                        GitHub
                                    </a>
                                    <a href="/" className="bg-white text-black px-4 py-2 rounded-lg">
                                        Live Demo
                                    </a>
                                </div> */}

                            </div>

                            {/* PROJECT 2 */}
                            <div className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition duration-300">
                                <h3 className="text-xl font-semibold">Hakimi Establishment Website</h3>

                                <p className="text-gray-400 mt-3">
                                    Responsive business website with modern UI, smooth animations,
                                    and clean layout.
                                </p>
                                <h4 className="text-sm font-semibold mt-4 text-white/80">Key Work</h4>
                                {/* BULLET POINTS */}
                                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                                    <li>• Designed responsive business website</li>
                                    <li>• Implemented smooth animations with Framer Motion</li>
                                    <li>• Built reusable React components</li>
                                    <li>• Optimized layout for mobile and desktop</li>
                                </ul>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {["React", "Tailwind", "Framer Motion"].map(t => (
                                        <span key={t} className="text-xs border border-white/10 px-2 py-1 rounded-md">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* <div className="flex gap-4 mt-6">
                                    <a href="#" className="border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10">
                                        GitHub
                                    </a>
                                    <a href="#" className="bg-white text-black px-4 py-2 rounded-lg">
                                        Live Demo
                                    </a>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto border-t border-white/5 my-12"></div>

                {/* ══════════════════════════
          CONTACT
      ══════════════════════════ */}
                <section id="contact" className="pt-16 pb-10">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl rounded-3xl p-10 text-center">
                            <p className="text-sm text-purple-400 mb-2">GET IN TOUCH</p>
                            <h2 className="text-3xl font-bold mb-4">Let’s work together</h2>
                            <p className="text-gray-400 mb-8">
                                I'm actively looking for internship opportunities.
                                If you think I’d be a good fit for your team, let’s talk.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {/* EMAIL */}
                                <a
                                    href="mailto:shreyash.londhe@gmail.com"
                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-xl font-medium hover:scale-105 transition"
                                >
                                    shreyash.londhe@gmail.com
                                </a>

                                {/* LINKEDIN */}
                                <a
                                    href="https://www.linkedin.com/in/shreyashlondhe/"
                                    target="_blank"
                                    className="border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition"
                                >
                                    LinkedIn
                                </a>

                                {/* WHATSAPP */}
                                <a
                                    href="https://wa.me/+919987603016"
                                    target="_blank"
                                    className="border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition"
                                >
                                    WhatsApp
                                </a>

                            </div>
                        </div>

                    </div>
                </section>

                <div className="max-w-7xl mx-auto border-t border-white/5 my-12"></div>

                {/* Footer */}
                <footer className="border-t border-white/6 py-6 text-center text-gray-600 text-xs">
                    Shreyash Londhe © {new Date().getFullYear()} · Built with React, TypeScript &amp; Framer Motion
                </footer>

                <ChatWidget />
            </div>
        </div>
    );
}
