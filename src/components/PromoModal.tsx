"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X, ArrowUpRight, Users, Award, Sparkles } from "lucide-react";

const STORAGE_KEY = "grcc_promo_v2_dismissed";
const HIGHLIGHT_ICONS = [Users, Award, Sparkles];

interface Facilitator { name: string; role: string; org: string; img?: string | null; main?: boolean; }
interface PromoData {
  id: string;
  active: boolean;
  badge: string;
  badge_color: string;
  tag: string;
  title: string;
  subtitle?: string;
  accent_color: string;
  description?: string;
  status: string;
  highlights?: string[] | null;
  facilitators: Facilitator[];
  cta_label: string;
  cta_href: string;
}

// ── Avatar placeholder ────────────────────────────────────────────────────────
function AvatarInitials({ name, color }: { name: string; color: string }) {
  const parts = name.split(",")[0].trim().split(" ");
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return (
    <div
      className="w-full h-full flex items-center justify-center text-white font-extrabold text-[1.1rem]"
      style={{ backgroundColor: color + "30", color }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function PromoModal() {
  const [show, setShow] = useState(false);
  const [promo, setPromo] = useState<PromoData | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    let timer: ReturnType<typeof setTimeout>;
    supabase
      .from("promo")
      .select("*")
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPromo(data as PromoData);
          timer = setTimeout(() => setShow(true), 900);
        }
      });
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!promo) return null;

  // highlights bisa berupa string[] atau {icon, text}[] — normalisasi ke string[]
  const rawHighlights = promo.highlights as Array<string | { icon?: string; text?: string }> | null | undefined;
  const highlights = rawHighlights?.map((h) =>
    typeof h === "string" ? h : (h?.text ?? "")
  ).filter(Boolean);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="promo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={dismiss}
            className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            key="promo-card"
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.05 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[680px] max-h-[92vh] overflow-y-auto rounded-[28px] pointer-events-auto"
              style={{
                background: "linear-gradient(160deg, #111118 0%, #0D0D0D 100%)",
                boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07), 0 0 80px ${promo.accent_color}18`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px]"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${promo.accent_color} 40%, ${promo.badge_color} 70%, transparent 100%)` }}
              />

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.18 }}
                onClick={dismiss}
                className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <X size={15} className="text-white/70" />
              </motion.button>

              {/* ── Header ─────────────────────────────────── */}
              <div className="relative px-8 pt-9 pb-7">
                {/* Glow blob */}
                <div
                  className="absolute top-0 right-0 w-[300px] h-[200px] pointer-events-none opacity-60"
                  style={{ background: `radial-gradient(ellipse at 80% 10%, ${promo.accent_color}20 0%, transparent 65%)` }}
                />

                {/* Tag row */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2.5 mb-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/grcc-logo.png" alt="GRCC" style={{ height: 28, width: "auto", filter: "brightness(1)" }} />
                  <div className="w-px h-4 bg-white/15" />
                  <span className="text-white/35 text-[0.65rem] font-mono tracking-[0.18em] uppercase">{promo.tag}</span>

                  {/* Badge */}
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full border" style={{ borderColor: promo.badge_color + "50", backgroundColor: promo.badge_color + "15" }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: promo.badge_color }} />
                    <span className="text-[0.62rem] font-extrabold tracking-[0.1em] uppercase" style={{ color: promo.badge_color }}>{promo.badge}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  <h2
                    className="font-extrabold tracking-tight leading-[1.1] mb-2 text-white"
                    style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)" }}
                  >
                    {promo.title}
                  </h2>
                  {promo.subtitle && (
                    <p className="font-bold text-[1rem] mb-4" style={{ color: promo.accent_color }}>
                      {promo.subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Description */}
                {promo.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/45 text-[0.84rem] leading-[1.8] mb-6"
                  >
                    {promo.description}
                  </motion.p>
                )}

                {/* Highlights chips */}
                {highlights && highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap gap-2"
                  >
                    {highlights.map((text: string, idx: number) => {
                      const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
                      return (
                        <span
                          key={idx}
                          className="flex items-center gap-2 text-[0.72rem] font-semibold px-3 py-1.5 rounded-full border border-white/[0.1] text-white/55 bg-white/[0.04]"
                        >
                          <Icon size={12} className="text-white/35" />
                          {text}
                        </span>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* ── Facilitators ───────────────────────────── */}
              {promo.facilitators && promo.facilitators.length > 0 && (
                <>
                  <div className="mx-8 h-px bg-white/[0.07]" />
                  <div className="px-8 py-7">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.38 }}
                      className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-white/25 mb-5"
                    >
                      Tim Fasilitator
                    </motion.p>

                    <div className={`grid gap-4 ${
                      promo.facilitators.length === 1 ? "grid-cols-1 max-w-[220px]"
                      : promo.facilitators.length === 2 ? "grid-cols-2"
                      : "grid-cols-3"
                    }`}>
                      {promo.facilitators.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.42 + i * 0.08, duration: 0.5 }}
                          className={`flex flex-col items-center text-center gap-3 p-4 rounded-2xl border transition-all ${
                            f.main
                              ? "border-white/[0.14] bg-white/[0.05]"
                              : "border-white/[0.06] bg-white/[0.02]"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10"
                            style={{ boxShadow: f.main ? `0 0 20px ${promo.accent_color}30` : "none" }}
                          >
                            {f.img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={f.img} alt={f.name} className="w-full h-full object-cover grayscale" />
                            ) : (
                              <AvatarInitials name={f.name} color={promo.accent_color} />
                            )}
                          </div>

                          <div>
                            {f.main && (
                              <span
                                className="inline-block text-[0.58rem] font-extrabold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full mb-1.5"
                                style={{ backgroundColor: promo.accent_color + "25", color: promo.accent_color }}
                              >
                                Koordinator
                              </span>
                            )}
                            <p className="text-white text-[0.75rem] font-bold leading-snug">{f.name}</p>
                            <p className="text-white/35 text-[0.65rem] leading-snug mt-1">{f.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Footer CTA ─────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mx-8 mb-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-white/[0.07]"
              >
                <p className="text-white/25 text-[0.74rem] leading-relaxed">
                  {promo.status === "coming_soon" ? (
                    <>Informasi pendaftaran akan segera diumumkan.<br />
                    <span className="text-white/40">Hubungi kami untuk info lebih lanjut.</span></>
                  ) : promo.status === "open" ? (
                    <>Pendaftaran sedang dibuka.<br />
                    <span className="text-white/40">Daftarkan diri Anda sekarang.</span></>
                  ) : (
                    <>Pendaftaran telah ditutup.<br />
                    <span className="text-white/40">Pantau program berikutnya.</span></>
                  )}
                </p>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={dismiss}
                    className="text-white/30 text-[0.78rem] font-semibold hover:text-white/55 transition-colors px-3 py-2"
                  >
                    Tutup
                  </button>
                  <motion.a
                    href={promo.cta_href}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-[0.82rem] font-extrabold px-5 py-3 rounded-xl transition-colors group"
                    style={{ backgroundColor: promo.accent_color, color: "#fff" }}
                  >
                    {promo.cta_label}
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
