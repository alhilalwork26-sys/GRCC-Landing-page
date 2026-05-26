"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, InsightItem } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X, Check, Loader2, Upload, Image as ImageIcon, Layout, Hash } from "lucide-react";

// ── Inline preview helpers (mirrors detail page) ──────────────────────────────
function renderPreview(raw: string) {
  if (!raw) return <p className="text-muted text-[0.88rem] py-6 text-center">Belum ada isi artikel.</p>;
  return raw.split(/\n{2,}/).map((block, i) => {
    const lines = block.trim().split("\n");
    if (lines.length === 1 && lines[0].startsWith("## ")) return <h2 key={i} className="text-[1.3rem] font-extrabold text-dark mt-8 mb-3 leading-[1.2]">{lines[0].slice(3)}</h2>;
    if (lines.length === 1 && lines[0].startsWith("### ")) return <h3 key={i} className="text-[1.05rem] font-bold text-dark mt-6 mb-2">{lines[0].slice(4)}</h3>;
    if (lines.every(l => l.startsWith("- "))) return (
      <ul key={i} className="my-4 space-y-2">
        {lines.map((l, j) => <li key={j} className="flex items-start gap-2.5 text-[0.88rem] text-dark/70 leading-[1.8]"><span className="mt-[0.65em] w-1.5 h-1.5 rounded-full bg-dark/35 flex-shrink-0" />{l.slice(2)}</li>)}
      </ul>
    );
    if (lines.every(l => l.startsWith("> "))) return <blockquote key={i} className="my-5 pl-4 border-l-[3px] border-dark/20 text-[0.9rem] text-dark/55 italic">{lines.map(l => l.slice(2)).join(" ")}</blockquote>;
    return <p key={i} className="text-[0.9rem] text-dark/68 leading-[1.85] my-4">{lines.join(" ")}</p>;
  });
}

const TYPES  = ["Kegiatan", "Publikasi", "Berita"] as const;
const COLORS = ["#4F46E5","#10B981","#EF4444","#F59E0B","#8B5CF6","#0EA5E9","#F97316"];
const EMPTY: Omit<InsightItem,"id"|"created_at"> = {
  type: "Kegiatan", tag: "", title: "", excerpt: "", content: "", date: "", location: "",
  img: "", color: "#4F46E5", featured: false, published: true, view_count: 0,
};

