"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronRight, Building2, CheckCircle2, Users, Lightbulb, Target, Calendar, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, ProgramItem, SubProgramItem, TrainingItem, ComingSoonPost } from "@/lib/supabase";
import { renderIcon } from "@/lib/iconMap";

// ── variants ──────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

// ── sub-program card ──────────────────────────────────────────────────────────
function SubCard({ sub, accent, index, programId }: {
  sub: SubProgramItem; accent: string; index: number; programId: string;
}) {
  return (
    <Link href={`/programs/${programId}/${sub.slug}`}>
      <motion.div
        custom={index} variants={fadeUp}
        whileHover={{ y: -3, boxShadow: `0 8px 24px ${accent}18` }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="group flex flex-col gap-2.5 p-5 rounded-xl border border-border hover:shadow-md bg-white hover:border-transparent transition-all duration-300 cursor-pointer"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-[5px] w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
          <div className="flex-1 min-w-0">
            <h4 className="text-dark text-[0.9rem] font-bold leading-snug mb-1">{sub.name}</h4>
            <p className="text-muted text-[0.78rem] leading-[1.65] line-clamp-2">{sub.description}</p>
          </div>
          <ChevronRight size={14} className="flex-shrink-0 mt-1 text-muted/40 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: accent }} />
        </div>
      </motion.div>
    </Link>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function ProgramsPage() {
  const [active,       setActive]      = useState(0);
  const [inHouseActive, setInHouseActive] = useState(false);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [subsMap,  setSubsMap]  = useState<Record<string, SubProgramItem[]>>({});
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [comingSoon, setComingSoon] = useState<ComingSoonPost[]>([]);
  const [loading,  setLoading]  = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    (async () => {
      const [{ data: progs }, { data: subData }, { data: trainData }, { data: csData }] = await Promise.all([
        supabase.from("programs").select("*").eq("active", true).order("order_index"),
        supabase.from("sub_programs").select("*").eq("active", true).order("order_index"),
        supabase.from("training").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3),
        supabase.from("coming_soon_posts").select("*").eq("visible", true).order("created_at", { ascending: false }).limit(2),
      ]);
      const ps = progs ?? [];
      setPrograms(ps);
      const map: Record<string, SubProgramItem[]> = {};
      ps.forEach(p => { map[p.id] = []; });
      (subData ?? []).forEach(s => { if (map[s.program_id]) map[s.program_id].push(s); });
      setSubsMap(map);
      setTrainings(trainData ?? []);
      setComingSoon(csData ?? []);
      setLoading(false);
    })();
  }, []);

  const prog = programs[active];
  const subs = prog ? (subsMap[prog.id] ?? []) : [];

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-dark/20 border-t-dark animate-spin" />
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[68vh] flex flex-col justify-end overflow-hidden bg-[#0D0D0D] pb-[clamp(56px,7vw,90px)]"
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:`linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize:"72px 72px" }} />
        <motion.div animate={{ scale:[1,1.1,1], opacity:[0.15,0.25,0.15] }} transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
          className="absolute top-[-15%] right-[-8%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle, #4F46E514 0%, transparent 65%)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-[1280px] mx-auto px-6 lg:px-16 w-full">
          <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.1 }}
            className="text-white/30 text-[0.72rem] font-mono tracking-[0.2em] uppercase mb-8">
            GRCC &nbsp;/&nbsp; Program
          </motion.p>

          <div className="overflow-hidden mb-5">
            <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }}
              transition={{ duration:0.8, ease:[0.76,0,0.24,1] }}
              className="text-white text-[clamp(2.8rem,6.5vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              Program<br /><span className="text-white/22">Unggulan</span>
            </motion.h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.p initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.65, delay:0.3 }}
              className="text-white/40 text-[0.95rem] leading-[1.8] max-w-[480px]">
              {programs.length} program inti GRCC yang mencakup seluruh dimensi tata kelola,
              keberlanjutan, keuangan, dan daya saing organisasi modern.
            </motion.p>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.45 }}
              className="flex flex-wrap gap-2">
              {programs.map((p, i) => (
                <button key={p.id} onClick={() => {
                  setActive(i);
                  document.querySelector("#program-explorer")?.scrollIntoView({ behavior:"smooth", block:"start" });
                }}
                  className="text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200"
                  style={{
                    borderColor: active === i ? p.accent : "rgba(255,255,255,0.12)",
                    color: active === i ? p.accent : "rgba(255,255,255,0.4)",
                    backgroundColor: active === i ? p.accent+"18" : "transparent",
                  }}>
                  {p.short}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── PROGRAM EXPLORER ────────────────────────────────── */}
      <section id="program-explorer" className="bg-bg py-[clamp(70px,9vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          {prog && (
            <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-10 items-start">
              {/* Left nav */}
              <div className="lg:sticky lg:top-24">
                <p className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                  {programs.length} Program
                </p>
                <nav className="flex flex-col gap-1.5">
                  {/* ── Pinned In-House Training ── */}
                  <div className="mb-2">
                    <button onClick={() => setInHouseActive(true)}
                      className={`group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-all duration-250 ${inHouseActive ? "shadow-lg" : "hover:shadow-md"}`}
                      style={inHouseActive
                        ? { background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#fff" }
                        : { background: "linear-gradient(135deg, #FEF3C720 0%, #FDE68A30 100%)", border: "1.5px dashed #F59E0B60" }
                      }>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: inHouseActive ? "#fff3" : "#F59E0B18" }}>
                        <Building2 size={15} style={{ color: inHouseActive ? "#fff" : "#D97706" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-[0.82rem] font-bold leading-tight ${inHouseActive ? "text-white" : "text-amber-800"}`}>
                            In-House Training
                          </p>
                          <span className={`text-[0.52rem] font-black tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full ${inHouseActive ? "bg-white/20 text-white" : "bg-amber-400/30 text-amber-700"}`}>
                            KHUSUS
                          </span>
                        </div>
                        <p className={`text-[0.65rem] mt-0.5 font-mono tracking-[0.1em] uppercase ${inHouseActive ? "text-white/50" : "text-amber-600/60"}`}>
                          Semua program
                        </p>
                      </div>
                      {inHouseActive
                        ? <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
                        : <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
                            className="text-amber-400 flex-shrink-0">
                            <ChevronRight size={14} />
                          </motion.span>
                      }
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-border mb-1 mt-1" />

                  {/* ── 8 Programs ── */}
                  {programs.map((p, i) => {
                    const isActive = active === i && !inHouseActive;
                    return (
                      <button key={p.id} onClick={() => { setActive(i); setInHouseActive(false); }}
                        className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-all duration-250 ${isActive ? "bg-dark text-white shadow-sm" : "hover:bg-dark/[0.05] text-dark/60 hover:text-dark"}`}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ backgroundColor: isActive ? p.accent+"25" : "rgba(0,0,0,0.05)" }}>
                          {renderIcon(p.icon_name, { size: 15, style: { color: isActive ? p.accent : undefined } })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[0.82rem] font-semibold leading-tight truncate ${isActive ? "text-white" : ""}`}>{p.title}</p>
                          <p className={`text-[0.65rem] mt-0.5 font-mono tracking-[0.1em] uppercase ${isActive ? "text-white/40" : "text-muted"}`}>
                            {(subsMap[p.id] ?? []).length} sub-program
                          </p>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-white/40 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Right detail */}
              <AnimatePresence mode="wait">
                {inHouseActive ? (
                  /* ── In-House Training Panel ── */
                  <motion.div key="inhouse" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-12 }} transition={{ duration:0.4, ease:[0.4,0,0.2,1] }}>

                    {/* Header card — amber gradient */}
                    <div className="rounded-2xl p-8 md:p-10 mb-5 overflow-hidden relative"
                      style={{ background: "linear-gradient(135deg, #1C1400 0%, #2D1F00 60%, #1A1200 100%)" }}>
                      {/* Glow */}
                      <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, #F59E0B18 0%, transparent 65%)" }} />

                      <div className="flex items-start justify-between gap-6 mb-6 relative">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#F59E0B25" }}>
                            <Building2 size={22} style={{ color: "#F59E0B" }} />
                          </div>
                          <div>
                            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: "#F59E0B" }}>
                              Format Khusus
                            </p>
                            <h2 className="text-white text-[1.35rem] md:text-[1.65rem] font-extrabold tracking-tight leading-tight">
                              In-House Training
                            </h2>
                          </div>
                        </div>
                        <span className="hidden md:flex items-center gap-1.5 text-[0.68rem] font-extrabold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full flex-shrink-0 animate-pulse"
                          style={{ backgroundColor: "#F59E0B20", color: "#F59E0B", border: "1px solid #F59E0B40" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          Tersedia
                        </span>
                      </div>

                      <p className="text-white/30 text-[0.78rem] font-semibold tracking-wide italic mb-3 relative">
                        &ldquo;Program yang sepenuhnya dirancang untuk kebutuhan spesifik organisasi Anda.&rdquo;
                      </p>
                      <p className="text-white/50 text-[0.88rem] leading-[1.8] mb-8 max-w-[620px] relative">
                        GRCC hadir langsung ke lokasi Anda — kantor, gedung pelatihan, atau venue pilihan — untuk menyelenggarakan program pelatihan yang disesuaikan dengan tantangan nyata, regulasi yang relevan, dan tim yang spesifik dalam organisasi Anda.
                      </p>

                      <div className="flex flex-wrap gap-3 relative">
                        <motion.a href="mailto:grcc.ailg@gmail.com" whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
                          className="inline-flex items-center gap-2 text-[0.82rem] font-bold px-5 py-2.5 rounded-[6px] transition-colors group"
                          style={{ backgroundColor: "#F59E0B", color: "#0D0D0D" }}>
                          Konsultasi Gratis
                          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </motion.a>
                        <motion.a href="https://wa.me/6281234567890" whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
                          className="inline-flex items-center gap-2 text-[0.82rem] font-bold px-5 py-2.5 rounded-[6px] border transition-colors"
                          style={{ borderColor: "#F59E0B40", color: "#F59E0B" }}>
                          WhatsApp
                          <ArrowUpRight size={14} />
                        </motion.a>
                      </div>
                    </div>

                    {/* Feature grid */}
                    <div className="mb-5">
                      <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted mb-4">Keunggulan In-House</p>
                      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 gap-3">
                        {[
                          { icon: <Target size={15} />, title: "Kurikulum Disesuaikan", desc: "Materi dirancang khusus berdasarkan industri, regulasi, dan tantangan spesifik organisasi Anda." },
                          { icon: <Users size={15} />, title: "Pelatih Berpengalaman", desc: "Fasilitator GRCC yang bersertifikasi dengan pengalaman langsung di sektor publik dan swasta." },
                          { icon: <Lightbulb size={15} />, title: "Semua Program Tersedia", desc: "GRC, ESG, Accounting, Audit, HCM, hingga Digital Finance — semua bisa diselenggarakan in-house." },
                          { icon: <CheckCircle2 size={15} />, title: "Sertifikasi & Modul", desc: "Peserta mendapatkan sertifikat kelulusan resmi dan modul pelatihan yang dapat digunakan kembali." },
                        ].map((f, i) => (
                          <motion.div key={f.title} custom={i} variants={fadeUp}
                            whileHover={{ y: -3, boxShadow: "0 8px 24px #F59E0B18" }}
                            transition={{ type: "spring", stiffness: 320, damping: 22 }}
                            className="flex gap-3.5 p-5 rounded-xl border bg-white hover:border-amber-200 transition-all duration-300"
                            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: "#F59E0B15", color: "#D97706" }}>
                              {f.icon}
                            </div>
                            <div>
                              <h4 className="text-dark text-[0.88rem] font-bold mb-1">{f.title}</h4>
                              <p className="text-muted text-[0.77rem] leading-[1.65]">{f.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Process steps */}
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                      <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-amber-700 mb-4">Proses Pelaksanaan</p>
                      <div className="flex flex-col gap-3">
                        {[
                          { step: "01", label: "Konsultasi Kebutuhan", desc: "Tim GRCC memahami konteks organisasi dan tujuan pelatihan." },
                          { step: "02", label: "Rancang Kurikulum", desc: "Materi disesuaikan dengan kebutuhan dan dijadwalkan fleksibel." },
                          { step: "03", label: "Pelaksanaan & Sertifikasi", desc: "Sesi interaktif di lokasi Anda + sertifikat kelulusan resmi." },
                        ].map((s) => (
                          <div key={s.step} className="flex items-start gap-4">
                            <span className="text-[0.68rem] font-black text-amber-300 w-6 flex-shrink-0 mt-0.5">{s.step}</span>
                            <div>
                              <p className="text-[0.85rem] font-bold text-amber-900">{s.label}</p>
                              <p className="text-[0.77rem] text-amber-700/70 leading-relaxed">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Regular program panel ── */
                  <motion.div key={active} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-12 }} transition={{ duration:0.4, ease:[0.4,0,0.2,1] }}>
                    {/* Dark header card */}
                    <div className="rounded-2xl p-8 md:p-10 mb-5" style={{ backgroundColor: prog.bg }}>
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: prog.accent+"25" }}>
                            {renderIcon(prog.icon_name, { size: 22, style: { color: prog.accent } })}
                          </div>
                          <div>
                            <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase mb-1" style={{ color: prog.accent }}>
                              Program {prog.id}
                            </p>
                            <h2 className="text-white text-[1.35rem] md:text-[1.65rem] font-extrabold tracking-tight leading-tight">
                              {prog.title}
                            </h2>
                          </div>
                        </div>
                        <span className="hidden md:block text-[0.7rem] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border flex-shrink-0"
                          style={{ borderColor: prog.accent+"50", color: prog.accent }}>
                          {subs.length} Sub-Program
                        </span>
                      </div>

                      {prog.tagline && (
                        <p className="text-white/30 text-[0.78rem] font-semibold tracking-wide italic mb-3">&ldquo;{prog.tagline}&rdquo;</p>
                      )}
                      <p className="text-white/50 text-[0.88rem] leading-[1.8] mb-8 max-w-[620px]">{prog.description}</p>

                      <motion.a href="mailto:grcc.ailg@gmail.com" whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
                        className="inline-flex items-center gap-2 text-[0.82rem] font-bold px-5 py-2.5 rounded-[6px] transition-colors group"
                        style={{ backgroundColor: prog.accent, color:"#fff" }}>
                        Daftar / Konsultasi
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </motion.a>
                    </div>

                    {/* Sub-programs grid */}
                    {subs.length > 0 && (
                      <div>
                        <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted mb-4">Sub-Program</p>
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 gap-3">
                          {subs.map((sub, i) => (
                            <SubCard key={sub.id} sub={sub} accent={prog.accent} index={i} programId={prog.id} />
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ── PELATIHAN MENDATANG ─────────────────────────────── */}
      {(trainings.length > 0 || comingSoon.length > 0) && (
        <section className="py-[clamp(60px,8vw,110px)] bg-bg border-t border-border">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            {/* Header */}
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="flex items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[0.74rem] font-bold tracking-[0.14em] uppercase text-muted mb-3">Pelatihan Mendatang</p>
                <h2 className="text-[clamp(1.7rem,3.2vw,2.6rem)] font-extrabold tracking-tight leading-[1.15]">
                  Kembangkan keahlian Anda<br className="hidden md:block" /> di bidang tata kelola &amp; kepatuhan
                </h2>
              </div>
              <Link href="/training"
                className="flex-shrink-0 flex items-center gap-1.5 text-[0.85rem] font-bold text-dark border border-dark/15 hover:border-dark/40 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Lihat Semua <ArrowUpRight size={13} />
              </Link>
            </motion.div>

            {/* Cards grid */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Training cards */}
              {trainings.map((t, i) => (
                <motion.div key={t.id} custom={i} variants={fadeUp}
                  className="bg-white rounded-2xl border border-border overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
                  {/* Poster / color top */}
                  <div className="relative h-[175px] overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: t.color + "12" }}>
                    {t.poster_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.poster_url} alt={t.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[3rem] font-black select-none" style={{ color: t.color + "30" }}>
                          {t.category?.slice(0,2).toUpperCase() || t.title.slice(0,2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="text-[0.62rem] font-extrabold tracking-wider uppercase px-2 py-1 rounded-md text-white"
                        style={{ backgroundColor: t.color }}>
                        {t.format}
                      </span>
                      {t.category && (
                        <span className="text-[0.62rem] font-bold tracking-wider uppercase px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm">
                          {t.category}
                        </span>
                      )}
                    </div>
                    {/* Price + participants at bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      {t.price_label && (
                        <span className="text-[0.88rem] font-extrabold text-white drop-shadow">{t.price_label}</span>
                      )}
                      {t.max_participants && (
                        <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-white/80 bg-black/30 backdrop-blur-sm rounded-md px-2 py-0.5">
                          <Users size={10} /> {t.max_participants} peserta
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div className="flex-1">
                      <h3 className="font-extrabold text-[0.95rem] leading-snug mb-1.5 line-clamp-2">{t.title}</h3>
                      {t.description && (
                        <p className="text-muted text-[0.78rem] leading-[1.65] line-clamp-3">{t.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-[0.72rem] text-muted">
                      {t.date_start && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={10} />
                          {t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}
                        </span>
                      )}
                      {t.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={10} /> {t.location}
                        </span>
                      )}
                    </div>
                    <Link href={`/training/${t.id}`}
                      className="flex items-center justify-center gap-2 text-[0.82rem] font-extrabold py-2.5 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ backgroundColor: t.color, boxShadow: `0 4px 14px ${t.color}35` }}>
                      Daftar Sekarang <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}

              {/* Coming soon cards */}
              {comingSoon.slice(0, Math.max(0, 3 - trainings.length)).map((cs, i) => (
                <motion.div key={cs.id} custom={trainings.length + i} variants={fadeUp}
                  className="bg-white rounded-2xl border border-dashed overflow-hidden flex flex-col group"
                  style={{ borderColor: cs.color + "50" }}>
                  {/* Top illustration */}
                  <div className="relative h-[175px] flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: cs.color + "08" }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: cs.color + "15" }}>
                      <Clock size={28} style={{ color: cs.color + "80" }} />
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: cs.color }} />
                      <span className="text-[0.6rem] font-extrabold tracking-[0.12em] uppercase" style={{ color: cs.color }}>
                        Segera Hadir
                      </span>
                      {cs.category && (
                        <span className="ml-1 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                          style={{ borderColor: cs.color + "40", color: cs.color }}>
                          {cs.category}
                        </span>
                      )}
                    </div>
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
                      <h3 className="font-extrabold text-[0.95rem] leading-snug mb-1.5 uppercase line-clamp-2">{cs.title}</h3>
                      {cs.subtitle && (
                        <p className="text-muted text-[0.78rem] leading-[1.65] line-clamp-3">{cs.subtitle}</p>
                      )}
                    </div>
                    <button disabled
                      className="flex items-center justify-center gap-2 text-[0.82rem] font-bold py-2.5 rounded-xl border border-dashed transition-all"
                      style={{ borderColor: cs.color + "60", color: cs.color, backgroundColor: cs.color + "06" }}>
                      Pendaftaran dibuka segera
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FORMAT ──────────────────────────────────────────── */}
      <section className="py-[clamp(60px,8vw,110px)] bg-white border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            className="text-center mb-12">
            <p className="text-[0.74rem] font-bold tracking-[0.14em] uppercase text-muted mb-3">Format Pelaksanaan</p>
            <h2 className="text-[clamp(1.7rem,3.2vw,2.6rem)] font-extrabold tracking-tight leading-[1.15]">Fleksibel sesuai kebutuhan Anda</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon:"🏛", title:"Public Training",  desc:"Sesi intensif tatap muka di Surabaya atau lokasi klien." },
              { icon:"💻", title:"Online Training",  desc:"Live virtual session yang interaktif dengan materi digital lengkap." },
              { icon:"⚡", title:"Hybrid Training",  desc:"Kombinasi fleksibel antara sesi tatap muka dan virtual." },
              { icon:"🏢", title:"In-House Training", desc:"Program yang dirancang khusus sesuai kebutuhan spesifik organisasi Anda." },
            ].map((f, i) => (
              <motion.div key={f.title} custom={i} variants={fadeUp} whileHover={{ y:-4 }}
                transition={{ type:"spring", stiffness:300, damping:22 }}
                className="flex flex-col gap-3.5 p-6 rounded-2xl border border-border hover:border-dark/15 hover:shadow-sm transition-all duration-300 bg-bg">
                <span className="text-[2rem]">{f.icon}</span>
                <h3 className="text-[1rem] font-bold">{f.title}</h3>
                <p className="text-[0.83rem] leading-[1.7] text-muted">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-[clamp(70px,9vw,110px)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 text-center">
          <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <p className="text-white/25 text-[0.72rem] font-mono tracking-[0.22em] uppercase mb-6">Mulai Sekarang</p>
            <h2 className="text-white text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold tracking-tight leading-[1.1] mb-5">
              Temukan program yang tepat<br />untuk organisasi Anda.
            </h2>
            <p className="text-white/38 text-[0.92rem] leading-[1.8] max-w-[460px] mx-auto mb-10">
              Konsultasikan kebutuhan organisasi Anda dengan tim GRCC untuk mendapatkan program yang paling sesuai.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a href="mailto:grcc.ailg@gmail.com" whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                className="flex items-center gap-2 bg-white text-dark text-[0.88rem] font-bold px-7 py-3.5 rounded-[6px] hover:bg-white/90 transition-colors group">
                Hubungi Kami <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
              <motion.a href="/about" whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                className="flex items-center gap-2 border border-white/18 text-white text-[0.88rem] font-bold px-7 py-3.5 rounded-[6px] hover:border-white/35 transition-colors">
                Tentang GRCC
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
