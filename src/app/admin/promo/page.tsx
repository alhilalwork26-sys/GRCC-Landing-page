"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

const COLORS = ["#4F46E5","#10B981","#EF4444","#F59E0B","#8B5CF6","#0EA5E9","#F97316"];
const STATUSES = [
  { value: "coming_soon", label: "Coming Soon" },
  { value: "open",        label: "Pendaftaran Dibuka" },
  { value: "closed",      label: "Pendaftaran Ditutup" },
];

interface Facilitator { name: string; role: string; org: string; img: string; main?: boolean; }
interface Highlight   { icon: string; text: string; }

export default function AdminPromo() {
  const [id,          setId]          = useState<string | null>(null);
  const [active,      setActive]      = useState(true);
  const [badge,       setBadge]       = useState("Coming Soon");
  const [badgeColor,  setBadgeColor]  = useState("#EF4444");
  const [tag,         setTag]         = useState("GRCC × AILG · Universitas Airlangga");
  const [title,       setTitle]       = useState("");
  const [subtitle,    setSubtitle]    = useState("");
  const [accentColor, setAccentColor] = useState("#4F46E5");
  const [description, setDesc]        = useState("");
  const [status,      setStatus]      = useState("coming_soon");
  const [ctaLabel,    setCtaLabel]    = useState("Daftar & Info Lengkap");
  const [ctaHref,     setCtaHref]     = useState("mailto:info@grcc.org");
  const [facilitators,setFacilitators]= useState<Facilitator[]>([{ name:"", role:"", org:"", img:"" }]);
  const [highlights,  setHighlights]  = useState<Highlight[]>([]);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState("");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("promo").select("*").order("created_at",{ascending:false}).limit(1).single();
        if (data) {
          setId(data.id); setActive(data.active); setBadge(data.badge);
          setBadgeColor(data.badge_color); setTag(data.tag); setTitle(data.title);
          setSubtitle(data.subtitle ?? ""); setAccentColor(data.accent_color);
          setDesc(data.description ?? ""); setStatus(data.status); setCtaLabel(data.cta_label);
          setCtaHref(data.cta_href);
          if (data.facilitators?.length) setFacilitators(data.facilitators);
          if (data.highlights?.length)   setHighlights(data.highlights);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addFacilitator = () => setFacilitators([...facilitators, { name:"", role:"", org:"", img:"", main: false }]);
  const removeFacilitator = (i: number) => setFacilitators(facilitators.filter((_,idx) => idx !== i));
  const updateFacilitator = (i: number, field: keyof Facilitator, val: string | boolean) =>
    setFacilitators(facilitators.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  const addHighlight    = () => setHighlights([...highlights, { icon: "✅", text: "" }]);
  const removeHighlight = (i: number) => setHighlights(highlights.filter((_,idx) => idx !== i));
  const updateHighlight = (i: number, field: keyof Highlight, val: string) =>
    setHighlights(highlights.map((h, idx) => idx === i ? { ...h, [field]: val } : h));

  const save = async () => {
    setSaving(true);
    const payload = {
      active, badge, badge_color: badgeColor, tag, title, subtitle,
      accent_color: accentColor, description, status,
      cta_label: ctaLabel, cta_href: ctaHref,
      facilitators, highlights, updated_at: new Date().toISOString(),
    };
    if (id) {
      await supabase.from("promo").update(payload).eq("id", id);
    } else {
      const { data } = await supabase.from("promo").insert(payload).select().single();
      if (data) setId(data.id);
    }
    setSaving(false);
    setMsg("Promo berhasil disimpan!");
    setTimeout(() => setMsg(""), 2500);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-muted" /></div>;

  return (
    <div className="max-w-[720px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Promo Modal</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">Banner yang muncul saat user pertama kali membuka website</p>
        </div>
        {/* Active toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <span className="text-[0.8rem] font-semibold">{active ? "Aktif" : "Nonaktif"}</span>
          <div onClick={() => setActive(v => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${active ? "bg-emerald-500" : "bg-dark/20"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${active ? "left-5" : "left-0.5"}`} />
          </div>
        </label>
      </div>

      {msg && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-5">
          <Check size={15} /> {msg}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">

        {/* Badge */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Teks Badge</label>
            <input value={badge} onChange={e => setBadge(e.target.value)} className="input" placeholder="Coming Soon" />
          </div>
          <div>
            <label className="label">Warna Badge</label>
            <div className="flex gap-2 mt-1">
              {COLORS.map(c => (
                <button key={c} onClick={() => setBadgeColor(c)}
                  className={`w-7 h-7 rounded-lg border-2 transition-all ${badgeColor===c?"border-dark scale-110":"border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status Program</label>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => setStatus(s.value)}
                className={`px-4 py-2 rounded-full text-[0.78rem] font-bold border transition-all ${status===s.value?"bg-dark text-white border-dark":"border-border hover:border-dark/30"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div><label className="label">Tag Penyelenggara</label>
          <input value={tag} onChange={e => setTag(e.target.value)} className="input" /></div>

        <div><label className="label">Judul Program *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="Nama program" /></div>

        <div><label className="label">Subjudul</label>
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="input" placeholder="For Non-Akuntan" /></div>

        <div>
          <label className="label">Warna Aksen</label>
          <div className="flex gap-2 mt-1">
            {COLORS.map(c => (
              <button key={c} onClick={() => setAccentColor(c)}
                className={`w-7 h-7 rounded-lg border-2 transition-all ${accentColor===c?"border-dark scale-110":"border-transparent"}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div><label className="label">Deskripsi</label>
          <textarea rows={4} value={description} onChange={e => setDesc(e.target.value)} className="input resize-none" /></div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Teks Tombol</label>
            <input value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} className="input" /></div>
          <div><label className="label">Link Tombol</label>
            <input value={ctaHref} onChange={e => setCtaHref(e.target.value)} className="input" placeholder="mailto: atau https://" /></div>
        </div>

        {/* Highlights */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="label mb-0">Highlights Program</label>
              <p className="text-[0.68rem] text-muted mt-0.5">Poin-poin unggulan yang ditampilkan di promo modal</p>
            </div>
            <button onClick={addHighlight} className="flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/60 hover:text-dark">
              <Plus size={13} /> Tambah
            </button>
          </div>
          {highlights.length === 0 && (
            <p className="text-[0.78rem] text-muted italic py-2">Belum ada highlight. Klik Tambah untuk menambahkan.</p>
          )}
          <div className="flex flex-col gap-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={h.icon}
                  onChange={e => updateHighlight(i, "icon", e.target.value)}
                  placeholder="Emoji / icon"
                  className="input text-[0.85rem] w-16 text-center flex-shrink-0"
                />
                <input
                  value={h.text}
                  onChange={e => updateHighlight(i, "text", e.target.value)}
                  placeholder="Deskripsi highlight…"
                  className="input text-[0.85rem] flex-1"
                />
                <button onClick={() => removeHighlight(i)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Facilitators */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label mb-0">Tim Fasilitator</label>
            <button onClick={addFacilitator} className="flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/60 hover:text-dark">
              <Plus size={13} /> Tambah
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {facilitators.map((f, i) => (
              <div key={i} className="border border-border rounded-xl p-4 relative">
                <button onClick={() => removeFacilitator(i)}
                  className="absolute top-3 right-3 p-1 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={13} />
                </button>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input value={f.name} onChange={e => updateFacilitator(i,"name",e.target.value)} placeholder="Nama lengkap" className="input text-[0.8rem]" />
                  <input value={f.role} onChange={e => updateFacilitator(i,"role",e.target.value)} placeholder="Jabatan" className="input text-[0.8rem]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={f.org} onChange={e => updateFacilitator(i,"org",e.target.value)} placeholder="Institusi" className="input text-[0.8rem]" />
                  <input value={f.img ?? ""} onChange={e => updateFacilitator(i,"img",e.target.value)} placeholder="URL foto (opsional)" className="input text-[0.8rem]" />
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={!!f.main} onChange={e => updateFacilitator(i,"main",e.target.checked)} />
                  <span className="text-[0.75rem] text-muted">Koordinator utama</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
          onClick={save} disabled={saving || !title}
          className="flex items-center justify-center gap-2 bg-dark text-white font-bold py-3.5 rounded-xl disabled:opacity-50 mt-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Simpan Perubahan
        </motion.button>
      </div>

      <style jsx global>{`
        .label { display:block; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#888; margin-bottom:6px; }
        .input { width:100%; border:1px solid #E5E5E5; border-radius:10px; padding:9px 13px; font-size:0.85rem; outline:none; transition:border-color 0.15s; background:#FAFAFA; }
        .input:focus { border-color:#aaa; background:#fff; }
      `}</style>
    </div>
  );
}