export default function AdminInsights() {
  const [items,   setItems]   = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(false);
  const [msg,     setMsg]     = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("insights").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const [dirty, setDirty] = useState(false);

  const openNew  = () => { setForm({ ...EMPTY }); setEditId(null); setPreview(false); setUploadError(""); setDragOver(false); setDirty(false); };
  const openEdit = (item: InsightItem) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id); setPreview(false); setUploadError(""); setDragOver(false); setDirty(false);
  };
  const closeForm = (force = false) => {
    if (!force && dirty && !confirm("Ada perubahan yang belum disimpan. Tutup?")) return;
    setForm(null); setEditId(null); setPreview(false); setUploadError(""); setDragOver(false); setDirty(false);
  };

  // Delete image file from Storage (best-effort, ignore errors)
  const deleteStorageImage = async (url: string) => {
    if (!url || !url.includes("insight-images")) return;
    try {
      const path = url.split("/insight-images/")[1]?.split("?")[0];
      if (path) await supabase.storage.from("insight-images").remove([path]);
    } catch { /* ignore */ }
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    if (editId) {
      // If image was removed, delete old file from storage
      const old = items.find(i => i.id === editId);
      if (old?.img && old.img !== form.img) await deleteStorageImage(old.img);
      await supabase.from("insights").update(form).eq("id", editId);
    } else {
      await supabase.from("insights").insert(form);
    }
    setSaving(false);
    setMsg(editId ? "Insight diperbarui!" : "Insight ditambahkan!");
    setTimeout(() => setMsg(""), 2500);
    closeForm(true);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Hapus insight ini?")) return;
    const item = items.find(i => i.id === id);
    if (item?.img) await deleteStorageImage(item.img);
    await supabase.from("insights").delete().eq("id", id);
    load();
  };

  const toggle = async (id: string, field: "published"|"featured", val: boolean) => {
    if (field === "featured" && !val) {
      // Hanya satu Sorotan Utama — unfeature semua dulu, lalu set yang dipilih
      await supabase.from("insights").update({ featured: false }).neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("insights").update({ featured: true }).eq("id", id);
    } else {
      await supabase.from("insights").update({ [field]: !val }).eq("id", id);
    }
    load();
  };

  const uploadImage = async (file: File) => {
    if (!form) return;
    setUploadError("");
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Format foto harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Ukuran foto maksimal 15MB.");
      return;
    }

    setUploadingImage(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("insight-images")
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
    setUploadingImage(false);

    if (error) {
      setUploadError(`Gagal upload: ${error.message}`);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("insight-images").getPublicUrl(data.path);
    setForm((current) => current ? { ...current, img: publicUrl.publicUrl } : current);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
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
                {["Judul","Tipe","Tanggal","Views","Tampil / Sorotan","Aksi"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[0.72rem] font-bold tracking-wider uppercase text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-[#F7F7F5]/60 transition-colors ${item.featured ? "bg-amber-50/40" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {item.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold line-clamp-1 max-w-[220px]">{item.title}</p>
                          {item.featured && (
                            <span className="flex-shrink-0 text-[0.58rem] font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                              Sorotan Utama
                            </span>
                          )}
                        </div>
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
                    <span className="flex items-center gap-1 text-muted text-[0.78rem]">
                      <Hash size={10} />{item.view_count ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggle(item.id, "published", item.published)} title={item.published ? "Sembunyikan" : "Tampilkan"}>
                        {item.published
                          ? <Eye size={15} className="text-emerald-500" />
                          : <EyeOff size={15} className="text-muted" />}
                      </button>
                      <button
                        onClick={() => toggle(item.id, "featured", item.featured)}
                        title={item.featured ? "Hapus dari Sorotan Utama" : "Jadikan Sorotan Utama di halaman Insights"}
                        className={`p-1 rounded-lg transition-colors ${item.featured ? "hover:bg-amber-100" : "hover:bg-dark/[0.06]"}`}
                      >
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
                <tr><td colSpan={6} className="text-center py-12 text-muted">Belum ada konten.</td></tr>
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => closeForm()} />
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }} transition={{ type:"spring", stiffness:300, damping:26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="flex items-center justify-between px-7 py-4 border-b border-border">
                  <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Insight" : "Tambah Insight"}</h2>
                  <div className="flex items-center gap-2">
                    {/* Preview / Edit toggle */}
                    <div className="flex items-center bg-dark/[0.06] rounded-xl p-1 gap-0.5">
                      {[
                        { label: "Edit", icon: <Pencil size={11} />, val: false },
                        { label: "Preview", icon: <Layout size={11} />, val: true },
                      ].map(({ label, icon, val }) => (
                        <button key={label} onClick={() => setPreview(val)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] font-bold transition-all ${preview === val ? "bg-white shadow text-dark" : "text-muted hover:text-dark"}`}>
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => closeForm()}><X size={18} className="text-muted hover:text-dark" /></button>
                  </div>
                </div>

                {/* ── Preview panel ── */}
                {preview && (
                  <div className="px-7 py-6">
                    {/* Mini hero */}
                    {form.img && (
                      <div className="relative h-[200px] rounded-2xl overflow-hidden mb-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[0.58rem] font-extrabold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: form.color }}>{form.tag || "Tag"}</span>
                            <span className="text-[0.6rem] font-semibold text-white/55 bg-white/15 px-2 py-1 rounded-full">{form.type}</span>
                          </div>
                          <p className="text-white font-extrabold text-[1.1rem] leading-[1.2]">{form.title || "Judul artikel"}</p>
                        </div>
                      </div>
                    )}
                    {!form.img && (
                      <div className="rounded-2xl border-2 border-dashed border-dark/15 bg-dark/[0.03] h-[120px] flex items-center justify-center mb-6">
                        <p className="text-muted text-[0.82rem]">Belum ada foto hero</p>
                      </div>
                    )}
                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-wrap mb-5 pb-5 border-b border-border">
                      {form.date     && <span className="text-[0.72rem] text-muted">📅 {form.date}</span>}
                      {form.location && <span className="text-[0.72rem] text-muted">📍 {form.location}</span>}
                    </div>
                    {/* Excerpt */}
                    {form.excerpt && <p className="text-[0.9rem] text-dark/55 italic leading-[1.85] mb-5 pb-5 border-b border-border">{form.excerpt}</p>}
                    {/* Content */}
                    <div>{renderPreview(form.content)}</div>
                  </div>
                )}

                <div className={`px-7 py-6 flex flex-col gap-4 ${preview ? "hidden" : ""}`}>
                  {/* Type & tag row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tipe</label>
                      <select value={form.type} onChange={e => { setForm({ ...form, type: e.target.value as typeof form.type }); setDirty(true); }} className="input">
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Tag</label>
                      <input value={form.tag} onChange={e => { setForm({ ...form, tag: e.target.value }); setDirty(true); }} placeholder="Workshop, Seminar…" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Judul *</label>
                    <input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value }); setDirty(true); }} placeholder="Judul konten" className="input" />
                  </div>

                  <div>
                    <label className="label">Ringkasan</label>
                    <textarea rows={3} value={form.excerpt} onChange={e => { setForm({ ...form, excerpt: e.target.value }); setDirty(true); }} placeholder="Deskripsi singkat…" className="input resize-none" />
                  </div>

                  <div>
                    <label className="label">Isi Artikel</label>
                    <p className="text-[0.7rem] text-muted mb-2">Gunakan baris kosong untuk paragraf baru. Ketik ## Judul untuk heading, - item untuk poin.</p>
                    <textarea rows={12} value={form.content} onChange={e => { setForm({ ...form, content: e.target.value }); setDirty(true); }}
                      placeholder={`## Pendahuluan\n\nTulis isi artikel di sini...\n\n## Poin Utama\n\n- Item pertama\n- Item kedua`}
                      className="input font-mono text-[0.8rem]" style={{ resize: "vertical", minHeight: 200 }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tanggal</label>
                      <input value={form.date} onChange={e => { setForm({ ...form, date: e.target.value }); setDirty(true); }} placeholder="14 Maret 2025" className="input" />
                    </div>
                    <div>
                      <label className="label">Lokasi</label>
                      <input value={form.location} onChange={e => { setForm({ ...form, location: e.target.value }); setDirty(true); }} placeholder="Surabaya / Online" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Foto Artikel</label>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file);
                        e.currentTarget.value = "";
                      }}
                    />

                    {form.img ? (
                      /* ── Has image ── */
                      <div className="rounded-2xl border border-border overflow-hidden">
                        <div className="relative aspect-[16/9] bg-white group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={form.img} alt="Preview foto artikel" className="w-full h-full object-cover" />
                          {/* Hover overlay */}
                          <div
                            onClick={() => imageInputRef.current?.click()}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center cursor-pointer"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-dark text-[0.75rem] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <Upload size={13} /> Ganti Foto
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setForm({ ...form, img: "" }); setUploadError(""); setDirty(true); }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                            title="Hapus foto"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border-t border-emerald-100">
                          <Check size={13} className="text-emerald-600 flex-shrink-0" />
                          <p className="text-[0.72rem] font-semibold text-emerald-700 truncate flex-1">Foto berhasil diupload</p>
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="flex items-center gap-1.5 text-[0.72rem] font-bold text-emerald-700 hover:text-emerald-900 transition-colors disabled:opacity-50"
                          >
                            {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            Ganti
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── No image — full clickable + droppable area ── */
                      <div
                        onClick={() => !uploadingImage && imageInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
                          dragOver
                            ? "border-dark bg-dark/[0.04] scale-[1.01]"
                            : "border-border bg-[#F7F7F5] hover:border-dark/40 hover:bg-dark/[0.02]"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center text-center px-6 py-10">
                          {uploadingImage ? (
                            <>
                              <Loader2 size={32} className="text-dark/40 animate-spin mb-3" />
                              <p className="text-[0.82rem] font-bold">Mengupload foto…</p>
                            </>
                          ) : (
                            <>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragOver ? "bg-dark text-white" : "bg-white border border-border text-muted"}`}>
                                {dragOver ? <Upload size={22} /> : <ImageIcon size={22} />}
                              </div>
                              <p className="text-[0.85rem] font-bold mb-1">
                                {dragOver ? "Lepaskan untuk upload" : "Klik atau seret foto ke sini"}
                              </p>
                              <p className="text-[0.72rem] text-muted">JPG, PNG, atau WebP · Maks. 15MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload error */}
                    {uploadError && (
                      <div className="flex items-center gap-2 mt-2 text-[0.75rem] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <X size={13} className="flex-shrink-0" />
                        {uploadError}
                        <button onClick={() => setUploadError("")} className="ml-auto text-red-400 hover:text-red-600"><X size={12} /></button>
                      </div>
                    )}
                  </div>

                  {/* Color */}
                  <div>
                    <label className="label">Warna Aksen</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => { setForm({ ...form, color: c }); setDirty(true); }}
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
                        <div onClick={() => { setForm({ ...form, [key]: !form[key] }); setDirty(true); }}
                          className={`w-10 h-5 rounded-full transition-colors relative ${form[key]?"bg-dark":"bg-dark/20"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key]?"left-5":"left-0.5"}`} />
                        </div>
                        <span className="text-[0.82rem] font-semibold">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
                  <button onClick={() => closeForm()} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06] transition-colors">Batal</button>
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
