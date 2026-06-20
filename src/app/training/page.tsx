"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowUpRight, Search, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, TrainingItem, ComingSoonPost } from "@/lib/supabase";

// ── animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

const FORMATS = ["Semua", "Online", "In-Person", "Hybrid", "In-House"];

// ── Training card ───────────────────────────────────────────────────────────
function TrainingCard({ t, index }: { t: TrainingItem; index: number }) {
  return (
    <motion.div
      custom={index} variants={fadeUp}
      className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
    >
      {/* Poster / color top */}
      <div className="relative h-[180px] overflow-hidden flex-shrink-0" style={{ backgroundColor: t.color + "12" }}>
        {t.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.poster_url} alt={t.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[3.5rem] font-black select-none" style={{ color: t.color + "25" }}>
              {(t.category || t.title).slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="text-[0.6rem] font-extrabold tracking-wider uppercase px-2 py-1 rounded-md text-white"
            style={{ backgroundColor: t.color }}>
            {t.format}
          </span>
          {t.category && (
            <span className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm">
              {t.category}
            </span>
          )}
        </div>
        {/* Price + participants bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {t.price_label ? (
            <span className="text-[0.92rem] font-extrabold text-white drop-shadow">{t.price_label}</span>
          ) : (
            <span />
          )}
          {t.max_participants && (
            <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-white/85 bg-black/35 backdrop-blur-sm rounded-md px-2 py-0.5">
              <Users size={10} /> {t.max_participants} peserta
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="font-extrabold text-[0.97rem] leading-snug mb-2 line-clamp-2">{t.title}</h3>
          {t.description && (
            <p className="text-muted text-[0.78rem] leading-[1.7] line-clamp-3">{t.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-[0.72rem] text-muted">
          {t.sessions ? (
            <span className="flex items-center gap-1.5">
              <Calendar size={10} />
              {t.sessions.length} sesi · {t.sessions[0]?.date}{t.sessions.length > 1 ? ` – ${t.sessions[t.sessions.length - 1]?.date}` : ""}
            </span>
          ) : (
            t.date_start && (
              <span className="flex items-center gap-1.5">
                <Calendar size={10} />
                {t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}
              </span>
            )
          )}
          {t.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={10} /> {t.location}
            </span>
          )}
        </div>
        <Link href={`/training/${t.id}`}
          className="flex items-center justify-center gap-2 text-[0.83rem] font-extrabold py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ backgroundColor: t.color, boxShadow: `0 4px 14px ${t.color}35` }}>
          Daftar Sekarang <ArrowUpRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Coming soon card ────────────────────────────────────────────────────────
function ComingSoonCard({ cs, index }: { cs: ComingSoonPost; index: number }) {
  return (
    <motion.div
      custom={index} variants={fadeUp}
      className="rounded-2xl border border-dashed overflow-hidden flex flex-col group"
      style={{ borderColor: cs.color + "55", backgroundColor: cs.color + "04" }}
    >
      {/* Top illustration */}
      <div className="relative h-[180px] flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: cs.color + "08" }}>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: cs.color + "18" }}>
          <Clock size={28} style={{ color: cs.color + "90" }} />
        </motion.div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-[0.6rem] font-extrabold tracking-[0.12em] uppercase"
            style={{ color: cs.color }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: cs.color }} />
            Segera Hadir
          </span>
          {cs.category && (
            <span className="text-[0.58rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border"
              style={{ borderColor: cs.color + "45", color: cs.color }}>
              {cs.category}
            </span>
          )}
        </div>
        {/* Expected date */}
        {cs.expected_date && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[0.72rem] font-semibold"
            style={{ color: cs.color }}>
            <Clock size={11} /> {cs.expected_date}
          </div>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <h3 className="font-extrabold text-[0.97rem] leading-snug mb-2 uppercase line-clamp-2">{cs.title}</h3>
          {cs.subtitle && (
            <p className="text-muted text-[0.78rem] leading-[1.7] line-clamp-3">{cs.subtitle}</p>
          )}
        </div>
        <button disabled
          className="flex items-center justify-center gap-2 text-[0.82rem] font-bold py-2.5 rounded-xl border border-dashed transition-all cursor-default"
          style={{ borderColor: cs.color + "60", color: cs.color, backgroundColor: cs.color + "07" }}>
          Pendaftaran dibuka segera
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function TrainingListPage() {
  const [trainings,  setTrainings]  = useState<TrainingItem[]>([]);
  const [comingSoon, setComingSoon] = useState<ComingSoonPost[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("Semua");
  const [query,      setQuery]      = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: cs }] = await Promise.all([
        supabase.from("training").select("*").eq("published", true).order("created_at", { ascending: false }),
        supabase.from("coming_soon_posts").select("*").eq("visible", true).order("created_at", { ascending: false }),
      ]);
      setTrainings(t ?? []);
      setComingSoon(cs ?? []);
      setLoading(false);
    })();
  }, []);

  // Filtered trainings
  const filtered = trainings.filter(t => {
    const matchFormat = filter === "Semua" || t.format === filter;
    const q = query.toLowerCase();
    const matchQuery = !q || t.title.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    return matchFormat && matchQuery;
  });

  const totalCount = trainings.length + comingSoon.length;

  return (
    <>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section ref={heroRef}
        className="relative min-h-[52vh] flex flex-col justify-end overflow-hidden bg-[#0D0D0D] pb-[clamp(48px,6vw,80px)]">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize: "64px 64px" }} />
        {/* Glow orb */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #4F46E518 0%, transparent 65%)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-[1280px] mx-auto px-6 lg:px-16 w-full">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/30 text-[0.7rem] font-mono tracking-[0.22em] uppercase mb-7">
            GRCC &nbsp;/&nbsp; Jadwal Pelatihan
          </motion.p>

          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: "100%" }} animate={{ y: 0 }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              className="text-white text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.97] tracking-[-0.03em]">
              Semua<br /><span className="text-white/22">Pelatihan</span>
            </motion.h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/38 text-[0.9rem] leading-[1.8] max-w-[400px]">
              {loading ? "Memuat program…" : `${totalCount} program pelatihan dan sertifikasi dari GRCC AILG Universitas Airlangga.`}
            </motion.p>

            {/* Format chips hero */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="flex flex-wrap gap-2">
              {FORMATS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200"
                  style={{
                    borderColor: filter === f ? "#fff" : "rgba(255,255,255,0.14)",
                    color: filter === f ? "#fff" : "rgba(255,255,255,0.38)",
                    backgroundColor: filter === f ? "rgba(255,255,255,0.1)" : "transparent",
                  }}>
                  {f}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <main className="bg-bg min-h-[60vh]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-[clamp(52px,7vw,88px)]">

          {/* Search + filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-10">
            {/* Search input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari pelatihan…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white text-[0.85rem] outline-none focus:border-dark/30 transition-colors"
              />
              {query && (
                <button onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  <X size={13} />
                </button>
              )}
            </div>
            {/* Filter toggle (mobile) */}
            <button onClick={() => setShowFilter(v => !v)}
              className={`sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[0.82rem] font-semibold transition-all ${showFilter ? "bg-dark text-white border-dark" : "bg-white border-border text-dark"}`}>
              <SlidersHorizontal size={14} /> Filter
            </button>
            {/* Format tabs (desktop) */}
            <div className="hidden sm:flex gap-1.5 bg-white border border-border rounded-xl p-1">
              {FORMATS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[0.72rem] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === f ? "bg-dark text-white shadow-sm" : "text-muted hover:text-dark"}`}>
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden overflow-hidden mb-6">
                <div className="flex flex-wrap gap-2 pb-4">
                  {FORMATS.map(f => (
                    <button key={f} onClick={() => { setFilter(f); setShowFilter(false); }}
                      className={`text-[0.75rem] font-bold px-3.5 py-1.5 rounded-lg border transition-all ${filter === f ? "bg-dark text-white border-dark" : "bg-white border-border text-muted"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            /* Skeleton */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="h-[180px] bg-dark/[0.06]" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-4 bg-dark/[0.07] rounded-full w-4/5" />
                    <div className="h-3 bg-dark/[0.05] rounded-full w-full" />
                    <div className="h-3 bg-dark/[0.05] rounded-full w-3/4" />
                    <div className="h-10 bg-dark/[0.06] rounded-xl mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ── Active trainings ── */}
              {filtered.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted">
                      Pelatihan Tersedia — {filtered.length} program
                    </p>
                  </div>
                  <motion.div
                    variants={stagger} initial="hidden" animate="visible"
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((t, i) => (
                      <TrainingCard key={t.id} t={t} index={i} />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Empty state for filtered */}
              {filtered.length === 0 && (filter !== "Semua" || query) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-20">
                  <p className="text-[2rem] mb-3">🔍</p>
                  <p className="font-bold text-dark mb-1.5">Tidak ada hasil</p>
                  <p className="text-muted text-[0.85rem]">Coba ganti filter atau kata kunci pencarian.</p>
                  <button onClick={() => { setFilter("Semua"); setQuery(""); }}
                    className="mt-5 text-[0.82rem] font-semibold underline text-dark">
                    Reset filter
                  </button>
                </motion.div>
              )}

              {/* ── Coming soon ── */}
              {comingSoon.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted">
                      Segera Hadir — {comingSoon.length} program
                    </p>
                  </div>
                  <motion.div
                    variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {comingSoon.map((cs, i) => (
                      <ComingSoonCard key={cs.id} cs={cs} index={i} />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Totally empty */}
              {trainings.length === 0 && comingSoon.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-[2.5rem] mb-4">📋</p>
                  <p className="font-extrabold text-[1.1rem] mb-2">Belum ada pelatihan</p>
                  <p className="text-muted text-[0.88rem] max-w-[320px] mx-auto leading-[1.7]">
                    Program pelatihan akan segera tersedia. Pantau terus atau hubungi kami untuk info lebih lanjut.
                  </p>
                  <a href="mailto:grcc.ailg@gmail.com"
                    className="inline-flex items-center gap-2 mt-7 bg-dark text-white text-[0.85rem] font-bold px-5 py-2.5 rounded-xl">
                    Hubungi Kami <ArrowUpRight size={13} />
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── CTA STRIP ───────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-[clamp(52px,6vw,80px)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p className="text-white/25 text-[0.68rem] font-mono tracking-[0.2em] uppercase mb-3">In-House Training</p>
              <h2 className="text-white text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold tracking-tight leading-[1.15] max-w-[480px]">
                Butuh pelatihan khusus untuk tim Anda?
              </h2>
              <p className="text-white/35 text-[0.85rem] leading-[1.8] mt-3 max-w-[400px]">
                GRCC merancang program in-house yang disesuaikan dengan kebutuhan spesifik organisasi Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <motion.a href="mailto:grcc.ailg@gmail.com"
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-dark text-[0.85rem] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors group">
                Konsultasi Gratis
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
              <motion.a href="/programs"
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 border border-white/18 text-white text-[0.85rem] font-bold px-6 py-3 rounded-xl hover:border-white/35 transition-colors">
                Lihat Program
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
