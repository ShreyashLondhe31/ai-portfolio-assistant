import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
      
      gsap.fromTo(
        '.about-card-reveal',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-cards-container',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-bg py-24 md:py-32 px-6 md:px-10 z-10" id="about">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-8 max-w-3xl">
            {/* Tag */}
            <div className="about-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stroke bg-surface/50 text-xs font-medium uppercase tracking-widest text-text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              About me
            </div>
            
            {/* Main Title */}
            <h2 className="about-reveal text-4xl md:text-6xl lg:text-7xl font-display text-text-primary leading-[1.1] tracking-tight">
              Defending applications <br className="hidden md:block"/> & securing architecture.
            </h2>
          </div>

        </div>

        {/* Cards Container */}
        <div className="about-cards-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Card - Visual & Highlight */}
          <div className="about-card-reveal bg-surface/40 border border-stroke rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
            {/* Visual Header */}
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8 relative">
              <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay z-10" />
              <img 
                src="/handshake.jpg" 
                alt="Tech Handshake" 
                className="w-full h-full object-cover object-center grayscale contrast-125 brightness-75 hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content Bottom */}
            <div className="flex flex-col gap-2">
              <h3 className="text-4xl md:text-5xl font-display text-text-primary">100%</h3>
              <p className="text-sm text-text-primary font-medium tracking-wide">Threat Mitigation Focus</p>
              <p className="text-xs text-muted leading-relaxed max-w-sm mt-1">
                Combining offensive security training with deep full-stack architecture knowledge.
              </p>
            </div>
          </div>

          {/* Right Card - Description & Stats */}
          <div className="about-card-reveal bg-surface/40 border border-stroke rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
            <p className="text-base md:text-lg text-text-primary/90 leading-relaxed max-w-md">
              I'm a security engineer leveraging a background in MERN stack development. This allows me to not just find vulnerabilities like IDOR and NoSQL Injection, but to actively understand and remediate them at the code level.
            </p>

            <div className="flex flex-col gap-6 mt-12 w-full">
              {/* Stat Row */}
              <div className="flex items-center justify-between border-b border-stroke/50 pb-4">
                <span className="text-xs md:text-sm text-muted font-medium">Core Focus</span>
                <span className="text-sm md:text-base text-text-primary font-medium">AppSec, Blue Team</span>
              </div>
              
              {/* Stat Row */}
              <div className="flex items-center justify-between border-b border-stroke/50 pb-4">
                <span className="text-xs md:text-sm text-muted font-medium">Key Tools</span>
                <span className="text-sm md:text-base text-text-primary font-medium">Burp Suite, Trivy, Nmap</span>
              </div>
              
              {/* Stat Row */}
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs md:text-sm text-muted font-medium">Pipeline Security</span>
                <span className="text-sm md:text-base text-text-primary font-medium">GitHub Actions, SonarQube</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center text-center mt-12 gap-6">
          <div className="about-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stroke bg-surface/50 text-xs font-medium uppercase tracking-widest text-text-primary">
            <span className="opacity-70">{"</>"}</span> Capabilities
          </div>
          <h2 className="about-reveal text-3xl md:text-5xl font-display text-text-primary leading-[1.2] tracking-tight max-w-2xl">
            From code review to deployment,<br/> fully secured.
          </h2>
        </div>

      </div>
    </section>
  );
}
