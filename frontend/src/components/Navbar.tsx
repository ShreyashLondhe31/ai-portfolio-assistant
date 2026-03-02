import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { X, Menu, Terminal } from "lucide-react";

const navLinks = [
  { label: "about", id: "about" },
  { label: "projects", id: "projects" },
  { label: "principles", id: "principles" },
  { label: "architecture", id: "architecture" },
  { label: "performance", id: "performance" },
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
    window.addEventListener("scroll", handle, { passive: true });
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
        background: scrolled ? "rgba(13,17,23,0.95)" : "rgba(13,17,23,0.70)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">

        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.30)" }}
          >
            <Terminal size={13} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: "var(--mono)" }}>
            <span style={{ color: "var(--text)", fontSize: "0.82rem", fontWeight: 600 }}>shreyash</span>
            <span style={{ color: "var(--accent)", fontSize: "0.82rem" }}>.dev</span>
          </div>
        </div>

        {/* Desktop links */}
        <div ref={linksRef} className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative px-3 py-1.5 rounded-md text-xs transition-all duration-150"
              style={{
                fontFamily: "var(--mono)",
                color: active === id ? "var(--accent)" : "var(--text-3)",
                background: active === id ? "rgba(99,102,241,0.08)" : "transparent",
                border: active === id ? "1px solid rgba(99,102,241,0.20)" : "1px solid transparent",
              }}
            >
              {active === id && <span style={{ color: "var(--text-3)", marginRight: 3 }}>{">"}</span>}
              {label}
            </button>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 btn-fn"
            style={{ fontSize: "0.72rem" }}
          >
            open_resume()
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden p-2 rounded-md"
          style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-3)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
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
                style={{ background: "rgba(0,0,0,0.5)" }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ type: "tween", duration: 0.18 }}
                className="fixed top-[52px] left-0 w-full z-[1000]"
                style={{
                  background: "var(--surface)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col items-center py-5 gap-3">
                  {navLinks.map(({ label, id }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="text-xs"
                      style={{
                        fontFamily: "var(--mono)",
                        color: active === id ? "var(--accent)" : "var(--text-3)",
                      }}
                    >
                      {active === id ? "> " : "  "}{label}
                    </button>
                  ))}
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fn mt-1"
                    onClick={() => setOpen(false)}
                  >
                    open_resume()
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