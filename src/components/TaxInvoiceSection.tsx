"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, FileText, Phone } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { whatsappHref } from "@/lib/site-config";
import { TAX_INVOICE_KEY } from "@/lib/tax-invoice";

type Props = {
  trainingTitle: string;
  accent: string;
  customData: Record<string, string>;
  setCustomData: Dispatch<SetStateAction<Record<string, string>>>;
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  group?: boolean;
};

// Cuma menampilkan pertanyaan Ya/Tidak Faktur Pajak. Begitu dijawab, halaman
// pemanggil (daftar/daftar-grup) menampilkan salah satu dari dua alur terpisah:
// form pendaftaran normal (Tidak) atau TaxInvoiceRequestForm yang minimal (Ya).
export default function TaxInvoiceSection({
  trainingTitle,
  accent,
  customData,
  setCustomData,
  errors,
  setErrors,
  group = false,
}: Props) {
  const message = `Halo Tim GRCC, saya membutuhkan Faktur Pajak untuk pendaftaran${group ? " grup" : ""} pelatihan "${trainingTitle}". Mohon bantu proses administrasi dan instruksi pembayaran resmi. Saya tidak akan melakukan transfer terlebih dahulu.`;

  const choose = (value: "Ya" | "Tidak") => {
    setCustomData((prev) => ({ ...prev, [TAX_INVOICE_KEY]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[TAX_INVOICE_KEY];
      return next;
    });
  };

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
                Jika memilih <strong className="text-dark/70">Ya</strong>, Anda akan diarahkan ke formulir request Faktur Pajak yang singkat — instruksi pembayaran resmi (VA khusus) menyusul dari tim GRCC setelah faktur diproses.
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
                    layoutId={`tax-toggle-bg-${group ? "group" : "individu"}`}
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
                      {value === "Ya" ? "Isi form request singkat" : "Lanjut isi formulir dan pembayaran"}
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
      </div>
    </motion.div>
  );
}
