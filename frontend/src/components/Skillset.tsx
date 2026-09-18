import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShieldAlert, 
  Activity, 
  Crosshair, 
  Bug, 
  Terminal, 
  Lock, 
  FileCode, 
  Layers, 
  GitBranch, 
  Cpu, 
  Database, 
  Key,
  FolderOpen,
  Folder as FolderIcon,
  Sparkles
} from 'lucide-react';
import Folder from './Folder/Folder';

gsap.registerPlugin(ScrollTrigger);

interface SkillPaper {
  badge: string;
  icon: typeof ShieldAlert;
  title: string;
  subtitle: string;
  code: string;
  level: string;
}

interface SkillDomain {
  id: string;
  category: string;
  title: string;
  description: string;
  color: string;
  tags: string[];
  papers: SkillPaper[];
}

const skillDomains: SkillDomain[] = [
  {
    id: '01',
    category: 'BLUE TEAM FOUNDATIONS',
    title: 'SOC, Alert Triage & Response',
    description: 'Defensive security operations specializing in log correlation, threat triage, and end-to-end incident mitigation.',
    color: '#2563eb', // Royal Blue
    tags: ['SIEM', 'EDR', 'Incident Lifecycle', 'Wazuh', 'Splunk Telemetry'],
    papers: [
      {
        badge: 'SOC TRIAGE',
        icon: ShieldAlert,
        title: 'Alert Triage & Escalation',
        subtitle: 'Log correlation & anomaly detection',
        code: 'SOC-TRG',
        level: '01'
      },
      {
        badge: 'IR LIFECYCLE',
        icon: Activity,
        title: 'Incident Response',
        subtitle: 'Containment, eradication & recovery',
        code: 'IR-RESP',
        level: '02'
      },
      {
        badge: 'CYBER DEFENSE',
        icon: Crosshair,
        title: 'TryHackMe SOC L1',
        subtitle: 'Defensive frameworks & threat hunting',
        code: 'THM-L1',
        level: '03'
      }
    ]
  },
  {
    id: '02',
    category: 'APPLICATION SECURITY',
    title: 'OWASP Top 10 & Pentesting',
    description: 'Offensive vulnerability discovery, exploiting web attack vectors, and authoring clean remediation code.',
    color: '#e11d48', // Vibrant Crimson
    tags: ['Burp Suite Pro', 'Kali Linux', 'Nmap', 'OWASP Top 10', 'Secure Code Review'],
    papers: [
      {
        badge: 'OWASP TOP 10',
        icon: Bug,
        title: 'Vulnerability Audit',
        subtitle: 'NoSQLi, IDOR & Broken Authentication',
        code: 'APP-VULN',
        level: '01'
      },
      {
        badge: 'OFFENSIVE SUITE',
        icon: Terminal,
        title: 'Burp Suite & Kali',
        subtitle: 'Repeater, Intruder & Nmap reconnaissance',
        code: 'PEN-TOOL',
        level: '02'
      },
      {
        badge: 'REMEDIATION',
        icon: Lock,
        title: 'Secure Code Review',
        subtitle: 'MERN input sanitization & auth gates',
        code: 'SEC-CODE',
        level: '03'
      }
    ]
  },
  {
    id: '03',
    category: 'DEVSECOPS PIPELINES',
    title: 'SAST, SCA & Security Gates',
    description: 'Integrating automated security checks into CI/CD workflows, keeping production builds immune to known CVEs.',
    color: '#059669', // Emerald
    tags: ['SonarQube SAST', 'Trivy Container Scan', 'GitHub Actions', 'Vault Secrets', 'IaC Linting'],
    papers: [
      {
        badge: 'SAST SCAN',
        icon: FileCode,
        title: 'SonarQube Analysis',
        subtitle: 'Code smells & static vulnerability gates',
        code: 'SAST-GAT',
        level: '01'
      },
      {
        badge: 'CONTAINERS',
        icon: Layers,
        title: 'Trivy Vulnerability Scan',
        subtitle: 'SCA, Dockerfile linting & image hardening',
        code: 'TRIV-SCA',
        level: '02'
      },
      {
        badge: 'CI AUTOMATION',
        icon: GitBranch,
        title: 'GitHub Actions CI',
        subtitle: '12 automated checks & Vault secrets',
        code: 'CI-GATES',
        level: '03'
      }
    ]
  },
  {
    id: '04',
    category: 'AI / LLM SECURITY',
    title: 'Prompt Injection Mitigation',
    description: 'Hardening modern AI agent architectures and vector stores against adversarial manipulation and data leaks.',
    color: '#7c3aed', // Cyber Violet
    tags: ['Prompt Injection', 'pgvector RBAC', 'RAG Context Isolation', 'Docker Hardening'],
    papers: [
      {
        badge: 'ADVERSARIAL',
        icon: Cpu,
        title: 'Prompt Injection Defense',
        subtitle: 'Jailbreak mitigation & system prompt hardening',
        code: 'LLM-INJ',
        level: '01'
      },
      {
        badge: 'VECTOR DB',
        icon: Database,
        title: 'pgvector Access Control',
        subtitle: 'RBAC & context-isolated vector search',
        code: 'VEC-RBAC',
        level: '02'
      },
      {
        badge: 'RAG DEFENSE',
        icon: Key,
        title: 'RAG Pipeline Hardening',
        subtitle: 'Non-root containers & least privilege',
        code: 'RAG-HARD',
        level: '03'
      }
    ]
  }
];

