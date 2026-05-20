"use client";

import { motion } from "framer-motion";

const logos = [
  "World Bank Group",
  "OECD",
  "UN Global Compact",
  "ISO",
  "IFC",
  "GRI Standards",
  "Basel Committee",
  "FATF",
];

export default function Partners() {
  const doubled = [...logos, ...logos];
  return (
    <section className="py-[clamp(60px,7vw,100px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted text-center mb-12"
        >
          Trusted by &amp; affiliated with leading organizations
        </motion.p>
      </div>

      <div className="overflow-hidden group">
        <div className="flex items-center gap-16 w-max animate-marquee-slow group-hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="text-[0.88rem] font-bold tracking-[0.06em] uppercase text-muted/45 hover:text-muted/90 transition-colors duration-200 whitespace-nowrap cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
