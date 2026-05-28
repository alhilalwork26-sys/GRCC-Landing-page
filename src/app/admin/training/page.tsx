"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, TrainingItem, CustomField } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Loader2, GripVertical, Settings2, Upload, Image as ImageIcon, FileText, CreditCard, Send, AlertCircle } from "lucide-react";

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
  title:"", category:"", date_start:"", date_end:"", time:"Sabtu 08.00–17.00 WIB",
  format:"Online", location:"Zoom Meeting", price: null, price_label:"",
  max_participants: null, color:"#4F46E5", description:"", published: true,
  poster_url: null, brochure_url: null, custom_fields: [], program_id: null,
  va_bank: null, va_number: null, va_set_at: null,
};

export default function AdminTraining() {
  const [items,   setItems]   = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [uploadingPoster,   setUploadingPoster]   = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [broadcasting, setBroadcasting] = useState<string | null>(null);
  const [msg,     setMsg]     = useState("");
  const posterInputRef   = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("training").select("*").order("created_at",{ascending:false});
    if (error) {
      setMsg(`Gagal memuat training: ${error.message}`);
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); },[]);

  const openNew  = () => { setForm({...EMPTY}); setEditId(null); };
  const openEdit = (item: TrainingItem) => {
    const { id, created_at, ...rest } = item;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    // Set va_set_at when VA number is newly provided
    const payload = { ...form };
    if (payload.va_number && !payload.va_set_at) {
      payload.va_set_at = new Date().toISOString();
    }
    if (!payload.va_number) {
      payload.va_set_at = null;
      payload.va_bank = null;
    }
    const { error } = editId
      ? await supabase.from("training").update(payload).eq("id", editId)
      : await supabase.from("training").insert(payload);
    setSaving(false);
    if (error) {
      setMsg(`Gagal menyimpan training: ${error.message}`);
      return;
    }
    setMsg(editId ? "Training diperbarui!" : "Training ditambahkan!");
    setTimeout(() => setMsg(""),2500);
    closeForm(); load();
  };

  const broadcastVA = async (trainingId: string, title: string, total: number) => {
    if (!confirm(`Kirim instruksi pembayaran VA ke semua peserta "${title}"?\n\nEstimasi: ${total > 0 ? total + " email" : "peserta terdaftar"}`)) return;
    setBroadcasting(trainingId);
    try {
      const res = await fetch("/api/broadcast-va", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingId }),
      });
      const data = await res.json();
      if (data.sent !== undefined) {
        setMsg(`✅ Broadcast selesai — ${data.sent}/${data.total} email terkirim`);
      } else {
        setMsg(data.message || data.error || "Broadcast selesai");
      }
      setTimeout(() => setMsg(""), 4000);
    } catch {
      setMsg("Gagal broadcast. Coba lagi.");
    } finally {
      setBroadcasting(null);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Hapus training ini?")) return;
    const { error } = await supabase.from("training").delete().eq("id", id);
    if (error) {
      setMsg(`Gagal menghapus training: ${error.message}`);
      return;
    }
    load();
  };

  const togglePublish = async (id:string, val:boolean) => {
    const { error } = await supabase.from("training").update({published:!val}).eq("id",id);
    if (error) {
      setMsg(`Gagal mengubah status: ${error.message}`);
      return;
    }
    load();
  };

  const uploadPoster = async (file: File) => {
    if (!form) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setMsg("Format poster harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg("Ukuran poster maksimal 5MB.");
      return;
    }

    setUploadingPoster(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("training-posters")
      .upload(filename, file, { contentType: file.type, upsert: false });
    setUploadingPoster(false);

    if (error) {
      setMsg(`Gagal upload poster: ${error.message}`);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("training-posters").getPublicUrl(data.path);
    setForm((current) => current ? { ...current, poster_url: publicUrl.publicUrl } : current);
  };

  const uploadBrochure = async (file: File) => {
    if (!form) return;
    if (file.type !== "application/pdf") {
      setMsg("Brosur harus berformat PDF.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setMsg("Ukuran brosur maksimal 20MB.");
      return;
    }
    setUploadingBrochure(true);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const { data, error } = await supabase.storage
      .from("training-brochures")
      .upload(filename, file, { contentType: "application/pdf", upsert: false });
    setUploadingBrochure(false);
    if (error) { setMsg(`Gagal upload brosur: ${error.message}`); return; }
    const { data: publicUrl } = supabase.storage.from("training-brochures").getPublicUrl(data.path);
    setForm((current) => current ? { ...current, brochure_url: publicUrl.publicUrl } : current);
  };

  return (
    <div className="max-w-[960px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Upcoming Training</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">{items.length} program tersimpan</p>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl">
          <Plus size={15} /> Tambah Training
        </motion.button>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4">
            <Check size={15}/> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted" /></div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[0.92rem] truncate">{item.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[0.75rem] text-muted flex-wrap">
                    {item.date_start && <span>{item.date_start}{item.date_end ? ` – ${item.date_end}` : ""}</span>}
                    {item.format && <span className="px-2 py-0.5 rounded-full bg-dark/[0.06]">{item.format}</span>}
                    {item.price_label && <span className="font-semibold text-dark">{item.price_label}</span>}
                    {item.program_id && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold">
                        {PROGRAMS.find(p => p.id === item.program_id)?.label.split(" ")[0] ?? item.program_id}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(item.id, item.published)} title={item.published?"Sembunyikan":"Tampilkan"}>
                    {item.published ? <Eye size={15} className="text-emerald-500"/> : <EyeOff size={15} className="text-muted"/>}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-dark/[0.07] rounded-lg"><Pencil size={14}/></button>
                  <button onClick={() => del(item.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
              {/* VA Status bar */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-3">
                {item.va_number ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[0.75rem] font-semibold text-emerald-700">
                      VA {item.va_bank}: <span className="font-mono">{item.va_number}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[0.75rem] font-semibold text-amber-600">
                      VA belum diisi — peserta belum bisa bayar
                    </span>
                  </div>
                )}
                {item.va_number && (
                  <button
                    onClick={() => broadcastVA(item.id, item.title, 0)}
                    disabled={broadcasting === item.id}
                    className="flex items-center gap-1.5 text-[0.72rem] font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {broadcasting === item.id
                      ? <Loader2 size={11} className="animate-spin" />
                      : <Send size={11} />}
                    Kirim VA ke Peserta
                  </button>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="bg-white rounded-2xl border border-border py-14 text-center text-muted text-[0.88rem]">
              Belum ada training. <button onClick={openNew} className="font-bold underline">Tambah sekarang</button>
            </div>
          )}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {form && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeForm}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.96}} transition={{type:"spring",stiffness:300,damping:26}}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="flex items-center justify-between px-7 py-5 border-b border-border">
                  <h2 className="font-extrabold text-[1.05rem]">{editId ? "Edit Training" : "Tambah Training"}</h2>
                  <button onClick={closeForm}><X size={18} className="text-muted hover:text-dark"/></button>
                </div>
                <div className="px-7 py-6 flex flex-col gap-4">
                  <div><label className="label">Judul *</label>
                    <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Nama program pelatihan" className="input"/></div>

                  <div><label className="label">Program</label>
                    <select
                      value={form.program_id ?? ""}
                      onChange={e=>setForm({...form,program_id:e.target.value || null})}
                      className="input"
                    >
                      <option value="">— Tampilkan di semua program —</option>
                      {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="label">Poster Training</label>
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPoster(file);
                        e.currentTarget.value = "";
                      }}
                    />
                    <div className="rounded-2xl border border-dashed border-border bg-[#FAFAFA] p-3">
                      {form.poster_url ? (
                        <div className="flex gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.poster_url}
                            alt="Preview poster training"
                            className="h-28 w-20 rounded-xl object-cover border border-border bg-white"
                          />
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <p className="text-[0.8rem] font-bold text-dark">Poster aktif</p>
                              <p className="mt-1 truncate text-[0.72rem] text-muted">{form.poster_url}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => posterInputRef.current?.click()}
                                disabled={uploadingPoster}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-dark px-3 py-2 text-[0.72rem] font-bold text-white disabled:opacity-50"
                              >
                                {uploadingPoster ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                                Ganti poster
                              </button>
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, poster_url: null })}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[0.72rem] font-bold text-muted hover:text-dark"
                              >
                                <X size={13} /> Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => posterInputRef.current?.click()}
                          disabled={uploadingPoster}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-dark/[0.03] disabled:opacity-50"
                        >
                          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-dark/[0.06]">
                            {uploadingPoster ? <Loader2 size={18} className="animate-spin text-muted" /> : <ImageIcon size={18} className="text-muted" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.82rem] font-bold text-dark">Upload poster JPG, PNG, atau WebP</span>
                            <span className="block text-[0.72rem] text-muted">Maksimal 5MB. Poster tampil di kartu training halaman utama.</span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Brosur PDF */}
                  <div>
                    <label className="label">Brosur PDF</label>
                    <input
                      ref={brochureInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadBrochure(file);
                        e.currentTarget.value = "";
                      }}
                    />
                    <div className="rounded-2xl border border-dashed border-border bg-[#FAFAFA] p-3">
                      {form.brochure_url ? (
                        <div className="flex items-center gap-3 px-2 py-2">
                          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.8rem] font-bold text-dark">Brosur aktif</p>
                            <p className="text-[0.7rem] text-muted truncate">{form.brochure_url.split("/").pop()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => brochureInputRef.current?.click()} disabled={uploadingBrochure}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-dark px-3 py-2 text-[0.72rem] font-bold text-white disabled:opacity-50">
                              {uploadingBrochure ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                              Ganti
                            </button>
                            <button type="button" onClick={() => setForm({ ...form, brochure_url: null })}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[0.72rem] font-bold text-muted hover:text-dark">
                              <X size={13} /> Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => brochureInputRef.current?.click()} disabled={uploadingBrochure}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-dark/[0.03] disabled:opacity-50">
                          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-dark/[0.06]">
                            {uploadingBrochure ? <Loader2 size={18} className="animate-spin text-muted" /> : <FileText size={18} className="text-muted" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.82rem] font-bold text-dark">Upload brosur PDF</span>
                            <span className="block text-[0.72rem] text-muted">Maksimal 20MB. Tampil sebagai tombol &ldquo;Lihat Brosur&rdquo; di halaman program.</span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Kategori / Tag</label>
                      <input value={form.category ?? ""} onChange={e=>setForm({...form,category:e.target.value})} placeholder="GRC, ESG, Accounting…" className="input"/></div>
                    <div><label className="label">Format</label>
                      <select value={form.format} onChange={e=>setForm({...form,format:e.target.value})} className="input">
                        {FORMATS.map(f=><option key={f}>{f}</option>)}
                      </select></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Tanggal Mulai</label>
                      <input value={form.date_start} onChange={e=>setForm({...form,date_start:e.target.value})} placeholder="18 April 2026" className="input"/></div>
                    <div><label className="label">Tanggal Selesai</label>
                      <input value={form.date_end ?? ""} onChange={e=>setForm({...form,date_end:e.target.value})} placeholder="opsional" className="input"/></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Waktu</label>
                      <input value={form.time} onChange={e=>setForm({...form,time:e.target.value})} placeholder="Sabtu 08.00–17.00" className="input"/></div>
                    <div><label className="label">Lokasi</label>
                      <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Zoom / Jakarta" className="input"/></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Harga (Angka)</label>
                      <input type="number" value={form.price ?? ""} onChange={e=>setForm({...form,price:+e.target.value||null})} placeholder="3900000" className="input"/>
                      <p className="text-[0.68rem] text-muted mt-1">Untuk kalkulasi diskon kode promo</p>
                    </div>
                    <div>
                      <label className="label">Label Harga</label>
                      <input value={form.price_label} onChange={e=>setForm({...form,price_label:e.target.value})} placeholder="Rp 3.900.000" className="input"/>
                      <p className="text-[0.68rem] text-muted mt-1">Teks yang ditampilkan di website</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Maks. Peserta</label>
                      <input type="number" value={form.max_participants ?? ""} onChange={e=>setForm({...form,max_participants:+e.target.value||null})} placeholder="30" className="input"/></div>
                  </div>

                  {/* ── Virtual Account ── */}
                  <div className="border border-dashed border-amber-200 bg-amber-50/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard size={15} className="text-amber-600" />
                      <span className="text-[0.82rem] font-bold text-amber-800">Virtual Account Pembayaran</span>
                    </div>
                    <p className="text-[0.72rem] text-amber-700 mb-3 leading-relaxed">
                      Isi setelah mendapat VA dari Universitas Airlangga. Setiap training memiliki VA berbeda.
                      Setelah disimpan, klik <strong>"Kirim VA ke Peserta"</strong> untuk broadcast email.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Bank VA</label>
                        <select
                          value={form.va_bank ?? ""}
                          onChange={e => setForm({...form, va_bank: e.target.value || null})}
                          className="input"
                        >
                          <option value="">— Pilih bank —</option>
                          {VA_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Nomor VA</label>
                        <input
                          value={form.va_number ?? ""}
                          onChange={e => setForm({...form, va_number: e.target.value || null})}
                          placeholder="8277XXXXXXXXX"
                          className="input font-mono"
                        />
                      </div>
                    </div>
                    {form.va_number && (
                      <p className="text-[0.7rem] text-emerald-700 mt-2 font-semibold">
                        ✅ VA aktif — peserta akan melihat instruksi pembayaran saat mendaftar
                      </p>
                    )}
                  </div>

                  <div><label className="label">Deskripsi Singkat</label>
                    <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input resize-none"/></div>

                  <div><label className="label">Warna</label>
                    <div className="flex gap-2">
                      {COLORS.map(c=>(
                        <button key={c} onClick={()=>setForm({...form,color:c})}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${form.color===c?"border-dark scale-110":"border-transparent"}`}
                          style={{backgroundColor:c}}/>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div onClick={()=>setForm({...form,published:!form.published})}
                      className={`w-10 h-5 rounded-full transition-colors relative ${form.published?"bg-dark":"bg-dark/20"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.published?"left-5":"left-0.5"}`}/>
                    </div>
                    <span className="text-[0.82rem] font-semibold">Tampilkan di website</span>
                  </label>

                  {/* ── Custom Fields ── */}
                  <div className="border-t border-border pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Settings2 size={14} className="text-muted" />
                        <span className="text-[0.82rem] font-bold">Kolom Tambahan Formulir</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newField: CustomField = {
                            id: Math.random().toString(36).slice(2),
                            label: "", type: "text", required: false, placeholder: ""
                          };
                          setForm({...form, custom_fields: [...(form.custom_fields||[]), newField]});
                        }}
                        className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-dark/60 hover:text-dark border border-dashed border-dark/20 hover:border-dark/40 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Plus size={12}/> Tambah Kolom
                      </button>
                    </div>
                    {(form.custom_fields||[]).length === 0 && (
                      <p className="text-[0.75rem] text-muted text-center py-4 border border-dashed border-border rounded-xl">
                        Belum ada kolom tambahan
                      </p>
                    )}
                    <div className="flex flex-col gap-3">
                      {(form.custom_fields||[]).map((cf, idx) => (
                        <div key={cf.id} className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-dark/[0.02]">
                          <div className="flex items-center gap-2">
                            <GripVertical size={13} className="text-muted flex-shrink-0"/>
                            <input
                              value={cf.label}
                              onChange={e => {
                                const updated = [...(form.custom_fields||[])];
                                updated[idx] = {...cf, label: e.target.value};
                                setForm({...form, custom_fields: updated});
                              }}
                              placeholder="Nama kolom (contoh: Ukuran Baju)"
                              className="input flex-1 text-[0.78rem] py-2"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (form.custom_fields||[]).filter((_,i) => i !== idx);
                                setForm({...form, custom_fields: updated});
                              }}
                              className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors"
                            >
                              <X size={11} className="text-red-500"/>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 ml-5">
                            <select
                              value={cf.type}
                              onChange={e => {
                                const updated = [...(form.custom_fields||[])];
                                updated[idx] = {...cf, type: e.target.value as CustomField["type"]};
                                setForm({...form, custom_fields: updated});
                              }}
                              className="input text-[0.75rem] py-1.5 flex-1"
                            >
                              {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input
                              value={cf.placeholder||""}
                              onChange={e => {
                                const updated = [...(form.custom_fields||[])];
                                updated[idx] = {...cf, placeholder: e.target.value};
                                setForm({...form, custom_fields: updated});
                              }}
                              placeholder="Placeholder (opsional)"
                              className="input flex-1 text-[0.75rem] py-1.5"
                            />
                            <label className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted whitespace-nowrap cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cf.required}
                                onChange={e => {
                                  const updated = [...(form.custom_fields||[])];
                                  updated[idx] = {...cf, required: e.target.checked};
                                  setForm({...form, custom_fields: updated});
                                }}
                                className="w-3.5 h-3.5 rounded"
                              />
                              Wajib
                            </label>
                          </div>
                          {cf.type === "select" && (
                            <div className="ml-5">
                              <input
                                value={(cf.options||[]).join(",")}
                                onChange={e => {
                                  const updated = [...(form.custom_fields||[])];
                                  updated[idx] = {...cf, options: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)};
                                  setForm({...form, custom_fields: updated});
                                }}
                                placeholder="Opsi dipisah koma: Pilihan A, Pilihan B, Pilihan C"
                                className="input w-full text-[0.75rem] py-1.5"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
                  <button onClick={closeForm} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06]">Batal</button>
                  <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                    onClick={save} disabled={saving||!form.title}
                    className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
                    {saving?<Loader2 size={14} className="animate-spin"/>:<Check size={14}/>} Simpan
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
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
