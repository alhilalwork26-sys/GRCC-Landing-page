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
  UserCircle2, Award, ShieldCheck, Eye, X, Star, Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareTrainingButton from "@/components/ShareTrainingButton";
import { supabase, TrainingItem, TestimonialItem } from "@/lib/supabase";
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

type PromoFacilitator = { name: string; role: string; org: string; img?: string | null; main?: boolean };
type SpeakerProfile = {
  name: string;
  role: string;
  org: string;
  summary: string;
  focus: string[];
  cvHighlights: string[];
  img?: string | null;
  main?: boolean;
};

const ICOFR_TRAINING_ID = "3b2f7f0a-665c-46fc-b8ae-3359abaa47ec";

const SPEAKERS_BY_TRAINING: Record<string, SpeakerProfile[]> = {
  [ICOFR_TRAINING_ID]: [
    {
      name: "Dina Heriyati, S.E., M.ForAccy",
      role: "Fasilitator ICoFR",
      org: "GRCC, AILG Universitas Airlangga",
      summary: "Fasilitator program ICoFR yang mendampingi peserta memahami hubungan proses bisnis, risiko, dan kontrol internal dalam pelaporan keuangan.",
      focus: ["Internal control over financial reporting", "Pemetaan proses dan risiko", "Kontrol internal berbasis praktik organisasi"],
      cvHighlights: ["Berpengalaman sebagai fasilitator program ICoFR", "Aktif dalam penguatan literasi tata kelola dan kontrol internal", "Mendampingi pembelajaran berbasis studi kasus dan diskusi praktis"],
    },
    {
      name: "Prof. Dr. Bambang Tjahjadi, SE., MBA., Ak., CMA., CPM., CA., CSSL.",
      role: "Guru Besar & Coordinator Fasilitator ICoFR",
      org: "GRCC, AILG Universitas Airlangga",
      summary: "Koordinator fasilitator yang memandu kerangka besar ICoFR, tata kelola, dan akuntabilitas organisasi dalam konteks manajemen non-akuntan.",
      focus: ["Good governance dan akuntabilitas", "Kerangka ICoFR untuk manajemen", "Penguatan kontrol dan kesiapan audit"],
      cvHighlights: ["Guru Besar dan koordinator fasilitator program", "Memiliki latar belakang kuat di bidang akuntansi, kontrol, dan tata kelola", "Mengarahkan pembelajaran strategis untuk pimpinan dan manajemen"],
      main: true,
    },
    {
      name: "Tantri Sun Estuning Dasih, S.A., M.A.",
      role: "Fasilitator ICoFR",
      org: "GRCC, AILG Universitas Airlangga",
      summary: "Fasilitator program yang membantu peserta menerjemahkan konsep ICoFR ke dalam kebutuhan dokumentasi, koordinasi, dan implementasi di unit kerja.",
      focus: ["Dokumentasi kontrol internal", "Koordinasi lintas unit kerja", "Implementasi pembelajaran ke proses operasional"],
      cvHighlights: ["Fasilitator program ICoFR untuk peserta non-akuntan", "Berfokus pada pemahaman konseptual dan penerapan praktis", "Mendukung proses pembelajaran yang ringkas, jelas, dan aplikatif"],
    },
  ],
};

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [training, setTraining] = useState<TrainingItem | null>(null);
  const [loading, setLoading]   = useState(true);
  const [flipBookUrl, setFlipBookUrl] = useState<string | null>(null);
  const [promoFacilitators, setPromoFacilitators] = useState<PromoFacilitator[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerProfile | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("training").select("*").eq("id", id).single(),
      supabase.from("promo").select("facilitators").eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]).then(([trainingRes, promoRes]) => {
      setTraining(trainingRes.data ?? null);
      setPromoFacilitators((promoRes.data?.facilitators as PromoFacilitator[] | null) ?? []);
      setLoading(false);
    });
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
  const speakers      = (SPEAKERS_BY_TRAINING[training.id] ?? []).map((speaker) => {
    const uploaded = promoFacilitators.find((f) => normalizeName(f.name) === normalizeName(speaker.name));
    return { ...speaker, img: uploaded?.img ?? speaker.img ?? null, main: uploaded?.main ?? speaker.main };
  });
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

      {selectedSpeaker && (
        <SpeakerCvModal speaker={selectedSpeaker} color={c} onClose={() => setSelectedSpeaker(null)} />
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

              {/* ── Pembicara ── */}
              {speakers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.03 }}
                  className="bg-white rounded-2xl border border-border overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-7 py-5 border-b border-border">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: c + "18" }}
                    >
                      <Award size={16} style={{ color: c }} />
                    </motion.div>
                    <div>
                      <p className="font-extrabold text-[0.92rem] text-dark">Pembicara</p>
                      <p className="text-[0.68rem] text-muted mt-0.5">Profil ringkas fasilitator program</p>
                    </div>
                    <span className="ml-auto text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: c + "15", color: c }}>
                      {speakers.length} pembicara
                    </span>
                  </div>

                  <div className="px-7 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {speakers.map((speaker, i) => (
                      <motion.div
                        key={speaker.name}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: i * 0.08 }}
                        className="rounded-2xl border border-border bg-[#FAFAFA] p-4 flex flex-col min-h-[260px]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border bg-white flex-shrink-0">
                            {speaker.img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={speaker.img} alt={speaker.name} className="w-full h-full object-cover" />
                            ) : (
                              <AvatarInitials name={speaker.name} color={c} />
                            )}
                          </div>
                          <div className="min-w-0">
                            {speaker.main && (
                              <span className="inline-block text-[0.55rem] font-extrabold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full mb-1"
                                style={{ backgroundColor: c + "18", color: c }}>
                                Koordinator
                              </span>
                            )}
                            <p className="font-extrabold text-[0.82rem] leading-snug text-dark">{speaker.name}</p>
                            <p className="text-[0.66rem] text-muted leading-snug mt-1">{speaker.role}</p>
                          </div>
                        </div>

                        <p className="text-[0.73rem] leading-[1.65] text-dark/60 mt-4 flex-1">
                          {speaker.summary}
                        </p>

                        <button
                          onClick={() => setSelectedSpeaker(speaker)}
                          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-[0.74rem] font-extrabold text-dark/70 hover:text-dark hover:border-dark/20 transition-colors"
                        >
                          <Eye size={13} /> Preview CV
                        </button>
                      </motion.div>
                    ))}
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
                  <ShareTrainingButton
                    trainingId={training.id}
                    title={training.title}
                    accent={c}
                    className="py-3 text-[0.85rem]"
                  />

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

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <TrainingTestimonialsSection trainingId={training.id} color={c} />

      <Footer />
    </>
  );
}

