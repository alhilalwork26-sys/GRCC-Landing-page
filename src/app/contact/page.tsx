"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, MessageSquare, Send, Check,
  Loader2, ArrowUpRight, Building2, User, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── WhatsApp icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const SUBJECTS = [
  "Konsultasi Program",
  "Informasi Pelatihan",
  "Kerjasama / Partnership",
  "Permintaan Proposal",
  "Lainnya",
];

const contactInfo = [
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: "grcc.ailg@gmail.com",
    href: "mailto:grcc.ailg@gmail.com",
    desc: "Kami merespons dalam 1-2 hari kerja",
  },
  {
    icon: <WhatsAppIcon size={20} />,
    label: "WhatsApp",
    value: "+62 882-9898-9171",
    href: "https://wa.me/6288298989171",
    desc: "Respons lebih cepat untuk pertanyaan mendesak",
  },
  {
    icon: <MapPin size={20} />,
    label: "Lokasi",
    value: "Surabaya, Indonesia",
    href: "https://maps.google.com/?q=Surabaya,Indonesia",
    desc: "Universitas Airlangga · AILG",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    nama: "", email: "", perusahaan: "", subjek: "", pesan: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.subjek) e.subjek = "Pilih subjek pesan";
    if (!form.pesan.trim()) e.pesan = "Pesan wajib diisi";
    else if (form.pesan.trim().length < 20) e.pesan = "Pesan terlalu singkat (minimal 20 karakter)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.");
    } finally {
      setSending(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] } }),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-[72px]">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.35,
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg pointer-events-none" />

          <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16 py-24 lg:py-32">
            <motion.div
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fadeUp} className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-dark/40 mb-5">
                GRCC — Hubungi Kami
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold tracking-tight leading-[1.1] text-dark mb-6 max-w-[640px]">
                Mulai Percakapan<br />
                <span className="text-dark/30">dengan Tim Kami</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-[1rem] text-dark/55 leading-[1.75] max-w-[480px]">
                Kami siap membantu Anda merancang solusi tata kelola, manajemen risiko, dan kepatuhan yang tepat untuk organisasi Anda.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-16 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-20">

            {/* ── Form ──────────────────────────────────────────────────────── */}
            <div>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
                    >
                      <Check size={32} className="text-emerald-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-dark mb-3">Pesan Terkirim!</h2>
                    <p className="text-dark/55 text-[0.95rem] leading-[1.7] max-w-[360px]">
                      Terima kasih telah menghubungi kami. Tim GRCC akan merespons dalam 1-2 hari kerja.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ nama:"", email:"", perusahaan:"", subjek:"", pesan:"" }); }}
                      className="mt-8 px-6 py-3 bg-dark text-white text-[0.85rem] font-semibold rounded-xl hover:bg-[#222] transition-colors"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                  >
                    <motion.h2 variants={fadeUp} className="text-[1.4rem] font-extrabold tracking-tight text-dark mb-8">
                      Kirim Pesan
                    </motion.h2>

                    {/* Nama + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/60 uppercase tracking-wide">
                          <User size={12} /> Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.nama}
                          onChange={e => set("nama", e.target.value)}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl border text-[0.88rem] bg-white outline-none transition-all duration-200 placeholder:text-dark/25 focus:ring-2 focus:ring-offset-0 ${errors.nama ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-black/10 focus:border-dark focus:ring-dark/10"}`}
                        />
                        {errors.nama && <p className="text-[0.72rem] text-red-500">{errors.nama}</p>}
                      </motion.div>

                      <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/60 uppercase tracking-wide">
                          <Mail size={12} /> Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set("email", e.target.value)}
                          placeholder="john@perusahaan.com"
                          className={`w-full px-4 py-3 rounded-xl border text-[0.88rem] bg-white outline-none transition-all duration-200 placeholder:text-dark/25 focus:ring-2 focus:ring-offset-0 ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-black/10 focus:border-dark focus:ring-dark/10"}`}
                        />
                        {errors.email && <p className="text-[0.72rem] text-red-500">{errors.email}</p>}
                      </motion.div>
                    </div>

                    {/* Perusahaan */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-1.5 mb-4">
                      <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/60 uppercase tracking-wide">
                        <Building2 size={12} /> Perusahaan / Instansi
                      </label>
                      <input
                        value={form.perusahaan}
                        onChange={e => set("perusahaan", e.target.value)}
                        placeholder="PT / Kementerian / Universitas"
                        className="w-full px-4 py-3 rounded-xl border border-black/10 text-[0.88rem] bg-white outline-none transition-all duration-200 placeholder:text-dark/25 focus:border-dark focus:ring-2 focus:ring-dark/10"
                      />
                    </motion.div>

                    {/* Subjek dropdown */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-1.5 mb-4 relative">
                      <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/60 uppercase tracking-wide">
                        <MessageSquare size={12} /> Subjek <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setSubjectOpen(o => !o)}
                        className={`w-full px-4 py-3 rounded-xl border text-[0.88rem] bg-white outline-none transition-all duration-200 text-left flex items-center justify-between focus:ring-2 focus:ring-offset-0 ${errors.subjek ? "border-red-300 focus:ring-red-100" : "border-black/10 focus:border-dark focus:ring-dark/10"}`}
                      >
                        <span className={form.subjek ? "text-dark" : "text-dark/25"}>{form.subjek || "Pilih topik pesan…"}</span>
                        <ChevronDown size={16} className={`text-dark/40 transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {subjectOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full mt-1 left-0 right-0 bg-white border border-black/10 rounded-xl shadow-xl z-20 overflow-hidden"
                          >
                            {SUBJECTS.map(s => (
                              <button
                                type="button"
                                key={s}
                                onClick={() => { set("subjek", s); setSubjectOpen(false); }}
                                className="w-full text-left px-4 py-3 text-[0.88rem] hover:bg-dark/5 transition-colors border-b border-black/5 last:border-0"
                              >
                                {s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {errors.subjek && <p className="text-[0.72rem] text-red-500">{errors.subjek}</p>}
                    </motion.div>

                    {/* Pesan */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-1.5 mb-8">
                      <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/60 uppercase tracking-wide">
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={form.pesan}
                        onChange={e => set("pesan", e.target.value)}
                        placeholder="Ceritakan kebutuhan Anda, pertanyaan, atau topik yang ingin didiskusikan…"
                        className={`w-full px-4 py-3 rounded-xl border text-[0.88rem] bg-white outline-none transition-all duration-200 placeholder:text-dark/25 resize-none focus:ring-2 focus:ring-offset-0 ${errors.pesan ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-black/10 focus:border-dark focus:ring-dark/10"}`}
                      />
                      <div className="flex items-center justify-between">
                        {errors.pesan ? <p className="text-[0.72rem] text-red-500">{errors.pesan}</p> : <span />}
                        <p className="text-[0.7rem] text-dark/30">{form.pesan.length} karakter</p>
                      </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={fadeUp}>
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2.5 bg-dark text-white font-semibold px-8 py-4 rounded-xl text-[0.9rem] hover:bg-[#222] transition-colors disabled:opacity-60"
                      >
                        {sending ? (
                          <><Loader2 size={16} className="animate-spin" /> Mengirim…</>
                        ) : (
                          <><Send size={16} /> Kirim Pesan</>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Contact cards */}
              {contactInfo.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-4 p-5 bg-white border border-border rounded-2xl hover:border-dark/20 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-dark/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-dark/10 transition-colors">
                    <span className="text-dark/70">{c.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.7rem] font-bold tracking-[0.08em] uppercase text-dark/40 mb-0.5">{c.label}</p>
                    <p className="text-[0.9rem] font-semibold text-dark truncate">{c.value}</p>
                    <p className="text-[0.78rem] text-dark/45 mt-0.5">{c.desc}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-dark/25 group-hover:text-dark/50 transition-colors flex-shrink-0 mt-0.5" />
                </motion.a>
              ))}

              {/* FAQ teaser */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-dark rounded-2xl p-6 text-white"
              >
                <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-white/40 mb-3">Butuh jawaban cepat?</p>
                <p className="text-[1rem] font-bold mb-2">Coba GRCC Assistant</p>
                <p className="text-[0.82rem] text-white/55 leading-[1.6] mb-5">
                  Chatbot kami siap menjawab pertanyaan seputar program, pelatihan, pendaftaran, dan informasi GRCC 24/7.
                </p>
                <button
                  onClick={() => {
                    // Trigger chat widget open
                    const btn = document.querySelector("[data-chat-trigger]") as HTMLButtonElement | null;
                    if (btn) btn.click();
                    else window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 bg-white text-dark text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Buka Chat <ArrowUpRight size={13} />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
