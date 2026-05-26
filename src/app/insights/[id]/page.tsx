"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  motion, useScroll, useTransform, AnimatePresence, useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowLeft, Calendar, MapPin, Tag, ChevronRight,
  ArrowUpRight, Eye, List, X, ZoomIn, ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, InsightItem } from "@/lib/supabase";

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
}

type TocItem = { level: 2 | 3; text: string; id: string };

function parseHeadings(content: string): TocItem[] {
  return content
    .split("\n")
    .filter((l) => l.startsWith("## ") || l.startsWith("### "))
    .map((l) => ({
      level: (l.startsWith("### ") ? 3 : 2) as 2 | 3,
      text: l.startsWith("### ") ? l.slice(4) : l.slice(3),
      id: slugify(l.startsWith("### ") ? l.slice(4) : l.slice(3)),
    }));
}

function renderContent(raw: string) {
  if (!raw) return null;
  return raw.split(/\n{2,}/).map((block, i) => {
    const lines = block.trim().split("\n");

    if (lines.length === 1 && lines[0].startsWith("## ")) {
      const text = lines[0].slice(3);
      return (
        <h2 key={i} id={slugify(text)}
          className="text-[1.55rem] font-extrabold tracking-tight text-dark mt-12 mb-5 leading-[1.2] scroll-mt-28">
          {text}
        </h2>
      );
    }
    if (lines.length === 1 && lines[0].startsWith("### ")) {
      const text = lines[0].slice(4);
      return (
        <h3 key={i} id={slugify(text)}
          className="text-[1.15rem] font-bold text-dark mt-9 mb-3 leading-[1.3] scroll-mt-28">
          {text}
        </h3>
      );
    }
    if (lines.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="my-5 space-y-2.5">
          {lines.map((l, j) => (
            <li key={j} className="flex items-start gap-3 text-[0.95rem] text-dark/70 leading-[1.85]">
              <span className="mt-[0.65em] w-1.5 h-1.5 rounded-full bg-dark/35 flex-shrink-0" />
              {l.slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      return (
        <ol key={i} className="my-5 space-y-2.5 list-none">
          {lines.map((l, j) => {
            const m = l.match(/^(\d+)\.\s(.+)/);
            if (!m) return null;
            return (
              <li key={j} className="flex items-start gap-3.5 text-[0.95rem] text-dark/70 leading-[1.85]">
                <span className="mt-0.5 text-[0.68rem] font-extrabold min-w-[22px] h-[22px] rounded-full bg-dark/[0.08] flex items-center justify-center flex-shrink-0">
                  {m[1]}
                </span>
                {m[2]}
              </li>
            );
          })}
        </ol>
      );
    }
    if (lines.every((l) => l.startsWith("> "))) {
      return (
        <blockquote key={i} className="my-7 pl-5 border-l-[3px] border-dark/20">
          <p className="text-[1rem] text-dark/55 italic leading-[1.85]">
            {lines.map((l) => l.slice(2)).join(" ")}
          </p>
        </blockquote>
      );
    }
    return (
      <p key={i} className="text-[0.97rem] text-dark/68 leading-[1.9] my-5">
        {lines.join(" ")}
      </p>
    );
  });
}

// ── TOC ───────────────────────────────────────────────────────────────────────
function TableOfContents({ toc, activeId }: { toc: TocItem[]; activeId: string }) {
  if (toc.length < 2) return null;
  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <List size={13} className="text-muted" />
        <p className="text-[0.63rem] font-bold tracking-[0.18em] uppercase text-muted">Daftar Isi</p>
      </div>
      <nav className="space-y-0.5">
        {toc.map((item) => (
          <a key={item.id} href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            className={`flex items-start gap-2.5 py-1.5 px-2.5 -mx-1 rounded-lg text-[0.78rem] transition-all duration-150 ${
              item.level === 3 ? "pl-5" : ""
            } ${activeId === item.id
                ? "text-dark font-bold bg-dark/[0.06]"
                : "text-dark/45 hover:text-dark hover:bg-dark/[0.03]"}`}
          >
            <span className={`mt-[0.6em] w-1 h-1 rounded-full flex-shrink-0 transition-colors ${activeId === item.id ? "bg-dark" : "bg-dark/20"}`} />
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ── Prev/Next card ────────────────────────────────────────────────────────────
type NavItem = Pick<InsightItem, "id" | "title" | "img" | "type" | "color" | "tag" | "date">;

function NavCard({ item, direction }: { item: NavItem; direction: "prev" | "next" }) {
  return (
    <Link href={`/insights/${item.id}`} className="flex-1 min-w-0">
      <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`flex items-center gap-4 p-5 bg-white border border-border rounded-2xl hover:shadow-md transition-shadow ${direction === "next" ? "flex-row-reverse" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.img} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
        <div className={`flex-1 min-w-0 ${direction === "next" ? "text-right" : ""}`}>
          <p className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-muted mb-1">
            {direction === "prev" ? "← Sebelumnya" : "Berikutnya →"}
          </p>
          <p className="font-bold text-[0.9rem] leading-[1.35] line-clamp-2">{item.title}</p>
          <span className="text-[0.62rem] font-bold mt-2 inline-block px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
            {item.tag}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Related card ──────────────────────────────────────────────────────────────
function RelatedCard({ item }: { item: InsightItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-40, 40], [3, -3]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-60, 60], [-3, 3]), { stiffness: 200, damping: 20 });

  return (
    <Link href={`/insights/${item.id}`}>
      <motion.div ref={ref}
        onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); x.set(e.clientX - r.left - r.width / 2); y.set(e.clientY - r.top - r.height / 2); }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-2xl cursor-pointer bg-white border border-border">
        <div className="relative overflow-hidden h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse at 50% 120%, ${item.color}30 0%, transparent 60%)` }} />
          <span className="absolute top-3 left-3 text-[0.58rem] font-extrabold tracking-[0.12em] uppercase px-2.5 py-1.5 rounded-full text-white"
            style={{ backgroundColor: item.color }}>{item.tag}</span>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-[0.92rem] leading-[1.4] line-clamp-2 mb-2">{item.title}</h4>
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] text-muted flex items-center gap-1"><Calendar size={10} />{item.date}</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color }}>
              <ArrowUpRight size={12} />
            </div>
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
  const [item, setItem]       = useState<InsightItem | null>(null);
  const [related, setRelated] = useState<InsightItem[]>([]);
  const [prevArt, setPrevArt] = useState<NavItem | null>(null);
  const [nextArt, setNextArt] = useState<NavItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeading, setActiveHeading] = useState("");
  const [sel, setSel] = useState({ text: "", x: 0, y: 0, show: false });
  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });
  const articleRef = useRef<HTMLDivElement>(null);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY   = useTransform(heroP, [0, 1], ["0%", "28%"]);
  const heroOpa = useTransform(heroP, [0, 0.7], [1, 0]);

  // Load
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("insights").select("*").eq("id", id).single();
      if (data) {
        setItem(data);
        supabase.rpc("increment_insight_views", { insight_id: id });
        const sel = "id,title,img,type,color,tag,date";
        const [{ data: rel }, { data: prev }, { data: nxt }] = await Promise.all([
          supabase.from("insights").select("*").eq("published", true).eq("type", data.type).neq("id", id).order("created_at", { ascending: false }).limit(3),
          supabase.from("insights").select(sel).eq("published", true).lt("created_at", data.created_at).order("created_at", { ascending: false }).limit(1).maybeSingle(),
          supabase.from("insights").select(sel).eq("published", true).gt("created_at", data.created_at).order("created_at", { ascending: true }).limit(1).maybeSingle(),
        ]);
        setRelated(rel ?? []);
        setPrevArt(prev);
        setNextArt(nxt);
      }
      setLoading(false);
    })();
  }, [id]);

  // TOC tracking
  const toc = item?.content ? parseHeadings(item.content) : [];
  useEffect(() => {
    if (!toc.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveHeading(e.target.id); }),
      { rootMargin: "-15% 0% -75% 0%" }
    );
    toc.forEach(({ id: hid }) => { const el = document.getElementById(hid); if (el) obs.observe(el); });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  // Text highlight share
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 15) { setSel((s) => ({ ...s, show: false })); return; }
    if (!articleRef.current?.contains(selection.anchorNode)) { setSel((s) => ({ ...s, show: false })); return; }
    const range = selection.getRangeAt(0);
    const rect  = range.getBoundingClientRect();
    setSel({ text: selection.toString().trim().slice(0, 280), x: rect.left + rect.width / 2, y: rect.top - 60, show: true });
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest("#share-tooltip")) return;
    setSel((s) => ({ ...s, show: false }));
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => { document.removeEventListener("mouseup", handleMouseUp); document.removeEventListener("mousedown", handleMouseDown); };
  }, [handleMouseUp, handleMouseDown]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-dark/20 border-t-dark" />
      </div>
      <Footer />
    </>
  );

  if (!item) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center gap-6">
        <p className="text-[1.1rem] font-bold text-dark/50">Artikel tidak ditemukan.</p>
        <Link href="/insights" className="text-[0.85rem] font-semibold text-dark underline underline-offset-4">← Kembali ke Insights</Link>
      </div>
      <Footer />
    </>
  );

  const readingTime = item.content ? Math.max(1, Math.ceil(item.content.split(/\s+/).length / 200)) : null;
  const pageUrl     = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* ── Reading progress bar ── */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%", backgroundColor: item.color }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[100]"
      />

      {/* ── Text highlight share tooltip ── */}
      <AnimatePresence>
        {sel.show && (
          <motion.div id="share-tooltip"
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{ left: sel.x, top: sel.y, translateX: "-50%", position: "fixed" }}
            className="z-[200] bg-[#0A0A0A] text-white rounded-full px-1 py-1 flex items-center gap-0.5 shadow-2xl pointer-events-auto"
          >
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${sel.text}" — via GRCC Insights\n${pageUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-white/15 transition-colors text-[0.7rem] font-bold">
              <X size={11} /> Tweet
            </a>
            <div className="w-px h-4 bg-white/20" />
            <a href={`https://wa.me/?text=${encodeURIComponent(`"${sel.text}" — ${pageUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-white/15 transition-colors text-[0.7rem] font-bold">
              WA
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[78vh] flex flex-col justify-end overflow-hidden bg-[#0A0A0A]">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, ${item.color}20 0%, transparent 55%)` }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />

        <motion.div style={{ opacity: heroOpa }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16 w-full pb-[clamp(60px,7vw,90px)]">

          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/28 text-[0.65rem] font-mono tracking-[0.15em] uppercase mb-8">
            <Link href="/" className="hover:text-white/55 transition-colors">GRCC</Link>
            <ChevronRight size={10} />
            <Link href="/insights" className="hover:text-white/55 transition-colors">Insights</Link>
            <ChevronRight size={10} />
            <span className="text-white/45">{item.type}</span>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="flex items-center gap-2.5 flex-wrap mb-6">
            <span className="text-[0.6rem] font-extrabold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
              {item.tag}
            </span>
            <span className="text-[0.6rem] font-semibold text-white/50 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full">{item.type}</span>
            {readingTime && (
              <span className="text-[0.6rem] font-semibold text-white/38 bg-white/[0.07] px-2.5 py-1.5 rounded-full">
                {readingTime} menit baca
              </span>
            )}
            <span className="text-[0.6rem] font-semibold text-white/38 bg-white/[0.07] px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Eye size={10} /> {(item.view_count ?? 0).toLocaleString()} views
            </span>
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden mb-5 max-w-[820px]">
            <motion.h1 initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="text-white font-extrabold leading-[1.1] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}>
              {item.title}
            </motion.h1>
          </div>

          {item.excerpt && (
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.25 }}
              className="text-white/48 text-[0.97rem] leading-[1.85] max-w-[580px] mb-8">
              {item.excerpt}
            </motion.p>
          )}

          {/* Meta */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.32 }}
            className="flex items-center gap-6 flex-wrap">
            {item.date     && <span className="flex items-center gap-2 text-[0.73rem] text-white/38"><Calendar size={12} className="opacity-70" />{item.date}</span>}
            {item.location && <span className="flex items-center gap-2 text-[0.73rem] text-white/38"><MapPin size={12} className="opacity-70" />{item.location}</span>}
            {item.tag      && <span className="flex items-center gap-2 text-[0.73rem] text-white/38"><Tag size={12} className="opacity-70" />{item.tag}</span>}
          </motion.div>
        </motion.div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────────────────────────── */}
      <section className="bg-[#F7F7F5] py-[clamp(60px,8vw,100px)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-14 items-start">

            {/* Left — article */}
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}>

              <motion.button onClick={() => router.back()} whileHover={{ x: -3 }}
                className="flex items-center gap-2 text-[0.78rem] font-bold text-dark/38 hover:text-dark transition-colors mb-10 group">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Kembali ke Insights
              </motion.button>

              {item.content ? (
                <article ref={articleRef} className="select-text">
                  {renderContent(item.content)}
                </article>
              ) : (
                <div className="bg-white rounded-2xl border border-border p-10 text-center">
                  <p className="text-[0.9rem] text-muted">Isi artikel belum tersedia.</p>
                </div>
              )}

              {/* ── Photo Gallery ── */}
              {(item.gallery ?? []).length > 0 && (() => {
                const photos = item.gallery!;
                const openLightbox = (idx: number) => setLightbox({ open: true, idx });
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-14 pt-10 border-t border-dark/[0.07]"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: item.color }} />
                      <h2 className="text-[1.1rem] font-extrabold tracking-tight">Foto Dokumentasi</h2>
                      <span className="text-[0.7rem] font-bold text-muted bg-dark/[0.05] px-2.5 py-1 rounded-full">{photos.length} foto</span>
                    </div>

                    {/* Grid */}
                    <motion.div
                      className={`grid gap-3 ${
                        photos.length === 1 ? "grid-cols-1" :
                        photos.length === 2 ? "grid-cols-2" :
                        photos.length === 4 ? "grid-cols-2" :
                        "grid-cols-2 md:grid-cols-3"
                      }`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-40px" }}
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                    >
                      {photos.map((url, idx) => (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, scale: 0.92, y: 16 },
                            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }
                          }}
                          onClick={() => openLightbox(idx)}
                          className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-dark/[0.04] ${
                            photos.length >= 3 && idx === 0 ? "col-span-2 md:col-span-1" : ""
                          }`}
                          style={{ aspectRatio: photos.length === 1 ? "16/9" : photos.length === 2 ? "4/3" : "1/1" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Dokumentasi ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Hover overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{ background: `${item.color}30` }}
                          >
                            <motion.div
                              initial={{ scale: 0.7, opacity: 0 }}
                              whileHover={{ scale: 1 }}
                              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                            >
                              <ZoomIn size={18} className="text-dark" />
                            </motion.div>
                          </div>
                          {/* Index badge */}
                          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-black/50 text-white text-[0.6rem] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {idx + 1}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })()}

              {/* ── Lightbox ── */}
              <AnimatePresence>
                {lightbox.open && (item.gallery ?? []).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
                    onClick={() => setLightbox(l => ({ ...l, open: false }))}
                  >
                    {/* Close */}
                    <button
                      className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                      onClick={() => setLightbox(l => ({ ...l, open: false }))}
                    >
                      <X size={18} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-[0.75rem] font-semibold">
                      {lightbox.idx + 1} / {item.gallery!.length}
                    </div>

                    {/* Prev */}
                    {item.gallery!.length > 1 && (
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                        onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx - 1 + item.gallery!.length) % item.gallery!.length })); }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}

                    {/* Image */}
                    <motion.div
                      key={lightbox.idx}
                      initial={{ opacity: 0, scale: 0.93 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.93 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-[90vw] max-h-[85vh]"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.gallery![lightbox.idx]}
                        alt={`Dokumentasi ${lightbox.idx + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                      />
                    </motion.div>

                    {/* Next */}
                    {item.gallery!.length > 1 && (
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                        onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx + 1) % item.gallery!.length })); }}
                      >
                        <ChevronRightIcon size={20} />
                      </button>
                    )}

                    {/* Thumbnails strip */}
                    {item.gallery!.length > 1 && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                        {item.gallery!.map((url, i) => (
                          <button
                            key={i}
                            onClick={e => { e.stopPropagation(); setLightbox({ open: true, idx: i }); }}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === lightbox.idx ? "border-white scale-110" : "border-white/20 opacity-50 hover:opacity-80"}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share row */}
              <div className="mt-14 pt-8 border-t border-dark/[0.07] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[0.75rem] font-semibold text-dark/35 mb-0.5">Bagikan artikel ini</p>
                  <p className="text-[0.68rem] text-muted">Sorot teks untuk share kutipan</p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: "Twitter / X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(pageUrl)}` },
                    { label: "LinkedIn",    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
                    { label: "WhatsApp",   href: `https://wa.me/?text=${encodeURIComponent(item.title + " " + pageUrl)}` },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="text-[0.72rem] font-bold px-3.5 py-2 rounded-lg border border-dark/10 hover:border-dark/25 hover:bg-dark/[0.04] transition-all">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Prev / Next */}
              {(prevArt || nextArt) && (
                <div className="mt-10 flex gap-4 flex-col sm:flex-row">
                  {prevArt && <NavCard item={prevArt} direction="prev" />}
                  {nextArt && <NavCard item={nextArt} direction="next" />}
                </div>
              )}
            </motion.div>

            {/* Right — sidebar */}
            <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.4, 0, 0.2, 1] }}
              className="lg:sticky lg:top-24 space-y-4">

              {/* TOC */}
              <TableOfContents toc={toc} activeId={activeHeading} />

              {/* About card */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <p className="text-[0.63rem] font-bold tracking-[0.16em] uppercase text-muted mb-4">Tentang Artikel</p>
                <div className="space-y-3.5">
                  {[
                    { icon: <Tag size={12} />, label: "Kategori", value: item.type },
                    item.date     ? { icon: <Calendar size={12} />, label: "Tanggal",   value: item.date }     : null,
                    item.location ? { icon: <MapPin size={12} />,   label: "Lokasi",    value: item.location } : null,
                    { icon: <Eye size={12} />, label: "Views",     value: `${(item.view_count ?? 0).toLocaleString()} kali dibaca` },
                    readingTime ? { icon: <span className="text-[0.65rem] font-bold">⏱</span>, label: "Waktu Baca", value: `${readingTime} menit` } : null,
                  ].filter(Boolean).map((row, i) => row && (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                        style={{ backgroundColor: item.color }}>
                        {row.icon}
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-muted font-semibold">{row.label}</p>
                        <p className="text-[0.82rem] font-bold">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <motion.div whileHover={{ y: -2 }} className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)` }}>
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-15" style={{ background: "rgba(255,255,255,0.4)" }} />
                <p className="text-[0.63rem] font-bold tracking-[0.12em] uppercase text-white/65 mb-2">GRCC Training</p>
                <p className="font-extrabold text-[1rem] leading-[1.3] mb-4">Ikuti pelatihan &amp; workshop GRCC</p>
                <Link href="/programs" className="flex items-center gap-2 text-[0.77rem] font-bold bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 rounded-xl w-fit">
                  Lihat Program <ArrowUpRight size={13} />
                </Link>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ── RELATED ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-[#F7F7F5] pb-[clamp(80px,10vw,120px)]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="border-t border-dark/[0.08] pt-14 mb-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[0.63rem] font-bold tracking-[0.2em] uppercase text-muted mb-1">Baca Juga</p>
                <h2 className="text-[1.3rem] font-extrabold tracking-tight">Artikel {item.type} Lainnya</h2>
              </div>
              <Link href="/insights" className="flex items-center gap-2 text-[0.8rem] font-bold text-dark/45 hover:text-dark transition-colors">
                Semua Insights <ArrowUpRight size={14} />
              </Link>
            </div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className={`grid gap-4 ${related.length === 3 ? "grid-cols-1 md:grid-cols-3" : related.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-sm"}`}>
              {related.map((r) => (
                <motion.div key={r.id}
                  variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } }}>
                  <RelatedCard item={r} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
