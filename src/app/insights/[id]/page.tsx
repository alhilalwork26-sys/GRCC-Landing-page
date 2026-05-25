"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  motion, useScroll, useTransform,
  AnimatePresence, useMotionValue, useSpring,
} from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Tag, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, InsightItem } from "@/lib/supabase";

// ── Simple markdown renderer ──────────────────────────────────────────────────
function renderContent(raw: string) {
  if (!raw) return null;
  const blocks = raw.split(/\n{2,}/);

  return blocks.map((block, i) => {
    const lines = block.trim().split("\n");

    // H2
    if (lines.length === 1 && lines[0].startsWith("## ")) {
      return (
        <h2 key={i} className="text-[1.55rem] font-extrabold tracking-tight text-dark mt-10 mb-4 leading-[1.2]">
          {lines[0].slice(3)}
        </h2>
      );
    }
    // H3
    if (lines.length === 1 && lines[0].startsWith("### ")) {
      return (
        <h3 key={i} className="text-[1.15rem] font-bold text-dark mt-8 mb-3 leading-[1.3]">
          {lines[0].slice(4)}
        </h3>
      );
    }
    // Bullet list
    if (lines.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="my-5 space-y-2.5">
          {lines.map((l, j) => (
            <li key={j} className="flex items-start gap-3 text-[0.95rem] text-dark/75 leading-[1.8]">
              <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "currentColor" }} />
              {l.slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    // Numbered list
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      return (
        <ol key={i} className="my-5 space-y-2.5 list-none">
          {lines.map((l, j) => {
            const match = l.match(/^(\d+)\.\s(.+)/);
            if (!match) return null;
            return (
              <li key={j} className="flex items-start gap-3.5 text-[0.95rem] text-dark/75 leading-[1.8]">
                <span className="mt-0.5 text-[0.7rem] font-extrabold min-w-[22px] h-[22px] rounded-full bg-dark/[0.08] flex items-center justify-center flex-shrink-0">
                  {match[1]}
                </span>
                {match[2]}
              </li>
            );
          })}
        </ol>
      );
    }
    // Blockquote
    if (lines.every((l) => l.startsWith("> "))) {
      return (
        <blockquote key={i} className="my-6 pl-5 border-l-[3px] border-dark/30">
          <p className="text-[1rem] text-dark/60 italic leading-[1.8]">
            {lines.map((l) => l.slice(2)).join(" ")}
          </p>
        </blockquote>
      );
    }
    // Regular paragraph
    return (
      <p key={i} className="text-[0.97rem] text-dark/70 leading-[1.9] my-5">
        {lines.join(" ")}
      </p>
    );
  });
}

// ── Related card ──────────────────────────────────────────────────────────────
function RelatedCard({ item }: { item: InsightItem }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-40, 40], [3, -3]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-60, 60], [-3, 3]), { stiffness: 200, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/insights/${item.id}`}>
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set(e.clientX - r.left - r.width / 2);
          y.set(e.clientY - r.top - r.height / 2);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-2xl cursor-pointer"
      >
        <div className="relative overflow-hidden h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse at 50% 120%, ${item.color}30 0%, transparent 60%)` }} />
          <span className="absolute top-3 left-3 text-[0.58rem] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
            {item.tag}
          </span>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-[0.92rem] leading-[1.4] line-clamp-2 mb-2">{item.title}</h4>
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] text-muted flex items-center gap-1"><Calendar size={10} />{item.date}</span>
            <motion.div initial={{ x: -4, opacity: 0 }} whileHover={{ x: 0, opacity: 1 }} className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
              <ArrowUpRight size={12} />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1.5px ${item.color}60` }} />
      </motion.div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InsightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<InsightItem | null>(null);
  const [related, setRelated] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY   = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpa = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("insights").select("*").eq("id", id).single();
      if (data) {
        setItem(data);
        // fetch related (same type, exclude this)
        const { data: rel } = await supabase
          .from("insights")
          .select("*")
          .eq("published", true)
          .eq("type", data.type)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(3);
        setRelated(rel ?? []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-dark/20 border-t-dark"
          />
        </div>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center gap-6">
          <p className="text-[1.1rem] font-bold text-dark/50">Artikel tidak ditemukan.</p>
          <Link href="/insights" className="text-[0.85rem] font-semibold text-dark underline underline-offset-4">
            ← Kembali ke Insights
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const readingTime = item.content
    ? Math.max(1, Math.ceil(item.content.split(/\s+/).length / 200))
    : null;

  return (
    <>
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden bg-[#0A0A0A]"
      >
        {/* Parallax image */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, ${item.color}22 0%, transparent 55%)` }} />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />

        {/* Content */}
        <motion.div style={{ opacity: heroOpa }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16 w-full pb-[clamp(60px,8vw,90px)]">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/30 text-[0.68rem] font-mono tracking-[0.15em] uppercase mb-8"
          >
            <Link href="/" className="hover:text-white/60 transition-colors">GRCC</Link>
            <ChevronRight size={10} />
            <Link href="/insights" className="hover:text-white/60 transition-colors">Insights</Link>
            <ChevronRight size={10} />
            <span className="text-white/50">{item.type}</span>
          </motion.div>

          {/* Tags row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="flex items-center gap-2.5 mb-6"
          >
            <span className="text-[0.62rem] font-extrabold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
              {item.tag}
            </span>
            <span className="text-[0.62rem] font-semibold text-white/50 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
              {item.type}
            </span>
            {readingTime && (
              <span className="text-[0.62rem] font-semibold text-white/40 bg-white/[0.07] px-2.5 py-1.5 rounded-full">
                {readingTime} menit baca
              </span>
            )}
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden mb-6 max-w-[820px]">
            <motion.h1
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="text-white font-extrabold leading-[1.1] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              {item.title}
            </motion.h1>
          </div>

          {/* Excerpt */}
          {item.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              className="text-white/50 text-[0.97rem] leading-[1.85] max-w-[580px] mb-8"
            >
              {item.excerpt}
            </motion.p>
          )}

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="flex items-center gap-6 flex-wrap"
          >
            {item.date && (
              <span className="flex items-center gap-2 text-[0.75rem] text-white/40">
                <Calendar size={13} className="opacity-70" />
                {item.date}
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-2 text-[0.75rem] text-white/40">
                <MapPin size={13} className="opacity-70" />
                {item.location}
              </span>
            )}
            {item.tag && (
              <span className="flex items-center gap-2 text-[0.75rem] text-white/40">
                <Tag size={13} className="opacity-70" />
                {item.tag}
              </span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ── ARTICLE BODY ────────────────────────────────────────────── */}
      <section className="bg-[#F7F7F5] py-[clamp(60px,8vw,100px)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">

            {/* Left — article content */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Back button */}
              <motion.button
                onClick={() => router.back()}
                whileHover={{ x: -3 }}
                className="flex items-center gap-2 text-[0.78rem] font-bold text-dark/40 hover:text-dark transition-colors mb-10 group"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Kembali ke Insights
              </motion.button>

              {item.content ? (
                <article className="prose-custom">
                  {renderContent(item.content)}
                </article>
              ) : (
                <div className="bg-white rounded-2xl border border-border p-8 text-center">
                  <p className="text-[0.9rem] text-muted">Isi artikel belum tersedia.</p>
                </div>
              )}

              {/* Share row */}
              <div className="mt-14 pt-8 border-t border-dark/[0.08] flex items-center justify-between flex-wrap gap-4">
                <p className="text-[0.78rem] font-semibold text-dark/35">Bagikan artikel ini</p>
                <div className="flex items-center gap-2.5">
                  {[
                    { label: "Twitter / X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(item.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="text-[0.72rem] font-bold px-3.5 py-2 rounded-lg border border-dark/10 hover:border-dark/25 hover:bg-dark/[0.04] transition-all">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
              className="lg:sticky lg:top-24 space-y-6"
            >
              {/* About card */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <p className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-muted mb-4">Tentang</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + "18" }}>
                      <Tag size={13} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-[0.68rem] text-muted font-semibold">Kategori</p>
                      <p className="text-[0.82rem] font-bold">{item.type}</p>
                    </div>
                  </div>
                  {item.date && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + "18" }}>
                        <Calendar size={13} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-[0.68rem] text-muted font-semibold">Tanggal</p>
                        <p className="text-[0.82rem] font-bold">{item.date}</p>
                      </div>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + "18" }}>
                        <MapPin size={13} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-[0.68rem] text-muted font-semibold">Lokasi</p>
                        <p className="text-[0.82rem] font-bold">{item.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA card */}
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}
              >
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full opacity-20" style={{ background: "rgba(255,255,255,0.3)" }} />
                <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-white/70 mb-3">GRCC Training</p>
                <p className="font-extrabold text-[1rem] leading-[1.3] mb-4">Ikuti pelatihan & workshop GRCC</p>
                <Link href="/programs" className="flex items-center gap-2 text-[0.78rem] font-bold bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 rounded-xl w-fit">
                  Lihat Program <ArrowUpRight size={13} />
                </Link>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ── RELATED ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {related.length > 0 && (
          <section className="bg-[#F7F7F5] pb-[clamp(80px,10vw,120px)]">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
              <div className="border-t border-dark/[0.08] pt-14 mb-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted mb-1">Baca Juga</p>
                  <h2 className="text-[1.3rem] font-extrabold tracking-tight">Artikel {item.type} Lainnya</h2>
                </div>
                <Link href="/insights" className="flex items-center gap-2 text-[0.8rem] font-bold text-dark/50 hover:text-dark transition-colors">
                  Semua Insights <ArrowUpRight size={14} />
                </Link>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                className={`grid gap-4 ${related.length === 3 ? "grid-cols-1 md:grid-cols-3" : related.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-sm"}`}
              >
                {related.map((r) => (
                  <motion.div
                    key={r.id}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
                    }}
                  >
                    <RelatedCard item={r} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
