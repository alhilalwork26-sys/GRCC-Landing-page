"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, PromoCode } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, X, Check, Loader2,
  Tag, Percent, BadgeDollarSign, Users2, Calendar,
  ToggleLeft, ToggleRight, Copy, CheckCheck, User, Users,
  BookOpen, ChevronDown,
} from "lucide-react";
import { TrainingItem, ComingSoonPost } from "@/lib/supabase";

const EMPTY: Omit<PromoCode, "id" | "created_at" | "used_count"> = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  min_price: 0,
  max_uses: null,
  active: true,
  expires_at: null,
  promo_type: "semua",
  training_ids: null,
};

const PROMO_TYPE_CONFIG = {
  semua:    { label: "Semua",    desc: "Berlaku untuk individu & grup", color: "#4F46E5", bg: "#EEF2FF", icon: Users2  },
  individu: { label: "Individu", desc: "Hanya pendaftaran individu",    color: "#0EA5E9", bg: "#E0F2FE", icon: User    },
  grup:     { label: "Grup",     desc: "Hanya pendaftaran grup",        color: "#8B5CF6", bg: "#F3E8FF", icon: Users   },
} as const;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function isExpired(expires_at: string | null) {
  if (!expires_at) return false;
  return new Date(expires_at) < new Date();
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="ml-1 p-1 rounded hover:bg-dark/[0.07] transition-colors text-muted"
      title="Salin kode"
    >
      {copied ? <CheckCheck size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────
function PromoForm({
  initial, onSave, onClose, saving, trainings, comingSoon,
}: {
  initial: typeof EMPTY & { id?: string };
  onSave: (data: typeof EMPTY) => void;
  onClose: () => void;
  saving: boolean;
  trainings: Pick<TrainingItem, "id" | "title">[];
  comingSoon: Pick<ComingSoonPost, "id" | "title">[];
}) {
  const [form, setForm] = useState<typeof EMPTY>({ ...initial });
  const [showTrainingPicker, setShowTrainingPicker] = useState(false);
  const isEdit = !!initial.id;

  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const toggleTraining = (id: string) => {
    const current = form.training_ids ?? [];
    const next = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    set({ training_ids: next.length > 0 ? next : null });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-border">
            <h2 className="font-extrabold text-[1.05rem]">
              {isEdit ? "Edit Kode Promo" : "Tambah Kode Promo"}
            </h2>
            <button onClick={onClose}><X size={18} className="text-muted hover:text-dark" /></button>
          </div>

          <div className="px-7 py-6 flex flex-col gap-5">
            {/* Code */}
            <div>
              <label className="label">Kode Promo *</label>
              <input
                value={form.code}
                onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/\s/g, "") })}
                placeholder="GRCC25 / EARLYBIRD / DISKON50"
                className="input font-bold tracking-widest"
              />
              <p className="text-[0.7rem] text-muted mt-1">Hanya huruf kapital, angka, dan tanda strip. Tanpa spasi.</p>
            </div>

            {/* Description */}
            <div>
              <label className="label">Deskripsi</label>
              <input
                value={form.description ?? ""}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Early bird batch 1, Kemitraan BUMN, dll."
                className="input"
              />
            </div>

            {/* Promo type */}
            <div>
              <label className="label">Berlaku Untuk *</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(PROMO_TYPE_CONFIG) as [PromoCode["promo_type"], typeof PROMO_TYPE_CONFIG[keyof typeof PROMO_TYPE_CONFIG]][]).map(([val, cfg]) => {
                  const Icon = cfg.icon;
                  const active = form.promo_type === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set({ promo_type: val })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                        active ? "border-transparent shadow-sm" : "border-[#E5E5E5] bg-white hover:border-dark/20"
                      }`}
                      style={active ? { backgroundColor: cfg.bg, borderColor: cfg.color + "50" } : {}}
                    >
                      <Icon size={16} style={{ color: active ? cfg.color : "#888" }} />
                      <p className="text-[0.78rem] font-bold" style={{ color: active ? cfg.color : "#333" }}>{cfg.label}</p>
                      <p className="text-[0.64rem] leading-tight" style={{ color: active ? cfg.color + "bb" : "#999" }}>{cfg.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discount type + value */}
            <div>
              <label className="label">Jenis & Nilai Diskon *</label>
              <div className="flex gap-3">
                <div className="flex rounded-xl border border-border overflow-hidden flex-shrink-0">
                  {(["percentage", "fixed"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => set({ discount_type: t })}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[0.78rem] font-bold transition-all ${
                        form.discount_type === t
                          ? "bg-dark text-white"
                          : "bg-white text-muted hover:text-dark"
                      }`}
                    >
                      {t === "percentage" ? <Percent size={13} /> : <BadgeDollarSign size={13} />}
                      {t === "percentage" ? "Persen (%)" : "Nominal (Rp)"}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    max={form.discount_type === "percentage" ? 100 : undefined}
                    value={form.discount_value}
                    onChange={(e) => set({ discount_value: Math.max(1, +e.target.value) })}
                    className="input pr-14 text-[1rem] font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-[0.82rem] font-semibold pointer-events-none">
                    {form.discount_type === "percentage" ? "%" : "Rp"}
                  </span>
                </div>
              </div>
              {form.discount_type === "percentage" && form.discount_value > 100 && (
                <p className="text-[0.72rem] text-red-500 mt-1">Maksimum 100%</p>
              )}
            </div>

            {/* Min price + Max uses */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Harga Minimum (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={form.min_price}
                  onChange={(e) => set({ min_price: +e.target.value || 0 })}
                  placeholder="0 = tanpa batas minimum"
                  className="input"
                />
                <p className="text-[0.68rem] text-muted mt-1">Kode berlaku jika harga ≥ nilai ini</p>
              </div>
              <div>
                <label className="label">Maks. Penggunaan</label>
                <input
                  type="number"
                  min={1}
                  value={form.max_uses ?? ""}
                  onChange={(e) => set({ max_uses: e.target.value ? +e.target.value : null })}
                  placeholder="Kosongkan = tak terbatas"
                  className="input"
                />
                <p className="text-[0.68rem] text-muted mt-1">Kosong = unlimited</p>
              </div>
            </div>

            {/* Expires at */}
            <div>
              <label className="label">Berlaku Hingga</label>
              <input
                type="datetime-local"
                value={form.expires_at ? form.expires_at.slice(0, 16) : ""}
                onChange={(e) =>
                  set({ expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
                className="input"
              />
              <p className="text-[0.68rem] text-muted mt-1">Kosong = tidak ada kadaluarsa</p>
            </div>

            {/* Training restriction */}
            <div>
              <label className="label">Berlaku untuk Pelatihan</label>
              <button
                type="button"
                onClick={() => setShowTrainingPicker((v) => !v)}
                className="input flex items-center justify-between text-left"
              >
                <span className={form.training_ids ? "text-dark font-semibold" : "text-muted"}>
                  {form.training_ids
                    ? `${form.training_ids.length} pelatihan dipilih`
                    : "Semua pelatihan (tidak dibatasi)"}
                </span>
                <ChevronDown size={14} className={`text-muted transition-transform ${showTrainingPicker ? "rotate-180" : ""}`} />
              </button>
              {showTrainingPicker && (
                <div className="mt-2 rounded-xl border border-border bg-white overflow-hidden max-h-52 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => set({ training_ids: null })}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-[0.8rem] border-b border-border hover:bg-[#F7F7F5] transition-colors ${
                      !form.training_ids ? "font-bold text-dark" : "text-muted"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${!form.training_ids ? "bg-dark border-dark" : "border-gray-300"}`}>
                      {!form.training_ids && <Check size={10} className="text-white" />}
                    </div>
                    Semua pelatihan
                  </button>
                  {trainings.length > 0 && (
                    <p className="px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted bg-[#F7F7F5] border-b border-border">
                      Pelatihan Terpublikasi
                    </p>
                  )}
                  {trainings.map((t) => {
                    const selected = (form.training_ids ?? []).includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTraining(t.id)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[0.8rem] border-b border-border hover:bg-[#F7F7F5] transition-colors text-left"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? "bg-dark border-dark" : "border-gray-300"}`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className={selected ? "font-semibold text-dark" : "text-muted"}>{t.title}</span>
                      </button>
                    );
                  })}
                  {comingSoon.length > 0 && (
                    <p className="px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border-b border-border">
                      Segera Hadir
                    </p>
                  )}
                  {comingSoon.map((t) => {
                    const selected = (form.training_ids ?? []).includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTraining(t.id)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[0.8rem] border-b border-border last:border-0 hover:bg-[#F7F7F5] transition-colors text-left"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? "bg-amber-500 border-amber-500" : "border-gray-300"}`}>
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className={selected ? "font-semibold text-amber-700" : "text-muted"}>{t.title}</span>
                      </button>
                    );
                  })}
                  {trainings.length === 0 && comingSoon.length === 0 && (
                    <p className="px-4 py-3 text-[0.78rem] text-muted">Belum ada pelatihan.</p>
                  )}
                </div>
              )}
              <p className="text-[0.68rem] text-muted mt-1">Kosong = berlaku untuk semua pelatihan</p>
            </div>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set({ active: !form.active })}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.active ? "bg-emerald-500" : "bg-dark/20"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-6" : "left-1"}`} />
              </div>
              <div>
                <p className="text-[0.85rem] font-bold">{form.active ? "Aktif" : "Nonaktif"}</p>
                <p className="text-[0.72rem] text-muted">Kode hanya bisa digunakan jika aktif</p>
              </div>
            </label>

            {/* Preview */}
            {form.code && form.discount_value > 0 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-[0.72rem] font-bold text-emerald-700 uppercase tracking-widest mb-1">Preview</p>
                <p className="text-[0.88rem] text-emerald-800">
                  Kode <strong>{form.code}</strong> memberikan diskon{" "}
                  {form.discount_type === "percentage"
                    ? `${form.discount_value}%`
                    : formatRupiah(form.discount_value)}
                  {" "}untuk pendaftaran <strong>{PROMO_TYPE_CONFIG[form.promo_type].label.toLowerCase()}</strong>
                  {form.min_price > 0 && `, minimal ${formatRupiah(form.min_price)}`}
                  {form.max_uses && `, maks. ${form.max_uses}x`}
                  {form.expires_at && `, s.d. ${new Date(form.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                  {form.training_ids && form.training_ids.length > 0 && `. Hanya untuk ${form.training_ids.length} pelatihan tertentu`}.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
            <button onClick={onClose} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06]">
              Batal
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => onSave(form)}
              disabled={saving || !form.code || form.discount_value <= 0 || (form.discount_type === "percentage" && form.discount_value > 100)}
              className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Simpan
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPromoCodes() {
  const [items, setItems] = useState<PromoCode[]>([]);
  const [trainings, setTrainings] = useState<Pick<TrainingItem, "id" | "title">[]>([]);
  const [comingSoon, setComingSoon] = useState<Pick<ComingSoonPost, "id" | "title">[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<(typeof EMPTY & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "individu" | "grup">("semua");

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: promos }, { data: trns }, { data: cs }] = await Promise.all([
      supabase.from("promo_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("training").select("id, title").eq("published", true).order("date_start", { ascending: true }),
      supabase.from("coming_soon_posts").select("id, title").eq("visible", true).order("created_at", { ascending: true }),
    ]);
    setItems(promos ?? []);
    setTrainings(trns ?? []);
    setComingSoon(cs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setFormData({ ...EMPTY });
  const openEdit = (item: PromoCode) => {
    const { id, created_at, used_count, ...rest } = item;
    setFormData({ ...rest, id });
  };

  const save = async (data: typeof EMPTY) => {
    setSaving(true);
    const id = formData?.id;
    if (id) {
      await supabase.from("promo_codes").update(data).eq("id", id);
    } else {
      await supabase.from("promo_codes").insert({ ...data, used_count: 0 });
    }
    setSaving(false);
    setMsg(id ? "Kode promo diperbarui!" : "Kode promo ditambahkan!");
    setTimeout(() => setMsg(""), 2500);
    setFormData(null);
    load();
  };

  const del = async (id: string, code: string) => {
    if (!confirm(`Hapus kode "${code}"?`)) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("promo_codes").update({ active: !active }).eq("id", id);
    load();
  };

  const activeCount = items.filter((i) => i.active && !isExpired(i.expires_at)).length;
  const filteredItems = filterType === "semua"
    ? items
    : items.filter((i) => (i.promo_type ?? "semua") === filterType);

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Kode Promo</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">
            {items.length} kode tersimpan · {activeCount} aktif
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl"
        >
          <Plus size={15} /> Tambah Kode
        </motion.button>
      </div>

      {/* Success msg */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4"
          >
            <Check size={15} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type filter tabs */}
      {!loading && items.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-[#F7F7F5] rounded-xl border border-border mb-4 w-fit">
          {(["semua", "individu", "grup"] as const).map((t) => {
            const cfg = PROMO_TYPE_CONFIG[t];
            const Icon = cfg.icon;
            const count = t === "semua" ? items.length : items.filter((i) => (i.promo_type ?? "semua") === t).length;
            const active = filterType === t;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[0.78rem] font-semibold transition-all ${
                  active ? "bg-white shadow-sm border border-border" : "text-muted hover:text-dark"
                }`}
                style={active ? { color: cfg.color } : {}}
              >
                <Icon size={12} />
                {cfg.label}
                <span className={`text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "" : "bg-dark/[0.07] text-muted"
                }`}
                  style={active ? { backgroundColor: cfg.bg, color: cfg.color } : {}}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted text-[0.88rem]">
          Belum ada kode promo.{" "}
          <button onClick={openNew} className="font-bold underline">Tambah sekarang</button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border py-12 text-center text-muted text-[0.88rem]">
          Tidak ada kode promo untuk tipe <strong>{PROMO_TYPE_CONFIG[filterType].label}</strong>.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item, i) => {
            const expired = isExpired(item.expires_at);
            const exhausted = item.max_uses !== null && item.used_count >= item.max_uses;
            const statusOk = item.active && !expired && !exhausted;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Color bar */}
                  <div
                    className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: statusOk ? "#10B981" : "#D1D5DB" }}
                  />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-[1.1rem] tracking-widest font-mono">
                        {item.code}
                      </span>
                      <CopyCode code={item.code} />
                      {/* Promo type badge */}
                      {(() => {
                        const tc = PROMO_TYPE_CONFIG[item.promo_type ?? "semua"];
                        const TIcon = tc.icon;
                        return (
                          <span
                            className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ backgroundColor: tc.bg, color: tc.color }}
                          >
                            <TIcon size={9} /> {tc.label}
                          </span>
                        );
                      })()}
                      {/* Status badges */}
                      {!item.active && (
                        <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                          Nonaktif
                        </span>
                      )}
                      {expired && (
                        <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-500 uppercase tracking-wide">
                          Kadaluarsa
                        </span>
                      )}
                      {exhausted && (
                        <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-500 uppercase tracking-wide">
                          Habis
                        </span>
                      )}
                      {statusOk && (
                        <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 uppercase tracking-wide">
                          Aktif
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[0.78rem] text-muted mt-0.5">{item.description}</p>
                    )}

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-3 mt-2.5">
                      <div className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-dark">
                        {item.discount_type === "percentage"
                          ? <><Percent size={12} className="text-indigo-500" /> {item.discount_value}% diskon</>
                          : <><BadgeDollarSign size={12} className="text-indigo-500" /> {formatRupiah(item.discount_value)} diskon</>
                        }
                      </div>
                      {item.min_price > 0 && (
                        <div className="flex items-center gap-1.5 text-[0.75rem] text-muted">
                          <Tag size={11} /> min. {formatRupiah(item.min_price)}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[0.75rem] text-muted">
                        <Users2 size={11} />
                        {item.used_count}
                        {item.max_uses !== null ? ` / ${item.max_uses}` : ""} penggunaan
                      </div>
                      {item.expires_at && (
                        <div className={`flex items-center gap-1.5 text-[0.75rem] ${expired ? "text-red-400" : "text-muted"}`}>
                          <Calendar size={11} />
                          s.d. {new Date(item.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      )}
                      {item.training_ids && item.training_ids.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[0.75rem] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                          <BookOpen size={10} />
                          {item.training_ids.length === 1
                            ? trainings.find((t) => t.id === item.training_ids![0])?.title ?? "1 pelatihan"
                            : `${item.training_ids.length} pelatihan`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggle(item.id, item.active)}
                      className="p-1.5 hover:bg-dark/[0.07] rounded-lg transition-colors"
                      title={item.active ? "Nonaktifkan" : "Aktifkan"}
                    >
                      {item.active
                        ? <ToggleRight size={18} className="text-emerald-500" />
                        : <ToggleLeft size={18} className="text-muted" />
                      }
                    </button>
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-dark/[0.07] rounded-lg">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => del(item.id, item.code)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {formData && (
          <PromoForm
            initial={formData}
            onSave={save}
            onClose={() => setFormData(null)}
            saving={saving}
            trainings={trainings}
            comingSoon={comingSoon}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .label{display:block;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:6px;}
        .input{width:100%;border:1px solid #E5E5E5;border-radius:10px;padding:9px 13px;font-size:0.85rem;outline:none;transition:border-color 0.15s;background:#FAFAFA;}
        .input:focus{border-color:#aaa;background:#fff;}
      `}</style>
    </div>
  );
}
