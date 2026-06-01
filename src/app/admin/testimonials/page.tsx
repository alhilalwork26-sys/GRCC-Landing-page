"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, TestimonialItem } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2,
  Star, MessageSquareQuote, AlertCircle, CheckCircle2, Award,
} from "lucide-react";

const EMPTY: Omit<TestimonialItem, "id" | "created_at"> = {
  name: "", position: null, company: null, content: "",
  rating: 5, avatar_url: null, training_id: null, training_name: null,
  published: true, featured: false,
};

export default function AdminTestimonials() {
  const [items,   setItems]   = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; ok: boolean } | null>(null);

  const showMsg = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ ...EMPTY }); setEditId(null); };
  const openEdit = (item: TestimonialItem) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const save = async () => {
    if (!form || !form.name || !form.content) return;
    setSaving(true);
    const { error } = editId
      ? await supabase.from("testimonials").update(form).eq("id", editId)
      : await supabase.from("testimonials").insert(form);
    setSaving(false);
    if (error) { showMsg(`Gagal: ${error.message}`, false); return; }
    showMsg(editId ? "Testimoni diperbarui!" : "Testimoni ditambahkan!");
    closeForm(); load();
  };

  const del = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  const toggleField = async (id: string, field: "published" | "featured", val: boolean) => {
    await supabase.from("testimonials").update({ [field]: !val }).eq("id", id);
    load();
  };

  const published = items.filter(i => i.published).length;
  const featured  = items.filter(i => i.featured).length;

  return (
    <div className="max-w-[820px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Testimoni Alumni</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">Kelola ulasan peserta yang tampil di homepage</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl shadow-sm">
          <Plus size={15} /> Tambah Testimoni
        </motion.button>
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total", value: items.length },
            { label: "Ditampilkan", value: published, accent: "#10B981" },
            { label: "Featured", value: featured, accent: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
              <p className="text-[1.4rem] font-black" style={{ color: s.accent ?? "#0D0D0D" }}>{s.value}</p>
              <p className="text-[0.7rem] text-muted font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-2.5 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4 ${msg.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />} {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-border p-5 animate-pulse flex gap-4">
              <div className="w-12 h-12 rounded-full bg-dark/[0.06] flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3.5 w-1/3 bg-dark/[0.07] rounded" />
                <div className="h-3 w-full bg-dark/[0.05] rounded" />
                <div className="h-3 w-4/5 bg-dark/[0.05] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, delay: idx * 0.03 }}
                className="bg-white rounded-2xl border border-border hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-stretch gap-0">
                  {/* Color bar by rating */}
                  <div className="w-1 flex-shrink-0 rounded-l-2xl"
                    style={{ backgroundColor: item.rating >= 5 ? "#10B981" : item.rating >= 4 ? "#F59E0B" : "#EF4444" }} />
                  <div className="flex-1 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-extrabold text-[0.75rem] flex-shrink-0">
                          {item.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-bold text-[0.92rem]">{item.name}</p>
                            {item.featured && (
                              <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">
                                <Award size={9} /> Featured
                              </span>
                            )}
                            {!item.published && (
                              <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Draft</span>
                            )}
                          </div>
                          {(item.position || item.company) && (
                            <p className="text-[0.74rem] text-muted mb-1.5">
                              {[item.position, item.company].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < item.rating ? "fill-amber-400 text-amber-400" : "text-dark/15"} />
                            ))}
                          </div>
                          <p className="text-[0.8rem] text-dark/60 leading-[1.65] line-clamp-2 italic">
                            &ldquo;{item.content}&rdquo;
                          </p>
                          {item.training_name && (
                            <p className="text-[0.65rem] font-semibold text-[#4F46E5] mt-1.5">📚 {item.training_name}</p>
                          )}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleField(item.id, "featured", item.featured)}
                          title={item.featured ? "Hapus dari featured" : "Set sebagai featured"}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          <Award size={15} className={item.featured ? "text-amber-500" : "text-muted"} />
                        </button>
                        <button onClick={() => toggleField(item.id, "published", item.published)}
                          title={item.published ? "Sembunyikan" : "Tampilkan"}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          {item.published ? <Eye size={15} className="text-emerald-500" /> : <EyeOff size={15} className="text-muted" />}
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="bg-white rounded-2xl border border-border py-14 text-center">
              <MessageSquareQuote size={32} className="mx-auto text-muted/30 mb-3" />
              <p className="text-muted text-[0.88rem]">Belum ada testimoni.</p>
              <button onClick={openNew} className="text-[0.85rem] font-bold text-dark underline mt-2">Tambah sekarang</button>
            </div>
          )}
        </div>
      )}

      {/* ── FORM MODAL ── */}
      <AnimatePresence>
        {form && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-border sticky top-0 bg-white z-10 rounded-t-3xl">
                  <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Testimoni" : "Tambah Testimoni"}</h2>
                  <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark/[0.07]">
                    <X size={16} className="text-muted" />
                  </button>
                </div>

                <div className="px-7 py-5 flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className="label">Nama Lengkap *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Budi Santoso" className="input" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Jabatan</label>
                      <input value={form.position ?? ""} onChange={e => setForm({ ...form, position: e.target.value || null })}
                        placeholder="Direktur Keuangan" className="input" />
                    </div>
                    <div>
                      <label className="label">Perusahaan / Instansi</label>
                      <input value={form.company ?? ""} onChange={e => setForm({ ...form, company: e.target.value || null })}
                        placeholder="PT Mitra Sejahtera" className="input" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="label">Isi Testimoni *</label>
                    <textarea rows={4} value={form.content}
                      onChange={e => setForm({ ...form, content: e.target.value })}
                      placeholder="Ceritakan pengalaman peserta mengikuti pelatihan GRCC…"
                      className="input resize-none" />
                  </div>

                  {/* Training name */}
                  <div>
                    <label className="label">Nama Pelatihan <span className="normal-case tracking-normal ml-1 opacity-60">— opsional</span></label>
                    <input value={form.training_name ?? ""} onChange={e => setForm({ ...form, training_name: e.target.value || null })}
                      placeholder="Internal Control over Financial Reporting" className="input" />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="label">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                          className="transition-transform hover:scale-125 active:scale-110">
                          <Star size={22} className={n <= form.rating ? "fill-amber-400 text-amber-400" : "text-dark/15"} />
                        </button>
                      ))}
                      <span className="text-[0.78rem] text-muted ml-1">{form.rating}/5</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col gap-3 pt-2 border-t border-border">
                    {[
                      { key: "published" as const, label: "Ditampilkan di website", color: "bg-emerald-500" },
                      { key: "featured"  as const, label: "Featured (muncul di urutan atas)", color: "bg-amber-500" },
                    ].map(({ key, label, color }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setForm({ ...form, [key]: !form[key] })}
                          className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form[key] ? color : "bg-dark/20"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key] ? "left-5" : "left-0.5"}`} />
                        </div>
                        <span className="text-[0.82rem] font-semibold">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border sticky bottom-0 bg-white rounded-b-3xl">
                  <button onClick={closeForm} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06]">
                    Batal
                  </button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={save} disabled={saving || !form.name || !form.content}
                    className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 shadow-sm">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    {saving ? "Menyimpan…" : editId ? "Perbarui" : "Tambah"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .label { display:block; font-size:0.7rem; font-weight:700; letter-spacing:0.09em; text-transform:uppercase; color:#888; margin-bottom:5px; }
        .input { width:100%; border:1px solid #E5E5E5; border-radius:10px; padding:9px 13px; font-size:0.85rem; outline:none; transition:border-color 0.15s; background:#FAFAFA; color:#0D0D0D; }
        .input:focus { border-color:#aaa; background:#fff; }
      `}</style>
    </div>
  );
}
