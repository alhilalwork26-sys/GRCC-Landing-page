"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, FileText, Phone } from "lucide-react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { whatsappHref } from "@/lib/site-config";
import {
  TAX_INVOICE_ADDRESS_KEY,
  TAX_INVOICE_COMPANY_KEY,
  TAX_INVOICE_CONTACTED_KEY,
  TAX_INVOICE_EMAIL_KEY,
  TAX_INVOICE_KEY,
  TAX_INVOICE_NPWP_KEY,
  TAX_INVOICE_PHONE_KEY,
  TAX_INVOICE_PIC_KEY,
  TAX_INVOICE_REQUIRED_KEYS,
} from "@/lib/tax-invoice";

type Props = {
  trainingTitle: string;
  accent: string;
  customData: Record<string, string>;
  setCustomData: Dispatch<SetStateAction<Record<string, string>>>;
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  group?: boolean;
};

const fieldCls = (error?: string) =>
  `w-full rounded-xl border bg-[#FAFAFA] px-4 py-3 text-[0.84rem] outline-none transition-all placeholder:text-dark/25 focus:bg-white focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-black/[0.08] focus:border-black/20 focus:ring-black/[0.04]"
  }`;

const fields = [
  {
    key: TAX_INVOICE_COMPANY_KEY,
    label: "Nama Perusahaan sesuai NPWP",
    placeholder: "PT / CV / instansi sesuai NPWP",
    type: "text",
  },
  {
    key: TAX_INVOICE_NPWP_KEY,
    label: "NPWP Perusahaan",
    placeholder: "XX.XXX.XXX.X-XXX.XXX",
    type: "text",
  },
  {
    key: TAX_INVOICE_ADDRESS_KEY,
    label: "Alamat Perusahaan",
    placeholder: "Alamat lengkap sesuai data pajak",
    type: "textarea",
  },
  {
    key: TAX_INVOICE_EMAIL_KEY,
    label: "Email Finance",
    placeholder: "finance@perusahaan.com",
    type: "email",
  },
  {
    key: TAX_INVOICE_PIC_KEY,
    label: "Nama PIC Finance",
    placeholder: "Nama PIC finance",
    type: "text",
  },
  {
    key: TAX_INVOICE_PHONE_KEY,
    label: "WhatsApp PIC Finance",
    placeholder: "08xxxxxxxxxx",
    type: "tel",
  },
] as const;

