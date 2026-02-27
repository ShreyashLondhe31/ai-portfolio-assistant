import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hi! I'm Shreyash's AI assistant. Ask me anything about his skills, projects, or experience.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://ai-portfolio-backend-v8f1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const cleaned = (data.reply || "")
        .replace(/\*\*/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to reach server. Try again." }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: "assistant", content: "Hi! I'm Shreyash's AI assistant. Ask me anything about his skills or projects." }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      {/* Status label */}
      <div className="flex items-center gap-2 pr-1" style={{ fontFamily: "var(--mono)" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
        <span className="text-xs" style={{ color: "var(--text-3)" }}>ai_assistant</span>
      </div>

      {/* Float button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
            style={{
              background: "var(--accent)",
              border: "1px solid rgba(47,129,247,0.5)",
              boxShadow: "0 4px 20px var(--accent-glow)",
            }}
          >
            <Terminal size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[94vw] sm:w-[380px] h-[78vh] sm:h-[520px] max-w-[420px] flex flex-col rounded-lg overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header — Windows title bar style */}
            <div
              className="flex items-center justify-between"
              style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
            >
              {/* Left: app icon + title */}
              <div className="flex items-center gap-2 px-4 py-2.5">
                <div
                  className="w-4 h-4 rounded-sm flex items-center justify-center text-white"
                  style={{ background: "var(--accent)", fontSize: "9px", fontWeight: 700, fontFamily: "var(--mono)" }}
                >
                  &gt;
                </div>
                <p className="text-xs" style={{ fontFamily: "var(--mono)", color: "var(--text-2)" }}>
                  shreyash_ai
                  <span style={{ color: "var(--text-3)", marginLeft: 4 }}>— AI Terminal</span>
                </p>
                <div className="flex items-center gap-1 ml-2 text-[10px]" style={{ fontFamily: "var(--mono)", color: "var(--green)" }}>
                  <Sparkles size={9} />
                  <span>online</span>
                </div>
              </div>

              {/* Right: Windows ─ □ × */}
              <div className="flex items-stretch h-full" style={{ fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
                <button
                  className="px-4 py-2.5 hover:bg-[#21262D] transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Minimize"
                  onClick={() => setIsOpen(false)}
                >─</button>
                <button
                  className="px-4 py-2.5 hover:bg-[#21262D] transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Maximize"
                >□</button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 hover:bg-[#F85149] hover:text-white transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Close"
                >✕</button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm"
              style={{ background: "var(--bg2)" }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 mr-2 mt-0.5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0 text-white"
                      style={{ background: "var(--accent)" }}
                    >
                      AI
                    </div>
                  )}
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-md whitespace-pre-wrap leading-relaxed text-xs"
                    style={
                      msg.role === "user"
                        ? {
                          background: "var(--accent)",
                          color: "#fff",
                          borderRadius: "8px 8px 2px 8px",
                        }
                        : {
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--mono)",
                          borderRadius: "2px 8px 8px 8px",
                        }
                    }
                  >
                    {msg.role === "assistant" && (
                      <span style={{ color: "var(--green)" }}>{">"} </span>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: "var(--accent)" }}
                  >AI</div>
                  <div
                    className="px-3.5 py-2.5 rounded-md flex gap-1.5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full animate-bounce"
                        style={{ background: "var(--text-3)", animationDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3"
              style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
            >
              <div
                className="flex items-center gap-2 rounded-md px-3 py-2"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
              >
                <span style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontSize: "0.7rem", flexShrink: 0 }}>PS&gt;</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
                  placeholder="ask anything..."
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ fontFamily: "var(--mono)", color: "var(--text)" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white disabled:opacity-30 transition-transform hover:scale-105"
                  style={{ background: "var(--accent)" }}
                >
                  <Send size={13} />
                </button>
              </div>
              <p className="text-center text-[10px] mt-1.5" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>
                powered by groqcloud
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}