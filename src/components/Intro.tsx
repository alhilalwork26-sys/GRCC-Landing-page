"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const phrases = [
  "Governance you can trust.",
  "Compliance you can rely on.",
];

// 3 stages: 0 = phrase[0], 1 = phrase[1], 2 = logo
type Stage = 0 | 1 | 2;

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [stage, setStage] = useState<Stage>(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const FADE_IN  = 300;
    const HOLD_TEXT = 1100;
    const HOLD_LOGO = 1600;
    const FADE_OUT = 400;
    const GAP      = 160;

    let t: ReturnType<typeof setTimeout>;

    const holdTime = stage === 2 ? HOLD_LOGO : HOLD_TEXT;

    setVisible(true);
    t = setTimeout(() => {
      setVisible(false);
      t = setTimeout(() => {
        if (stage < 2) {
          setStage((s) => (s + 1) as Stage);
        } else {
          setExiting(true);
          t = setTimeout(onComplete, 800);
        }
      }, FADE_OUT + GAP);
    }, FADE_IN + holdTime);

    return () => clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D]"
        >
          <AnimatePresence mode="wait">
            {/* Phrases 0 & 1 */}
            {visible && stage < 2 && (
              <motion.p
                key={phrases[stage]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="text-white text-[1.05rem] font-normal tracking-[0.01em] select-none"
              >
                {phrases[stage]}
              </motion.p>
            )}

            {/* Stage 2 — logo reveal */}
            {visible && stage === 2 && (
              <motion.div
                key="logo-reveal"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
                className="flex flex-col items-center gap-5 select-none"
              >
                {/* Logo image */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-[320px] h-[320px] relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/grcc-logo.svg"
                    alt="GRCC Logo"
                    width={320}
                    height={320}
                    style={{ width: 320, height: 320, objectFit: "contain" }}
                  />
                </motion.div>

                {/* Animated underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{ originX: 0.5 }}
                  className="h-px w-[80px] bg-white/20"
                />

                {/* Label */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="text-white/40 text-[0.72rem] font-mono tracking-[0.25em] uppercase"
                >
                  GRCC
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="intro-curtain"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0D0D0D]"
        />
      )}
    </AnimatePresence>
  );
}
