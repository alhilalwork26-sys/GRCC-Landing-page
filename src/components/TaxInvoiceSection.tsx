"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText, Phone } from "lucide-react";
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
  `w-full rounded-xl border bg-white px-4 py-3 text-[0.84rem] outline-none transition-all placeholder:text-dark/25 focus:ring-2 ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-black/[0.1] focus:border-[#4F46E5] focus:ring-[#4F46E5]/10"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="mb-10"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-5"
        data-error={errors[TAX_INVOICE_KEY] ? true : undefined}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, #f59e0b, ${accent}, #f59e0b)` }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white">
              <FileText size={17} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.15em] text-amber-700">
                Faktur Pajak
              </p>
              <h3 className="mt-1 text-[1rem] font-extrabold leading-snug text-dark">
                Apakah Anda membutuhkan Faktur Pajak?
              </h3>
              <p className="mt-1 max-w-2xl text-[0.78rem] leading-[1.7] text-amber-900/75">
                Jika memilih <strong>Ya</strong>, sistem akan menonaktifkan instruksi transfer dan upload bukti bayar. Tim GRCC akan mengirim instruksi pembayaran resmi setelah proses Faktur Pajak.
              </p>
            </div>
          </div>

          <a
            href={whatsappHref(message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-extrabold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            <Phone size={14} /> Hubungi Admin
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(["Tidak", "Ya"] as const).map((value) => {
            const active = customData[TAX_INVOICE_KEY] === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => choose(value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                  active ? "bg-white shadow-sm" : "bg-white/65 hover:bg-white"
                }`}
                style={{
                  borderColor: active ? accent : "rgba(0,0,0,0.1)",
                }}
              >
                <span>
                  <span className="block text-[0.86rem] font-extrabold text-dark">
                    {value === "Ya" ? "Ya, butuh Faktur Pajak" : "Tidak butuh Faktur Pajak"}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] font-semibold text-muted">
                    {value === "Ya" ? "Pembayaran website dikunci dahulu" : "Lanjut isi formulir dan pembayaran"}
                  </span>
                </span>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full border"
                  style={{
                    borderColor: active ? accent : "rgba(0,0,0,0.16)",
                    backgroundColor: active ? accent : "white",
                  }}
                >
                  {active && <CheckCircle2 size={15} className="text-white" />}
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
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-2xl border border-amber-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => {
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
                      <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/70">
                          {field.label} <span className="text-red-500">*</span>
                        </label>
                        {field.type === "textarea" ? (
                          <textarea {...common} rows={3} />
                        ) : (
                          <input {...common} type={field.type} />
                        )}
                        {error && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500">
                            <AlertCircle size={10} /> {error}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  data-error={errors[`tax_${TAX_INVOICE_CONTACTED_KEY}`] ? true : undefined}
                  onClick={() =>
                    update(
                      TAX_INVOICE_CONTACTED_KEY,
                      customData[TAX_INVOICE_CONTACTED_KEY] === "Ya" ? "" : "Ya"
                    )
                  }
                  className={`mt-4 flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                    customData[TAX_INVOICE_CONTACTED_KEY] === "Ya"
                      ? "border-emerald-200 bg-emerald-50"
                      : errors[`tax_${TAX_INVOICE_CONTACTED_KEY}`]
                        ? "border-red-200 bg-red-50"
                        : "border-black/[0.1] bg-[#F7F7F5] hover:bg-white"
                  }`}
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border"
                    style={{
                      borderColor: customData[TAX_INVOICE_CONTACTED_KEY] === "Ya" ? "#10B981" : "rgba(0,0,0,0.18)",
                      backgroundColor: customData[TAX_INVOICE_CONTACTED_KEY] === "Ya" ? "#10B981" : "white",
                    }}
                  >
                    {customData[TAX_INVOICE_CONTACTED_KEY] === "Ya" && <CheckCircle2 size={13} className="text-white" />}
                  </span>
                  <span>
                    <span className="block text-[0.78rem] font-extrabold text-dark">
                      Saya paham untuk tidak melakukan transfer sebelum menerima instruksi pembayaran resmi dari GRCC.
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-muted">
                      Request tetap masuk ke admin agar tim finance dapat memproses Faktur Pajak terlebih dahulu.
                    </span>
                    {errors[`tax_${TAX_INVOICE_CONTACTED_KEY}`] && (
                      <span className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-red-500">
                        <AlertCircle size={10} /> {errors[`tax_${TAX_INVOICE_CONTACTED_KEY}`]}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
