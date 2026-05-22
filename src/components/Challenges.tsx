"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Cards surround the central text (center zone: ~28%–68% x, ~25%–70% y)
// Left column keeps cards to the left of center text
// Right column keeps cards to the right of center text
const challenges = [
  {
    text: "Tata kelola organisasi yang belum sepenuhnya terintegrasi dan terdokumentasi dengan baik.",
    x: "2%",  y: "4%",
    fromX: -80, floatY: -7, floatDur: 4.2, floatDelay: 0,
  },
  {
    text: "Risiko bisnis, operasional, dan kepatuhan yang semakin kompleks dan dinamis.",
    x: "71%", y: "7%",
    fromX: 80,  floatY: 8,  floatDur: 3.8, floatDelay: 0.6,
  },
  {
    text: "Kebutuhan untuk menyesuaikan praktik organisasi dengan standar GRC dan sustainability global.",
    x: "2%",  y: "31%",
    fromX: -80, floatY: -9, floatDur: 4.6, floatDelay: 0.3,
  },
  {
    text: "Tantangan dalam membangun sistem manajemen risiko yang efektif dan berkelanjutan.",
    x: "71%", y: "34%",
    fromX: 80,  floatY: 7,  floatDur: 3.6, floatDelay: 0.9,
  },
  {
    text: "Keterbatasan kapasitas internal dalam merancang kebijakan, prosedur, dan kontrol organisasi.",
    x: "2%",  y: "58%",
    fromX: -80, floatY: -8, floatDur: 4.0, floatDelay: 0.5,
  },
  {
    text: "Tekanan untuk meningkatkan transparansi, akuntabilitas, dan kepercayaan stakeholder.",
    x: "71%", y: "61%",
    fromX: 80,  floatY: 10, floatDur: 4.4, floatDelay: 0.2,
  },
  {
    text: "Kebutuhan data, riset, dan asesmen yang kuat untuk mendukung pengambilan keputusan strategis.",
    x: "2%",  y: "80%",
    fromX: -80, floatY: -7, floatDur: 3.9, floatDelay: 0.7,
  },
  {
    text: "Tantangan UMKM, BUMN/BUMD, sektor publik, dan korporasi dalam meningkatkan daya saing berkelanjutan.",
    x: "71%", y: "83%",
    fromX: 80,  floatY: 9,  floatDur: 4.1, floatDelay: 0.4,
  },
];

const TEXT_IN_START = 0.04;
const TEXT_IN_END   = 0.15;
const CARDS_START   = 0.16;
const CARDS_END     = 0.88;

function getCardThreshold(index: number, total: number) {
  const span = CARDS_END - CARDS_START;
  const step = span / total;
  const start = CARDS_START + index * step;
  const end   = start + step * 0.6;
  return { start, end };
}

function WarningIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-[1px]">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L14.5 13.5H1.5L8 1.5Z" fill="#F59E0B" />
        <path d="M8 6.5V9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="white" />
      </svg>
    </div>
  );
}

function ScrollCard({
  text, x, y, fromX, floatY, floatDur, floatDelay, index, scrollYProgress,
}: {
  text: string; x: string; y: string;
  fromX: number;
  floatY: number; floatDur: number; floatDelay: number;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end } = getCardThreshold(index, challenges.length);

  const opacity    = useTransform(scrollYProgress, [start, end], [0, 1]);
  const translateX = useTransform(scrollYProgress, [start, end], [fromX, 0]);
  const translateY = useTransform(scrollYProgress, [start, end], [-12, 0]);
  const scale      = useTransform(scrollYProgress, [start, end], [0.93, 1]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        x: translateX,
        y: translateY,
        scale,
      }}
      className="w-[255px] xl:w-[270px]"
    >
      {/* Inner element handles continuous float */}
      <motion.div
        animate={{ y: [0, floatY, 0] }}
        transition={{
          duration: floatDur,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
          repeatType: "loop",
        }}
        className="group bg-white rounded-2xl border border-black/[0.07] px-4 py-4 flex items-start gap-3 cursor-default select-none"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <WarningIcon />
        <span className="text-[0.8rem] leading-[1.6] text-dark/75 font-medium pt-[1px]">
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
}

function CentralText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [TEXT_IN_START, TEXT_IN_END], [0, 1]);
  const y       = useTransform(scrollYProgress, [TEXT_IN_START, TEXT_IN_END], [32, 0]);
  const scale   = useTransform(scrollYProgress, [TEXT_IN_START, TEXT_IN_END], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none px-8"
    >
      <div className="text-center max-w-[520px]">
        <p className="text-[clamp(1.45rem,2.2vw,1.9rem)] font-extrabold leading-[1.35] tracking-[-0.03em] text-dark mb-3">
          We recognize the challenges you face.
        </p>
        <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] font-normal leading-[1.7] text-dark/40">
          That is why your path to governance excellence starts here.
        </p>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {challenges.map((_, i) => (
            <ProgressDot key={i} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  index,
  scrollYProgress,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const threshold = getCardThreshold(index, challenges.length);
  const opacity = useTransform(scrollYProgress, [threshold.start, threshold.end], [0.15, 1]);
  const scale = useTransform(scrollYProgress, [threshold.start, threshold.end], [0.6, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-1.5 h-1.5 rounded-full bg-amber-400"
    />
  );
}

export default function Challenges() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const SCROLL_STEPS = challenges.length + 4;

  return (
    <>
      {/* ── DESKTOP sticky scroll-pinned ── */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: `${SCROLL_STEPS * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-[#F8F8F6]">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
            }}
          />

          <CentralText scrollYProgress={scrollYProgress} />

          <div className="absolute inset-0">
            {challenges.map((c, i) => (
              <ScrollCard
                key={c.text}
                {...c}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE stacked ── */}
      <section className="lg:hidden bg-[#F8F8F6] py-20 px-5">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-2"
          >
            <p className="text-[1.5rem] font-extrabold leading-[1.35] tracking-[-0.025em] text-dark mb-2">
              We recognize the challenges you face.
            </p>
            <p className="text-[0.95rem] text-dark/40 leading-[1.7]">
              That is why your path to governance excellence starts here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {challenges.map((c, i) => (
              <motion.div
                key={c.text}
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white rounded-2xl border border-black/[0.07] px-4 py-4 flex items-start gap-3"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
              >
                <WarningIcon />
                <span className="text-[0.8rem] leading-[1.6] text-dark/75 font-medium pt-[1px]">
                  {c.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
