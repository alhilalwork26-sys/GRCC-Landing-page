"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, ComingSoonPost } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2,
  CheckCircle2, AlertCircle, Clock,
} from "lucide-react";

const COLORS = ["#4F46E5", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#0EA5E9", "#F97316", "#EC4899"];

const EMPTY: Omit<ComingSoonPost, "id" | "created_at"> = {
  title: "",
  subtitle: "",
  category: "",
  color: "#4F46E5",
  visible: true,
  expected_date: "",
};

export default function AdminComingSoon() {
  const [items,   setItems]   = useState<ComingSoonPost[]>([]);
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
    const { data, error } = await supabase
      .from("coming_soon_posts").select("*").order("created_at", { ascending: false });
    if (error) { showMsg(`Gagal memuat: ${error.message}`, false); setItems([]); }
    else setItems(data ?? []);
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ ...EMPTY }); setEditId(null); };
  const openEdit = (item: ComingSoonPost) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const payload = {
      ...form,
      subtitle:      form.subtitle      || null,
      category:      form.category      || null,
      expected_date: form.expected_date || null,
    };
    const { error } = editId
      ? await supabase.from("coming_soon_posts").update(payload).eq("id", editId)
      : await supabase.from("coming_soon_posts").insert(payload);
    setSaving(false);
    if (error) { showMsg(`Gagal menyimpan: ${error.message}`, false); return; }
    showMsg(editId ? "Berhasil diperbarui!" : "Coming soon ditambahkan!");
    closeForm(); load();
  };

  const del = async (id: string) => {
    if (!confirm("Hapus post ini?")) return;
    const { error } = await supabase.from("coming_soon_posts").delete().eq("id", id);
    if (error) { showMsg(`Gagal hapus: ${error.message}`, false); return; }
    load();
  };

  const toggleVisible = async (id: string, cur: boolean) => {
    const { error } = await supabase.from("coming_soon_posts").update({ visible: !cur }).eq("id", id);
    if (error) { showMsg(`Gagal: ${error.message}`, false); return; }
    load();
  };

  const visible = items.filter(i => i.visible).length;

  return (
    <div className="max-w-[900px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Coming Soon</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">Tampilkan teaser pelatihan yang akan datang di halaman utama</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl shadow-sm">
          <Plus size={15} /> Tambah Coming Soon
        </motion.button>
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Post",  value: items.length },
            { label: "Ditampilkan", value: visible,            accent: "#10B981" },
            { label: "Disembunyikan", value: items.length - visible, accent: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
              <span className="text-[1.45rem] font-black tracking-tight block" style={{ color: s.accent ?? "#0D0D0D" }}>{s.value}</span>
              <span className="text-[0.7rem] text-muted font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2.5 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4 ${msg.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />} {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-border p-4 animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-dark/[0.06] flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2 py-1">
                <div className="h-3.5 w-2/3 bg-dark/[0.07] rounded-full" />
                <div className="h-2.5 w-1/2 bg-dark/[0.05] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="bg-white rounded-2xl border border-border hover:shadow-md transition-all overflow-hidden group">

                <div className="flex items-stretch">
                  {/* Color bar */}
                  <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: item.color }} />

                  {/* Color swatch */}
                  <div className="w-16 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: item.color + "12" }}>
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: item.color + "30" }}>
                      <div className="w-full h-full flex items-center justify-center">
                        <Clock size={14} style={{ color: item.color }} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-4 py-3 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-bold text-[0.92rem] truncate">{item.title}</p>
                          {!item.visible && (
                            <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
                              Tersembunyi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[0.72rem] text-muted flex-wrap">
                          {item.category && (
                            <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold"
                              style={{ backgroundColor: item.color + "15", color: item.color }}>
                              {item.category}
                            </span>
                          )}
                          {item.expected_date && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> {item.expected_date}
                            </span>
                          )}
                          {item.subtitle && (
                            <span className="truncate max-w-[280px] text-muted italic">{item.subtitle}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleVisible(item.id, item.visible)}
                          title={item.visible ? "Sembunyikan" : "Tampilkan"}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          {item.visible
                            ? <Eye size={15} className="text-emerald-500" />
                            : <EyeOff size={15} className="text-muted" />}
                        </button>
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => del(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
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
            <div className="bg-white rounded-2xl border border-border py-16 text-center">
              <p className="text-muted text-[0.88rem] mb-2">Belum ada coming soon post.</p>
              <button onClick={openNew} className="text-[0.85rem] font-bold text-dark underline">
                Tambah sekarang
              </button>
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
              exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[520px] pointer-events-auto flex flex-col">

                {/* Modal header */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-border">
                  <div>
                    <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Coming Soon" : "Coming Soon Baru"}</h2>
                    <p className="text-[0.72rem] text-muted mt-0.5">Teaser pelatihan yang belum dibuka pendaftarannya</p>
                  </div>
                  <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark/[0.07] transition-colors">
                    <X size={16} className="text-muted" />
                  </button>
                </div>

                <div className="px-7 py-5 flex flex-col gap-4">
                  {/* Preview mini card */}
                  <div className="rounded-2xl overflow-hidden border border-border"
                    style={{ background: `linear-gradient(135deg, ${form.color}10 0%, ${form.color}05 100%)` }}>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[0.6rem] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: form.color }}>
                          Segera Hadir
                        </span>
                        {form.category && (
                          <span className="text-[0.62rem] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: form.color + "20", color: form.color }}>
                            {form.category}
                          </span>
                        )}
                      </div>
                      <p className="font-extrabold text-[0.95rem] leading-tight text-dark">
                        {form.title || "Judul pelatihan..."}
                      </p>
                      {form.subtitle && (
                        <p className="text-[0.75rem] text-muted mt-1 leading-relaxed">{form.subtitle}</p>
                      )}
                      {form.expected_date && (
                        <p className="text-[0.7rem] font-semibold mt-2 flex items-center gap-1" style={{ color: form.color }}>
                          <Clock size={11} /> {form.expected_date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fields */}
                  <div>
                    <p className="label">Judul *</p>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Nama pelatihan yang akan datang" className="input" />
                  </div>
                  <div>
                    <p className="label">Subtitle / Deskripsi Singkat</p>
                    <textarea rows={2} value={form.subtitle ?? ""} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                      placeholder="Deskripsi singkat yang menarik minat calon peserta"
                      className="input resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="label">Kategori / Tag</p>
                      <input value={form.category ?? ""} onChange={e => setForm({ ...form, category: e.target.value })}
                        placeholder="GRC, ESG, Audit…" className="input" />
                    </div>
                    <div>
                      <p className="label">Perkiraan Waktu</p>
                      <input value={form.expected_date ?? ""} onChange={e => setForm({ ...form, expected_date: e.target.value })}
                        placeholder="Agustus 2026" className="input" />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <p className="label">Warna Kartu</p>
                    <div className="flex gap-2">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => setForm({ ...form, color: c })}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${form.color === c ? "border-dark scale-110 shadow-sm" : "border-transparent"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Visibility toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm({ ...form, visible: !form.visible })}
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form.visible ? "bg-emerald-500" : "bg-dark/20"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.visible ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-[0.82rem] font-semibold">
                      {form.visible ? "Ditampilkan di website" : "Disembunyikan"}
                    </span>
                  </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
                  <button onClick={closeForm}
                    className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06] transition-colors">
                    Batal
                  </button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={save} disabled={saving || !form.title}
                    className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 shadow-sm">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    {saving ? "Menyimpan…" : (editId ? "Perbarui" : "Tambah")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .label{display:block;font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:#888;margin-bottom:5px;}
        .input{width:100%;border:1px solid #E5E5E5;border-radius:10px;padding:9px 13px;font-size:0.85rem;outline:none;transition:border-color 0.15s;background:#FAFAFA;color:#0D0D0D;}
        .input:focus{border-color:#aaa;background:#fff;}
      `}</style>
    </div>
  );
}
