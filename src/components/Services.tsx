"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    num: "01",
    title: "Konsultasi Tata Kelola",
    desc: "Pendampingan strategis dan penyusunan peta jalan untuk membangun struktur tata kelola yang selaras dengan tujuan organisasi dan lanskap regulasi.",
  },
  {
    num: "02",
    title: "Manajemen Risiko",
    desc: "Kerangka identifikasi, asesmen, dan mitigasi risiko yang melindungi organisasi dari risiko operasional, keuangan, dan reputasi.",
  },
  {
    num: "03",
    title: "Solusi Kepatuhan",
    desc: "Program kepatuhan end-to-end yang disesuaikan dengan standar industri dan persyaratan regulasi agar kewajiban organisasi terpenuhi secara efisien.",
  },
  {
    num: "04",
    title: "Strategi Daya Saing",
    desc: "Strategi berbasis data yang menjadikan keunggulan tata kelola sebagai pembeda kompetitif dan mendorong kepemimpinan pasar yang berkelanjutan.",
  },
  {
    num: "05",
    title: "ESG & Keberlanjutan",
    desc: "Pengembangan kerangka dan pelaporan ESG untuk memenuhi ekspektasi pemangku kepentingan serta standar keberlanjutan global.",
  },
  {
    num: "06",
    title: "Pelatihan & Penguatan Kapasitas",
    desc: "Program pelatihan yang membangun kapabilitas tata kelola dan kepatuhan di seluruh level organisasi, dari pimpinan hingga tim operasional.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function Services() {
  return (
    <section id="services" className="py-[clamp(80px,10vw,140px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[clamp(40px,6vw,80px)]"
        >
          <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted mb-4">
            Layanan Kami
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
            Kapabilitas ahli untuk seluruh{" "}
            <br className="hidden md:block" />
            spektrum tata kelola
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg overflow-hidden"
        >
          {services.map((s) => (
            <motion.div
              key={s.num}
              variants={item}
              whileHover={{ backgroundColor: "#EFEDE7" }}
              className="flex flex-col p-[clamp(28px,3vw,44px)] border-b border-r border-border last:border-b-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 transition-colors duration-300 group"
            >
              <span className="text-[0.73rem] font-bold tracking-[0.1em] text-muted mb-7">
                {s.num}
              </span>
              <div className="flex-1 mb-8">
                <h3 className="text-[1.1rem] font-bold tracking-tight mb-3">{s.title}</h3>
                <p className="text-[0.875rem] leading-[1.7] text-muted">{s.desc}</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold tracking-[0.05em] text-dark"
              >
                Pelajari lebih lanjut
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
