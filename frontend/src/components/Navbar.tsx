import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { X, Menu, Terminal } from "lucide-react";

const navLinks = [
  { label: "about", id: "about" },
  { label: "projects", id: "projects" },
  { label: "contact", id: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([logoRef.current, linksRef.current], {
        y: -20, opacity: 0, duration: 0.5,
        stagger: 0.1, ease: "power2.out", delay: 0.1,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.body.offsetHeight;
      setScrolled(scrollY > 20);
      if (scrollY + winH >= docH - 50) { setActive("contact"); return; }
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el && scrollY + 150 >= el.offsetTop) { setActive(navLinks[i].id); break; }
      }
    };
    window.addEventListener("scroll", handle);
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.nav
      ref={navRef as any}
      className="fixed top-0 w-full z-50 transition-all duration-200"
      style={{
        background: scrolled ? "rgba(13,17,23,0.92)" : "rgba(13,17,23,0.70)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3.5 px-6">

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent-glow)" }}
          >
            <Terminal size={15} color="#fff" />
          </div>
          <div style={{ fontFamily: "var(--mono)" }}>
            <span style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: 600 }}>shreyash</span>
            <span style={{ color: "var(--accent)", fontSize: "0.85rem" }}>.dev</span>
          </div>
        </div>

        {/* Desktop links */}
        <div ref={linksRef} className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative px-4 py-2 rounded-md text-sm transition-all duration-150"
              style={{
                fontFamily: "var(--mono)",
                color: active === id ? "var(--accent)" : "var(--text-2)",
                background: active === id ? "rgba(47,129,247,0.10)" : "transparent",
                border: active === id ? "1px solid rgba(47,129,247,0.22)" : "1px solid transparent",
              }}
            >
              {active === id && <span style={{ color: "var(--text-3)", marginRight: 4 }}>{">"}</span>}
              {label}
            </button>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 btn-primary"
          >
            resume.pdf
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999]"
                style={{ background: "rgba(0,0,0,0.6)" }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="fixed top-[58px] left-0 w-full z-[1000]"
                style={{
                  background: "var(--surface)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col items-center py-6 gap-4">
                  {navLinks.map(({ label, id }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="text-sm"
                      style={{
                        fontFamily: "var(--mono)",
                        color: active === id ? "var(--accent)" : "var(--text-2)",
                      }}
                    >
                      {active === id ? "> " : "  "}{label}
                    </button>
                  ))}
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-2"
                    onClick={() => setOpen(false)}
                  >
                    resume.pdf
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