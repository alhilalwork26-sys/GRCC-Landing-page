"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X, Calendar, MapPin, Clock, Users, ArrowUpRight,
  Target, CheckCircle2, UserCheck, CreditCard, BookOpen,
} from "lucide-react";
import { TrainingItem } from "@/lib/supabase";
import { parseTrainingSection } from "@/lib/training-sections";
import ShareTrainingButton from "@/components/ShareTrainingButton";

interface Props {
  training: TrainingItem | null;
  accent?: string;
  onClose: () => void;
}

export default function TrainingDetailModal({ training, accent = "#4F46E5", onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (training) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [training]);

  const objectiveSection = parseTrainingSection(training?.objectives, "Tujuan Pelatihan");
  const audienceSection  = parseTrainingSection(training?.target_audience, "Untuk Siapa?");
  const objectiveLines   = objectiveSection.items;
  const audienceLines    = audienceSection.items;
  const daftarHref       = training ? `/daftar/${training.id}` : "#";
  const daftarGrupHref   = training ? `/daftar-grup/${training.id}` : "#";

  return (
    <AnimatePresence>
      {training && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white w-full sm:max-w-[640px] max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* ── Hero ── */}
              <div className="relative flex-shrink-0 h-[180px] sm:h-[220px] overflow-hidden">
                {training.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={training.poster_url}
                    alt={training.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: training.color + "15" }}
                  >
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(${training.color}18 1px, transparent 1px), linear-gradient(90deg, ${training.color}18 1px, transparent 1px)`,
                      backgroundSize: "36px 36px",
                    }} />
                    <div className="absolute inset-0" style={{
                      background: `radial-gradient(ellipse at 60% 20%, ${training.color}35 0%, transparent 60%)`,
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center select-none">
                      <span
                        className="text-[5rem] font-black tracking-[-0.06em] leading-none"
                        style={{ color: training.color + "20" }}
                      >
                        {(training.category || training.title).slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className="text-[0.6rem] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: training.color }}
                  >
                    {training.format}
                  </span>
                  {training.category && (
                    <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">
                      {training.category}
                    </span>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <X size={14} className="text-white" />
                </button>

                {/* Price */}
                {(training.price || training.price_label) && (
                  <p className="absolute bottom-4 left-4 text-white font-extrabold text-[1.1rem] leading-none drop-shadow-md">
                    {training.price
                      ? `Rp ${training.price.toLocaleString("id-ID")}`
                      : training.price_label}
                  </p>
                )}
              </div>

              {/* ── Body (scrollable) ── */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 pt-5 pb-2">
                  <h2 className="font-extrabold text-[1.15rem] leading-snug tracking-tight text-dark mb-3">
                    {training.title}
                  </h2>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {training.date_start && (
                      <Chip icon={<Calendar size={11} />}>
                        {training.date_start}{training.date_end ? ` – ${training.date_end}` : ""}
                      </Chip>
                    )}
                    {training.time && <Chip icon={<Clock size={11} />}>{training.time}</Chip>}
                    {training.location && <Chip icon={<MapPin size={11} />}>{training.location}</Chip>}
                    {training.max_participants && (
                      <Chip icon={<Users size={11} />}>Maks. {training.max_participants} peserta</Chip>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border mb-5" />
                </div>

                <div className="px-6 flex flex-col gap-6 pb-4">
                  {/* Description */}
                  {training.description && (
                    <Section icon={<BookOpen size={14} />} label="Tentang Program" accent={training.color}>
                      <p className="text-[0.85rem] leading-[1.85] text-dark/65 whitespace-pre-line">
                        {training.description}
                      </p>
                    </Section>
                  )}

                  {/* Objectives */}
                  {objectiveLines.length > 0 && (
                    <Section icon={<Target size={14} />} label={objectiveSection.title} accent={training.color}>
                      <ul className="flex flex-col gap-2">
                        {objectiveLines.map((obj, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            className="flex items-start gap-2.5 text-[0.84rem] text-dark/70 leading-[1.7]"
                          >
                            <CheckCircle2
                              size={14}
                              className="flex-shrink-0 mt-[3px]"
                              style={{ color: training.color }}
                            />
                            {obj}
                          </motion.li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {/* Target Audience */}
                  {audienceLines.length > 0 && (
                    <Section icon={<UserCheck size={14} />} label={audienceSection.title} accent={training.color}>
                      <div className="flex flex-wrap gap-2">
                        {audienceLines.map((aud, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="text-[0.78rem] font-semibold px-3 py-1.5 rounded-full border"
                            style={{
                              borderColor: training.color + "40",
                              backgroundColor: training.color + "0D",
                              color: training.color,
                            }}
                          >
                            {aud}
                          </motion.span>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* VA Payment info */}
                  {training.va_number && (
                    <Section icon={<CreditCard size={14} />} label="Pembayaran" accent={training.color}>
                      <div
                        className="rounded-xl border p-4 text-center"
                        style={{ borderColor: training.color + "30", backgroundColor: training.color + "08" }}
                      >
                        <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-1" style={{ color: training.color }}>
                          Virtual Account {training.va_bank ?? ""}
                        </p>
                        <p className="font-mono font-extrabold text-[1.1rem] tracking-widest text-dark">
                          {training.va_number}
                        </p>
                        <p className="text-[0.7rem] text-muted mt-1">a.n. Universitas Airlangga</p>
                      </div>
                    </Section>
                  )}
                </div>
              </div>

              {/* ── CTA footer ── */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-white">
                <div className="flex gap-2.5">
                  <Link
                    href={daftarHref}
                    className="flex-1 flex items-center justify-center gap-2 font-extrabold text-[0.88rem] py-3.5 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ backgroundColor: training.color, boxShadow: `0 6px 20px ${training.color}35` }}
                  >
                    Daftar Sekarang <ArrowUpRight size={15} />
                  </Link>
                  <Link
                    href={daftarGrupHref}
                    className="flex items-center justify-center gap-1.5 font-bold text-[0.82rem] px-4 py-3.5 rounded-xl border-2 transition-all hover:opacity-80"
                    style={{ borderColor: training.color + "60", color: training.color }}
                  >
                    <Users size={14} /> Grup
                  </Link>
                  <ShareTrainingButton
                    trainingId={training.id}
                    title={training.title}
                    accent={training.color}
                    variant="icon"
                    className="h-[50px] w-12 rounded-xl border border-border bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function Section({
  icon, label, accent, children,
}: { icon: React.ReactNode; label: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: accent }}>{icon}</span>
        <span className="text-[0.68rem] font-extrabold tracking-[0.12em] uppercase text-muted">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted px-2.5 py-1 rounded-full bg-dark/[0.05] border border-border">
      {icon} {children}
    </span>
  );
}
