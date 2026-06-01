"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, ArrowUpRight,
  Target, CheckCircle2, UserCheck, CreditCard, BookOpen,
  Wifi, MonitorPlay, Building2, MessageCircle, FileText,
  Sparkles, Briefcase, GraduationCap, Landmark, LineChart,
  UserCircle2, Award, ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, TrainingItem } from "@/lib/supabase";
import { whatsappHref } from "@/lib/site-config";
import dynamic from "next/dynamic";

const FlipBookModal = dynamic(() => import("@/components/FlipBookModal"), { ssr: false });

function parseBullets(text: string) {
  return text.split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
}

function FormatIcon({ format }: { format: string }) {
  const f = (format ?? "").toLowerCase();
  if (f.includes("online")) return <Wifi size={14} />;
  if (f.includes("hybrid")) return <MonitorPlay size={14} />;
  return <Building2 size={14} />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [training, setTraining] = useState<TrainingItem | null>(null);
  const [loading, setLoading]   = useState(true);
  const [flipBookUrl, setFlipBookUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("training").select("*").eq("id", id).single()
      .then(({ data }) => { setTraining(data ?? null); setLoading(false); });
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-dark/20 border-t-dark animate-spin" />
      </div>
      <Footer />
    </>
  );

  if (!training) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted text-[0.95rem]">Program tidak ditemukan.</p>
        <Link href="/" className="text-[0.85rem] font-bold underline">Kembali ke Beranda</Link>
      </div>
      <Footer />
    </>
  );

  const c = training.color || "#4F46E5";
  const objectives    = training.objectives     ? parseBullets(training.objectives)     : [];
  const audience      = training.target_audience ? parseBullets(training.target_audience) : [];
  const daftarHref    = `/daftar/${training.id}`;
  const daftarGrpHref = `/daftar-grup/${training.id}`;
  const waMsg = `Halo, saya ingin informasi lebih lanjut tentang program pelatihan:\n\n*${training.title}*\n\nTerima kasih.`;

  return (
    <>
      <Navbar />

      {/* FlipBook */}
      {flipBookUrl && (
        <FlipBookModal pdfUrl={flipBookUrl} title={training.title} accent={c} onClose={() => setFlipBookUrl(null)} />
      )}

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[56vh] flex flex-col justify-end overflow-hidden pb-[clamp(48px,6vw,80px)]">
        {/* Background */}
        {training.poster_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={training.poster_url}
              alt={training.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ backgroundColor: c + "18" }}>
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(${c}15 1px, transparent 1px), linear-gradient(90deg, ${c}15 1px, transparent 1px)`,
                backgroundSize: "56px 56px",
              }} />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c}25 0%, transparent 65%)` }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-16 w-full"
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-8"
          >
            <Link href="/#training"
              className="flex items-center gap-1.5 text-white/45 hover:text-white/80 transition-colors text-[0.7rem] font-mono tracking-[0.15em] uppercase">
              <ArrowLeft size={11} /> Beranda
            </Link>
            <span className="text-white/20 text-[0.7rem]">/</span>
            <span className="text-white/45 text-[0.7rem] font-mono tracking-[0.15em] uppercase">Training</span>
          </motion.div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span
              className="flex items-center gap-1.5 text-[0.62rem] font-extrabold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: c }}
            >
              <FormatIcon format={training.format} /> {training.format}
            </span>
            {training.category && (
              <span className="text-[0.62rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/20">
                {training.category}
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
            className="text-white font-extrabold leading-[1.08] tracking-[-0.025em] mb-5 max-w-[720px]"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.6rem)" }}
          >
            {training.title}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {training.date_start && (
              <MetaChip icon={<Calendar size={12} />} white>
                {training.date_start}{training.date_end ? ` – ${training.date_end}` : ""}
              </MetaChip>
            )}
            {training.time && <MetaChip icon={<Clock size={12} />} white>{training.time}</MetaChip>}
            {training.location && <MetaChip icon={<MapPin size={12} />} white>{training.location}</MetaChip>}
            {training.max_participants && (
              <MetaChip icon={<Users size={12} />} white>Maks. {training.max_participants} peserta</MetaChip>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ── BODY ─────────────────────────────────────────── */}
      <main className="bg-[#F7F7F5]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-[clamp(56px,7vw,96px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* ── LEFT: Content ── */}
            <div className="flex flex-col gap-8">

              {/* ── Tentang Program ── */}
              {training.description && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-7 py-5 border-b border-border">
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                      transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: c + "18" }}
                    >
                      <BookOpen size={16} style={{ color: c }} />
                    </motion.div>
                    <div>
                      <p className="font-extrabold text-[0.92rem] text-dark">Tentang Program</p>
                      <p className="text-[0.68rem] text-muted mt-0.5">Gambaran umum pelatihan ini</p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                      className="ml-auto"
                    >
                      <Sparkles size={14} style={{ color: c }} />
                    </motion.div>
                  </div>
                  <div className="px-7 py-6">
                    <p className="text-[0.9rem] leading-[1.95] text-dark/65 whitespace-pre-line">
                      {training.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Tujuan Program ── */}
              {objectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-7 py-5 border-b border-border">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: c + "18" }}
                    >
                      <Target size={16} style={{ color: c }} />
                    </motion.div>
                    <div>
                      <p className="font-extrabold text-[0.92rem] text-dark">Tujuan Program</p>
                      <p className="text-[0.68rem] text-muted mt-0.5">Yang akan Anda capai setelah pelatihan</p>
                    </div>
                    <span className="ml-auto text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: c + "15", color: c }}>
                      {objectives.length} tujuan
                    </span>
                  </div>

                  <div className="px-7 py-6 flex flex-col gap-4">
                    {objectives.map((obj, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        className="flex items-start gap-4 group"
                      >
                        {/* Animated number badge */}
                        <motion.div
                          whileHover={{ scale: 1.12, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[0.75rem] text-white shadow-sm"
                          style={{ backgroundColor: c }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </motion.div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-[0.88rem] leading-[1.75] text-dark/70">{obj}</p>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 300 }}
                          className="flex-shrink-0 mt-0.5"
                        >
                          <CheckCircle2 size={15} style={{ color: c + "80" }} />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Untuk Siapa ── */}
              {audience.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 px-7 py-5 border-b border-border">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: c + "18" }}
                    >
                      <UserCheck size={16} style={{ color: c }} />
                    </motion.div>
                    <div>
                      <p className="font-extrabold text-[0.92rem] text-dark">Untuk Siapa Program Ini?</p>
                      <p className="text-[0.68rem] text-muted mt-0.5">Program ini dirancang untuk</p>
                    </div>
                  </div>

                  <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {audience.map((aud, i) => {
                      const icons = [Briefcase, GraduationCap, Landmark, LineChart, UserCircle2, Award, ShieldCheck, Users];
                      const Icon = icons[i % icons.length];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.92 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          whileHover={{ y: -2, boxShadow: `0 6px 20px ${c}18` }}
                          className="flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200"
                          style={{ borderColor: c + "20", backgroundColor: c + "06" }}
                        >
                          <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: c + "18" }}
                          >
                            <Icon size={17} style={{ color: c }} />
                          </motion.div>
                          <p className="text-[0.84rem] font-semibold text-dark/80 leading-snug">{aud}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* VA Payment */}
              {training.va_number && (
                <ContentSection icon={<CreditCard size={15} />} label="Informasi Pembayaran" color={c}>
                  <div className="rounded-2xl border p-6 text-center"
                    style={{ borderColor: c + "30", backgroundColor: c + "08" }}>
                    <p className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase mb-2" style={{ color: c }}>
                      Virtual Account {training.va_bank ?? ""}
                    </p>
                    <p className="font-mono font-extrabold text-[1.6rem] tracking-[0.1em] text-dark my-2">
                      {training.va_number}
                    </p>
                    <p className="text-[0.74rem] text-muted">a.n. Universitas Airlangga</p>
                    <div className="mt-4 pt-4 border-t text-[0.75rem] text-dark/50 leading-[1.8]"
                      style={{ borderColor: c + "20" }}>
                      Transfer tepat sesuai nominal. Simpan bukti transfer &amp; upload di halaman pendaftaran.
                    </div>
                  </div>
                </ContentSection>
              )}
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="flex flex-col gap-4 lg:sticky lg:top-[90px]"
            >
              {/* Price card */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-6 pt-6 pb-5 border-b border-border">
                  {(training.price || training.price_label) ? (
                    <>
                      <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted mb-1">Investasi</p>
                      <p className="font-extrabold text-[1.8rem] tracking-tight" style={{ color: c }}>
                        {training.price
                          ? `Rp ${training.price.toLocaleString("id-ID")}`
                          : training.price_label}
                      </p>
                      <p className="text-[0.72rem] text-muted mt-0.5">per peserta · sudah termasuk sertifikat</p>
                    </>
                  ) : (
                    <p className="font-bold text-[1rem] text-dark">Hubungi kami untuk harga</p>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {/* Info rows */}
                  <div className="flex flex-col gap-2.5">
                    {training.date_start && (
                      <InfoRow icon={<Calendar size={13} />}>
                        {training.date_start}{training.date_end ? ` – ${training.date_end}` : ""}
                      </InfoRow>
                    )}
                    {training.time && <InfoRow icon={<Clock size={13} />}>{training.time}</InfoRow>}
                    {training.location && <InfoRow icon={<MapPin size={13} />}>{training.location}</InfoRow>}
                    {training.max_participants && (
                      <InfoRow icon={<Users size={13} />}>Maks. {training.max_participants} peserta</InfoRow>
                    )}
                  </div>

                  <div className="h-px bg-border" />

                  {/* CTAs */}
                  <Link href={daftarHref}
                    className="flex items-center justify-center gap-2 font-extrabold text-[0.9rem] py-3.5 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{ backgroundColor: c, boxShadow: `0 6px 20px ${c}35` }}>
                    Daftar Sekarang <ArrowUpRight size={15} />
                  </Link>
                  <Link href={daftarGrpHref}
                    className="flex items-center justify-center gap-2 font-bold text-[0.85rem] py-3 rounded-xl border-2 transition-all hover:opacity-80"
                    style={{ borderColor: c + "60", color: c }}>
                    <Users size={14} /> Daftar sebagai Grup
                  </Link>

                  {/* Brochure */}
                  {training.brochure_url && (
                    <button
                      onClick={() => setFlipBookUrl(training.brochure_url!)}
                      className="flex items-center justify-center gap-2 font-semibold text-[0.82rem] py-2.5 rounded-xl border border-border text-muted hover:text-dark hover:border-dark/30 transition-all">
                      <FileText size={14} /> Lihat Brosur PDF
                    </button>
                  )}
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <p className="font-extrabold text-[0.9rem] mb-1">Ada pertanyaan?</p>
                <p className="text-muted text-[0.75rem] mb-4 leading-relaxed">Tim GRCC siap membantu Anda memilih program yang tepat.</p>
                <motion.a
                  href={whatsappHref(waMsg)}
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 bg-[#25D366] text-white font-bold text-[0.82rem] px-4 py-3 rounded-xl hover:bg-[#22c55e] transition-colors w-full justify-center">
                  <MessageCircle size={15} /> Chat via WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function ContentSection({ icon, label, color, children }: {
  icon: React.ReactNode; label: string; color: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl border border-border p-7"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span style={{ color }}>{icon}</span>
        <span className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-muted">{label}</span>
        <div className="flex-1 h-px bg-border ml-1" />
      </div>
      {children}
    </motion.div>
  );
}

function MetaChip({ icon, children, white }: { icon: React.ReactNode; children: React.ReactNode; white?: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 text-[0.74rem] font-semibold px-3 py-1.5 rounded-full ${
      white
        ? "bg-white/15 text-white border border-white/20 backdrop-blur-sm"
        : "bg-dark/[0.05] text-muted border border-border"
    }`}>
      {icon} {children}
    </span>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[0.8rem] text-dark/60">
      <span className="text-muted flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
}
