import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What technologies do you specialize in?",
    answer: "I am a SOC Analyst and AppSec Engineer specializing in offensive security (Burp Suite, Kali Linux), defensive monitoring (SIEM, EDR), and DevSecOps pipelines (GitHub Actions, Trivy, SonarQube)."
  },
  {
    question: "What is your approach to vulnerability remediation?",
    answer: "I follow a structured methodology: triage the alert, dissect the attacker behavior using tools like Nmap or Burp Suite, identify the root cause at the code level, and coordinate effective remediation with the engineering team."
  },
  {
    question: "How does your developer background help in AppSec?",
    answer: "My background in full-stack MERN development gives me a unique advantage. I don't just run automated scans; I understand the underlying logic flaws (like IDOR or complex NoSQL Injections) and can provide developers with actionable, code-level fixes."
  },
  {
    question: "What tools do you use for security assessments?",
    answer: "I rely on a mix of manual and automated tools, including Burp Suite Professional, Kali Linux, Nmap, SonarQube for SAST, and Trivy for container scanning. I also have experience hardening specialized databases like pgvector for AI applications."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#faq',
            start: 'top 85%',
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
  }, [openIndex]);

  return (
    <section className="relative w-full bg-bg py-24 md:py-32" id="faq">
      <div className="max-w-4xl mx-auto px-6 md:px-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="faq-reveal flex flex-col items-center text-center mb-16 gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stroke bg-surface/50 text-xs font-medium uppercase tracking-widest text-text-primary">
            <span className="opacity-70">{"</>"}</span> FAQ's
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary tracking-tight max-w-2xl">
            Answers To What You're Wondering About.
          </h2>
        </div>

        {/* Accordion List */}
        <div className="faq-reveal w-full flex flex-col gap-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className="w-full bg-surface/80 border border-stroke rounded-2xl overflow-hidden transition-colors hover:bg-surface"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className="text-lg md:text-xl font-medium text-text-primary pr-8">
                    {faq.question}
                  </span>
                  
                  {/* Plus / Minus Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-muted"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </motion.div>
                </button>
                
                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Gradient Contact Card */}
        <div className="faq-reveal w-full relative rounded-3xl overflow-hidden p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          {/* Complex CSS Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-black z-0"></div>
          
          {/* Glowing Orbs */}
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] bg-[#4ADE80]/30 blur-[100px] rounded-full z-0 mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-[20%] right-[10%] w-[60%] h-[120%] bg-[#F59E0B]/20 blur-[120px] rounded-full z-0 mix-blend-screen pointer-events-none"></div>
          <div className="absolute -bottom-[30%] left-[20%] w-[70%] h-[100%] bg-[#3B82F6]/20 blur-[100px] rounded-full z-0 mix-blend-screen pointer-events-none"></div>
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0 border border-white/10 rounded-3xl"></div>

          {/* Card Content */}
          <div className="flex flex-col gap-4 relative z-10 max-w-xl">
            <h3 className="text-3xl md:text-4xl font-display tracking-tight text-white drop-shadow-sm">
              Still Have A Question?
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Have a question we didn't cover? Send me a message on LinkedIn and we'll chat.
            </p>
          </div>
          
          {/* Button */}
          <div className="relative z-10 shrink-0">
            <a 
              href="https://linkedin.com/in/shreyashlondhe" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
