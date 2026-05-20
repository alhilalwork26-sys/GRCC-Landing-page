"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, InsightItem } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X, Check, Loader2 } from "lucide-react";

const TYPES  = ["Kegiatan", "Publikasi", "Berita"] as const;
const COLORS = ["#4F46E5","#10B981","#EF4444","#F59E0B","#8B5CF6","#0EA5E9","#F97316"];
const EMPTY: Omit<InsightItem,"id"|"created_at"> = {
  type: "Kegiatan", tag: "", title: "", excerpt: "", date: "", location: "",
  img: "", color: "#4F46E5", featured: false, published: true,
};

export default function AdminInsights() {
  const [items,   setItems]   = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("insights").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ ...EMPTY }); setEditId(null); };
  const openEdit = (item: InsightItem) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    if (editId) {
      await supabase.from("insights").update(form).eq("id", editId);
    } else {
      await supabase.from("insights").insert(form);
    }
    setSaving(false);
    setMsg(editId ? "Insight diperbarui!" : "Insight ditambahkan!");
    setTimeout(() => setMsg(""), 2500);
    closeForm();
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Hapus insight ini?")) return;
    await supabase.from("insights").delete().eq("id", id);
    load();
  };

  const toggle = async (id: string, field: "published"|"featured", val: boolean) => {
    await supabase.from("insights").update({ [field]: !val }).eq("id", id);
    load();
  };

  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Insights</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">{items.length} konten tersimpan</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl"
        >
          <Plus size={15} /> Tambah Baru
        </motion.button>
      </div>

      {/* Success msg */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4">
            <Check size={15} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-[0.82rem]">
            <thead>
              <tr className="border-b border-border bg-[#F7F7F5]">
                {["Judul","Tipe","Tanggal","Status","Aksi"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-[#F7F7F5]/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {item.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold line-clamp-1 max-w-[260px]">{item.title}</p>
                        <p className="text-muted text-[0.72rem]">{item.tag}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-bold" style={{ backgroundColor: item.color+"20", color: item.color }}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{item.date || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggle(item.id, "published", item.published)} title={item.published ? "Sembunyikan" : "Tampilkan"}>
                        {item.published
                          ? <Eye size={15} className="text-emerald-500" />
                          : <EyeOff size={15} className="text-muted" />}
                      </button>
                      <button onClick={() => toggle(item.id, "featured", item.featured)} title={item.featured ? "Unfeature" : "Jadikan featured"}>
                        <Star size={15} className={item.featured ? "text-amber-400 fill-amber-400" : "text-muted"} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-dark/[0.07] rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => del(item.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted">Belum ada konten.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {form && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }} transition={{ type:"spring", stiffness:300, damping:26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="flex items-center justify-between px-7 py-5 border-b border-border">
                  <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Insight" : "Tambah Insight"}</h2>
                  <button onClick={closeForm}><X size={18} className="text-muted hover:text-dark" /></button>
                </div>

                <div className="px-7 py-6 flex flex-col gap-4">
                  {/* Type & tag row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tipe</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as typeof form.type })} className="input">
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Tag</label>
                      <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="Workshop, Seminar…" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Judul *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Judul konten" className="input" />
                  </div>

                  <div>
                    <label className="label">Ringkasan</label>
                    <textarea rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Deskripsi singkat…" className="input resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tanggal</label>
                      <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="14 Maret 2025" className="input" />
                    </div>
                    <div>
                      <label className="label">Lokasi</label>
                      <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Surabaya / Online" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">URL Foto</label>
                    <input value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} placeholder="https://..." className="input" />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="label">Warna Aksen</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => setForm({ ...form, color: c })}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${form.color===c?"border-dark scale-110":"border-transparent"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-5">
                    {[
                      { label:"Tampilkan", key:"published" as const },
                      { label:"Featured", key:"featured" as const },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                        <div onClick={() => setForm({ ...form, [key]: !form[key] })}
                          className={`w-10 h-5 rounded-full transition-colors relative ${form[key]?"bg-dark":"bg-dark/20"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key]?"left-5":"left-0.5"}`} />
                        </div>
                        <span className="text-[0.82rem] font-semibold">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
                  <button onClick={closeForm} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06] transition-colors">Batal</button>
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                    onClick={save} disabled={saving || !form.title}
                    className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Simpan
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .label { display:block; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#888; margin-bottom:6px; }
        .input { width:100%; border:1px solid #E5E5E5; border-radius:10px; padding:9px 13px; font-size:0.85rem; outline:none; transition:border-color 0.15s; background:#FAFAFA; }
        .input:focus { border-color:#aaa; background:#fff; }
      `}</style>
    </div>
  );
}
