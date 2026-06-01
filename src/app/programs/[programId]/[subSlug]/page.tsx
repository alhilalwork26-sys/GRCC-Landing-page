"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, MessageCircle,
  Mail, ChevronDown, ChevronUp, Check, Minus, Plus,
  ArrowUpRight, PhoneCall, Sparkles, BookOpen,
  Tag, BadgePercent, CheckCircle2, X, AlertCircle, Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, TrainingItem, PromoCode, ProgramItem, SubProgramItem } from "@/lib/supabase";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { getIcon } from "@/lib/iconMap";
import dynamic from "next/dynamic";

const FlipBookModal      = dynamic(() => import("@/components/FlipBookModal"),      { ssr: false });
const TrainingDetailModal = dynamic(() => import("@/components/TrainingDetailModal"), { ssr: false });

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Booking Widget ─────────────────────────────────────────────────────────────
function BookingWidget({
  trainings,
  accent,
  subName,
  programTitle,
}: {
  trainings: TrainingItem[];
  accent: string;
  subName: string;
  programTitle: string;
}) {
  const [selected, setSelected] = useState<TrainingItem | null>(null);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>(null);

  // Promo state
  const [promoInput, setPromoInput]     = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError]     = useState("");

  const parsePriceLabel = (label: string | null | undefined): number => {
    if (!label) return 0;
    const digits = label.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  const price    = selected?.price ?? parsePriceLabel(selected?.price_label);
  const subtotal = price * qty;

  const discountAmt = appliedPromo && subtotal > 0
    ? appliedPromo.discount_type === "percentage"
      ? Math.round(subtotal * appliedPromo.discount_value / 100)
      : Math.min(appliedPromo.discount_value, subtotal)
    : 0;
  const total = subtotal - discountAmt;

  const totalLabel = (() => {
    if (!selected) return "—";
    if (total > 0) return formatRupiah(total);
    return "Hubungi kami";
  })();

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    setAppliedPromo(null);

    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();

    if (!data) {
      setPromoError("Kode promo tidak ditemukan atau tidak aktif.");
    } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setPromoError("Kode promo sudah kadaluarsa.");
    } else if (data.max_uses !== null && data.used_count >= data.max_uses) {
      setPromoError("Kode promo sudah habis digunakan.");
    } else if (subtotal > 0 && data.min_price > subtotal) {
      setPromoError(`Kode berlaku untuk transaksi minimal ${formatRupiah(data.min_price)}.`);
    } else {
      setAppliedPromo(data);
    }
    setPromoLoading(false);
  };

  const removePromo = () => { setAppliedPromo(null); setPromoInput(""); setPromoError(""); };

  const daftarHref = selected
    ? `/daftar/${selected.id}?qty=${qty}${appliedPromo ? `&promo=${appliedPromo.code}` : ""}`
    : "#";

  if (trainings.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-dark/[0.05] flex items-center justify-center mx-auto mb-4">
          <Calendar size={20} className="text-muted" />
        </div>
        <p className="font-bold text-[0.95rem] mb-1">Jadwal Segera Hadir</p>
        <p className="text-muted text-[0.82rem] mb-5">Belum ada jadwal yang dipublikasikan untuk program ini.</p>
        <a
          href={whatsappHref(`Halo, saya ingin info jadwal program *${subName}*. Terima kasih.`)}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl"
        >
          <MessageCircle size={14} /> Tanya Jadwal via WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <h3 className="font-extrabold text-[1rem]">Atur Tempat, Jadwal &amp; Jumlah</h3>
        <p className="text-muted text-[0.75rem] mt-0.5">Pilih jadwal yang sesuai, lalu tentukan jumlah peserta</p>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Session picker */}
        <div>
          <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted mb-2">Pilih Jadwal</label>
          <div className="flex flex-col gap-2">
            {trainings.map((t) => {
              const isOpen = open === t.id;
              const isSelected = selected?.id === t.id;
              return (
                <div
                  key={t.id}
                  className={`rounded-xl border transition-all overflow-hidden ${isSelected ? "border-dark shadow-sm" : "border-border hover:border-dark/40"}`}
                >
                  <button
                    onClick={() => { setOpen(isOpen ? null : t.id); if (!isSelected) { setSelected(t); setAppliedPromo(null); setPromoInput(""); setPromoError(""); } }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? "border-dark bg-dark" : "border-border"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[0.82rem] font-semibold line-clamp-1">
                        {t.date_start}{t.date_end ? ` – ${t.date_end}` : ""} | {t.format}
                        {t.title !== t.format && ` | ${t.title.length > 30 ? t.title.slice(0, 30) + "…" : t.title}`}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-muted flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-4 pb-4 border-t border-border bg-[#FAFAF8]">
                          <p className="font-bold text-[0.85rem] pt-3 mb-2">{t.title}</p>
                          <div className="flex flex-col gap-1.5 text-[0.75rem] text-muted mb-3">
                            <span className="flex items-center gap-2"><Calendar size={12} /> {t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}</span>
                            {t.time && <span className="flex items-center gap-2"><Clock size={12} /> {t.time}</span>}
                            <span className="flex items-center gap-2"><MapPin size={12} /> {t.location}</span>
                            {t.max_participants && <span className="flex items-center gap-2"><Users size={12} /> Maks. {t.max_participants} peserta</span>}
                          </div>
                          {t.price_label && (
                            <div className="flex items-center gap-3 bg-white rounded-lg border border-border px-3 py-2.5">
                              <div className="w-4 h-4 rounded-full border-2 border-dark bg-dark flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              </div>
                              <span className="text-[0.78rem] font-semibold flex-1">{t.date_start} | {t.format} | {t.title.slice(0, 25)}… — <span style={{ color: accent }}>{t.price_label}</span></span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Qty */}
        <div>
          <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted mb-2">Jumlah Peserta</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-dark/[0.05] transition-colors">
                <Minus size={14} />
              </button>
              <span className="w-12 text-center font-bold text-[0.95rem]">{qty}</span>
              <button onClick={() => setQty(Math.min(selected?.max_participants ?? 99, qty + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-dark/[0.05] transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <span className="text-[0.75rem] text-muted">peserta</span>
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted mb-2">Kode Voucher / Promo</label>

          {appliedPromo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-emerald-200 bg-emerald-50"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[0.8rem] font-extrabold text-emerald-800 font-mono tracking-wider">{appliedPromo.code}</p>
                    {appliedPromo.promo_type && appliedPromo.promo_type !== "semua" && (
                      <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                        appliedPromo.promo_type === "individu"
                          ? "bg-sky-100 text-sky-600"
                          : "bg-violet-100 text-violet-600"
                      }`}>
                        {appliedPromo.promo_type === "individu" ? "Individu" : "Grup"}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.68rem] text-emerald-700">
                    Diskon {appliedPromo.discount_type === "percentage" ? `${appliedPromo.discount_value}%` : formatRupiah(appliedPromo.discount_value)}
                    {subtotal > 0 && ` — hemat `}
                    {subtotal > 0 && <strong>{formatRupiah(discountAmt)}</strong>}
                  </p>
                </div>
              </div>
              <button onClick={removePromo} className="w-6 h-6 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center flex-shrink-0 transition-colors">
                <X size={10} className="text-emerald-700" />
              </button>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Masukkan kode promo"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-[0.82rem] font-mono tracking-widest uppercase outline-none transition-all
                    ${promoError ? "border-red-300 bg-red-50/50" : "border-border hover:border-dark/30 focus:border-dark bg-white"}`}
                />
              </div>
              <button
                onClick={applyPromo}
                disabled={promoLoading || !promoInput.trim()}
                className="px-4 py-2.5 rounded-xl text-white text-[0.78rem] font-bold flex items-center gap-1.5 disabled:opacity-40 transition-all flex-shrink-0"
                style={{ backgroundColor: accent }}
              >
                {promoLoading ? <Loader2 size={13} className="animate-spin" /> : <BadgePercent size={13} />}
                Pakai
              </button>
            </div>
          )}

          <AnimatePresence>
            {promoError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[0.68rem] text-red-500 mt-1.5"
              >
                <AlertCircle size={10} /> {promoError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Price summary */}
        <div className="rounded-xl bg-[#F7F7F5] px-4 py-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[0.78rem] text-muted">
            <span>Harga per peserta</span>
            <span>{selected?.price_label || (price > 0 ? formatRupiah(price) : "—")}</span>
          </div>
          <div className="flex items-center justify-between text-[0.78rem] text-muted">
            <span>Jumlah peserta</span>
            <span>× {qty}</span>
          </div>

          <AnimatePresence>
            {appliedPromo && subtotal > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between text-[0.78rem] text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1"><Tag size={10} /> {appliedPromo.code}</span>
                  <span>− {formatRupiah(discountAmt)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-px bg-border my-1" />
          <div className="flex items-center justify-between font-extrabold text-[0.95rem]">
            <span>Total</span>
            <motion.span key={totalLabel} initial={{ scale: 1.06 }} animate={{ scale: 1 }} style={{ color: appliedPromo && subtotal > 0 ? accent : undefined }}>
              {totalLabel}
            </motion.span>
          </div>
          {appliedPromo && subtotal > 0 && (
            <p className="text-[0.65rem] text-emerald-600 text-right">
              Hemat {formatRupiah(discountAmt)} dari harga normal {formatRupiah(subtotal)}
            </p>
          )}
        </div>

        {/* CTA */}
        {selected ? (
          <div className="flex flex-col gap-2">
            <Link
              href={daftarHref}
              className="flex items-center justify-center gap-2.5 text-white font-extrabold text-[0.9rem] py-3.5 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: accent, boxShadow: `0 6px 20px ${accent}40` }}
            >
              <Check size={16} /> Daftar Sekarang
            </Link>
            <Link
              href={`/daftar-grup/${selected.id}?qty=${qty}${appliedPromo ? `&promo=${appliedPromo.code}` : ""}`}
              className="flex items-center justify-center gap-2.5 font-bold text-[0.85rem] py-3 rounded-xl border-2 transition-all hover:opacity-80"
              style={{ borderColor: accent, color: accent }}
            >
              <Users size={15} /> Daftar sebagai Grup
            </Link>
          </div>
        ) : (
          <button disabled className="flex items-center justify-center gap-2.5 text-white font-extrabold text-[0.9rem] py-3.5 rounded-xl bg-dark/30 cursor-not-allowed w-full">
            <Calendar size={16} /> Pilih Jadwal Dulu
          </button>
        )}

        <p className="text-center text-[0.7rem] text-muted">
          {selected ? "Individu atau grup? Pilih sesuai kebutuhan" : "Pilih sesi pelatihan terlebih dahulu"}
        </p>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function SubProgramPage() {
  const { programId, subSlug } = useParams<{ programId: string; subSlug: string }>();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpa = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const [program, setProgram]   = useState<ProgramItem | null>(null);
  const [sub, setSub]           = useState<SubProgramItem | null>(null);
  const [allSubs, setAllSubs]   = useState<SubProgramItem[]>([]);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [loadingT, setLoadingT] = useState(true);
  const [flipBookUrl, setFlipBookUrl] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(null);

  // Fetch program + sub-program data
  useEffect(() => {
    if (!programId || !subSlug) return;
    (async () => {
      const [{ data: prog }, { data: subData }, { data: allSubsData }] = await Promise.all([
        supabase.from("programs").select("*").eq("id", programId).single(),
        supabase.from("sub_programs").select("*").eq("program_id", programId).eq("slug", subSlug).single(),
        supabase.from("sub_programs").select("*").eq("program_id", programId).eq("active", true).order("order_index"),
      ]);
      setProgram(prog ?? null);
      setSub(subData ?? null);
      setAllSubs(allSubsData ?? []);
      setLoading(false);
    })();
  }, [programId, subSlug]);

  // Fetch trainings once program is loaded
  useEffect(() => {
    if (!programId) return;
    supabase
      .from("training")
      .select("*")
      .eq("published", true)
      .or(`program_id.eq.${programId},program_id.is.null`)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTrainings(data ?? []);
        setLoadingT(false);
      });
  }, [programId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-muted" />
        </div>
        <Footer />
      </>
    );
  }

  if (!program || !sub) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-muted">
          Program tidak ditemukan.
        </div>
        <Footer />
      </>
    );
  }

  const Icon = getIcon(program.icon_name);
  const subIndex = allSubs.findIndex((s) => s.slug === subSlug);
  const prevSub  = subIndex > 0 ? allSubs[subIndex - 1] : null;
  const nextSub  = subIndex < allSubs.length - 1 ? allSubs[subIndex + 1] : null;

  const waMsg = `Halo, saya ingin informasi lebih lanjut mengenai program:\n\n*${sub.name}*\n(${program.title})\n\nTerima kasih.`;

  return (
    <>
      <Navbar />

      {/* FlipBook Modal */}
      {flipBookUrl && (
        <FlipBookModal
          pdfUrl={flipBookUrl}
          title={sub.name}
          accent={program.accent}
          onClose={() => setFlipBookUrl(null)}
        />
      )}

      {/* Training Detail Modal */}
      <TrainingDetailModal
        training={selectedTraining}
        accent={program.accent}
        onClose={() => setSelectedTraining(null)}
      />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[62vh] flex flex-col justify-end overflow-hidden pb-[clamp(56px,7vw,90px)]"
        style={{ background: program.bg }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.accent}20 0%, transparent 65%)` }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.accent}10 0%, transparent 65%)` }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpa }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16 w-full"
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <Link
              href="/programs"
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-[0.72rem] font-mono tracking-[0.15em] uppercase"
            >
              <ArrowLeft size={12} /> Programs
            </Link>
            <span className="text-white/20 text-[0.7rem]">/</span>
            <span className="text-white/40 text-[0.72rem] font-mono tracking-[0.15em] uppercase truncate max-w-[180px]">{program.short}</span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: program.accent + "40", backgroundColor: program.accent + "18" }}>
              <Icon size={13} style={{ color: program.accent }} />
              <span className="text-[0.65rem] font-extrabold tracking-[0.12em] uppercase" style={{ color: program.accent }}>{program.short}</span>
            </div>
            <span className="text-white/25 text-[0.68rem] font-mono">#{String(subIndex + 1).padStart(2, "0")}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="text-white font-extrabold leading-[1.05] tracking-[-0.025em] mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {sub.name}
          </motion.h1>

          {/* Brochure buttons */}
          {trainings.some(t => t.brochure_url) && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {trainings.filter(t => t.brochure_url).map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFlipBookUrl(t.brochure_url!)}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-[0.82rem] transition-all group"
                  style={{ backgroundColor: program.accent, color: "#fff" }}
                >
                  <BookOpen size={15} />
                  Brosur: {t.title.length > 28 ? t.title.slice(0, 28) + "…" : t.title}
                  <span className="text-white/60 text-[0.65rem] font-normal">PDF</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <main className="bg-[#F7F7F5]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-[clamp(60px,8vw,100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

            {/* LEFT */}
            <div className="flex flex-col gap-12">

              {/* About section */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
              >
                <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted mb-4">Tentang Program</p>
                <div className="bg-white rounded-2xl border border-border p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: program.accent + "18" }}
                    >
                      <Icon size={22} style={{ color: program.accent }} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[1.05rem] leading-snug">{sub.name}</p>
                      <p className="text-muted text-[0.78rem] mt-0.5">{program.title}</p>
                    </div>
                  </div>
                  <p className="text-dark/65 text-[0.9rem] leading-[1.85] whitespace-pre-line">{sub.description}</p>
                  <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-dark/65 text-[0.88rem] leading-[1.8]">{program.description}</p>
                  </div>

                  {/* Info chips */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {["Sertifikat Kelulusan", "Modul & Materi", "Networking"].map((c) => (
                      <span
                        key={c}
                        className="flex items-center gap-1.5 text-[0.7rem] font-semibold px-3 py-1.5 rounded-full border border-border text-muted"
                      >
                        <Sparkles size={10} style={{ color: program.accent }} />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Training */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-muted">Pelatihan Mendatang</p>
                  <Link href="/insights" className="text-[0.72rem] font-semibold text-muted hover:text-dark flex items-center gap-1">
                    Lihat semua <ArrowUpRight size={11} />
                  </Link>
                </div>

                {loadingT ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="rounded-2xl overflow-hidden border border-border bg-white animate-pulse">
                        <div className="h-[140px] bg-dark/[0.06]" />
                        <div className="p-4 flex flex-col gap-2">
                          <div className="h-3 w-2/3 bg-dark/[0.07] rounded-full" />
                          <div className="h-3 w-1/2 bg-dark/[0.05] rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trainings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted text-[0.85rem]">
                    Belum ada jadwal pelatihan. Hubungi kami untuk informasi terbaru.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {trainings.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.09 }}
                        whileHover={{ y: -3, boxShadow: `0 8px 28px ${t.color}22` }}
                        onClick={() => (window.location.href = `/training/${t.id}`)}
                        className="rounded-2xl overflow-hidden border border-black/[0.07] bg-white cursor-pointer group"
                        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                      >
                        {/* Poster / Banner */}
                        <div className="relative h-[140px] overflow-hidden">
                          {t.poster_url ? (
                            <motion.img
                              src={t.poster_url}
                              alt={t.title}
                              className="absolute inset-0 w-full h-full object-cover"
                              variants={{ hover: { scale: 1.06 } }}
                              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                            />
                          ) : (
                            <div className="absolute inset-0" style={{ backgroundColor: t.color + "12" }}>
                              <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(${t.color}20 1px, transparent 1px), linear-gradient(90deg, ${t.color}20 1px, transparent 1px)`,
                                backgroundSize: "28px 28px",
                              }} />
                              <div className="absolute inset-0" style={{
                                background: `radial-gradient(ellipse at 70% 30%, ${t.color}40 0%, transparent 65%)`,
                              }} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[2.8rem] font-black tracking-[-0.05em] select-none leading-none" style={{ color: t.color + "22" }}>
                                  {(t.category || t.title).slice(0, 3).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 to-transparent" />
                          <span
                            className="absolute top-3 left-3 text-[0.58rem] font-extrabold tracking-[0.1em] uppercase px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: t.color }}
                          >
                            {t.format}
                          </span>
                          {(t.price || t.price_label) && (
                            <p className="absolute bottom-3 left-3 text-white font-extrabold text-[0.95rem] leading-none drop-shadow">
                              {t.price ? `Rp ${t.price.toLocaleString("id-ID")}` : t.price_label}
                            </p>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-4">
                          <p className="font-bold text-[0.85rem] leading-snug line-clamp-2 mb-2.5">{t.title}</p>
                          <div className="flex flex-col gap-1.5 mb-3">
                            {t.date_start && (
                              <div className="flex items-center gap-2 text-[0.7rem] text-muted">
                                <Calendar size={10} className="flex-shrink-0" />
                                <span>{t.date_start}{t.date_end ? ` – ${t.date_end}` : ""}</span>
                              </div>
                            )}
                            {t.location && (
                              <div className="flex items-center gap-2 text-[0.7rem] text-muted">
                                <MapPin size={10} className="flex-shrink-0" />
                                <span className="truncate">{t.location}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className="flex items-center gap-1 text-[0.68rem] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: t.color }}
                          >
                            Lihat Detail <ArrowUpRight size={10} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Prev / Next Sub */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3"
              >
                {prevSub ? (
                  <Link
                    href={`/programs/${program.id}/${prevSub.slug}`}
                    className="group flex flex-col gap-1 bg-white rounded-2xl border border-border p-5 hover:border-dark/30 hover:shadow-sm transition-all"
                  >
                    <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-muted flex items-center gap-1.5">
                      <ArrowLeft size={10} /> Sebelumnya
                    </span>
                    <span className="text-[0.85rem] font-bold leading-snug line-clamp-2 group-hover:text-dark/80">{prevSub.name}</span>
                  </Link>
                ) : <div />}
                {nextSub ? (
                  <Link
                    href={`/programs/${program.id}/${nextSub.slug}`}
                    className="group flex flex-col gap-1 bg-white rounded-2xl border border-border p-5 hover:border-dark/30 hover:shadow-sm transition-all text-right"
                  >
                    <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-muted flex items-center gap-1.5 justify-end">
                      Berikutnya <ArrowUpRight size={10} />
                    </span>
                    <span className="text-[0.85rem] font-bold leading-snug line-clamp-2 group-hover:text-dark/80">{nextSub.name}</span>
                  </Link>
                ) : <div />}
              </motion.div>
            </div>

            {/* RIGHT — sticky sidebar */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-[90px]">

              {/* Booking widget */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.25 }}
              >
                {loadingT ? (
                  <div className="rounded-2xl border border-border bg-white p-6 animate-pulse h-64" />
                ) : (
                  <BookingWidget
                    trainings={trainings}
                    accent={program.accent}
                    subName={sub.name}
                    programTitle={program.title}
                  />
                )}
              </motion.div>

              {/* Chat Admin */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.35 }}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <p className="font-extrabold text-[0.92rem] mb-1">Ada pertanyaan?</p>
                <p className="text-muted text-[0.78rem] mb-4">Tim kami siap membantu Anda memilih program yang tepat.</p>
                <div className="flex flex-col gap-2.5">
                  <motion.a
                    href={whatsappHref(waMsg)}
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 bg-[#25D366] text-white font-bold text-[0.85rem] px-4 py-3 rounded-xl hover:bg-[#22c55e] transition-colors"
                  >
                    <MessageCircle size={16} />
                    Chat via WhatsApp
                    <ArrowUpRight size={13} className="ml-auto" />
                  </motion.a>
                  <motion.a
                    href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`Informasi Program: ${sub.name}`)}`}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 border border-border text-dark font-semibold text-[0.85rem] px-4 py-3 rounded-xl hover:bg-dark/[0.04] transition-colors"
                  >
                    <Mail size={16} />
                    Kirim Email
                    <ArrowUpRight size={13} className="ml-auto text-muted" />
                  </motion.a>
                  <motion.a
                    href={telHref()}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 border border-border text-dark font-semibold text-[0.85rem] px-4 py-3 rounded-xl hover:bg-dark/[0.04] transition-colors"
                  >
                    <PhoneCall size={16} />
                    Hubungi Kami
                    <ArrowUpRight size={13} className="ml-auto text-muted" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Back to program */}
              <Link
                href="/programs"
                className="flex items-center justify-center gap-2 border border-border text-muted text-[0.8rem] font-semibold py-3 rounded-xl hover:bg-dark/[0.04] transition-colors"
              >
                <ArrowLeft size={13} /> Kembali ke Semua Program
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
