"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, TrainingItem, CustomField } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2,
  GripVertical, Settings2, Upload, Image as ImageIcon, FileText,
  CreditCard, Send, AlertCircle, Calendar, MapPin, Users,
  Clock, BookOpen, CheckCircle2, Radio, ChevronDown,
} from "lucide-react";

const COLORS   = ["#4F46E5","#10B981","#EF4444","#F59E0B","#8B5CF6","#0EA5E9","#F97316"];
const FORMATS  = ["Online","In-Person","Hybrid","In-House"];
const FIELD_TYPES = ["text","textarea","select","number","date"] as const;
const PROGRAMS = [
  { id: "01", label: "Governance, Risk, and Compliance (GRC)" },
  { id: "02", label: "ESG dan Keberlanjutan Bisnis (ESG)" },
  { id: "03", label: "Accounting (ACC)" },
  { id: "04", label: "Auditing (AUD)" },
  { id: "05", label: "Organizational Competitiveness (OC)" },
  { id: "06", label: "Human Capital Management (HCM)" },
  { id: "07", label: "Digital and Technology in Finance (DTF)" },
  { id: "08", label: "Penelitian (RES)" },
];
const VA_BANKS = ["BNI","BRI","Mandiri","BTN","BCA","BSI","CIMB Niaga"];

const EMPTY: Omit<TrainingItem,"id"|"created_at"> = {
  title:"", category:"", date_start:"", date_end: null, time:"Sabtu 08.00–17.00 WIB",
  format:"Online", location:"Zoom Meeting", price: null, price_label:"",
  max_participants: null, color:"#4F46E5", description:"", published: true,
  poster_url: null, brochure_url: null, custom_fields: [], program_id: null,
  va_bank: null, va_number: null, va_set_at: null,
  objectives: null, target_audience: null,
};

