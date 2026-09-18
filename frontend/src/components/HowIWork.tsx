import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: '01',
    title: 'Analyze & Architect',
    timeline: 'Phase 1',
    desc: 'I dive deep into requirements, designing scalable data models and selecting the optimal tech stack for high performance.',
    gradient: 'from-purple-500 via-fuchsia-400 to-orange-400'
  },
  {
    id: '02',
    title: 'Build & Integrate',
    timeline: 'Phase 2',
    desc: 'Developing clean, modular frontend components and robust backend APIs, seamlessly integrating AI capabilities where needed.',
    gradient: 'from-emerald-400 via-green-300 to-yellow-200'
  },
  {
    id: '03',
    title: 'Test & Deploy',
    timeline: 'Phase 3',
    desc: 'Rigorous performance testing, lazy-loading optimizations, and deploying to production servers with automated CI/CD pipelines.',
    gradient: 'from-blue-500 via-cyan-400 to-teal-300'
  }
];

export default function HowIWork() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.hiw-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#how-i-work',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Cards reveal
      gsap.fromTo(
        '.hiw-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.hiw-cards-container',
            start: 'top 80%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-bg py-24 md:py-32 flex flex-col items-center" id="how-i-work">
      <div className="max-w-6xl mx-auto px-6 md:px-10 w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="hiw-header flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stroke bg-surface/50 text-xs font-medium uppercase tracking-widest text-text-primary">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            How I work
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary leading-[1.1] tracking-tight max-w-2xl">
            Engineering real results <br className="hidden md:block"/> without the guesswork.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="hiw-cards-container w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div key={step.id} className="hiw-card flex flex-col items-center md:items-start group">
              
              {/* Top Box */}
              <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-surface/40 border border-stroke rounded-3xl mb-6 md:mb-8 flex items-center justify-center overflow-hidden relative transition-colors duration-500 hover:bg-surface/60">
                {/* Glowing Circle */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${step.gradient} opacity-80 mix-blend-screen blur-[1px]`}></div>
                  {/* Inner shine for 3D sphere look */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-50 mix-blend-overlay"></div>
                  
                  {/* Number */}
                  <span className="relative z-10 text-5xl md:text-6xl font-display text-white drop-shadow-md">
                    {step.id}
                  </span>
                </div>
              </div>

              {/* Title & Tag */}
              <div className="flex items-center gap-3 mb-4 w-full justify-center md:justify-start">
                <h3 className="text-xl md:text-2xl font-medium text-text-primary tracking-tight">
                  {step.title}
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-surface border border-stroke text-[10px] uppercase tracking-wider text-muted whitespace-nowrap">
                  {step.timeline}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted leading-relaxed text-center md:text-left max-w-xs md:max-w-none">
                {step.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
