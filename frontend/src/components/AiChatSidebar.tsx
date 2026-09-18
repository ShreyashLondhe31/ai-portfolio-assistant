import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contextTitle: string | null;
}

const RAW_API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://ai-portfolio-assistant-backend-s4xb.onrender.com' 
    : 'http://localhost:8000');
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const renderSafeContent = (text: string) => {
  if (!text) return null;
  // Safely parse markdown bold (**text**) without rendering raw HTML
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function AiChatSidebar({ isOpen, onClose, contextTitle }: AiChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message context and fetch summary
  useEffect(() => {
    let isMounted = true;
    
    const fetchInitialSummary = async () => {
      if (!isOpen || !contextTitle) return;

      const randomPrompts = [
        `Can you give me a quick overview of the ${contextTitle} project?`,
        `What's the main highlight of the ${contextTitle} project?`,
        `I'd love to hear a brief summary of ${contextTitle}.`,
        `Tell me more about what was achieved in ${contextTitle}.`,
        `Could you break down the ${contextTitle} project for me?`
      ];
      const initialUserMessage = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];

      // Show user message immediately and start typing indicator
      setMessages([{ role: 'user', content: initialUserMessage }]);
      setIsTyping(true);

      try {
        const prompt = `[System Context: The user just asked about the project "${contextTitle}". Please provide a very short, 2-sentence professional summary of this project. Then, end your response with a random, unique follow-up question asking what else they would like to know about it.]\n\nUser: ${initialUserMessage}`;
        
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        
        if (isMounted) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Sorry, I am having trouble connecting to the server right now.'
          }]);
        }
      } finally {
        if (isMounted) {
          setIsTyping(false);
        }
      }
    };

    fetchInitialSummary();

    return () => {
      isMounted = false;
    };
  }, [isOpen, contextTitle]);

  // Auto-scroll chat container to bottom on new messages without triggering window scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Prevent wheel events inside the sidebar from propagating to window/Lenis
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    sidebar.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      sidebar.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    try {
      // Secretly append the context to help the backend AI know what we are talking about
      const contextPrefix = `[Context: We are discussing the project "${contextTitle}".] `;
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextPrefix + userText })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          ref={sidebarRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="fixed top-0 right-0 h-[100vh] w-full md:w-[400px] bg-surface border-l border-stroke z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stroke shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center text-bg font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="font-medium text-text-primary text-sm">Ask AI</h3>
                <p className="text-[10px] text-muted uppercase tracking-widest">{contextTitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-bg border border-stroke text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatContainerRef}
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-bg overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === 'user' 
                      ? 'bg-text-primary text-bg rounded-tr-sm' 
                      : 'bg-surface border border-stroke text-text-primary rounded-tl-sm'
                  }`}
                >
                  {renderSafeContent(msg.content)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface border border-stroke rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-surface border-t border-stroke shrink-0">
            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-bg border border-stroke text-text-primary text-sm rounded-full py-4 pl-6 pr-12 focus:outline-none focus:border-text-primary/50 transition-colors"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-text-primary text-bg flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
