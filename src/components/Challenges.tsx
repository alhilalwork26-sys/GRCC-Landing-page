"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// x/y = final resting position. fromX/fromY = entrance direction offset (px)
const challenges = [
  {
    text: "Governance frameworks that are outdated and fragmented",
    x: "5%",   y: "10%",
    fromX: -120, fromY: -20,
  },
  {
    text: "Slow compliance processes creating regulatory exposure",
    x: "60%",  y: "7%",
    fromX: 120,  fromY: -20,
  },
  {
    text: "Lack of accountability across departments and levels",
    x: "72%",  y: "40%",
    fromX: 120,  fromY: 0,
  },
  {
    text: "Siloed risk management with no unified view",
    x: "3%",   y: "56%",
    fromX: -120, fromY: 0,
  },
  {
    text: "Difficulty measuring governance effectiveness",
    x: "62%",  y: "72%",
    fromX: 120,  fromY: 20,
  },
  {
    text: "Scaling compliance by adding headcount, not systems",
    x: "16%",  y: "76%",
    fromX: -80,  fromY: 20,
  },
];

// Each card reveals at evenly-spaced scroll intervals
// 0.10–0.14: central text fades in
// 0.16–0.90: cards appear one by one
const TEXT_IN_START  = 0.05;
const TEXT_IN_END    = 0.16;
const CARDS_START    = 0.18;
const CARDS_END      = 0.88;

function getCardThreshold(index: number, total: number) {
  const span = CARDS_END - CARDS_START;
  const step = span / total;
  const start = CARDS_START + index * step;
  const end   = start + step * 0.55; // each card takes 55% of its step to fully appear
  return { start, end };
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-[1px]">
      <path d="M8 1L15 14H1L8 1Z" fill="#F59E0B" />
      <path d="M8 6.5V9.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.7" fill="white" />
    </svg>
  );
}

function ScrollCard({
  text, x, y, fromX, fromY, index, scrollYProgress,
}: {
  text: string; x: string; y: string;
  fromX: number; fromY: number;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end } = getCardThreshold(index, challenges.length);

  const opacity    = useTransform(scrollYProgress, [start, end], [0, 1]);
  const translateX = useTransform(scrollYProgress, [start, end], [fromX, 0]);
  const translateY = useTransform(scrollYProgress, [start, end], [fromY, 0]);

  // Subtle continuous drift after appearing (parallax float)
  const drift = index % 2 === 0 ? -18 : 14;
  const floatY = useTransform(scrollYProgress, [end, 1], [0, drift]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        x: translateX,
        y: useTransform(
          scrollYProgress,
          [start, end, 1],
          [fromY, 0, drift]
        ),
      }}
      className="flex items-start gap-2.5 bg-black/[0.04] rounded-lg px-4 py-3 w-[260px] xl:w-[295px] cursor-default select-none"
    >
      <WarningIcon />
      <span className="text-[0.82rem] leading-[1.5] text-dark/80 font-medium">{text}</span>
    </motion.div>
  );
}

function CentralText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [TEXT_IN_START, TEXT_IN_END], [0, 1]);
  const y       = useTransform(scrollYProgress, [TEXT_IN_START, TEXT_IN_END], [28, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none px-8"
    >
      <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.4] tracking-[-0.025em] text-center max-w-[600px]">
        We recognize the challenges you face.{" "}
        <span className="text-dark/40 font-normal">
          That is why your path to governance excellence starts here.
        </span>
      </p>
    </motion.div>
  );
}

export default function Challenges() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const SCROLL_STEPS = challenges.length + 3; // extra breathing room

  return (
    <>
      {/* ── DESKTOP sticky scroll-pinned section ── */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: `${SCROLL_STEPS * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-[#FAFAF8]">
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
      <section className="lg:hidden bg-[#FAFAF8] py-20 px-6">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[1.5rem] font-bold leading-[1.4] tracking-[-0.02em] text-center mb-2"
          >
            We recognize the challenges you face.{" "}
            <span className="text-dark/40 font-normal">
              That is why your path to governance excellence starts here.
            </span>
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {challenges.map((c, i) => (
              <motion.div
                key={c.text}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-2.5 bg-black/[0.04] rounded-lg px-4 py-3"
              >
                <WarningIcon />
                <span className="text-[0.82rem] leading-[1.5] text-dark/80 font-medium">{c.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
