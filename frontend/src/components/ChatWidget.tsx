import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export type ChatWidgetHandle = {
  openWithPrompt: (prompt: string) => void;
};

const ChatWidget = forwardRef<ChatWidgetHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "I'm Shreyash's AI assistant. Ask me about his architecture decisions, stack choices, or project details.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openWithPrompt(prompt: string) {
      setIsOpen(true);
      setMessages([{
        role: "assistant",
        content: "I'm Shreyash's AI assistant. Ask me about his architecture decisions, stack choices, or project details.",
      }]);
      // Brief delay to let the panel animate in before focusing
      setTimeout(() => {
        setInput(prompt);
        inputRef.current?.focus();
      }, 250);
    },
  }));

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to reach server. Try again later." }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 280);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      {/* Status label */}
      <div className="flex items-center gap-2 pr-1" style={{ fontFamily: "var(--mono)" }}>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--green)", boxShadow: "0 0 5px var(--green)" }}
        />
        <span className="text-[10px]" style={{ color: "var(--text-3)" }}>ai_assistant</span>
      </div>

      {/* Float button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 rounded-md flex items-center justify-center"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "var(--accent)",
            }}
          >
            <Terminal size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[94vw] sm:w-[380px] h-[76vh] sm:h-[500px] max-w-[420px] flex flex-col rounded-lg overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header — Windows title bar */}
            <div
              className="flex items-center justify-between"
              style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
            >
              {/* Left */}
              <div className="flex items-center gap-2 px-4 py-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-sm flex items-center justify-center"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.30)",
                    color: "var(--accent)",
                    fontSize: "8px",
                    fontFamily: "var(--mono)",
                  }}
                >
                  &gt;
                </div>
                <p className="text-xs" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>
                  shreyash_ai
                  <span style={{ color: "var(--text-3)", marginLeft: 4, opacity: 0.6 }}>— AI Terminal</span>
                </p>
                <div className="flex items-center gap-1 ml-1 text-[9px]" style={{ fontFamily: "var(--mono)", color: "var(--green)" }}>
                  <Sparkles size={8} />
                  <span>online</span>
                </div>
              </div>

              {/* Right: Windows ─ □ × */}
              <div className="flex items-stretch h-full" style={{ fontFamily: "var(--mono)", fontSize: "0.65rem" }}>
                <button
                  className="px-3.5 py-2.5 hover:bg-[#21262D] transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Minimize"
                  onClick={() => setIsOpen(false)}
                >─</button>
                <button
                  className="px-3.5 py-2.5 hover:bg-[#21262D] transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Maximize"
                >□</button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-2.5 hover:bg-[#F85149] hover:text-white transition-colors select-none"
                  style={{ color: "var(--text-3)" }}
                  title="Close"
                >✕</button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ background: "var(--bg2)" }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div
                      className="w-5 h-5 mr-2 mt-0.5 rounded-sm flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.30)",
                        color: "var(--accent)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      AI
                    </div>
                  )}
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-md text-xs whitespace-pre-wrap leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                          background: "rgba(99,102,241,0.20)",
                          border: "1px solid rgba(99,102,241,0.30)",
                          color: "var(--text)",
                          borderRadius: "8px 8px 2px 8px",
                        }
                        : {
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-2)",
                          fontFamily: "var(--mono)",
                          borderRadius: "2px 8px 8px 8px",
                          lineHeight: 1.65,
                        }
                    }
                  >
                    {msg.role === "assistant" && (
                      <span style={{ color: "var(--accent)", marginRight: 4 }}>{">"}</span>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.30)",
                      color: "var(--accent)",
                      fontFamily: "var(--mono)",
                    }}
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
                <span style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontSize: "0.65rem", flexShrink: 0 }}>PS&gt;</span>
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
                  className="w-6 h-6 rounded-md flex items-center justify-center disabled:opacity-25 transition-opacity"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.30)",
                    color: "var(--accent)",
                  }}
                >
                  <Send size={11} />
                </button>
              </div>
              <p className="text-center text-[9px] mt-1.5" style={{ fontFamily: "var(--mono)", color: "var(--text-3)" }}>
                powered by groqcloud
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ChatWidget.displayName = "ChatWidget";
export default ChatWidget;