// ── small helpers ─────────────────────────────────────────────────────────────
function Stat({ label, value, accent }: { label: string; value: string|number; accent?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[1.45rem] font-black tracking-tight" style={{ color: accent ?? "#0D0D0D" }}>{value}</span>
      <span className="text-[0.7rem] text-muted font-semibold">{label}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminTraining() {
  const [items,   setItems]   = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [uploadingPoster,   setUploadingPoster]   = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [broadcasting, setBroadcasting] = useState<string | null>(null);
  const [msg,     setMsg]     = useState<{ text: string; ok: boolean } | null>(null);
  const [filterPublished, setFilterPublished] = useState<"all"|"published"|"draft">("all");
  const posterInputRef   = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const showMsg = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("training").select("*").order("created_at", { ascending: false });
    if (error) { showMsg(`Gagal memuat: ${error.message}`, false); setItems([]); }
    else setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm({ ...EMPTY }); setEditId(null); };
  const openEdit = (item: TrainingItem) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const payload = { ...form };

    // VA logic: only set va_set_at when number is newly provided
    if (payload.va_number && !payload.va_set_at) {
      payload.va_set_at = new Date().toISOString();
    }
    // Clear va_set_at if number was removed, but keep bank selection
    if (!payload.va_number) {
      payload.va_set_at = null;
    }

    const { error } = editId
      ? await supabase.from("training").update(payload).eq("id", editId)
      : await supabase.from("training").insert(payload);
    setSaving(false);
    if (error) { showMsg(`Gagal menyimpan: ${error.message}`, false); return; }
    showMsg(editId ? "Training berhasil diperbarui!" : "Training berhasil ditambahkan!");
    closeForm(); load();
  };

  const broadcastVA = async (trainingId: string, title: string) => {
    if (!confirm(`Kirim instruksi VA ke semua peserta:\n"${title}"\n\nLanjutkan?`)) return;
    setBroadcasting(trainingId);
    try {
      const res  = await fetch("/api/broadcast-va", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingId }),
      });
      const data = await res.json();
      showMsg(data.sent !== undefined
        ? `Broadcast selesai — ${data.sent}/${data.total} email terkirim`
        : data.message || data.error || "Broadcast selesai");
    } catch {
      showMsg("Gagal broadcast. Coba lagi.", false);
    } finally {
      setBroadcasting(null);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Hapus training ini?")) return;
    const { error } = await supabase.from("training").delete().eq("id", id);
    if (error) { showMsg(`Gagal hapus: ${error.message}`, false); return; }
    load();
  };

  const togglePublish = async (id: string, val: boolean) => {
    const { error } = await supabase.from("training").update({ published: !val }).eq("id", id);
    if (error) { showMsg(`Gagal: ${error.message}`, false); return; }
    load();
  };

  const uploadPoster = async (file: File) => {
    if (!form) return;
    const allowed = ["image/jpeg","image/png","image/webp"];
    if (!allowed.includes(file.type)) { showMsg("Format poster harus JPG, PNG, atau WebP.", false); return; }
    if (file.size > 5 * 1024 * 1024) { showMsg("Poster maksimal 5MB.", false); return; }
    setUploadingPoster(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("training-posters").upload(filename, file, { contentType: file.type, upsert: false });
    setUploadingPoster(false);
    if (error) { showMsg(`Gagal upload poster: ${error.message}`, false); return; }
    const { data: pub } = supabase.storage.from("training-posters").getPublicUrl(data.path);
    setForm(cur => cur ? { ...cur, poster_url: pub.publicUrl } : cur);
    showMsg("Poster berhasil diupload!");
  };

  const uploadBrochure = async (file: File) => {
    if (!form) return;
    if (file.type !== "application/pdf") { showMsg("Brosur harus PDF.", false); return; }
    if (file.size > 20 * 1024 * 1024) { showMsg("Brosur maksimal 20MB.", false); return; }
    setUploadingBrochure(true);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const { data, error } = await supabase.storage
      .from("training-brochures").upload(filename, file, { contentType: "application/pdf", upsert: false });
    setUploadingBrochure(false);
    if (error) { showMsg(`Gagal upload brosur: ${error.message}`, false); return; }
    const { data: pub } = supabase.storage.from("training-brochures").getPublicUrl(data.path);
    setForm(cur => cur ? { ...cur, brochure_url: pub.publicUrl } : cur);
    showMsg("Brosur berhasil diupload!");
  };

  // ── derived stats ─────────────────────────────────────────────────────────
  const published  = items.filter(i => i.published).length;
  const withVA     = items.filter(i => i.va_number).length;
  const withPoster = items.filter(i => i.poster_url).length;

  const filtered = items.filter(i => {
    if (filterPublished === "published") return i.published;
    if (filterPublished === "draft")     return !i.published;
    return true;
  });

  return (
    <div className="max-w-[1000px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Manajemen Training</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">Kelola jadwal, poster, brosur, dan VA pembayaran</p>
        </div>
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl shadow-sm">
          <Plus size={15} /> Tambah Training
        </motion.button>
      </div>

      {/* ── Stats bar ── */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Training",  value: items.length },
            { label: "Dipublikasikan", value: published,  accent: "#10B981" },
            { label: "Sudah Ada VA",   value: withVA,     accent: "#4F46E5" },
            { label: "Punya Poster",   value: withPoster, accent: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
              <Stat {...s} />
            </div>
          ))}
        </div>
      )}

      {/* ── Filter tabs ── */}
      {!loading && items.length > 0 && (
        <div className="flex gap-1.5 mb-4">
          {(["all","published","draft"] as const).map(f => (
            <button key={f} onClick={() => setFilterPublished(f)}
              className={`text-[0.72rem] font-bold px-3.5 py-1.5 rounded-lg transition-all ${filterPublished === f ? "bg-dark text-white" : "text-muted hover:text-dark hover:bg-dark/[0.06]"}`}>
              {f === "all" ? `Semua (${items.length})` : f === "published" ? `Aktif (${published})` : `Draft (${items.length - published})`}
            </button>
          ))}
        </div>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity:0, y:-10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8 }} className={`flex items-center gap-2.5 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4 ${msg.ok ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg.ok ? <CheckCircle2 size={15}/> : <AlertCircle size={15}/>} {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-border p-4 animate-pulse flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-dark/[0.06] flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2 py-1">
                <div className="h-3.5 w-2/3 bg-dark/[0.07] rounded-full" />
                <div className="h-2.5 w-1/2 bg-dark/[0.05] rounded-full" />
                <div className="h-2.5 w-1/3 bg-dark/[0.04] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, scale:0.97 }}
                transition={{ duration:0.25, delay: idx * 0.03 }}
                className="bg-white rounded-2xl border border-border hover:shadow-md transition-all duration-200 overflow-hidden group">

                <div className="flex items-stretch gap-0">
                  {/* Left color bar */}
                  <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: item.color }} />

                  {/* Poster thumbnail */}
                  <div className="w-[88px] flex-shrink-0 relative self-stretch min-h-[88px]">
                    {item.poster_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.poster_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: item.color + "10" }}>
                        <span className="text-[1.4rem] font-black select-none"
                          style={{ color: item.color + "40" }}>
                          {(item.category || item.title).slice(0,2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {!item.published && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-[0.55rem] font-black uppercase tracking-wider text-dark/50 rotate-[-30deg]">Draft</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-4 py-3 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-bold text-[0.92rem] truncate">{item.title}</p>
                          {!item.published && (
                            <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">Draft</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[0.72rem] text-muted flex-wrap">
                          {item.date_start && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {item.date_start}{item.date_end ? ` – ${item.date_end}` : ""}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1 truncate max-w-[140px]">
                              <MapPin size={10} /> {item.location}
                            </span>
                          )}
                          {item.format && (
                            <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold"
                              style={{ backgroundColor: item.color + "15", color: item.color }}>
                              {item.format}
                            </span>
                          )}
                          {item.price_label && (
                            <span className="font-bold text-dark">{item.price_label}</span>
                          )}
                        </div>

                        {/* Asset badges */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {item.poster_url && (
                            <span className="flex items-center gap-1 text-[0.62rem] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-100">
                              <ImageIcon size={9} /> Poster
                            </span>
                          )}
                          {item.brochure_url && (
                            <span className="flex items-center gap-1 text-[0.62rem] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                              <FileText size={9} /> Brosur
                            </span>
                          )}
                          {item.va_number ? (
                            <span className="flex items-center gap-1 text-[0.62rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CreditCard size={9} /> VA {item.va_bank}: <span className="font-mono">{item.va_number}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[0.62rem] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                              <AlertCircle size={9} /> VA belum diisi
                            </span>
                          )}
                          {item.program_id && (
                            <span className="text-[0.62rem] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                              Program {item.program_id}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {item.va_number && (
                          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                            onClick={() => broadcastVA(item.id, item.title)}
                            disabled={broadcasting === item.id}
                            title="Kirim VA ke peserta"
                            className="flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50">
                            {broadcasting === item.id ? <Loader2 size={11} className="animate-spin"/> : <Send size={11}/>}
                            <span className="hidden sm:inline">Kirim VA</span>
                          </motion.button>
                        )}
                        <button onClick={() => togglePublish(item.id, item.published)}
                          title={item.published ? "Sembunyikan" : "Tampilkan"}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          {item.published ? <Eye size={15} className="text-emerald-500"/> : <EyeOff size={15} className="text-muted"/>}
                        </button>
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-dark/[0.06] transition-colors">
                          <Pencil size={14}/>
                        </button>
                        <button onClick={() => del(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-border py-14 text-center">
              <p className="text-muted text-[0.88rem] mb-2">
                {items.length === 0 ? "Belum ada training." : "Tidak ada training di filter ini."}
              </p>
              {items.length === 0 && (
                <button onClick={openNew} className="text-[0.85rem] font-bold text-dark underline">
                  Tambah sekarang
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          FORM MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {form && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeForm}/>
            <motion.div initial={{ opacity:0, scale:0.95, y:24 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96, y:16 }} transition={{ type:"spring", stiffness:300, damping:26 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[600px] max-h-[92vh] overflow-y-auto pointer-events-auto flex flex-col">

                {/* Modal header */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-border sticky top-0 bg-white z-10 rounded-t-3xl">
                  <div>
                    <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Training" : "Training Baru"}</h2>
                    <p className="text-[0.72rem] text-muted mt-0.5">
                      {editId ? "Perbarui informasi program pelatihan" : "Isi detail untuk menambah jadwal baru"}
                    </p>
                  </div>
                  <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dark/[0.07] transition-colors">
                    <X size={16} className="text-muted"/>
                  </button>
                </div>

                <div className="px-7 py-5 flex flex-col gap-5">

                  {/* ── Section: Konten ── */}
                  <Section icon={<BookOpen size={14}/>} label="Informasi Utama">
                    <Field label="Judul Training *">
                      <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                        placeholder="Nama program pelatihan" className="input"/>
                    </Field>
                    <Field label="Program">
                      <select value={form.program_id ?? ""}
                        onChange={e=>setForm({...form,program_id:e.target.value||null})} className="input">
                        <option value="">— Tampil di semua program —</option>
                        {PROGRAMS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Kategori / Tag">
                        <input value={form.category??""} onChange={e=>setForm({...form,category:e.target.value})}
                          placeholder="GRC, ESG, Accounting…" className="input"/>
                      </Field>
                      <Field label="Format">
                        <select value={form.format} onChange={e=>setForm({...form,format:e.target.value})} className="input">
                          {FORMATS.map(f=><option key={f}>{f}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Deskripsi Singkat">
                      <textarea rows={3} value={form.description}
                        onChange={e=>setForm({...form,description:e.target.value})} className="input resize-none"/>
                    </Field>
                    <Field label="Tujuan Pelatihan" note="satu tujuan per baris">
                      <textarea rows={4} value={form.objectives ?? ""}
                        onChange={e=>setForm({...form,objectives:e.target.value||null})}
                        placeholder={"Peserta mampu memahami kerangka GRC\nPeserta dapat menerapkan manajemen risiko\nPeserta mendapatkan sertifikat kelulusan"}
                        className="input resize-none text-[0.82rem]"/>
                    </Field>
                    <Field label="Untuk Siapa?" note="satu target per baris">
                      <textarea rows={3} value={form.target_audience ?? ""}
                        onChange={e=>setForm({...form,target_audience:e.target.value||null})}
                        placeholder={"Risk Manager & Compliance Officer\nDirektur & Manajer Senior\nAkuntan & Internal Auditor"}
                        className="input resize-none text-[0.82rem]"/>
                    </Field>
                  </Section>

                  {/* ── Section: Jadwal ── */}
                  <Section icon={<Calendar size={14}/>} label="Jadwal & Lokasi">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Tanggal Mulai">
                        <input value={form.date_start} onChange={e=>setForm({...form,date_start:e.target.value})}
                          placeholder="18 April 2026" className="input"/>
                      </Field>
                      <Field label="Tanggal Selesai">
                        <input value={form.date_end??""} onChange={e=>setForm({...form,date_end:e.target.value||null})}
                          placeholder="opsional" className="input"/>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Waktu">
                        <input value={form.time} onChange={e=>setForm({...form,time:e.target.value})}
                          placeholder="Sabtu 08.00–17.00" className="input"/>
                      </Field>
                      <Field label="Lokasi">
                        <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}
                          placeholder="Zoom / Jakarta" className="input"/>
                      </Field>
                    </div>
                    <Field label="Maks. Peserta">
                      <input type="number" value={form.max_participants??""} placeholder="30"
                        onChange={e=>setForm({...form,max_participants:+e.target.value||null})} className="input w-[50%]"/>
                    </Field>
                  </Section>

                  {/* ── Section: Harga ── */}
                  <Section icon={<CreditCard size={14}/>} label="Harga">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Harga (angka)" note="Untuk kalkulasi diskon">
                        <input type="number" value={form.price??""} onChange={e=>setForm({...form,price:+e.target.value||null})}
                          placeholder="3900000" className="input"/>
                      </Field>
                      <Field label="Label Harga" note="Teks di website">
                        <input value={form.price_label} onChange={e=>setForm({...form,price_label:e.target.value})}
                          placeholder="Rp 3.900.000" className="input"/>
                      </Field>
                    </div>
                  </Section>

                  {/* ── Section: Media ── */}
                  <Section icon={<ImageIcon size={14}/>} label="Poster & Brosur">
                    {/* Poster */}
                    <input ref={posterInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadPoster(f); e.currentTarget.value=""; }}/>
                    <div>
                      <p className="label mb-2">Poster Training</p>
                      {form.poster_url ? (
                        <div className="flex gap-3 p-3 rounded-2xl border border-border bg-[#FAFAFA]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={form.poster_url} alt="poster" className="h-24 w-16 rounded-xl object-cover border border-border bg-white flex-shrink-0"/>
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <p className="text-[0.78rem] font-bold text-emerald-700 flex items-center gap-1.5 mb-0.5">
                                <CheckCircle2 size={12}/> Poster aktif
                              </p>
                              <p className="text-[0.68rem] text-muted truncate">{form.poster_url.split("/").pop()}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={()=>posterInputRef.current?.click()} disabled={uploadingPoster}
                                className="flex items-center gap-1.5 bg-dark text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">
                                {uploadingPoster?<Loader2 size={11} className="animate-spin"/>:<Upload size={11}/>} Ganti
                              </button>
                              <button type="button" onClick={()=>setForm({...form,poster_url:null})}
                                className="flex items-center gap-1.5 border border-border text-muted text-[0.7rem] font-bold px-3 py-1.5 rounded-lg hover:text-dark">
                                <X size={11}/> Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={()=>posterInputRef.current?.click()} disabled={uploadingPoster}
                          className="flex w-full items-center gap-3 p-4 rounded-2xl border border-dashed border-border bg-[#FAFAFA] hover:bg-dark/[0.03] transition-colors disabled:opacity-50">
                          <span className="w-10 h-10 rounded-xl bg-dark/[0.06] flex items-center justify-center flex-shrink-0">
                            {uploadingPoster?<Loader2 size={16} className="animate-spin text-muted"/>:<ImageIcon size={16} className="text-muted"/>}
                          </span>
                          <span className="text-left">
                            <span className="block text-[0.8rem] font-bold text-dark">Upload poster (JPG / PNG / WebP)</span>
                            <span className="block text-[0.7rem] text-muted">Maks. 5MB. Tampil di kartu training.</span>
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Brosur */}
                    <input ref={brochureInputRef} type="file" accept="application/pdf" className="hidden"
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadBrochure(f); e.currentTarget.value=""; }}/>
                    <div>
                      <p className="label mb-2">Brosur PDF</p>
                      {form.brochure_url ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-[#FAFAFA]">
                          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                            <FileText size={16} className="text-red-500"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.78rem] font-bold text-emerald-700 flex items-center gap-1.5 mb-0.5">
                              <CheckCircle2 size={12}/> Brosur aktif
                            </p>
                            <p className="text-[0.7rem] text-muted truncate">{form.brochure_url.split("/").pop()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={()=>brochureInputRef.current?.click()} disabled={uploadingBrochure}
                              className="flex items-center gap-1.5 bg-dark text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">
                              {uploadingBrochure?<Loader2 size={11} className="animate-spin"/>:<Upload size={11}/>} Ganti
                            </button>
                            <button type="button" onClick={()=>setForm({...form,brochure_url:null})}
                              className="flex items-center gap-1.5 border border-border text-muted text-[0.7rem] font-bold px-3 py-1.5 rounded-lg hover:text-dark">
                              <X size={11}/> Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={()=>brochureInputRef.current?.click()} disabled={uploadingBrochure}
                          className="flex w-full items-center gap-3 p-4 rounded-2xl border border-dashed border-border bg-[#FAFAFA] hover:bg-dark/[0.03] transition-colors disabled:opacity-50">
                          <span className="w-10 h-10 rounded-xl bg-dark/[0.06] flex items-center justify-center flex-shrink-0">
                            {uploadingBrochure?<Loader2 size={16} className="animate-spin text-muted"/>:<FileText size={16} className="text-muted"/>}
                          </span>
                          <span className="text-left">
                            <span className="block text-[0.8rem] font-bold text-dark">Upload brosur PDF</span>
                            <span className="block text-[0.7rem] text-muted">Maks. 20MB. Tampil sebagai tombol &ldquo;Lihat Brosur&rdquo;.</span>
                          </span>
                        </button>
                      )}
                    </div>
                  </Section>

                  {/* ── Section: VA ── */}
                  <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={14} className="text-amber-600"/>
                      <span className="text-[0.82rem] font-extrabold text-amber-800">Virtual Account Pembayaran</span>
                      {form.va_number && (
                        <span className="ml-auto text-[0.65rem] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={11}/> VA aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[0.7rem] text-amber-700 mb-3 leading-relaxed">
                      Isi setelah mendapat VA dari Universitas Airlangga.
                      Klik <strong>"Kirim VA ke Peserta"</strong> di halaman utama setelah disimpan.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Bank VA">
                        <select value={form.va_bank??""} onChange={e=>setForm({...form,va_bank:e.target.value||null})} className="input">
                          <option value="">— Pilih bank —</option>
                          {VA_BANKS.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                      </Field>
                      <Field label="Nomor VA">
                        <input value={form.va_number??""} onChange={e=>setForm({...form,va_number:e.target.value||null})}
                          placeholder="8277XXXXXXXXX" className="input font-mono tracking-wider"/>
                      </Field>
                    </div>
                  </div>

                  {/* ── Section: Tampilan ── */}
                  <Section icon={<Radio size={14}/>} label="Tampilan & Status">
                    <Field label="Warna Kartu">
                      <div className="flex gap-2">
                        {COLORS.map(c=>(
                          <button key={c} onClick={()=>setForm({...form,color:c})}
                            className={`w-7 h-7 rounded-lg border-2 transition-all ${form.color===c?"border-dark scale-110 shadow-sm":"border-transparent"}`}
                            style={{backgroundColor:c}}/>
                        ))}
                      </div>
                    </Field>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={()=>setForm({...form,published:!form.published})}
                        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form.published?"bg-emerald-500":"bg-dark/20"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.published?"left-5":"left-0.5"}`}/>
                      </div>
                      <span className="text-[0.82rem] font-semibold">
                        {form.published ? "Ditampilkan di website" : "Disimpan sebagai draft"}
                      </span>
                    </label>
                  </Section>

                  {/* ── Section: Custom Fields ── */}
                  <div className="border-t border-border pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Settings2 size={14} className="text-muted"/>
                        <span className="text-[0.82rem] font-bold">Kolom Tambahan Formulir</span>
                      </div>
                      <button type="button"
                        onClick={()=>{
                          const nf: CustomField = { id: Math.random().toString(36).slice(2), label:"", type:"text", required:false, placeholder:"" };
                          setForm({...form, custom_fields:[...(form.custom_fields||[]), nf]});
                        }}
                        className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-dark/60 hover:text-dark border border-dashed border-dark/20 hover:border-dark/40 px-3 py-1.5 rounded-lg transition-all">
                        <Plus size={11}/> Tambah Kolom
                      </button>
                    </div>
                    {(form.custom_fields||[]).length === 0 && (
                      <p className="text-[0.75rem] text-muted text-center py-4 border border-dashed border-border rounded-xl">
                        Belum ada kolom tambahan
                      </p>
                    )}
                    <div className="flex flex-col gap-3">
                      {(form.custom_fields||[]).map((cf, idx)=>(
                        <div key={cf.id} className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-dark/[0.02]">
                          <div className="flex items-center gap-2">
                            <GripVertical size={13} className="text-muted flex-shrink-0"/>
                            <input value={cf.label}
                              onChange={e=>{
                                const u=[...(form.custom_fields||[])];
                                u[idx]={...cf,label:e.target.value};
                                setForm({...form,custom_fields:u});
                              }}
                              placeholder="Nama kolom (contoh: Ukuran Baju)" className="input flex-1 text-[0.78rem] py-2"/>
                            <button type="button"
                              onClick={()=>setForm({...form,custom_fields:(form.custom_fields||[]).filter((_,i)=>i!==idx)})}
                              className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                              <X size={11} className="text-red-500"/>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 ml-5">
                            <select value={cf.type}
                              onChange={e=>{
                                const u=[...(form.custom_fields||[])];
                                u[idx]={...cf,type:e.target.value as CustomField["type"]};
                                setForm({...form,custom_fields:u});
                              }}
                              className="input text-[0.75rem] py-1.5 flex-1">
                              {FIELD_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                            <input value={cf.placeholder||""}
                              onChange={e=>{
                                const u=[...(form.custom_fields||[])];
                                u[idx]={...cf,placeholder:e.target.value};
                                setForm({...form,custom_fields:u});
                              }}
                              placeholder="Placeholder (opsional)" className="input flex-1 text-[0.75rem] py-1.5"/>
                            <label className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted whitespace-nowrap cursor-pointer">
                              <input type="checkbox" checked={cf.required}
                                onChange={e=>{
                                  const u=[...(form.custom_fields||[])];
                                  u[idx]={...cf,required:e.target.checked};
                                  setForm({...form,custom_fields:u});
                                }}
                                className="w-3.5 h-3.5 rounded"/>
                              Wajib
                            </label>
                          </div>
                          {cf.type==="select" && (
                            <div className="ml-5">
                              <input value={(cf.options||[]).join(",")}
                                onChange={e=>{
                                  const u=[...(form.custom_fields||[])];
                                  u[idx]={...cf,options:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)};
                                  setForm({...form,custom_fields:u});
                                }}
                                placeholder="Opsi: Pilihan A, Pilihan B" className="input w-full text-[0.75rem] py-1.5"/>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border sticky bottom-0 bg-white rounded-b-3xl">
                  <button onClick={closeForm}
                    className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06] transition-colors">
                    Batal
                  </button>
                  <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                    onClick={save} disabled={saving||!form.title}
                    className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 shadow-sm">
                    {saving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
                    {saving ? "Menyimpan…" : (editId ? "Perbarui Training" : "Tambah Training")}
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

// ── helpers ───────────────────────────────────────────────────────────────────
function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted">{icon}</span>
        <span className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted">{label}</span>
        <div className="flex-1 h-px bg-border ml-1"/>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label">{label}{note && <span className="normal-case tracking-normal ml-1 opacity-60">— {note}</span>}</p>
      {children}
    </div>
  );
}
