"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Clock } from "lucide-react";

const trainings = [
  {
    category: "Governance",
    date: "June 10–12, 2026",
    location: "Jakarta, Indonesia",
    duration: "3 Days",
    title: "Corporate Governance & Board Effectiveness",
    desc: "A comprehensive program for board members and senior executives on building robust governance structures, accountability frameworks, and strategic oversight.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    seats: "24 seats left",
  },
  {
    category: "Risk Management",
    date: "July 7–8, 2026",
    location: "Online (Zoom)",
    duration: "2 Days",
    title: "Enterprise Risk Management: Frameworks & Practice",
    desc: "Hands-on training on implementing ERM frameworks, identifying emerging risk categories, and embedding risk culture across the organization.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    seats: "30 seats left",
  },
  {
    category: "Compliance",
    date: "August 19–21, 2026",
    location: "Surabaya, Indonesia",
    duration: "3 Days",
    title: "Regulatory Compliance & Anti-Corruption Program",
    desc: "Equip compliance officers and legal teams with tools to navigate complex regulatory environments and build proactive anti-corruption controls.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    seats: "18 seats left",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

export default function Insights() {
  return (
    <section id="insights" className="py-[clamp(80px,10vw,140px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted mb-4">
              Upcoming Training
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
              Develop your expertise{" "}
              <br className="hidden md:block" />
              in governance &amp; compliance
            </h2>
          </motion.div>
          <motion.a
            href="#insights"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-dark text-dark text-[0.84rem] font-semibold px-5 py-3 rounded-[4px] hover:bg-dark hover:text-white transition-colors group"
          >
            View All Training
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {trainings.map((t) => (
            <motion.article
              key={t.title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col rounded-lg overflow-hidden border border-border bg-white group cursor-pointer"
            >
              {/* Image */}
              <div className="h-[200px] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.img}
                  alt={t.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Seats badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[0.68rem] font-bold tracking-[0.06em] uppercase text-dark px-2.5 py-1 rounded-full">
                  {t.seats}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 gap-3 p-[clamp(20px,2.5vw,28px)]">
                {/* Category + type */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase bg-dark/[0.07] px-2.5 py-1 rounded-full">
                    {t.category}
                  </span>
                </div>

                <h3 className="text-[1rem] font-bold leading-[1.4] tracking-tight">{t.title}</h3>
                <p className="text-[0.84rem] leading-[1.7] text-muted flex-1">{t.desc}</p>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 pt-1 border-t border-border mt-1">
                  <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                    <Calendar size={13} className="flex-shrink-0 text-dark/40" />
                    <span>{t.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                    <MapPin size={13} className="flex-shrink-0 text-dark/40" />
                    <span>{t.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                    <Clock size={13} className="flex-shrink-0 text-dark/40" />
                    <span>{t.duration}</span>
                  </div>
                </div>

                {/* CTA */}
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex items-center justify-center gap-2 bg-dark text-white text-[0.82rem] font-semibold py-2.5 rounded-[4px] hover:bg-[#222] transition-colors group/btn"
                >
                  Register Now
                  <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </motion.a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
