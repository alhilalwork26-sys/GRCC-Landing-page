"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, TeamMember } from "@/lib/supabase";
import { Plus, Pencil, Trash2, GripVertical, X, Check, Loader2, Upload, UserCircle2, CheckCircle2 } from "lucide-react";

const EMPTY: Omit<TeamMember,"id"> = {
  num:"", name:"", role:"", photo:"", bio:"", order_index: 0, active: true,
};

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState<typeof EMPTY | null>(null);
  const [editId,  setEditId]  = useState<string | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [msg,           setMsg]           = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("order_index");
    setMembers(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); },[]);

  const openNew  = () => { setForm({...EMPTY, order_index: members.length+1, num: String(members.length+1).padStart(2,"0")}); setEditId(null); };
  const openEdit = (m: TeamMember) => {
    const { id, ...rest } = m;
    setForm(rest); setEditId(id);
  };
  const closeForm = () => { setForm(null); setEditId(null); };

  const uploadPhoto = async (file: File) => {
    if (!form) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setMsg("Format foto harus JPG, PNG, atau WebP."); return; }
    if (file.size > 20 * 1024 * 1024) { setMsg("Foto maksimal 20MB."); return; }
    setUploadingPhoto(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("team-photos").upload(filename, file, { contentType: file.type, upsert: false });
    setUploadingPhoto(false);
    if (error) { setMsg(`Gagal upload: ${error.message}`); return; }
    const { data: pub } = supabase.storage.from("team-photos").getPublicUrl(data.path);
    setForm(cur => cur ? { ...cur, photo: pub.publicUrl } : cur);
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    if (editId) await supabase.from("team_members").update(form).eq("id", editId);
    else        await supabase.from("team_members").insert(form);
    setSaving(false);
    setMsg(editId ? "Anggota diperbarui!" : "Anggota ditambahkan!");
    setTimeout(()=>setMsg(""),2500);
    closeForm(); load();
  };

  const del = async (id:string) => {
    if (!confirm("Hapus anggota ini?")) return;
    await supabase.from("team_members").delete().eq("id",id);
    load();
  };

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Tim GRCC</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">{members.length} anggota terdaftar</p>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={openNew}
          className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-4 py-2.5 rounded-xl">
          <Plus size={15}/> Tambah Anggota
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
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted"/></div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((m) => (
            <div key={m.id} className={`bg-white rounded-2xl border border-border p-4 flex items-center gap-4 transition-all hover:shadow-sm ${!m.active?"opacity-50":""}`}>
              <GripVertical size={16} className="text-muted flex-shrink-0 cursor-grab"/>
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-dark/[0.06] flex-shrink-0">
                {m.photo
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top"/>
                  : <div className="w-full h-full flex items-center justify-center text-dark/40 text-[0.7rem] font-bold">{m.num}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[0.9rem] truncate">{m.name}</p>
                <p className="text-muted text-[0.75rem] truncate">{m.role}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>openEdit(m)} className="p-1.5 hover:bg-dark/[0.07] rounded-lg"><Pencil size={14}/></button>
                <button onClick={()=>del(m.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
          {members.length===0 && (
            <div className="bg-white rounded-2xl border border-border py-14 text-center text-muted text-[0.88rem]">
              Belum ada anggota. <button onClick={openNew} className="font-bold underline">Tambah sekarang</button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {form && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeForm}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.96}} transition={{type:"spring",stiffness:300,damping:26}}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="flex items-center justify-between px-7 py-5 border-b border-border">
                  <h2 className="font-extrabold text-[1.05rem]">{editId?"Edit Anggota":"Tambah Anggota"}</h2>
                  <button onClick={closeForm}><X size={18} className="text-muted hover:text-dark"/></button>
                </div>
                <div className="px-7 py-6 flex flex-col gap-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div><label className="label">No.</label>
                      <input value={form.num} onChange={e=>setForm({...form,num:e.target.value})} placeholder="01" className="input"/></div>
                    <div className="col-span-3"><label className="label">Nama Lengkap *</label>
                      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama + gelar" className="input"/></div>
                  </div>
                  <div><label className="label">Jabatan</label>
                    <input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Manager GRCC" className="input"/></div>

                  {/* ── Foto Upload ── */}
                  <div>
                    <label className="label">Foto</label>
                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadPhoto(f); e.currentTarget.value=""; }}/>
                    {form.photo ? (
                      <div className="flex gap-4 p-3 rounded-2xl border border-border bg-[#FAFAFA] items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.photo} alt="" className="w-16 h-16 rounded-xl object-cover object-top border border-border flex-shrink-0"/>
                        <div className="flex flex-col justify-between flex-1 min-w-0 gap-2">
                          <p className="text-[0.78rem] font-bold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 size={13}/> Foto aktif
                          </p>
                          <div className="flex gap-2">
                            <button type="button" onClick={()=>photoInputRef.current?.click()} disabled={uploadingPhoto}
                              className="flex items-center gap-1.5 bg-dark text-white text-[0.72rem] font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">
                              {uploadingPhoto ? <Loader2 size={11} className="animate-spin"/> : <Upload size={11}/>} Ganti
                            </button>
                            <button type="button" onClick={()=>setForm({...form,photo:""})}
                              className="flex items-center gap-1.5 border border-border text-muted text-[0.72rem] font-bold px-3 py-1.5 rounded-lg hover:text-dark">
                              <X size={11}/> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={()=>photoInputRef.current?.click()} disabled={uploadingPhoto}
                        className="flex w-full items-center gap-3 p-4 rounded-2xl border border-dashed border-border bg-[#FAFAFA] hover:bg-dark/[0.03] transition-colors disabled:opacity-50">
                        <span className="w-10 h-10 rounded-xl bg-dark/[0.06] flex items-center justify-center flex-shrink-0">
                          {uploadingPhoto ? <Loader2 size={16} className="animate-spin text-muted"/> : <UserCircle2 size={18} className="text-muted"/>}
                        </span>
                        <span className="text-left">
                          <span className="block text-[0.8rem] font-bold text-dark">Upload foto (JPG / PNG / WebP)</span>
                          <span className="block text-[0.7rem] text-muted">Maks. 20MB.</span>
                        </span>
                      </button>
                    )}
                  </div>
                  <div><label className="label">Bio</label>
                    <textarea rows={4} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="input resize-none" placeholder="Deskripsi singkat peran…"/></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Urutan</label>
                      <input type="number" value={form.order_index} onChange={e=>setForm({...form,order_index:+e.target.value})} className="input"/></div>
                    <label className="flex items-center gap-2 cursor-pointer pt-6">
                      <div onClick={()=>setForm({...form,active:!form.active})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${form.active?"bg-dark":"bg-dark/20"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active?"left-5":"left-0.5"}`}/>
                      </div>
                      <span className="text-[0.82rem] font-semibold">Tampilkan</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
                  <button onClick={closeForm} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06]">Batal</button>
                  <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                    onClick={save} disabled={saving||!form.name}
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
