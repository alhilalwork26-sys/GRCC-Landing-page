"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion, useScroll, useTransform,
  AnimatePresence, useMotionValue, useSpring,
} from "framer-motion";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, InsightItem } from "@/lib/supabase";

// ── types ─────────────────────────────────────────────────────────────────────
type Category = "Semua" | "Kegiatan" | "Publikasi" | "Berita";

const cats: Category[] = ["Semua", "Kegiatan", "Publikasi", "Berita"];

// ── magnetic card hook ────────────────────────────────────────────────────────
function MagneticCard({
  item, large = false,
}: {
  item: InsightItem;
  large?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-60, 60], [4, -4]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-80, 80], [-4, 4]), { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${large ? "h-[480px]" : "h-[280px]"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
        />
        {/* Layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 120%, ${item.color}30 0%, transparent 60%)` }}
        />

        {/* Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-[0.6rem] font-extrabold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-white"
            style={{ backgroundColor: item.color }}
          >
            {item.tag}
          </motion.span>
          <span className="text-[0.6rem] font-semibold text-white/60 bg-black/30 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {item.type}
          </span>
        </div>

        {/* Content overlaid */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3
            className={`text-white font-extrabold leading-[1.25] tracking-tight mb-3 ${
              large ? "text-[1.55rem]" : "text-[1rem]"
            }`}
          >
            {item.title}
          </h3>

          {/* Excerpt — slides up on hover */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-white/65 text-[0.82rem] leading-[1.7] mb-3 line-clamp-2"
            >
              {item.excerpt}
            </motion.p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[0.7rem] text-white/50">
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                {item.date}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <MapPin size={11} />
                {item.location}
              </span>
            </div>

            {/* Arrow button */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: item.color }}
            >
              <ArrowUpRight size={15} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${item.color}60` }}
      />
    </motion.div>
  );
}

// ── animated tab indicator ────────────────────────────────────────────────────
function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: Category;
  onChange: (c: Category) => void;
  counts: Record<Category, number>;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {cats.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.95 }}
            className="relative px-5 py-2.5 rounded-full text-[0.8rem] font-bold transition-colors duration-200 overflow-hidden"
            style={{ color: isActive ? "#fff" : "rgba(0,0,0,0.45)" }}
          >
            {/* Active bg pill */}
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-dark"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 rounded-full border border-border hover:border-dark/25 transition-colors" />
            )}
            <span className="relative flex items-center gap-2">
              {cat}
              <span
                className={`text-[0.62rem] font-extrabold min-w-[18px] text-center px-1 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-dark/[0.07] text-dark/40"
                }`}
              >
                {counts[cat]}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<Category>("Semua");
  const [allItems, setAllItems] = useState<InsightItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const heroOpa = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    supabase
      .from("insights")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setAllItems(data ?? []);
        setLoadingItems(false);
      });
  }, []);

  const featured = allItems.find((i) => i.featured) ?? allItems[0];
  const rest = featured ? allItems.filter((i) => i.id !== featured.id) : allItems;
  const filtered = activeTab === "Semua" ? rest : rest.filter((i) => i.type === activeTab);

  const counts: Record<Category, number> = {
    Semua: rest.length,
    Kegiatan: rest.filter((i) => i.type === "Kegiatan").length,
    Publikasi: rest.filter((i) => i.type === "Publikasi").length,
    Berita: rest.filter((i) => i.type === "Berita").length,
  };

  // Build rows: alternating [1.6fr,1fr,1fr] and [1fr,1fr,1.6fr]
  const rows: InsightItem[][] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i === 0 && filtered.length >= 3) {
      rows.push([filtered[0], filtered[1], filtered[2]]);
      i += 3;
    } else {
      const chunk = filtered.slice(i, i + 3);
      rows.push(chunk);
      i += chunk.length;
    }
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden bg-[#0A0A0A] pb-[clamp(60px,8vw,100px)]"
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Glow blobs */}
        {[
          { x: "70%", y: "-10%", c: "#4F46E5" },
          { x: "-5%", y: "60%",  c: "#10B981" },
        ].map((b) => (
          <motion.div
            key={b.c}
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ left: b.x, top: b.y, background: `radial-gradient(circle, ${b.c}18 0%, transparent 65%)` }}
          />
        ))}

        <motion.div
          style={{ y: heroY, opacity: heroOpa }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16 w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/25 text-[0.7rem] font-mono tracking-[0.22em] uppercase mb-8"
          >
            GRCC &nbsp;/&nbsp; Insights
          </motion.p>

          <div className="overflow-hidden mb-4">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="text-white font-extrabold leading-[0.93] tracking-[-0.035em]"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}
            >
              Insights &amp;
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
              className="font-extrabold leading-[0.93] tracking-[-0.035em]"
              style={{
                fontSize: "clamp(3rem, 7vw, 6.5rem)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
                color: "transparent",
              }}
            >
              Aktivitas
            </motion.h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28 }}
              className="text-white/38 text-[0.95rem] leading-[1.85] max-w-[460px]"
            >
              Dokumentasi kegiatan, publikasi riset, dan berita terkini dari
              Center for Governance, Risk, Compliance &amp; Competitiveness.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex gap-8"
            >
              {[["11+","Kegiatan 2025"],["500+","Peserta"],["3","Publikasi"]].map(([v,l]) => (
                <div key={l} className="flex flex-col">
                  <span className="text-white font-extrabold leading-none" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)" }}>{v}</span>
                  <span className="text-white/28 text-[0.62rem] tracking-[0.12em] uppercase mt-1.5">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURED ────────────────────────────────────────────────── */}
      {!loadingItems && featured && (
        <section className="py-[clamp(60px,8vw,100px)] bg-[#F7F7F5]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-7"
            >
              <span className="w-6 h-px bg-dark/30" />
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-dark/40">Sorotan Utama</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <MagneticCard item={featured} large />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── GRID ────────────────────────────────────────────────────── */}
      <section className="pb-[clamp(80px,10vw,130px)] bg-[#F7F7F5]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

          {/* Filter + label row */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-10 pb-8 border-b border-dark/[0.08]">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-dark/35 mb-1">
                Semua Konten
              </p>
              <h2 className="text-[1.4rem] font-extrabold tracking-tight">
                {counts[activeTab]} artikel ditemukan
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <FilterTabs active={activeTab} onChange={setActiveTab} counts={counts} />
            </motion.div>
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingItems ? "loading" : activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {loadingItems && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map((n) => (
                    <div key={n} className="rounded-2xl overflow-hidden bg-dark/[0.05] animate-pulse">
                      <div className="h-[280px]" />
                    </div>
                  ))}
                </div>
              )}
              {rows.map((row, ri) => (
                <motion.div
                  key={ri}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                  className={`grid gap-4 mb-4 ${
                    ri % 2 === 0 && row.length === 3
                      ? "grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr]"
                      : ri % 2 === 1 && row.length === 3
                      ? "grid-cols-1 md:grid-cols-[1fr_1fr_1.6fr]"
                      : row.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {row.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, y: 32 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
                      }}
                    >
                      <MagneticCard item={item} large={false} />
                    </motion.div>
                  ))}
                </motion.div>
              ))}

              {!loadingItems && filtered.length === 0 && (
                <div className="py-24 text-center text-muted text-[0.9rem]">
                  Belum ada konten untuk kategori ini.
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Load more */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 bg-dark text-white text-[0.84rem] font-bold px-8 py-4 rounded-full hover:bg-dark/85 transition-colors group"
            >
              Lihat Semua Konten
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] py-[clamp(80px,10vw,120px)] relative overflow-hidden">
        {/* Background number */}
        <div
          className="absolute right-[-2%] top-[-10%] text-[clamp(180px,22vw,280px)] font-extrabold leading-none select-none pointer-events-none"
          style={{ color: "rgba(255,255,255,0.025)", letterSpacing: "-0.05em" }}
        >
          GRC
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-[clamp(50px,7vw,100px)] items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <p className="text-white/22 text-[0.68rem] font-mono tracking-[0.22em] uppercase mb-5">Newsletter</p>
              <h2
                className="text-white font-extrabold tracking-tight leading-[1.12] mb-5"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)" }}
              >
                Dapatkan update kegiatan
                <br />dan riset terbaru GRCC.
              </h2>
              <p className="text-white/35 text-[0.9rem] leading-[1.85] mb-8">
                Bergabunglah dengan 1.000+ profesional yang berlangganan — insights
                governance, jadwal pelatihan, dan publikasi terbaru langsung ke inbox Anda.
              </p>
              {/* Topic chips */}
              <div className="flex flex-wrap gap-2">
                {["Corporate Governance","ESG","Audit Internal","Kepatuhan","Riset","Pelatihan"].map((t) => (
                  <span
                    key={t}
                    className="text-[0.68rem] font-semibold px-3 py-1.5 rounded-full border border-white/10 text-white/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* Email form */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-2xl px-5 py-4 text-white text-[0.9rem] placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-all pr-40"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="absolute right-2 top-2 bottom-2 bg-white text-dark text-[0.82rem] font-extrabold px-5 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Berlangganan
                </motion.button>
              </div>
              <p className="text-white/18 text-[0.72rem] pl-1">
                Tidak ada spam. Berhenti kapan saja.
              </p>

              {/* Social proof */}
              <div className="mt-6 pt-6 border-t border-white/[0.07] flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] overflow-hidden relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-white/38 text-[0.78rem]">
                  <span className="text-white font-bold">1.000+</span> profesional sudah berlangganan
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