// ── TrainingTestimonialsSection ───────────────────────────────────────────────
function TStarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 380 }}
        >
          <Star
            size={12}
            className={i < rating ? "fill-current" : "opacity-15"}
            style={{ color: i < rating ? color : undefined }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function TAvatar({ name, src, color }: { name: string; src?: string | null; color: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" />;
  }
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-[0.7rem] ring-2 ring-white flex-shrink-0"
      style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function TCard({ t, index, color }: { t: TestimonialItem; index: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.09)" }}
      className="bg-white rounded-2xl border border-black/[0.07] flex flex-col gap-0 overflow-hidden h-full"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Color bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: color }} />

      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Top row: stars + quote icon */}
        <div className="flex items-start justify-between gap-3">
          <TStarRating rating={t.rating} color={color} />
          <Quote size={22} style={{ color: color + "28" }} className="fill-current flex-shrink-0 mt-0.5" />
        </div>

        {/* Content */}
        <p className="text-[0.875rem] leading-[1.9] text-dark/60 flex-1 italic">
          &ldquo;{t.content}&rdquo;
        </p>

        {/* Bottom: author */}
        <div className="flex items-center gap-3 pt-4 border-t border-black/[0.06]">
          <TAvatar name={t.name} src={t.avatar_url} color={color} />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-[0.85rem] text-dark truncate leading-tight">{t.name}</p>
            {(t.position || t.company) && (
              <p className="text-[0.71rem] text-muted truncate mt-0.5">
                {[t.position, t.company].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="h-[3px] bg-dark/[0.08] w-full" />
      <div className="p-6 flex flex-col gap-4">
        <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 rounded bg-dark/[0.07]" />)}</div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 bg-dark/[0.06] rounded w-full" />
          <div className="h-3 bg-dark/[0.06] rounded w-5/6" />
          <div className="h-3 bg-dark/[0.06] rounded w-4/5" />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="w-9 h-9 rounded-full bg-dark/[0.07]" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-24 bg-dark/[0.07] rounded" />
            <div className="h-2.5 w-32 bg-dark/[0.05] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingTestimonialsSection({ trainingId, color }: { trainingId: string; color: string }) {
  const [items, setItems]     = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First fetch testimonials specific to this training
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .eq("training_id", trainingId)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data: specific }) => {
        if (specific && specific.length >= 2) {
          setItems(specific);
          setLoading(false);
        } else {
          // fallback: mix specific + general
          supabase
            .from("testimonials")
            .select("*")
            .eq("published", true)
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(3)
            .then(({ data: all }) => {
              setItems(all ?? []);
              setLoading(false);
            });
        }
      });
  }, [trainingId]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-[#FAFAF8] border-t border-border py-[clamp(60px,8vw,100px)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-[640px]"
          >
            <p className="text-[0.68rem] font-extrabold tracking-[0.2em] uppercase mb-5" style={{ color }}>
              Kata Mereka
            </p>

            {/* Pull-quote style heading */}
            <div className="relative">
              {/* Decorative opening quote */}
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute -top-3 -left-1 font-serif text-[4.5rem] leading-none select-none pointer-events-none"
                style={{ color: color + "22" }}
              >
                "
              </motion.span>

              <h2 className="text-[clamp(1.55rem,3.2vw,2.4rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-dark italic pl-5">
                Pelatihannya tidak hanya teori —{" "}
                <span className="not-italic relative inline-block">
                  langsung bisa diterapkan.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full origin-left"
                    style={{ backgroundColor: color }}
                  />
                </span>
              </h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-3 pl-5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-muted"
              >
                — Alumni yang pernah hadir
              </motion.p>
            </div>
          </motion.div>

          {/* Rating summary */}
          {!loading && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 self-start sm:self-auto"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-current" style={{ color }} />
                ))}
              </div>
              <span className="font-extrabold text-[0.9rem] text-dark">
                {(items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)}
              </span>
              <span className="text-[0.73rem] text-muted">/ 5 · {items.length} ulasan</span>
            </motion.div>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(n => <TSkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((t, i) => (
              <TCard key={t.id} t={t} index={i} color={color} />
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 text-center"
          >
            <p className="text-[0.8rem] text-muted mb-3">
              Pernah mengikuti program ini?
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "") || ""}?text=${encodeURIComponent("Halo Tim GRCC, saya ingin mengirimkan testimoni untuk program pelatihan yang pernah saya ikuti.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-dark text-[0.8rem] font-semibold px-5 py-2.5 rounded-xl hover:border-dark/30 hover:bg-white transition-all"
            >
              Bagikan pengalaman Anda →
            </a>
          </motion.div>
        )}
      </div>
    </section>
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

function SpeakerCvModal({ speaker, color, onClose }: { speaker: SpeakerProfile; color: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-[560px] bg-white rounded-3xl border border-border overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-6 border-b border-border">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-[#F7F7F5] flex-shrink-0">
            {speaker.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={speaker.img} alt={speaker.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarInitials name={speaker.name} color={color} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {speaker.main && (
              <span className="inline-block text-[0.58rem] font-extrabold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: color + "18", color }}>
                Koordinator Program
              </span>
            )}
            <p className="font-extrabold text-[1.05rem] leading-tight text-dark">{speaker.name}</p>
            <p className="text-[0.78rem] font-semibold text-dark/55 mt-1">{speaker.role}</p>
            <p className="text-[0.72rem] text-muted mt-1">{speaker.org}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-dark hover:bg-dark/[0.04] transition-colors flex-shrink-0"
            aria-label="Tutup preview CV"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <p className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-muted mb-2">Ringkasan CV</p>
            <p className="text-[0.86rem] leading-[1.8] text-dark/65">{speaker.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-[#FAFAFA] p-4">
              <p className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-muted mb-3">Fokus Keahlian</p>
              <div className="flex flex-col gap-2">
                {speaker.focus.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-[0.76rem] leading-snug text-dark/65">
                    <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color }} />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-[#FAFAFA] p-4">
              <p className="text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-muted mb-3">Highlight Profil</p>
              <div className="flex flex-col gap-2">
                {speaker.cvHighlights.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-[0.76rem] leading-snug text-dark/65">
                    <Award size={13} className="mt-0.5 flex-shrink-0" style={{ color }} />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AvatarInitials({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-center font-black text-[0.82rem]"
      style={{ backgroundColor: color + "12", color }}>
      {initials || "GR"}
    </div>
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
