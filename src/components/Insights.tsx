"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, TrainingItem } from "@/lib/supabase";
import { ArrowUpRight, Calendar, MapPin, Users, Wifi, MonitorPlay, Building2 } from "lucide-react";
import ShareTrainingButton from "@/components/ShareTrainingButton";

// ── format icon ───────────────────────────────────────────────────────────────
function FormatIcon({ format }: { format: string }) {
  const f = (format ?? "").toLowerCase();
  if (f.includes("online")) return <Wifi size={11} />;
  if (f.includes("hybrid")) return <MonitorPlay size={11} />;
  return <Building2 size={11} />;
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Poster placeholder (when no poster_url) ───────────────────────────────────
function PosterPlaceholder({ training }: { training: TrainingItem }) {
  const c = training.color || "#4F46E5";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: c + "12" }}>
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${c}20 1px, transparent 1px), linear-gradient(90deg, ${c}20 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 60% 40%, ${c}35 0%, transparent 65%)` }}
      />
      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-[64px]"
        style={{ backgroundColor: c + "15" }}
      />
      {/* Short label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[3.5rem] font-black tracking-[-0.05em] select-none leading-none"
          style={{ color: c + "25" }}
        >
          {(training.category || training.title).slice(0, 3).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[20px] overflow-hidden border border-border bg-white">
      <div className="h-[220px] bg-dark/[0.05] animate-pulse" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-20 bg-dark/[0.07] rounded-full animate-pulse" />
        <div className="h-5 w-4/5 bg-dark/[0.07] rounded animate-pulse" />
        <div className="h-3 w-full bg-dark/[0.05] rounded animate-pulse" />
        <div className="h-3 w-3/5 bg-dark/[0.05] rounded animate-pulse" />
        <div className="mt-3 h-10 bg-dark/[0.05] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ── Training Card ─────────────────────────────────────────────────────────────
function TrainingCard({ t, index }: { t: TrainingItem; index: number }) {
  const c = t.color || "#4F46E5";
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const hasPoster = !!t.poster_url && !imgError;

  return (
    <motion.article
      onClick={() => router.push(`/training/${t.id}`)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover="hover"
      className="flex flex-col rounded-[20px] overflow-hidden bg-white border border-black/[0.07] cursor-pointer group h-full"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* ── Poster area — fixed height for all cards ── */}
      <div className="relative overflow-hidden h-[220px]">
        {hasPoster ? (
          <>
            <motion.img
              src={t.poster_url!}
              alt={t.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
            {/* Subtle gradient so badges stay readable */}
            <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/50 to-transparent" />
          </>
        ) : (
          <PosterPlaceholder training={t} />
        )}

        {/* Dark gradient overlay at bottom (no-poster only) */}
        {!hasPoster && <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/60 to-transparent" />}

        {/* Top badges — always show */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-[0.6rem] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ backgroundColor: c }}
          >
            <FormatIcon format={t.format} />
            {t.format}
          </span>
          {t.category && (
            <span className="text-[0.6rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-dark/70 shadow-sm">
              {t.category}
            </span>
          )}
        </div>

        <ShareTrainingButton
          trainingId={t.id}
          title={t.title}
          accent={c}
          variant="icon"
          className="absolute right-3.5 top-3.5 z-10"
        />

        {/* Bottom: price + seats — always show */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
          <div>
            {(t.price || t.price_label) && (
              <p className="text-white font-extrabold text-[1.05rem] leading-none drop-shadow-sm">
                {t.price ? formatRupiah(t.price) : t.price_label}
              </p>
            )}
          </div>
          {t.max_participants && (
            <span className="flex items-center gap-1 text-[0.62rem] font-semibold text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
              <Users size={9} />
              {t.max_participants} peserta
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <h3
          className="text-[0.97rem] font-bold leading-[1.4] tracking-tight line-clamp-2 group-hover:text-dark transition-colors"
        >
          {t.title}
        </h3>

        {/* Description */}
        {t.description && (
          <p className="text-[0.78rem] leading-[1.65] text-muted flex-1 line-clamp-2">
            {t.description}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-black/[0.06]">
          {t.date_start && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-dark/[0.05] flex items-center justify-center flex-shrink-0">
                <Calendar size={11} className="text-dark/50" />
              </div>
              <span className="text-[0.74rem] text-dark/60 font-medium">
                {t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}
              </span>
            </div>
          )}
          {t.location && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-dark/[0.05] flex items-center justify-center flex-shrink-0">
                <MapPin size={11} className="text-dark/50" />
              </div>
              <span className="text-[0.74rem] text-dark/60 font-medium">{t.location}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/daftar/${t.id}`; }}
          className="mt-1 flex items-center justify-center gap-2 text-white text-[0.8rem] font-bold py-2.5 rounded-xl transition-all group/btn hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: c }}
        >
          Daftar Sekarang
          <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </div>
      </div>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
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
            <p className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-muted mb-4">
              Pelatihan Mendatang
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
              Kembangkan keahlian Anda{" "}
              <br className="hidden md:block" />
              di bidang tata kelola &amp; kepatuhan
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
            className="flex items-center gap-2 border border-dark text-dark text-[0.84rem] font-semibold px-5 py-3 rounded-[6px] hover:bg-dark hover:text-white transition-colors group"
          >
            Lihat Semua
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-16 text-muted text-[0.88rem]">
            Belum ada pelatihan yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainings.map((t, i) => (
              <TrainingCard key={t.id} t={t} index={i} />
            ))}
          </div>
        )}

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[0.76rem] text-muted mt-10"
        >
          Butuh program khusus?{" "}
          <a href="mailto:grcc.ailg@gmail.com" className="underline underline-offset-2 hover:text-dark transition-colors">
            Hubungi kami untuk pelatihan in-house
          </a>
        </motion.p>
      </div>
    </section>
  );
}
