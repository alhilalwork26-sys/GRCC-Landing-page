"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, RotateCcw, ChevronDown, Sparkles } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Program apa saja yang ada di GRCC?",
  "Bagaimana cara mendaftar pelatihan?",
  "Apakah ada training online?",
  "Rekomendasikan program untuk saya",
];

// ── Markdown-light renderer ───────────────────────────────────────────────────
function renderMessage(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<p key={key++} className="font-bold text-[0.88rem] mt-3 mb-1">{line.slice(3)}</p>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={key++} className="font-bold text-[0.83rem]">{line.slice(2, -2)}</p>);
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 text-[0.82rem] leading-[1.65]">
          <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-50" />
          <span dangerouslySetInnerHTML={{ __html: inlineBold(line.slice(2)) }} />
        </div>
      );
    } else if (line === "") {
      if (elements.length > 0) elements.push(<div key={key++} className="h-1.5" />);
    } else {
      elements.push(
        <p key={key++} className="text-[0.83rem] leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: inlineBold(line) }} />
      );
    }
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

function inlineBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-current opacity-60"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Bot avatar ────────────────────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[0.62rem] font-extrabold"
      style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
      GR
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const abortRef    = useRef<AbortController | null>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya **GRCC Assistant** 👋\n\nSaya siap membantu Anda mengetahui lebih lanjut tentang program pelatihan, workshop, dan layanan konsultasi GRCC.\n\nAda yang bisa saya bantu?",
    }]);
  }, []);

  // Scroll to bottom
  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, []);

  useEffect(() => { if (open) scrollBottom(); }, [messages, open, scrollBottom]);

  // Mark unread when closed and new message arrives
  useEffect(() => {
    if (!open && messages.length > 1) setHasUnread(true);
  }, [messages, open]);

  const openChat = () => { setOpen(true); setHasUnread(false); setTimeout(() => inputRef.current?.focus(), 350); };

  const sendMessage = useCallback(async (text: string) => {
    const userText = text.trim();
    if (!userText || streaming) return;

    setShowQuick(false);
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: userText };
    const assistantId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);
    scrollBottom();

    abortRef.current = new AbortController();

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: accumulated } : m
        ));
        scrollBottom();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Maaf, terjadi kesalahan. Silakan coba lagi." }
            : m
        ));
      }
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming, scrollBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Halo! Saya **GRCC Assistant** 👋\n\nSaya siap membantu Anda mengetahui lebih lanjut tentang program pelatihan, workshop, dan layanan konsultasi GRCC.\n\nAda yang bisa saya bantu?",
    }]);
    setStreaming(false);
    setShowQuick(true);
    setInput("");
  };

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fixed bottom-6 right-6 z-[200]">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              {/* Ping ring */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }} />

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={openChat}
                data-chat-trigger
                className="relative w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
                title="Chat dengan GRCC Assistant"
              >
                <MessageCircle size={24} />
                {/* Unread badge */}
                {hasUnread && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-white text-[0.5rem] font-extrabold flex items-center justify-center"
                  >
                    1
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-6 right-6 z-[200] w-[370px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl overflow-hidden shadow-[0_32px_80px_-8px_rgba(0,0,0,0.3)] border border-white/10"
            style={{ height: "min(600px, calc(100vh - 5rem))" }}
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6D28D9 60%, #7C3AED 100%)" }}>
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-indigo-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-extrabold text-[0.92rem] leading-none">GRCC Assistant</p>
                <p className="text-white/60 text-[0.68rem] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  AI · Siap membantu
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={reset} title="Reset percakapan"
                  className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors">
                  <RotateCcw size={14} className="text-white/70" />
                </button>
                <button onClick={() => setOpen(false)} title="Tutup"
                  className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors">
                  <X size={16} className="text-white/80" />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto bg-[#F7F7F5] px-4 py-4 flex flex-col gap-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#ddd transparent" }}>

              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0 : 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && <BotAvatar />}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#4F46E5] text-white rounded-tr-sm"
                        : "bg-white text-dark shadow-sm border border-black/[0.05] rounded-tl-sm"
                    }`}
                  >
                    {msg.content === "" && msg.role === "assistant" ? (
                      <TypingDots />
                    ) : msg.role === "assistant" ? (
                      <>
                        {renderMessage(msg.content)}
                        {streaming && i === messages.length - 1 && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-0.5 h-3.5 bg-dark/40 ml-0.5 align-middle"
                          />
                        )}
                      </>
                    ) : (
                      <p className="text-[0.83rem] leading-[1.65] text-white">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick prompts */}
              <AnimatePresence>
                {showQuick && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <p className="text-[0.65rem] font-bold tracking-widest uppercase text-muted/70 text-center">
                      Pertanyaan populer
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_PROMPTS.map((q) => (
                        <motion.button
                          key={q}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => sendMessage(q)}
                          className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-full border border-[#4F46E5]/30 text-[#4F46E5] bg-[#4F46E5]/[0.07] hover:bg-[#4F46E5]/[0.14] transition-colors"
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </div>

            {/* ── Scroll to bottom button ── */}
            <AnimatePresence>
              {streaming && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute bottom-[68px] right-4 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center"
                >
                  <ChevronDown size={15} className="text-muted" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Input area ── */}
            <div className="flex-shrink-0 bg-white border-t border-black/[0.06] px-3 py-3">
              <div className="flex items-end gap-2 bg-[#F7F7F5] rounded-2xl border border-black/[0.08] px-3 py-2 focus-within:border-indigo-300 focus-within:shadow-sm transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan…"
                  disabled={streaming}
                  rows={1}
                  style={{ resize: "none", minHeight: 28, maxHeight: 120, overflow: "auto" }}
                  className="flex-1 bg-transparent text-[0.84rem] text-dark placeholder:text-muted/60 outline-none leading-[1.6] py-0.5 disabled:opacity-50"
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                  style={{ background: input.trim() ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : "#E5E5E5" }}
                >
                  <Send size={14} className={input.trim() ? "text-white" : "text-muted"} />
                </motion.button>
              </div>
              <p className="text-center text-[0.6rem] text-muted/50 mt-2">
                Powered by Claude AI · GRCC © 2025
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
