"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: 0.2 + i * 0.15, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-[calc(72px+clamp(60px,8vw,100px))] pb-[clamp(60px,8vw,100px)] px-6 lg:px-16 max-w-[1280px] mx-auto"
    >
      {/* Eyebrow badge */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <span className="inline-block px-4 py-2 bg-dark/[0.06] rounded-full text-[0.78rem] font-semibold tracking-[0.05em] text-muted">
          Tata kelola tepercaya · Kepatuhan yang dapat diandalkan
        </span>
      </motion.div>

      {/* Headline + top image */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start gap-10 mb-[clamp(60px,8vw,100px)]">
        <motion.h1
          className="text-[clamp(2.65rem,6.2vw,6.1rem)] font-extrabold leading-[1.0] tracking-[-0.03em] text-dark"
        >
          {["Center For", "Governance,", "Risk, Compliance,", "and Competitiveness"].map((line, i) => (
            <motion.span
              key={i}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          custom={0}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-[clamp(220px,28vw,380px)] aspect-[4/3] rounded-lg overflow-hidden hidden lg:block flex-shrink-0 mt-2 relative"
        >
          <Image
            src="/event-speaker.jpg"
            alt="Narasumber GRCC sedang presentasi"
            width={600}
            height={450}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 object-top"
            priority
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/[0.06] rounded-lg pointer-events-none" />
        </motion.div>
      </div>

      {/* Lower row: image + description + CTAs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,5vw,80px)] items-center">
        {/* ── Animated dual-photo block ── */}
        <motion.div
          custom={1}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Main photo — group */}
          <motion.div
            className="aspect-[4/3] rounded-lg overflow-hidden relative"
            whileHover="hover"
          >
            <motion.div
              variants={{ hover: { scale: 1.04 } }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full"
            >
              <Image
                src="/event-group.jpg"
                alt="Peserta pelatihan GRCC"
                width={900}
                height={675}
                className="w-full h-full object-cover object-center"
                priority
              />
            </motion.div>
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            {/* Badge overlay */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm"
            >
              <p className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-dark/40 mb-0.5">Peserta Aktif</p>
              <p className="text-[1.05rem] font-extrabold text-dark leading-none">500+ Alumni</p>
            </motion.div>
          </motion.div>

          {/* Floating speaker thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 12, y: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ delay: 1.3, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.04, rotate: -1 }}
            className="absolute -top-5 -right-5 w-[38%] aspect-[3/4] rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)] border-[3px] border-white cursor-pointer"
          >
            <Image
              src="/event-speaker.jpg"
              alt="Narasumber GRCC"
              width={300}
              height={400}
              className="w-full h-full object-cover object-top"
            />
            {/* Shine sweep on hover */}
            <motion.div
              variants={{ hover: { x: "200%" } }}
              initial={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.div>
        </motion.div>

        <div className="flex flex-col gap-8">
          <motion.p
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-muted"
          >
            GRCC adalah unit strategis di bawah AILG Universitas Airlangga yang berfokus pada penguatan tata kelola, manajemen risiko, kepatuhan, dan daya saing berkelanjutan. GRCC menjadi mitra bagi sektor publik, BUMN/BUMD, korporasi swasta, dan UMKM dalam menerapkan sistem GRC dan keberlanjutan berbasis standar global, bukti empiris, serta konteks Indonesia.
          </motion.p>

          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-dark text-white text-[0.88rem] font-semibold px-5 py-3.5 rounded-[4px] border border-dark hover:bg-[#222] transition-colors group"
            >
              Hubungi Kami
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-transparent text-dark text-[0.88rem] font-semibold px-5 py-3.5 rounded-[4px] border border-dark hover:bg-dark hover:text-white transition-colors group"
            >
              Lihat Layanan
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </motion.div>

          {/* ── Inline Trusted By ── */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="pt-2"
          >
            {/* Separator + label */}
            <div className="flex items-center gap-4 mb-5">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
                style={{ originX: 0 }}
                className="h-px bg-dark/15 flex-1"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                className="font-mono text-[0.65rem] tracking-[0.2em] text-dark/30 uppercase whitespace-nowrap"
              >
                /Dipercaya oleh
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
                style={{ originX: 1 }}
                className="h-px bg-dark/15 flex-1"
              />
            </div>

            {/* Scrolling logo marquee */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="flex items-center gap-8 w-max animate-marquee-slow hover:[animation-play-state:paused]"
              >
                {[
                  { name: "World Bank", cls: "font-serif italic font-bold text-[0.95rem]" },
                  { name: "OECD", cls: "font-black text-[1.1rem] tracking-[0.12em]" },
                  { name: "UN Global Compact", cls: "font-bold text-[0.68rem] tracking-[0.06em] uppercase leading-tight" },
                  { name: "ISO", cls: "font-black text-[1.2rem] tracking-[0.1em]" },
                  { name: "IFC", cls: "font-bold text-[1.05rem] tracking-[0.08em]" },
                  { name: "GRI Standards", cls: "font-semibold text-[0.78rem] tracking-[0.04em]" },
                  { name: "FATF", cls: "font-black text-[1rem] tracking-[0.15em]" },
                  { name: "Basel Committee", cls: "font-medium text-[0.7rem] tracking-[0.03em] leading-tight" },
                  // duplicate for seamless loop
                  { name: "World Bank", cls: "font-serif italic font-bold text-[0.95rem]" },
                  { name: "OECD", cls: "font-black text-[1.1rem] tracking-[0.12em]" },
                  { name: "UN Global Compact", cls: "font-bold text-[0.68rem] tracking-[0.06em] uppercase leading-tight" },
                  { name: "ISO", cls: "font-black text-[1.2rem] tracking-[0.1em]" },
                  { name: "IFC", cls: "font-bold text-[1.05rem] tracking-[0.08em]" },
                  { name: "GRI Standards", cls: "font-semibold text-[0.78rem] tracking-[0.04em]" },
                  { name: "FATF", cls: "font-black text-[1rem] tracking-[0.15em]" },
                  { name: "Basel Committee", cls: "font-medium text-[0.7rem] tracking-[0.03em] leading-tight" },
                ].map((logo, i) => (
                  <span
                    key={i}
                    className={`text-dark/25 hover:text-dark/60 transition-colors duration-200 cursor-default whitespace-nowrap ${logo.cls}`}
                  >
                    {logo.name}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
