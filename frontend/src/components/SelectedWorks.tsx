import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { 
    id: 'proj-1', 
    title: 'AuraStream Security Audit', 
    number: '01', 
    tags: ['OWASP', 'Burp Suite', 'Kali Linux'], 
    img: '/Aurastream_sec_audit.png', 
    desc: 'Performed a manual security assessment on a Netflix-inspired MERN platform. Identified and remediated critical NoSQL Injection and IDOR vulnerabilities, enforcing strict ownership verification and input sanitization.',
    link: 'https://github.com/ShreyashLondhe31/AuraStream-Security-Audit'
  },
  { 
    id: 'proj-2', 
    title: 'RAG Prompt Injection Hardening', 
    number: '02', 
    tags: ['pgvector', 'Docker', 'Prompt Eng'], 
    img: '/RAG_Pipeline.png', 
    desc: 'Designed adversarially robust system prompts to mitigate Prompt Injection. Hardened the PostgreSQL vector database with role-based access control and capability-dropped containers in a privacy-first RAG pipeline.',
    link: 'https://github.com/ShreyashLondhe31/n8n-RAG-metrics'
  },
  { 
    id: 'proj-3', 
    title: 'DevSecOps CI/CD Pipeline', 
    number: '03', 
    tags: ['GitHub Actions', 'SonarQube', 'Trivy'], 
    img: '/DevSecOps_Pipeline.png', 
    desc: 'Built a CI pipeline enforcing 12 automated security checks. Integrated SonarQube for SAST and Trivy for container vulnerability scanning as automated gates ahead of deployment.',
    link: 'https://github.com/ShreyashLondhe31/DevSecOps-3Tier-Pipeline'
  }
];

interface SelectedWorksProps {
  onAskAI?: (contextTitle: string) => void;
}

export default function SelectedWorks({ onAskAI }: SelectedWorksProps) {
  const [activeProject, setActiveProject] = useState<string | null>('proj-1');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.accordion-item-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#work',
            start: 'top 80%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeProject]);

  return (
    <section className="relative w-full bg-bg py-24 md:py-32 scroll-mt-10" id="work">
      <div id="projects" className="absolute -top-10 left-0 pointer-events-none" />
      <div id="works" className="absolute -top-10 left-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col">
        
        {/* Accordion Container */}
        <div className="w-full flex flex-col border-t border-stroke">
          {projects.map((project) => {
            const isActive = activeProject === project.id;

            return (
              <div 
                key={project.id} 
                className="accordion-item-reveal border-b border-stroke flex flex-col"
              >
                {/* Header Row (Clickable) */}
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() => setActiveProject(prev => prev === project.id ? null : project.id)}
                  className="w-full py-8 md:py-10 flex items-center justify-between group text-left cursor-pointer transition-colors hover:bg-surface/20 px-4 md:px-8 -mx-4 md:-mx-8 rounded-2xl"
                >
                  <div className="flex items-start gap-3 md:gap-6">
                    <span className="text-3xl md:text-5xl font-display text-text-primary group-hover:text-white transition-colors tracking-tight flex items-center gap-4">
                      {/* Icon Placeholder (Circle/Box) */}
                      <div className="w-6 h-6 md:w-8 md:h-8 border border-stroke rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-text-primary" />
                      </div>
                      {project.title}
                    </span>
                    <span className="text-xs text-muted font-medium pt-1 md:pt-2">
                      {project.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 mr-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 rounded-full border border-stroke/60 text-[10px] uppercase tracking-widest text-muted group-hover:border-stroke transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Toggle Icon */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${isActive ? 'bg-text-primary text-bg rotate-180' : 'bg-surface border border-stroke text-text-primary'}`}
                      title={isActive ? "Collapse project info" : "Expand project info"}
                    >
                      {isActive ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanding Content */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden px-4 md:px-8"
                    >
                      <div className="pb-10 pt-4 flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                        {/* Image */}
                        <div className="w-full lg:w-3/5 h-64 md:h-[400px] rounded-2xl overflow-hidden relative group">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                          <img 
                            src={project.img} 
                            alt={project.title} 
                            className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                          />
                        </div>

                        {/* Details */}
                        <div className="w-full lg:w-2/5 flex flex-col justify-between h-full py-4">
                          <p className="text-sm md:text-base text-muted leading-relaxed max-w-sm mb-8">
                            {project.desc}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="group/btn relative rounded-full h-12 w-full max-w-[280px]">
                              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                              <div className="relative h-full px-6 bg-text-primary rounded-full flex items-center justify-center gap-2 text-sm font-medium text-bg transition-colors group-hover/btn:bg-bg group-hover/btn:text-text-primary">
                                View Project <span className="text-[10px]">↗</span>
                              </div>
                            </a>

                            <button 
                              onClick={() => onAskAI?.(project.title)}
                              className="group/btn relative rounded-full h-12 w-full max-w-[280px]"
                            >
                              <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                              <div className="relative h-full px-6 bg-surface border border-stroke rounded-full flex items-center justify-center gap-2 text-sm font-medium text-text-primary transition-colors group-hover/btn:bg-bg">
                                Ask AI 
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
