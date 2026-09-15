"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Check, FileText, Loader2, MessageCircle,
  Phone, ShieldCheck, Upload, User, X,
} from "lucide-react";
import { supabase, TrainingItem } from "@/lib/supabase";
import { trainingDateLabel, trainingTimeLabel } from "@/lib/training-schedule";
import { whatsappHref } from "@/lib/site-config";
import {
  TAX_INVOICE_COMPANY_KEY,
  TAX_INVOICE_EMAIL_KEY,
  TAX_INVOICE_KEY,
  TAX_INVOICE_NPWP_PHOTO_KEY,
  TAX_INVOICE_PHONE_KEY,
  TAX_INVOICE_PIC_KEY,
} from "@/lib/tax-invoice";

type Props = {
  trainingId: string;
  training: TrainingItem;
  accent: string;
  group?: boolean;
  onBack: () => void;
};

type FormState = {
  pic: string;
  instansi: string;
  email: string;
  whatsapp: string;
};

const EMPTY: FormState = { pic: "", instansi: "", email: "", whatsapp: "" };

const inputCls = (error?: string) =>
  `w-full rounded-xl border bg-[#FAFAFA] px-4 py-3 text-[0.86rem] outline-none transition-all placeholder:text-dark/25 focus:bg-white focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-black/[0.08] focus:border-black/20 focus:ring-black/[0.04]"
  }`;

