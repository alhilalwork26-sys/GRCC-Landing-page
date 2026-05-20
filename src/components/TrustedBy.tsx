"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "World Bank",        style: "font-serif italic font-bold text-[1.1rem] tracking-tight" },
  { name: "OECD",              style: "font-black text-[1.4rem] tracking-[0.15em]" },
  { name: "UN Global Compact", style: "font-bold text-[0.78rem] tracking-[0.07em] uppercase leading-tight text-center" },
  { name: "ISO",               style: "font-black text-[1.6rem] tracking-[0.12em]" },
  { name: "IFC",               style: "font-bold text-[1.35rem] tracking-[0.1em]" },
  { name: "GRI Standards",     style: "font-semibold text-[0.88rem] tracking-[0.05em]" },
  { name: "FATF",              style: "font-black text-[1.2rem] tracking-[0.18em]" },
  { name: "Basel Committee",   style: "font-medium text-[0.78rem] tracking-[0.04em] text-center leading-tight" },
];

export default function TrustedBy() {
  return (
    <section className="bg-[#FAFAF8] py-14">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

        {/* Top rule + label */}
        <div className="relative flex items-center gap-5 mb-12">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{ originX: 0 }}
            className="h-px bg-dark/15 flex-1"
          />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-mono text-[0.68rem] tracking-[0.2em] text-dark/30 uppercase whitespace-nowrap"
          >
            /Trusted by
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
            style={{ originX: 1 }}
            className="h-px bg-dark/15 flex-1"
          />
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-8">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.3, y: 0 }}
              whileHover={{ opacity: 0.85, scale: 1.05 }}
              viewport={{ once: true }}
              transition={{
                default: { duration: 0.5, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.5, delay: i * 0.07 },
                scale:   { duration: 0.2 },
              }}
              className="cursor-default flex-shrink-0"
            >
              <span className={`text-dark ${logo.style} leading-none`}>
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
