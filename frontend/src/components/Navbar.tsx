import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      setScrolled(scrollPosition > 20);

      if (scrollPosition + windowHeight >= fullHeight - 50) {
        setActive("contact");
        return;
      }

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].id);
        if (section && scrollPosition + 150 >= section.offsetTop) {
          setActive(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-xl bg-[#07090f]/85 border-b border-white/10"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold">
            SL
          </div>
          <span className="text-sm font-semibold text-white/80 hidden sm:block">
            Shreyash Londhe
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-4 py-2 rounded-lg text-sm transition ${active === id
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
          >
            Resume
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* BACKDROP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                onClick={() => setOpen(false)}
              />

              {/* DRAWER */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="fixed top-[64px] left-0 w-full bg-[#0b0f19] border-t border-white/10 z-[1000]"
              >
                <div className="flex flex-col items-center py-6 space-y-6">

                  {navLinks.map(({ label, id }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`text-sm ${active === id
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                        }`}
                    >
                      {label}
                    </button>
                  ))}

                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black px-5 py-2 rounded-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Resume
                  </a>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.nav>
  );
}