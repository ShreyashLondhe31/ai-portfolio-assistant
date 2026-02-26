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
        "Hi! I'm Shreyash's AI assistant. Ask me anything about his skills, projects, or experience.",
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
      const res = await fetch(
        "https://ai-portfolio-backend-v8f1.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      const data = await res.json();

      let cleaned = data.reply || "";

      // remove markdown bold
      cleaned = cleaned.replace(/\*\*/g, "");

      // fix escaped new lines
      cleaned = cleaned.replace(/\\n/g, "\n");

      // remove weird spacing
      cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

      // trim
      cleaned = cleaned.trim();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleaned }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to reach server. Try again.",
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm Shreyash's AI assistant. Ask me anything about his skills or projects.",
        },
      ]);

      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      {/* ONLINE LABEL */}
      <div className="flex items-center gap-2 pr-1">
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
        <p className="text-xs text-white/80 font-medium">AI Assistant</p>
      </div>

      {/* FLOAT BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center text-white"
          >
            <MessageSquare size={22} />
            <span className="absolute inset-0 rounded-2xl border border-violet-400/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35 }}
            className="
              w-[94vw] sm:w-[380px]
              h-[78vh] sm:h-[540px]
              max-w-[420px]
              flex flex-col
              rounded-3xl
              overflow-hidden
              shadow-2xl
              border border-white/10
            "
            style={{
              background: "rgba(10,14,25,0.92)",
              backdropFilter: "blur(22px)",
            }}
          >

            {/* HEADER */}
            <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                  SL
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d1220]" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Shreyash's Assistant
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <Sparkles size={10} />
                  AI-powered · Online
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 text-sm">

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 mr-2 mt-1 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      SL
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[85%]
                      px-4 py-3
                      rounded-2xl
                      whitespace-pre-wrap
                      leading-relaxed
                      ${msg.role === "user"
                        ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-tr-sm"
                        : "bg-white/10 text-gray-200 border border-white/10 rounded-tl-sm"
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* TYPING */}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[9px] font-bold">
                    SL
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="px-3 sm:px-4 py-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about Shreyash..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
                />

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </div>

              <p className="text-center text-gray-500 text-[10px] mt-2">
                Powered by GroqCloud
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}