export default function TaxInvoiceRequestForm({ trainingId, training, accent, group = false, onBack }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [npwpFile, setNpwpFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const handleFile = (f: File) => {
    if (f.size > 8 * 1024 * 1024) { setErrors((er) => ({ ...er, npwp: "File maksimal 8MB" })); return; }
    setNpwpFile(f);
    setErrors((er) => ({ ...er, npwp: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.pic.trim()) e.pic = "Nama PIC wajib diisi";
    if (!form.instansi.trim()) e.instansi = "Nama instansi wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.whatsapp.trim()) e.whatsapp = "Nomor WhatsApp wajib diisi";
    if (!npwpFile) e.npwp = "Foto NPWP wajib diunggah";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      // Foto NPWP disimpan di bucket "payment-proofs" yang sudah ada (private,
      // sudah mendukung tipe file gambar/PDF) — bukan bucket baru, supaya tidak
      // perlu migrasi storage tambahan.
      const ext = npwpFile!.name.split(".").pop();
      const filename = `${trainingId}/npwp/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("payment-proofs")
        .upload(filename, npwpFile!, { contentType: npwpFile!.type });
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from("registrations").insert({
        training_id: trainingId,
        nama_lengkap: form.pic.trim(),
        instansi: form.instansi.trim(),
        jabatan: "PIC Finance",
        email: form.email.trim().toLowerCase(),
        telepon: form.whatsapp.trim(),
        bukti_pembayaran_url: null,
        custom_data: {
          [TAX_INVOICE_KEY]: "Ya",
          [TAX_INVOICE_PIC_KEY]: form.pic.trim(),
          [TAX_INVOICE_COMPANY_KEY]: form.instansi.trim(),
          [TAX_INVOICE_EMAIL_KEY]: form.email.trim().toLowerCase(),
          [TAX_INVOICE_PHONE_KEY]: form.whatsapp.trim(),
          [TAX_INVOICE_NPWP_PHOTO_KEY]: uploadData.path,
        },
        status: "pending",
        is_group: group,
        participant_count: 1,
      });
      if (insertErr) throw insertErr;

      fetch("/api/notify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: group ? "grup" : "individu",
          trainingTitle: training.title,
          nama: form.pic.trim(),
          email: form.email.trim().toLowerCase(),
          instansi: form.instansi.trim(),
          jabatan: "PIC Finance",
          telepon: form.whatsapp.trim(),
          taxInvoiceRequested: true,
          trainingDate: trainingDateLabel(training) ?? undefined,
          trainingTime: trainingTimeLabel(training) ?? undefined,
          trainingLocation: training.location ?? undefined,
          trainingFormat: training.format ?? undefined,
          trainingColor: training.color ?? undefined,
        }),
      }).catch(() => {/* silent */});

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const waMsg = `Halo Tim GRCC, saya ${form.pic} baru saja mengirim request Faktur Pajak untuk pelatihan "${training.title}". Mohon info lanjutannya. Terima kasih.`;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-8 py-14 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: accent + "15" }}
        >
          <Check size={26} style={{ color: accent }} strokeWidth={2.5} />
        </motion.div>
        <div>
          <h3 className="text-[1.05rem] font-extrabold text-dark">Request Faktur Pajak Terkirim</h3>
          <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-[1.7] text-muted">
            Tim GRCC akan memproses Faktur Pajak dan mengirim instruksi pembayaran resmi (Virtual Account khusus) ke email/WhatsApp Anda. Mohon jangan transfer sebelum menerima instruksi tersebut.
          </p>
        </div>
        <a
          href={whatsappHref(waMsg)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.82rem] font-extrabold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
        >
          <MessageCircle size={15} /> Chat Admin via WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-black/[0.08] bg-white p-6"
    >
      <div className="mb-6 flex items-start gap-3.5">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent + "12" }}
        >
          <FileText size={17} style={{ color: accent }} />
        </div>
        <div>
          <h3 className="text-[0.98rem] font-extrabold leading-snug text-dark">Request Faktur Pajak</h3>
          <p className="mt-1 max-w-md text-[0.78rem] leading-[1.7] text-muted">
            Isi data singkat ini — tim GRCC akan memproses faktur dan mengirim instruksi pembayaran resmi terpisah.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { key: "pic" as const, label: "Nama PIC", placeholder: "Nama penanggung jawab", icon: User, type: "text" },
          { key: "instansi" as const, label: "Nama Instansi", placeholder: "PT / CV / instansi Anda", icon: FileText, type: "text" },
          { key: "email" as const, label: "Email Aktif", placeholder: "nama@perusahaan.com", icon: FileText, type: "email" },
          { key: "whatsapp" as const, label: "Nomor WA Aktif", placeholder: "08xxxxxxxxxx", icon: Phone, type: "tel" },
        ].map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <label className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/70">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={set(field.key)}
              placeholder={field.placeholder}
              data-error={errors[field.key] ? true : undefined}
              className={inputCls(errors[field.key])}
            />
            <AnimatePresence>
              {errors[field.key] && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500"
                >
                  <AlertCircle size={10} /> {errors[field.key]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Foto NPWP */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <label className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/70">
            Foto NPWP <span className="text-red-500">*</span>
            <span className="ml-1 text-[0.68rem] font-normal text-dark/30">(JPG, PNG, atau PDF — maks 8MB)</span>
          </label>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {npwpFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <FileText size={16} className="text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.82rem] font-semibold text-emerald-800">{npwpFile.name}</p>
                <p className="text-[0.7rem] text-emerald-600">{(npwpFile.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => { setNpwpFile(null); if (inputRef.current) inputRef.current.value = ""; }}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-200 transition-colors hover:bg-emerald-300"
              >
                <X size={11} className="text-emerald-700" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              data-error={errors.npwp ? true : undefined}
              whileHover={{ scale: 1.005 }}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragging(false);
                const f = e.dataTransfer.files[0]; if (f) handleFile(f);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-6 py-7 text-center transition-all duration-200 ${
                dragging
                  ? "scale-[1.005] border-black/25 bg-black/[0.03]"
                  : errors.npwp
                    ? "border-red-300 bg-red-50/50 hover:border-red-400"
                    : "border-black/[0.1] hover:border-black/20 hover:bg-black/[0.015]"
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${dragging ? "bg-black/10" : "bg-dark/[0.05]"}`}>
                <Upload size={18} className={dragging ? "text-dark/60" : "text-dark/35"} />
              </div>
              <p className="text-[0.8rem] font-semibold text-dark/55">
                {dragging ? "Lepaskan file di sini" : "Klik atau drag & drop foto NPWP"}
              </p>
            </motion.div>
          )}
          <AnimatePresence>
            {errors.npwp && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500"
              >
                <AlertCircle size={10} /> {errors.npwp}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-start gap-2.5 rounded-xl bg-[#FAFAFA] p-3.5 text-[0.72rem] leading-relaxed text-muted"
        >
          <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-dark/30" />
          Instruksi pembayaran (Virtual Account khusus) menyusul dari tim GRCC setelah Faktur Pajak diproses. Mohon jangan transfer sebelum menerima instruksi resmi.
        </motion.div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl px-4 py-3 text-[0.82rem] font-bold text-muted transition-colors hover:text-dark"
          >
            Ganti Pilihan
          </button>
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={!submitting ? { scale: 1.01, y: -1 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[0.88rem] font-extrabold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}35` }}
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Mengirim...</>
            ) : (
              <><FileText size={16} /> Kirim ke Admin</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}
