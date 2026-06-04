"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CTABand() {
  return (
    <section id="contact" className="py-[clamp(80px,10vw,130px)] bg-dark text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-[clamp(40px,6vw,80px)]"
        >
          <div>
            <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-5">
              Mulai percakapan
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white mb-5">
              Siap memperkuat{" "}
              <br className="hidden md:block" />
              tata kelola &amp; kepatuhan?
            </h2>
            <p className="text-[1rem] leading-[1.7] text-white/50 max-w-[48ch]">
              Tim ahli kami siap memetakan kondisi organisasi Anda dan merancang langkah
              menuju tata kelola unggul yang sesuai dengan kebutuhan organisasi.
            </p>
          </div>

          <div className="flex flex-col gap-5 items-start">
            <motion.a
              href="mailto:info@grcc.org"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-white text-dark text-[0.95rem] font-semibold px-7 py-4 rounded-[4px] border border-white hover:bg-[#f0efea] transition-colors group"
            >
              Hubungi Kami
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
            <div className="flex flex-col gap-1.5">
              <a
                href="mailto:info@grcc.org"
                className="text-[0.86rem] text-white/45 hover:text-white transition-colors"
              >
                info@grcc.org
              </a>
              <a
                href="tel:+6221000000"
                className="text-[0.86rem] text-white/45 hover:text-white transition-colors"
              >
                +62 21 000 0000
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