export default function Skillset() {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    '01': false,
    '02': false,
    '03': false,
    '04': false
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skillset-reveal',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#skillset',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allOpen = Object.values(openFolders).every(Boolean);

  const toggleAll = () => {
    const nextState = !allOpen;
    setOpenFolders({
      '01': nextState,
      '02': nextState,
      '03': nextState,
      '04': nextState
    });
  };

  return (
    <section className="relative w-full bg-bg py-24 md:py-32" id="skillset">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Header Section */}
        <div className="skillset-reveal flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stroke bg-surface/50 text-xs font-medium uppercase tracking-widest text-text-primary">
              <span className="opacity-70">{"</>"}</span> Classified Dossiers
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary tracking-tight">
              Technical <br className="hidden md:block"/> Clearance Dossiers
            </h2>
            <p className="text-sm md:text-base text-muted max-w-xl font-normal leading-relaxed">
              Interactive security clearance folders containing verified competencies across Blue Teaming, Application Pentesting, DevSecOps, and AI Security.
            </p>
          </div>

          {/* Quick toggle all action */}
          <button
            onClick={toggleAll}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-stroke bg-surface/80 hover:bg-surface text-xs font-medium uppercase tracking-widest text-text-primary transition-all duration-300 hover:border-text-primary/30 group shadow-sm self-start md:self-auto cursor-pointer"
          >
            {allOpen ? (
              <>
                <FolderIcon className="w-4 h-4 text-muted group-hover:text-text-primary transition-colors" />
                <span>Collapse All Dossiers</span>
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 text-muted group-hover:text-text-primary transition-colors" />
                <span>Inspect All Dossiers</span>
              </>
            )}
          </button>
        </div>

        {/* 2x2 Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {skillDomains.map((domain) => {
            const isOpen = !!openFolders[domain.id];
            
            // Format papers as custom interactive cards
            const folderItems = domain.papers.map((paper) => {
              const Icon = paper.icon;
              return (
                <div 
                  key={paper.code}
                  className="w-full h-full flex flex-col justify-between items-stretch p-2 text-slate-900 select-none cursor-pointer"
                  title={`${paper.title}: ${paper.subtitle}`}
                >
                  {/* Top Bar: Badge & Icon */}
                  <div className="flex items-center justify-between border-b border-slate-200/90 pb-1">
                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded">
                      {paper.badge}
                    </span>
                    <Icon className="w-2.5 h-2.5 text-slate-700 shrink-0" />
                  </div>
                  
                  {/* Middle Content: Title & Subtitle */}
                  <div className="my-auto text-left py-0.5">
                    <div className="text-[10px] font-extrabold text-slate-900 leading-snug tracking-tight">
                      {paper.title}
                    </div>
                    <div className="text-[7.5px] font-medium text-slate-600 leading-tight mt-0.5 line-clamp-2">
                      {paper.subtitle}
                    </div>
                  </div>

                  {/* Footer Bar: Clearance Code */}
                  <div className="flex items-center justify-between border-t border-slate-200/90 pt-0.5 text-[6.5px] font-mono text-slate-500">
                    <span className="tracking-wider">LVL-{paper.level}</span>
                    <span className="font-bold text-slate-700">{paper.code}</span>
                  </div>
                </div>
              );
            });

            return (
              <div
                key={domain.id}
                className={`skillset-reveal relative flex flex-col bg-surface/70 border rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 backdrop-blur-sm overflow-visible group ${
                  isOpen 
                    ? 'border-white/30 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.7)]' 
                    : 'border-stroke hover:border-stroke/80'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-stroke/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-muted tracking-wider">
                      {domain.id} //
                    </span>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium">
                      {domain.category}
                    </h4>
                  </div>

                  {/* Status Indicator */}
                  <button
                    onClick={() => toggleFolder(domain.id)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-stroke/80 bg-surface hover:bg-stroke/40 transition-colors cursor-pointer text-muted hover:text-text-primary"
                  >
                    <span 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-muted'
                      }`}
                    />
                    <span>{isOpen ? 'Classified Open' : 'Click Folder'}</span>
                  </button>
                </div>

                {/* Folder Interactive Stage with ample vertical space and clearance */}
                <div className="relative w-full h-72 md:h-80 flex items-center justify-center my-4 overflow-visible">
                  {/* Subtle color aura matching domain */}
                  <div 
                    className="absolute w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-500"
                    style={{ backgroundColor: domain.color, opacity: isOpen ? 0.35 : 0.15 }}
                  />

                  {/* React Bits Folder Component */}
                  <div className="relative z-20 flex items-center justify-center">
                    <Folder
                      size={isMobile ? 1.35 : 1.65}
                      color={domain.color}
                      items={folderItems}
                      isOpen={isOpen}
                      onToggle={() => toggleFolder(domain.id)}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Interactive hint floating below folder */}
                  <div 
                    onClick={() => toggleFolder(domain.id)}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-mono text-muted/70 hover:text-text-primary transition-colors cursor-pointer select-none"
                  >
                    <Sparkles className="w-3 h-3 text-muted/60" />
                    <span>{isOpen ? 'Click folder to close' : 'Click folder to reveal 3 files'}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col pt-4 border-t border-stroke/60">
                  <h3 className="text-xl md:text-2xl font-display text-text-primary mb-2">
                    {domain.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-muted mb-5 leading-relaxed font-normal">
                    {domain.description}
                  </p>

                  {/* Tags Pill Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {domain.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted/90 bg-bg/60 border border-stroke px-2.5 py-1 rounded-md"
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: domain.color }}
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