export default function TaxInvoiceSection({
  trainingTitle,
  accent,
  customData,
  setCustomData,
  errors,
  setErrors,
  group = false,
}: Props) {
  const needsInvoice = customData[TAX_INVOICE_KEY] === "Ya";
  const message = `Halo Tim GRCC, saya membutuhkan Faktur Pajak untuk pendaftaran${group ? " grup" : ""} pelatihan "${trainingTitle}". Mohon bantu proses administrasi dan instruksi pembayaran resmi. Saya tidak akan melakukan transfer terlebih dahulu.`;

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next[`tax_${key}`];
      return next;
    });
  };

  const choose = (value: "Ya" | "Tidak") => {
    setCustomData((prev) => {
      const next: Record<string, string> = { ...prev, [TAX_INVOICE_KEY]: value };
      if (value === "Tidak") {
        TAX_INVOICE_REQUIRED_KEYS.forEach((key) => delete next[key]);
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[TAX_INVOICE_KEY];
      TAX_INVOICE_REQUIRED_KEYS.forEach((key) => delete next[`tax_${key}`]);
      return next;
    });
  };

  const update = (key: string, value: string) => {
    setCustomData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const confirmed = customData[TAX_INVOICE_CONTACTED_KEY] === "Ya";
  const confirmError = errors[`tax_${TAX_INVOICE_CONTACTED_KEY}`];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10"
    >
      <div
        className="rounded-2xl border border-black/[0.08] bg-white p-6"
        data-error={errors[TAX_INVOICE_KEY] ? true : undefined}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3.5">
            <motion.div
              whileHover={{ scale: 1.06, rotate: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: accent + "12" }}
            >
              <FileText size={17} style={{ color: accent }} />
            </motion.div>
            <div>
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.15em]" style={{ color: accent }}>
                Faktur Pajak
              </p>
              <h3 className="mt-1 text-[0.98rem] font-extrabold leading-snug text-dark">
                Apakah Anda membutuhkan Faktur Pajak?
              </h3>
              <p className="mt-1 max-w-xl text-[0.78rem] leading-[1.7] text-muted">
                Jika memilih <strong className="text-dark/70">Ya</strong>, instruksi transfer &amp; upload bukti bayar dinonaktifkan sementara — tim GRCC akan mengirim instruksi pembayaran resmi setelah proses Faktur Pajak.
              </p>
            </div>
          </div>

          <motion.a
            href={whatsappHref(message)}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-extrabold text-white shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Phone size={14} /> Hubungi Admin
          </motion.a>
        </div>

        {/* Segmented toggle */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {(["Tidak", "Ya"] as const).map((value) => {
            const active = customData[TAX_INVOICE_KEY] === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.985 }}
                onClick={() => choose(value)}
                className="relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors"
                style={{ borderColor: active ? accent : "rgba(0,0,0,0.08)" }}
              >
                {active && (
                  <motion.div
                    layoutId="tax-toggle-bg"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0"
                    style={{ backgroundColor: accent + "0A" }}
                  />
                )}
                <span className="relative flex items-center justify-between gap-3">
                  <span>
                    <span className={`block text-[0.85rem] font-extrabold ${active ? "text-dark" : "text-dark/60"}`}>
                      {value === "Ya" ? "Ya, butuh Faktur Pajak" : "Tidak butuh Faktur Pajak"}
                    </span>
                    <span className={`mt-0.5 block text-[0.7rem] font-semibold ${active ? "text-muted" : "text-dark/30"}`}>
                      {value === "Ya" ? "Pembayaran website dikunci dahulu" : "Lanjut isi formulir dan pembayaran"}
                    </span>
                  </span>
                  <motion.span
                    animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: accent }}
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </motion.span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {errors[TAX_INVOICE_KEY] && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 flex items-center gap-1.5 text-[0.72rem] text-red-500"
            >
              <AlertCircle size={11} /> {errors[TAX_INVOICE_KEY]}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {needsInvoice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-black/[0.06] pt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field, i) => {
                    const error = errors[`tax_${field.key}`];
                    const common = {
                      value: customData[field.key] || "",
                      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        update(field.key, event.target.value),
                      className: fieldCls(error),
                      placeholder: field.placeholder,
                      "data-error": error ? true : undefined,
                    };

                    return (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={field.type === "textarea" ? "sm:col-span-2" : ""}
                      >
                        <label className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/70">
                          {field.label} <span className="text-red-500">*</span>
                        </label>
                        {field.type === "textarea" ? (
                          <textarea {...common} rows={3} />
                        ) : (
                          <input {...common} type={field.type} />
                        )}
                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500"
                            >
                              <AlertCircle size={10} /> {error}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  data-error={confirmError ? true : undefined}
                  onClick={() => update(TAX_INVOICE_CONTACTED_KEY, confirmed ? "" : "Ya")}
                  className={`mt-4 flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                    confirmed
                      ? "border-emerald-200 bg-emerald-50/60"
                      : confirmError
                        ? "border-red-200 bg-red-50/60"
                        : "border-black/[0.08] bg-[#FAFAFA] hover:bg-white"
                  }`}
                >
                  <motion.span
                    animate={{ backgroundColor: confirmed ? "#10B981" : "#ffffff" }}
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border"
                    style={{ borderColor: confirmed ? "#10B981" : "rgba(0,0,0,0.16)" }}
                  >
                    <motion.span
                      animate={{ scale: confirmed ? 1 : 0, opacity: confirmed ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    >
                      <Check size={13} className="text-white" strokeWidth={3} />
                    </motion.span>
                  </motion.span>
                  <span>
                    <span className="block text-[0.78rem] font-extrabold text-dark">
                      Saya paham untuk tidak melakukan transfer sebelum menerima instruksi pembayaran resmi dari GRCC.
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-muted">
                      Request tetap masuk ke admin agar tim finance dapat memproses Faktur Pajak terlebih dahulu.
                    </span>
                    <AnimatePresence>
                      {confirmError && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500"
                        >
                          <AlertCircle size={10} /> {confirmError}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
