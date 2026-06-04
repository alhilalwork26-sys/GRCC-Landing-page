"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, BookOpen } from "lucide-react";

const suggestions = [
  { label: "Jadwal Pelatihan", href: "/jadwal",   icon: Calendar  },
  { label: "Semua Program",    href: "/programs", icon: BookOpen  },
  { label: "Artikel & Berita", href: "/insights", icon: Search    },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-6">
      <div className="max-w-[520px] w-full text-center">

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative mb-8 select-none"
        >
          <p
            className="font-black leading-none tracking-[-0.06em]"
            style={{
              fontSize: "clamp(7rem, 22vw, 12rem)",
              WebkitTextStroke: "2px #0D0D0D12",
              color: "transparent",
            }}
          >
            404
          </p>
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white border border-border shadow-lg flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="font-extrabold text-[1.6rem] tracking-tight mb-3">
            Halaman tidak ditemukan
          </h1>
          <p className="text-muted text-[0.92rem] leading-[1.8] mb-8 max-w-[380px] mx-auto">
            Halaman yang Anda cari tidak ada atau sudah dipindahkan.
            Mungkin bisa kami bantu dari sini?
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col gap-2.5 mb-8"
        >
          {suggestions.map(({ label, href, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3.5 bg-white border border-border rounded-xl px-5 py-3.5 hover:shadow-md hover:border-dark/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-dark/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-dark group-hover:text-white transition-all">
                  <Icon size={15} className="text-muted group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-[0.88rem] text-dark/80 group-hover:text-dark transition-colors">
                  {label}
                </span>
                <ArrowLeft size={13} className="ml-auto text-muted rotate-180 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Back home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-dark text-white font-bold text-[0.88rem] px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </motion.div>

        {/* Branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-8 text-[0.72rem] text-muted/50 font-medium tracking-wider"
        >
          GRCC · Pusat Tata Kelola, Risiko &amp; Kepatuhan
        </motion.p>
      </div>
    </div>
  );
}
