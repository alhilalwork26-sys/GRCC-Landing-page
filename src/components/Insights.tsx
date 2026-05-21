"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, TrainingItem } from "@/lib/supabase";
import { ArrowUpRight, Calendar, MapPin, Clock, Users } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-border bg-white">
      <div className="h-[160px] bg-dark/[0.05] animate-pulse" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-3 w-20 bg-dark/[0.07] rounded-full animate-pulse" />
        <div className="h-5 w-4/5 bg-dark/[0.07] rounded animate-pulse" />
        <div className="h-4 w-full bg-dark/[0.05] rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-dark/[0.05] rounded animate-pulse" />
        <div className="mt-2 h-10 bg-dark/[0.05] rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function Insights() {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("training")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setTrainings(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="training" className="py-[clamp(80px,10vw,140px)] bg-bg">
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
            href="/insights"
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-16 text-muted text-[0.88rem]">
            Belum ada training yang dipublikasikan.
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {trainings.map((t) => (
              <motion.article
                key={t.id}
                variants={itemVariant}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col rounded-lg overflow-hidden border border-border bg-white group cursor-pointer"
              >
                {/* Color banner — replaces image */}
                <div className="h-[160px] relative overflow-hidden" style={{ backgroundColor: t.color + "18" }}>
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `linear-gradient(${t.color}25 1px, transparent 1px), linear-gradient(90deg, ${t.color}25 1px, transparent 1px)`,
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {/* Glow */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(ellipse at 50% -20%, ${t.color}40 0%, transparent 65%)` }}
                  />
                  {/* Category + Format badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[0.65rem] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.category || "Training"}
                    </span>
                    <span className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm text-dark/70">
                      {t.format}
                    </span>
                  </div>
                  {/* Bottom badges */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    {t.max_participants && (
                      <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold bg-black/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                        <Users size={10} />
                        Maks. {t.max_participants} peserta
                      </span>
                    )}
                    {t.price_label && (
                      <span className="ml-auto bg-white/90 backdrop-blur-sm text-[0.68rem] font-bold tracking-[0.06em] uppercase text-dark px-2.5 py-1 rounded-full">
                        {t.price_label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 gap-3 p-[clamp(20px,2.5vw,28px)]">
                  <h3 className="text-[1rem] font-bold leading-[1.4] tracking-tight">{t.title}</h3>
                  {t.description && (
                    <p className="text-[0.84rem] leading-[1.7] text-muted flex-1 line-clamp-2">{t.description}</p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-border mt-1">
                    {t.date_start && (
                      <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                        <Calendar size={13} className="flex-shrink-0 text-dark/40" />
                        <span>{t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}</span>
                      </div>
                    )}
                    {t.location && (
                      <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                        <MapPin size={13} className="flex-shrink-0 text-dark/40" />
                        <span>{t.location}</span>
                      </div>
                    )}
                    {t.time && (
                      <div className="flex items-center gap-2 text-[0.76rem] text-muted">
                        <Clock size={13} className="flex-shrink-0 text-dark/40" />
                        <span>{t.time}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href="mailto:info@grcc.org"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 flex items-center justify-center gap-2 bg-dark text-white text-[0.82rem] font-semibold py-2.5 rounded-[4px] hover:bg-[#222] transition-colors group/btn"
                  >
                    Daftar Sekarang
                    <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
