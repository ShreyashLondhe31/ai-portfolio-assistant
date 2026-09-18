import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const roles = ["SOC Analyst", "AppSec Engineer", "Blue Teamer", "Cyber Defender"];

const SpaceBackground = () => {
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, opacity: number, duration: number, delay: number}[]>([]);
  
  useEffect(() => {
    const newStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-bg pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--bg)_100%)] z-10 opacity-70" />
    </div>
  );
};

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.fromTo(
        ".hero-text",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.1,
          clearProps: "transform"
        }
      );

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.05
        }
      );

      // Parallax Scroll Effect
      gsap.to(heroRef.current, {
        yPercent: 40, // Reduced from 80 to let it scroll up a bit more naturally while overlapping
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen bg-bg overflow-hidden flex flex-col justify-between z-0" id="home">
      <div id="hero" className="absolute top-0 left-0 pointer-events-none" />
      
      {/* Space Background */}
      <SpaceBackground />

      {/* Navbar */}
      <nav className="hero-fade relative z-50 w-full p-6 md:p-10 flex justify-between items-center">
        <a 
          href="#home" 
          className="text-xs text-muted hover:text-text-primary transition-colors tracking-wide"
        >
          <span className="text-text-primary font-medium">Shreyash</span> - PORTFOLIO
        </a>
        
        <div className="hidden md:flex relative items-center gap-1 bg-surface/50 backdrop-blur-md border border-stroke rounded-full px-2 py-2">
          {[
            { label: 'work', href: '#work' },
            { label: 'resume', href: '/SHREYASH_Resume.pdf', target: '_blank' },
            { label: 'contact', href: '#' }
          ].map((item) => {
            if (item.label === 'contact') {
              return (
                <div 
                  key={item.label}
                  className="relative flex items-center"
                  onMouseEnter={() => setIsContactOpen(true)}
                  onMouseLeave={() => setIsContactOpen(false)}
                >
                  <a 
                    href={item.href}
                    onClick={(e) => e.preventDefault()}
                    className="px-5 py-2 rounded-full text-xs uppercase tracking-widest text-muted hover:text-text-primary hover:bg-stroke/50 transition-colors"
                  >
                    {item.label}
                  </a>
                  <AnimatePresence>
                    {isContactOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-4 z-50 pointer-events-auto"
                      >
                        <div className="bg-surface/90 backdrop-blur-xl border border-stroke rounded-2xl p-2 flex flex-col min-w-[220px] shadow-2xl">
                          <a href="https://wa.me/919987603016" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-stroke/50 rounded-xl transition-colors group">
                            <div className="text-muted group-hover:text-[#25D366] transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                <path d="M16 14.5c-.3.8-1.5 1.5-2.2 1.5-.7 0-1.8-.4-3.5-2.1s-2.1-2.8-2.1-3.5c0-.7.7-1.9 1.5-2.2.4-.2 1 .1 1.2.6l1 2.3c.1.3 0 .7-.2.9l-.6.6c.3.5.9 1.5 1.8 2.4.9.9 1.9 1.5 2.4 1.8l.6-.6c.2-.2.6-.3.9-.2l2.3 1c.5.2.8.8.6 1.2z"/>
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-text-primary font-medium">WhatsApp</span>
                              <span className="text-xs text-muted">+91 99876 03016</span>
                            </div>
                          </a>
                          <a href="mailto:shreyash.londhe@gmail.com" className="flex items-center gap-3 px-4 py-3 hover:bg-stroke/50 rounded-xl transition-colors group">
                            <div className="text-muted group-hover:text-[#EA4335] transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-text-primary font-medium">Email</span>
                              <span className="text-xs text-muted">shreyash.londhe@gmail.com</span>
                            </div>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <a 
                key={item.label} 
                href={item.href}
                target={item.target}
                rel={item.target ? "noopener noreferrer" : undefined}
                className="px-5 py-2 rounded-full text-xs uppercase tracking-widest text-muted hover:text-text-primary hover:bg-stroke/50 transition-colors"
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <a href="https://linkedin.com/in/shreyashlondhe" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide hover:text-white transition-colors">
          Let's talk ↗
        </a>
      </nav>

      {/* Video Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/EngineerWorking.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Center Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="hero-text text-sm md:text-base uppercase tracking-[0.3em] text-muted mb-6">
          Security Professional
        </div>
        <h1 className="hero-text text-6xl md:text-8xl lg:text-[120px] font-display italic text-text-primary tracking-tight leading-[0.9] text-center mb-6">
          Shreyash <br className="md:hidden" />Londhe
        </h1>
        <div className="hero-text text-xl md:text-3xl text-muted font-light flex items-center gap-3">
          I am a 
          <span className="relative inline-block w-[180px] md:w-[300px] font-medium text-text-primary h-8 md:h-10">
            {roles.map((role, idx) => (
              <span
                key={role}
                className={`absolute left-0 top-0 w-full transition-all duration-500 ${
                  idx === roleIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {role}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="hero-fade relative z-50 w-full p-6 md:p-10 flex justify-between items-end pointer-events-none">
        <div className="text-xs text-muted max-w-[250px] leading-relaxed">
          MCA Postgrad.<br/>
          Defending infrastructure & securing enterprise applications.
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted rotate-90 origin-bottom mb-8">Scroll</div>
          <div className="w-px h-16 bg-stroke relative overflow-hidden">
            <div className="w-full h-1/2 bg-text-primary absolute top-0 animate-scroll-down"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
