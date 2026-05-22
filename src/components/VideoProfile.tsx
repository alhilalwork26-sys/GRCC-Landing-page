"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";

// ── Ganti dengan URL video company profile GRCC ───────────────────────────────
const VIDEO_URL = "https://www.youtube.com/embed/BCOjopku3bk";
const VIDEO_THUMBNAIL = "";
const YOUTUBE_ID = "BCOjopku3bk";

export default function VideoProfile() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY   = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const thumbSrc = VIDEO_THUMBNAIL || `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

  return (
    <>
      {/* ── LIGHTBOX ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              key="lb-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(false)}
              className="fixed inset-0 z-[15000] bg-black/92 backdrop-blur-lg"
            />
            <motion.div
              key="lb-frame"
              initial={{ opacity: 0, scale: 0.88, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="fixed inset-0 z-[15001] flex flex-col items-center justify-center gap-4 p-4 lg:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button — ABOVE the video, always visible */}
              <div className="flex w-full max-w-5xl justify-end">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLightbox(false)}
                  className="flex items-center gap-2 text-white/70 hover:text-white text-[0.82rem] font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15 transition-all"
                >
                  <X size={15} />
                  Tutup
                </motion.button>
              </div>

              {/* Video */}
              <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
                <iframe
                  src={`${VIDEO_URL}?autoplay=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>

              {/* ESC hint */}
              <p className="text-white/25 text-[0.7rem]">Tekan ESC atau klik di luar untuk menutup</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SECTION ─────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        className="relative py-[clamp(80px,10vw,140px)] overflow-hidden bg-[#0C0C0C]"
      >
        {/* Animated background gradient */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-[-10%] pointer-events-none"
        >
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #4F46E530 0%, transparent 65%)" }} />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #10B98125 0%, transparent 65%)" }} />
        </motion.div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">

            {/* ── LEFT: Text ── */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Label */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-[2px] bg-[#4F46E5]" />
                <span className="text-[0.68rem] font-bold tracking-[0.22em] uppercase text-white/35">
                  Company Profile
                </span>
              </div>

              <h2 className="text-white font-extrabold leading-[1.1] tracking-[-0.03em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                Kenali GRCC lebih
                <br />
                <span className="text-white/25">dalam lewat video</span>
              </h2>

              <p className="text-white/45 text-[0.95rem] leading-[1.85] mb-10 max-w-[440px]">
                Saksikan bagaimana GRCC membangun kapasitas organisasi terbaik di Indonesia
                melalui program pelatihan, konsultasi, dan riset yang terukur.
              </p>

              {/* Stats mini */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: "500+", label: "Organisasi" },
                  { num: "8", label: "Program Inti" },
                  { num: "10+", label: "Tahun" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  >
                    <p className="text-white font-extrabold text-[1.6rem] tracking-[-0.04em] leading-none mb-1">
                      {s.num}
                    </p>
                    <p className="text-white/35 text-[0.72rem] font-medium">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLightbox(true)}
                className="flex items-center gap-3 text-white font-bold text-[0.88rem] group"
              >
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: "#4F46E5" }}
                >
                  <Play size={16} fill="white" className="ml-0.5" />
                </span>
                Tonton Company Profile
              </motion.button>
            </motion.div>

            {/* ── RIGHT: Video Card ── */}
            <motion.div
              style={{ y: cardY }}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              {/* Glow behind card */}
              <div
                className="absolute inset-[-8%] rounded-[32px] opacity-30 blur-2xl"
                style={{ background: "radial-gradient(ellipse, #4F46E540 0%, transparent 70%)" }}
              />

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative rounded-[24px] overflow-hidden cursor-pointer group"
                style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)" }}
                onClick={() => setLightbox(true)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#111]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbSrc}
                    alt="GRCC Company Profile"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />

                  {/* Dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                  {/* Center play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.94 }}
                      className="relative"
                    >
                      {/* Pulse rings */}
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-white/20"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0, 0.25] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="absolute inset-0 rounded-full bg-white/15"
                      />

                      {/* Play circle */}
                      <div className="relative w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <Play size={28} fill="#0C0C0C" className="ml-1.5 text-[#0C0C0C]" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 inset-x-0 px-6 py-5 flex items-end justify-between">
                    <div>
                      <p className="text-white font-extrabold text-[1rem] leading-snug">
                        GRCC Company Profile
                      </p>
                      <p className="text-white/50 text-[0.72rem] mt-0.5">
                        Center for Governance, Risk, and Compliance
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-white/70 text-[0.62rem] font-semibold tracking-[0.08em] uppercase">Watch Now</span>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="bg-[#111] border-t border-white/[0.07] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/grcc-logo.png" alt="GRCC" className="h-5 w-auto opacity-70" />
                    <span className="text-white/30 text-[0.65rem] font-mono tracking-[0.1em]">OFFICIAL CHANNEL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-all">
                      <Volume2 size={11} className="text-white/40" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                      className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-all"
                    >
                      <Maximize2 size={11} className="text-white/40" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="absolute -top-5 -right-5"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                >
                  <p className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-dark/50 mb-0.5">Dipercaya oleh</p>
                  <p className="text-dark font-extrabold text-[1rem] leading-none">500+ Organisasi</p>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
