import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Shreyash's AI assistant. Ask me anything about his skills, projects, or experience. 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://ai-portfolio-backend-v8f1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const cleaned = data.reply.replace(/\*\*/g, "").replace(/\\n/g, "\n");

      setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to reach the server. Please try again." },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        <h3 className="font-semibold">AI Assistant</h3>
      </div>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl shadow-2xl shadow-violet-500/30 flex items-center justify-center text-white"
          >
            <MessageSquare size={22} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl border-2 border-violet-400/40 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            className="w-[380px] h-[540px] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
            style={{
              background: "rgba(13, 18, 32, 0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-white/8 flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-violet-500/30">
                  SL
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d1220]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-none">Shreyash's Assistant</p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <Sparkles size={10} />
                  AI-powered · Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mr-2 mt-1 shadow-lg shadow-violet-500/20">
                      SL
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                      ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20"
                      : "bg-white/8 text-gray-200 rounded-tl-sm border border-white/8"
                      }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 shadow-lg shadow-violet-500/20">
                      SL
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/8 flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, idx) => (
                        <motion.span
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full bg-violet-400"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-3 border-t border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-violet-500/40 focus-within:bg-violet-500/5 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                  placeholder="Ask about Shreyash..."
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white disabled:opacity-30 transition-opacity shadow-lg shadow-violet-500/30 flex-shrink-0"
                >
                  <Send size={14} />
                </motion.button>
              </div>
              <p className="text-center text-gray-700 text-[10px] mt-2">
                Powered by OpenRouter AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
