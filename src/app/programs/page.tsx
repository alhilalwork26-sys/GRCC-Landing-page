"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, ProgramItem, SubProgramItem } from "@/lib/supabase";
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
  const [active,   setActive]   = useState(0);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [subsMap,  setSubsMap]  = useState<Record<string, SubProgramItem[]>>({});
  const [loading,  setLoading]  = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    (async () => {
      const [{ data: progs }, { data: subData }] = await Promise.all([
        supabase.from("programs").select("*").eq("active", true).order("order_index"),
        supabase.from("sub_programs").select("*").eq("active", true).order("order_index"),
      ]);
      const ps = progs ?? [];
      setPrograms(ps);
      const map: Record<string, SubProgramItem[]> = {};
      ps.forEach(p => { map[p.id] = []; });
      (subData ?? []).forEach(s => { if (map[s.program_id]) map[s.program_id].push(s); });
      setSubsMap(map);
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
                  {programs.map((p, i) => {
                    const isActive = active === i;
                    return (
                      <button key={p.id} onClick={() => setActive(i)}
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

                    <motion.a href="mailto:info@grcc.org" whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.97 }}
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
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

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
              { icon:"🏛", title:"Public Training",  desc:"Sesi intensif tatap muka di Jakarta, Surabaya, atau lokasi klien." },
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
              <motion.a href="mailto:info@grcc.org" whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
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
