"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Calendar, MapPin, User, Building2, Briefcase,
  Mail, Phone, CreditCard, Upload, Check, ChevronRight,
  AlertCircle, Loader2, FileText, X, Sparkles, Tag,
  BadgePercent, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase, TrainingItem, CustomField, PromoCode } from "@/lib/supabase";
import { paymentInstruction, siteConfig, whatsappHref } from "@/lib/site-config";

// ── helpers ───────────────────────────────────────────────────────────────────
function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Field wrapper with animated label ────────────────────────────────────────
function FormField({
  label, required, error, children, icon,
}: {
  label: string; required?: boolean; error?: string;
  children: React.ReactNode; icon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col gap-1.5"
    >
      <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/70">
        {icon && <span className="text-dark/40">{icon}</span>}
        {label}
        {required && <span className="text-red-500 text-[0.7rem]">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-[0.72rem] text-red-500"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border text-[0.88rem] bg-white outline-none transition-all duration-200
  focus:ring-2 focus:ring-offset-0 placeholder:text-dark/25
  ${err
    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
    : "border-black/[0.1] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10"}`;

// ── File Upload ───────────────────────────────────────────────────────────────
function FileUpload({
  value, onChange, error
}: {
  value: File | null;
  onChange: (f: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) { alert("File maksimal 5MB"); return; }
    onChange(f);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-1.5"
    >
      <label className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-dark/70">
        <Upload size={13} className="text-dark/40" />
        Bukti Pembayaran
        <span className="text-red-500 text-[0.7rem]">*</span>
        <span className="text-dark/30 text-[0.68rem] font-normal ml-1">(JPG/PNG/PDF, maks 5MB)</span>
      </label>

      <input
        ref={inputRef} type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {value ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-green-200 bg-green-50"
        >
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.82rem] font-semibold text-green-800 truncate">{value.name}</p>
            <p className="text-[0.7rem] text-green-600">{(value.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="w-6 h-6 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-colors"
          >
            <X size={11} className="text-green-700" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files[0]; if (f) handleFile(f);
          }}
          className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-[#4F46E5] bg-[#4F46E5]/5 scale-[1.01]"
              : error
                ? "border-red-300 bg-red-50/50 hover:border-red-400"
                : "border-black/[0.1] hover:border-[#4F46E5]/50 hover:bg-[#4F46E5]/[0.02]"
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dragging ? "bg-[#4F46E5]/15" : "bg-dark/[0.05]"}`}>
            <Upload size={20} className={dragging ? "text-[#4F46E5]" : "text-dark/35"} />
          </div>
          <div className="text-center">
            <p className="text-[0.82rem] font-semibold text-dark/60">
              {dragging ? "Lepaskan file di sini" : "Klik atau drag & drop file"}
            </p>
            <p className="text-[0.72rem] text-dark/35 mt-0.5">JPG, PNG, PDF · Maks. 5MB</p>
          </div>
        </motion.div>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-[0.72rem] text-red-500">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </motion.div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ num, title, accent }: { num: string; title: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-6"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[0.7rem] font-extrabold flex-shrink-0"
        style={{ backgroundColor: accent }}
      >
        {num}
      </div>
      <h3 className="text-[0.85rem] font-extrabold tracking-[0.06em] uppercase text-dark/70">{title}</h3>
      <div className="flex-1 h-px bg-black/[0.06]" />
    </motion.div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ training, accent }: { training: TrainingItem; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center justify-center text-center py-20 px-8 max-w-md mx-auto"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accent + "15" }}>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.25 }}
          >
            <Check size={40} style={{ color: accent }} strokeWidth={2.5} />
          </motion.div>
        </div>
        {/* Ring pulse */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: accent + "20" }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: accent }} />
          <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: accent }}>
            Pendaftaran Berhasil
          </span>
        </div>
        <h2 className="text-[1.7rem] font-extrabold tracking-tight leading-tight mb-3 text-dark">
          Terima kasih!
        </h2>
        <p className="text-dark/50 text-[0.9rem] leading-[1.8] mb-2">
          Pendaftaran Anda untuk
        </p>
        <p className="font-bold text-dark text-[0.95rem] mb-6">{training.title}</p>
        <p className="text-dark/45 text-[0.85rem] leading-[1.8]">
          Tim GRCC akan menghubungi Anda melalui email atau WhatsApp dalam <strong>1×24 jam</strong> untuk konfirmasi dan informasi selanjutnya.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3 mt-10 w-full"
      >
        <Link
          href="/programs"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-dark/15 text-dark text-[0.84rem] font-semibold hover:bg-dark/[0.04] transition-all"
        >
          <ArrowLeft size={14} /> Lihat Program Lain
        </Link>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-[0.84rem] font-semibold transition-all"
          style={{ backgroundColor: accent }}
        >
          Kembali ke Beranda <ChevronRight size={14} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DaftarPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const searchParams   = useSearchParams();
  const router = useRouter();

  const [training, setTraining] = useState<TrainingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form state
  const [form, setForm] = useState({
    nama_lengkap: "", instansi: "", jabatan: "",
    email: "", telepon: "", npwp: "",
  });
  const [customData, setCustomData] = useState<Record<string, string>>({});
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    supabase.from("training").select("*").eq("id", trainingId).maybeSingle()
      .then(({ data }) => { setTraining(data); setLoading(false); });
  }, [trainingId]);

  // Auto-apply promo & qty from URL params (passed from booking widget)
  useEffect(() => {
    const promoFromUrl = searchParams.get("promo");
    if (promoFromUrl && !appliedPromo) {
      setPromoInput(promoFromUrl.toUpperCase());
      // validate & apply
      supabase.from("promo_codes").select("*").eq("code", promoFromUrl.toUpperCase()).eq("active", true).maybeSingle()
        .then(({ data }) => {
          if (data &&
              (data.promo_type ?? "semua") !== "grup" &&
              !(data.expires_at && new Date(data.expires_at) < new Date()) &&
              !(data.max_uses !== null && data.used_count >= data.max_uses)) {
            setAppliedPromo(data);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Calculate progress
  useEffect(() => {
    const fields = [
      form.nama_lengkap, form.instansi, form.jabatan,
      form.email, form.telepon,
    ];
    const filled = fields.filter(Boolean).length;
    const total = fields.length + 1; // +1 for payment file
    setProgress(Math.round(((filled + (paymentFile ? 1 : 0)) / total) * 100));
  }, [form, paymentFile]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama_lengkap.trim()) e.nama_lengkap = "Nama lengkap wajib diisi";
    if (!form.instansi.trim()) e.instansi = "Asal instansi wajib diisi";
    if (!form.jabatan.trim()) e.jabatan = "Jabatan wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.telepon.trim()) e.telepon = "Nomor telepon wajib diisi";
    if (!paymentFile) e.payment = "Bukti pembayaran wajib diunggah";
    // Custom required fields
    training?.custom_fields?.forEach(cf => {
      if (cf.required && !customData[cf.id]?.trim()) {
        e[`custom_${cf.id}`] = `${cf.label} wajib diisi`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Promo code helpers ────────────────────────────────────────────────────
  const basePrice = training?.price ?? 0;

  const calcDiscount = (promo: PromoCode): number => {
    if (!basePrice) return 0;
    if (promo.discount_type === "percentage") {
      return Math.round(basePrice * promo.discount_value / 100);
    }
    return Math.min(promo.discount_value, basePrice);
  };

  const finalPrice = appliedPromo ? basePrice - calcDiscount(appliedPromo) : basePrice;

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
    } else if ((data.promo_type ?? "semua") === "grup") {
      setPromoError("Kode ini hanya berlaku untuk pendaftaran grup.");
    } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setPromoError("Kode promo sudah kadaluarsa.");
    } else if (data.max_uses !== null && data.used_count >= data.max_uses) {
      setPromoError("Kode promo sudah habis digunakan.");
    } else if (basePrice > 0 && data.min_price > basePrice) {
      setPromoError(`Kode berlaku untuk transaksi minimal ${formatRp(data.min_price)}.`);
    } else {
      setAppliedPromo(data);
      setPromoError("");
    }
    setPromoLoading(false);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload bukti pembayaran
      let buktiUrl: string | null = null;
      if (paymentFile) {
        const ext = paymentFile.name.split(".").pop();
        const filename = `${trainingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("payment-proofs")
          .upload(filename, paymentFile, { contentType: paymentFile.type });
        if (uploadErr) throw uploadErr;
        buktiUrl = uploadData.path;
      }

      // 2. Insert registration
      const discountAmt = appliedPromo ? calcDiscount(appliedPromo) : null;
      const { error: insertErr } = await supabase.from("registrations").insert({
        training_id: trainingId,
        nama_lengkap: form.nama_lengkap.trim(),
        instansi: form.instansi.trim(),
        jabatan: form.jabatan.trim(),
        email: form.email.trim().toLowerCase(),
        telepon: form.telepon.trim(),
        npwp: form.npwp.trim() || null,
        bukti_pembayaran_url: buktiUrl,
        custom_data: customData,
        status: "pending",
        promo_code: appliedPromo?.code ?? null,
        original_price: basePrice || null,
        discount_amount: discountAmt,
        final_price: basePrice ? finalPrice : null,
        participant_count: 1,
      });

      // 3. Increment promo used_count (atomic RPC, avoids race condition)
      if (appliedPromo) {
        await supabase.rpc("increment_promo_used_count", { promo_id: appliedPromo.id });
      }
      if (insertErr) throw insertErr;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-dark/30" />
    </div>
  );

  if (!training) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted">
      <p>Program tidak ditemukan.</p>
      <Link href="/programs" className="text-dark underline text-sm">← Kembali ke Programs</Link>
    </div>
  );

  const accent = training.color || "#4F46E5";
  const customFields: CustomField[] = training.custom_fields ?? [];

  return (
    <>
      <Navbar />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] z-[9999]"
        style={{ backgroundColor: accent }}
        initial={{ width: "0%" }}
        animate={{ width: submitted ? "100%" : `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <main className="min-h-screen bg-[#F7F7F5] pt-20">
        {submitted ? (
          /* ── SUCCESS ── */
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-20">
            <SuccessScreen training={training} accent={accent} />
          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-12">
            {/* Back */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-muted hover:text-dark transition-colors"
              >
                <ArrowLeft size={13} /> Kembali ke Programs
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

              {/* ── FORM ── */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl border border-black/[0.07] p-8 lg:p-10"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
              >
                {/* Form header */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                    <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">
                      Formulir Pendaftaran
                    </span>
                  </div>
                  <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-tight text-dark leading-tight">
                    Daftar Sekarang
                  </h1>
                  <p className="text-muted text-[0.85rem] mt-2">
                    Isi formulir di bawah dengan data yang benar. Semua kolom bertanda <span className="text-red-500">*</span> wajib diisi.
                  </p>
                </div>

                {/* ── Section 1: Data Peserta ── */}
                <SectionHeader num="1" title="Data Peserta" accent={accent} />
                <div className="grid sm:grid-cols-2 gap-5 mb-10">
                  <div className="sm:col-span-2">
                    <FormField label="Nama Lengkap" required error={errors.nama_lengkap} icon={<User size={13} />}>
                      <input
                        data-error={errors.nama_lengkap ? true : undefined}
                        type="text" placeholder="Masukkan nama lengkap sesuai KTP"
                        value={form.nama_lengkap} onChange={set("nama_lengkap")}
                        className={inputCls(errors.nama_lengkap)}
                      />
                    </FormField>
                  </div>
                  <FormField label="Asal Instansi / Perusahaan" required error={errors.instansi} icon={<Building2 size={13} />}>
                    <input
                      type="text" placeholder="Nama instansi atau perusahaan"
                      value={form.instansi} onChange={set("instansi")}
                      className={inputCls(errors.instansi)}
                    />
                  </FormField>
                  <FormField label="Jabatan" required error={errors.jabatan} icon={<Briefcase size={13} />}>
                    <input
                      type="text" placeholder="Jabatan / posisi Anda"
                      value={form.jabatan} onChange={set("jabatan")}
                      className={inputCls(errors.jabatan)}
                    />
                  </FormField>
                </div>

                {/* ── Section 2: Kontak ── */}
                <SectionHeader num="2" title="Informasi Kontak" accent={accent} />
                <div className="grid sm:grid-cols-2 gap-5 mb-10">
                  <FormField label="Alamat Email" required error={errors.email} icon={<Mail size={13} />}>
                    <input
                      type="email" placeholder="email@instansi.com"
                      value={form.email} onChange={set("email")}
                      className={inputCls(errors.email)}
                    />
                  </FormField>
                  <FormField label="Nomor Telepon / WhatsApp" required error={errors.telepon} icon={<Phone size={13} />}>
                    <input
                      type="tel" placeholder="08xxxxxxxxxx"
                      value={form.telepon} onChange={set("telepon")}
                      className={inputCls(errors.telepon)}
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="NPWP" error={errors.npwp} icon={<CreditCard size={13} />}>
                      <input
                        type="text" placeholder="XX.XXX.XXX.X-XXX.XXX (opsional)"
                        value={form.npwp} onChange={set("npwp")}
                        className={inputCls(errors.npwp)}
                      />
                    </FormField>
                  </div>
                </div>

                {/* ── Section 3: Custom Fields (from admin) ── */}
                {customFields.length > 0 && (
                  <>
                    <SectionHeader num="3" title="Informasi Tambahan" accent={accent} />
                    <div className="grid sm:grid-cols-2 gap-5 mb-10">
                      {customFields.map((cf) => (
                        <div key={cf.id} className={cf.type === "textarea" ? "sm:col-span-2" : ""}>
                          <FormField
                            label={cf.label}
                            required={cf.required}
                            error={errors[`custom_${cf.id}`]}
                          >
                            {cf.type === "textarea" ? (
                              <textarea
                                rows={3}
                                placeholder={cf.placeholder || ""}
                                value={customData[cf.id] || ""}
                                onChange={e => {
                                  setCustomData(d => ({ ...d, [cf.id]: e.target.value }));
                                  setErrors(er => ({ ...er, [`custom_${cf.id}`]: "" }));
                                }}
                                className={inputCls(errors[`custom_${cf.id}`]) + " resize-none"}
                              />
                            ) : cf.type === "select" ? (
                              <select
                                value={customData[cf.id] || ""}
                                onChange={e => {
                                  setCustomData(d => ({ ...d, [cf.id]: e.target.value }));
                                  setErrors(er => ({ ...er, [`custom_${cf.id}`]: "" }));
                                }}
                                className={inputCls(errors[`custom_${cf.id}`])}
                              >
                                <option value="">Pilih...</option>
                                {cf.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={cf.type === "number" ? "number" : cf.type === "date" ? "date" : "text"}
                                placeholder={cf.placeholder || ""}
                                value={customData[cf.id] || ""}
                                onChange={e => {
                                  setCustomData(d => ({ ...d, [cf.id]: e.target.value }));
                                  setErrors(er => ({ ...er, [`custom_${cf.id}`]: "" }));
                                }}
                                className={inputCls(errors[`custom_${cf.id}`])}
                              />
                            )}
                          </FormField>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Section: Kode Promo ── */}
                {training.price && training.price > 0 && (
                  <div className="mb-10">
                    <SectionHeader
                      num={customFields.length > 0 ? "4" : "3"}
                      title="Kode Promo"
                      accent={accent}
                    />

                    {appliedPromo ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between gap-3 px-4 py-4 rounded-xl border border-emerald-200 bg-emerald-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[0.84rem] font-extrabold text-emerald-800 tracking-wide font-mono">
                              {appliedPromo.code}
                            </p>
                            <p className="text-[0.72rem] text-emerald-700">
                              {appliedPromo.discount_type === "percentage"
                                ? `Diskon ${appliedPromo.discount_value}%`
                                : `Diskon ${formatRp(appliedPromo.discount_value)}`}
                              {" "}— hemat{" "}
                              <strong>{formatRp(calcDiscount(appliedPromo))}</strong>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removePromo}
                          className="w-7 h-7 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center flex-shrink-0 transition-colors"
                        >
                          <X size={12} className="text-emerald-700" />
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Masukkan kode promo"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-[0.88rem] font-mono tracking-widest bg-white outline-none transition-all focus:ring-2 focus:ring-offset-0 uppercase
                              ${promoError
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                : "border-black/[0.1] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10"
                              }`}
                          />
                        </div>
                        <motion.button
                          type="button"
                          onClick={applyPromo}
                          disabled={promoLoading || !promoInput.trim()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-5 py-3 rounded-xl text-white text-[0.84rem] font-bold flex items-center gap-2 disabled:opacity-50 transition-all flex-shrink-0"
                          style={{ backgroundColor: accent }}
                        >
                          {promoLoading
                            ? <Loader2 size={15} className="animate-spin" />
                            : <BadgePercent size={15} />
                          }
                          Pakai
                        </motion.button>
                      </div>
                    )}

                    <AnimatePresence>
                      {promoError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 text-[0.72rem] text-red-500 mt-2"
                        >
                          <AlertCircle size={11} /> {promoError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Section: Bukti Pembayaran ── */}
                <SectionHeader
                  num={(() => {
                    let n = 3;
                    if (customFields.length > 0) n++;
                    if (training.price && training.price > 0) n++;
                    return String(n);
                  })()}
                  title="Bukti Pembayaran"
                  accent={accent}
                />
                <div className="mb-10">
                  <FileUpload
                    value={paymentFile}
                    onChange={setPaymentFile}
                    error={errors.payment}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200"
                  >
                    <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[0.75rem] text-amber-700 leading-[1.7]">
                      <strong>{paymentInstruction()}</strong>
                      Pastikan nominal sesuai dengan biaya program yang tertera.
                    </p>
                  </motion.div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={!submitting ? { scale: 1.01, y: -1 } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-extrabold text-[0.95rem] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}40` }}
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
                  ) : (
                    <><Check size={18} /> Kirim Pendaftaran</>
                  )}
                </motion.button>

                <p className="text-center text-[0.72rem] text-muted mt-4">
                  Dengan mendaftar, Anda menyetujui <a href="#" className="underline hover:text-dark">syarat & ketentuan</a> GRCC.
                </p>
              </motion.form>

              {/* ── SIDEBAR: Training Info ── */}
              <div className="lg:sticky lg:top-24 flex flex-col gap-4">
                {/* Training card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="rounded-3xl overflow-hidden border border-black/[0.07]"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
                >
                  {/* Color header */}
                  <div className="relative h-[120px]" style={{ backgroundColor: accent + "18" }}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(${accent}20 1px, transparent 1px), linear-gradient(90deg, ${accent}20 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }} />
                    <div className="absolute inset-0" style={{
                      background: `radial-gradient(ellipse at 70% 30%, ${accent}35 0%, transparent 65%)`
                    }} />
                    {training.poster_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={training.poster_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    )}
                    {/* Price badge */}
                    {(training.price || training.price_label) && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-white font-extrabold text-[1.1rem] drop-shadow-sm">
                          {training.price ? formatRp(training.price) : training.price_label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6">
                    <span
                      className="inline-block text-[0.6rem] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full text-white mb-3"
                      style={{ backgroundColor: accent }}
                    >
                      {training.format}
                    </span>
                    <h2 className="font-extrabold text-[1rem] leading-snug text-dark mb-4">{training.title}</h2>

                    <div className="flex flex-col gap-2.5 border-t border-black/[0.06] pt-4">
                      {training.date_start && (
                        <div className="flex items-center gap-2.5 text-[0.78rem] text-muted">
                          <Calendar size={13} className="flex-shrink-0 text-dark/40" />
                          <span>{training.date_start}{training.date_end ? ` – ${training.date_end}` : ""}</span>
                        </div>
                      )}
                      {training.location && (
                        <div className="flex items-center gap-2.5 text-[0.78rem] text-muted">
                          <MapPin size={13} className="flex-shrink-0 text-dark/40" />
                          <span>{training.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ── Price summary (shown when price exists) ── */}
                {training.price && training.price > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl border border-black/[0.07] p-5"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                      Ringkasan Biaya
                    </p>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between text-[0.82rem]">
                        <span className="text-muted">Biaya program</span>
                        <span className="font-semibold">{formatRp(training.price)}</span>
                      </div>

                      <AnimatePresence>
                        {appliedPromo && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="flex justify-between text-[0.82rem]">
                              <span className="text-emerald-600 flex items-center gap-1">
                                <Tag size={11} /> {appliedPromo.code}
                              </span>
                              <span className="font-semibold text-emerald-600">
                                − {formatRp(calcDiscount(appliedPromo))}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="border-t border-black/[0.06] pt-2.5 flex justify-between items-center">
                        <span className="text-[0.82rem] font-extrabold">Total</span>
                        <motion.span
                          key={finalPrice}
                          initial={{ scale: 1.08 }}
                          animate={{ scale: 1 }}
                          className="font-extrabold text-[1rem]"
                          style={{ color: accent }}
                        >
                          {formatRp(finalPrice)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Progress card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-black/[0.07] p-5"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[0.75rem] font-bold text-dark/60">Kelengkapan Formulir</p>
                    <span className="text-[0.78rem] font-extrabold" style={{ color: accent }}>{progress}%</span>
                  </div>
                  <div className="h-2 bg-dark/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: accent }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-[0.7rem] text-muted mt-2">
                    {progress < 100 ? "Lengkapi semua kolom wajib untuk mengirim" : "Formulir siap dikirim! ✓"}
                  </p>
                </motion.div>

                {/* Need help */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl border border-black/[0.07] p-5"
                >
                  <p className="text-[0.75rem] font-bold text-dark mb-2">Butuh bantuan?</p>
                  <p className="text-[0.72rem] text-muted leading-[1.7] mb-3">
                    Hubungi tim GRCC jika ada pertanyaan seputar pendaftaran.
                  </p>
                  <a
                    href={whatsappHref("Halo, saya membutuhkan bantuan terkait pendaftaran program GRCC.")}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-[0.78rem] font-semibold text-white px-4 py-2.5 rounded-xl transition-all w-full justify-center"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <Phone size={13} /> {siteConfig.whatsappNumber ? "WhatsApp Admin" : "Email Admin"}
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
