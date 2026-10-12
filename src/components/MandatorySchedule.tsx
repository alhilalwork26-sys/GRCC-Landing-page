"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Check, Clock } from "lucide-react";
import type { TrainingSession } from "@/lib/supabase";

const EASE = [0.4, 0, 0.2, 1] as const;

function CalendarIllustration({ count, accent }: { count: number; accent: string }) {
  const reduce = useReducedMotion();
  const cells = Math.min(Math.max(count, 2), 8);
  const cols = 4;

  return (
    <svg viewBox="0 0 132 112" className="h-[92px] w-[108px] flex-shrink-0" aria-hidden>
      <motion.g
        initial={{ opacity: 0, y: 8, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ transformOrigin: "66px 56px" }}
      >
        <rect x="6" y="14" width="120" height="92" rx="16" fill="#fff" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
        <path d="M6 44V30a16 16 0 0 1 16-16h88a16 16 0 0 1 16 16v14H6Z" fill={accent} opacity="0.14" />
        <rect x="30" y="6" width="8" height="18" rx="4" fill={accent} />
        <rect x="94" y="6" width="8" height="18" rx="4" fill={accent} />
        {Array.from({ length: cells }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = 18 + c * 26;
          const y = 54 + r * 24;
          const active = i < count;
          return (
            <g key={i}>
              <motion.rect
                x={x} y={y} width="20" height="18" rx="6"
                fill={active ? accent : "rgba(0,0,0,0.05)"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: active ? 0.16 : 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07, type: "spring", stiffness: 380, damping: 22 }}
                style={{ transformOrigin: `${x + 10}px ${y + 9}px` }}
              />
              {active && (
                <motion.path
                  d={`M${x + 5.5} ${y + 9.5} l3.6 3.6 l6-7`}
                  fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                  transition={reduce ? { duration: 0.4 } : { duration: 5.2, times: [0, 0.12, 0.82, 1], delay: 0.6 + i * 0.45, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
}

export default function MandatorySchedule({
  sessions,
  accent,
}: {
  sessions: TrainingSession[];
  accent: string;
}) {
  const reduce = useReducedMotion();
  const n = sessions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-6"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: accent + "14" }}
      />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-[0.68rem] font-extrabold uppercase tracking-[0.15em]" style={{ color: accent }}>
            Jadwal Program
          </p>
          <h3 className="text-[1.05rem] font-extrabold leading-snug text-dark">Wajib mengikuti seluruh sesi</h3>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 24 }}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold"
            style={{ backgroundColor: accent + "14", color: accent }}
          >
            <Calendar size={11} /> {n} hari · {n} sesi
          </motion.span>
        </div>
        <CalendarIllustration count={n} accent={accent} />
      </div>

      <div className="relative flex flex-col gap-3">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.35 * n + 0.3, ease: EASE, delay: 0.15 }}
          className="absolute bottom-5 left-[19px] top-5 w-[2px] origin-top rounded-full"
          style={{ backgroundColor: accent + "26" }}
        />
        {!reduce && (
          <motion.span
            className="absolute left-[15px] h-[10px] w-[10px] rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 0 4px ${accent}22`, top: 14 }}
            animate={{ top: ["14px", "calc(100% - 24px)"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut", delay: 1.2, times: [0, 0.1, 0.9, 1] }}
          />
        )}

        {sessions.map((s, i) => {
          const times = s.times.filter(Boolean);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.22, duration: 0.5, ease: EASE }}
              className="relative flex items-start gap-4"
            >
              <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center">
                {!reduce && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: accent }}
                    animate={{ scale: [1, 1.7], opacity: [0.28, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.6, delay: 1 + i * 0.5, ease: "easeOut" }}
                  />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.22, type: "spring", stiffness: 420, damping: 18 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[0.82rem] font-black ring-2"
                  style={{ color: accent, ["--tw-ring-color" as string]: accent + "55" }}
                >
                  {i + 1}
                </motion.span>
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-black/[0.07] bg-[#FAFAFA] px-4 py-3 transition-colors hover:bg-white">
                <p className="text-[0.88rem] font-extrabold leading-snug text-dark">
                  {s.day}{s.day && s.date ? ", " : ""}{s.date}
                </p>
                {times.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {times.map((t, ti) => (
                      <motion.span
                        key={ti}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.22 + ti * 0.08 }}
                        className="inline-flex items-center gap-1 rounded-full border border-black/[0.07] bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-dark/70"
                      >
                        <Clock size={10} style={{ color: accent }} /> {t}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + n * 0.22 }}
        className="relative mt-5 flex items-start gap-2.5 rounded-xl px-3.5 py-3"
        style={{ backgroundColor: accent + "0D" }}
      >
        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: accent }}>
          <Check size={10} className="text-white" strokeWidth={3.5} />
        </span>
        <p className="text-[0.74rem] font-semibold leading-relaxed text-dark/70">
          Semua tanggal di atas otomatis tercakup dalam pendaftaran Anda — tidak perlu memilih salah satu.
        </p>
      </motion.div>
    </motion.div>
  );
}
