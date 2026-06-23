"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Check, Copy, Image as ImageIcon, Loader2, Megaphone, Plus, Trash2, Upload, X } from "lucide-react";

const COLORS = ["#4F46E5","#10B981","#EF4444","#F59E0B","#8B5CF6","#0EA5E9","#F97316"];
const STATUSES = [
  { value: "coming_soon", label: "Coming Soon" },
  { value: "open",        label: "Pendaftaran Dibuka" },
  { value: "closed",      label: "Pendaftaran Ditutup" },
];

interface Facilitator { name: string; role: string; org: string; img: string; main?: boolean; }
interface Highlight   { icon: string; text: string; }
type PromoPlacement = "banner" | "popup";
interface PromoRecord {
  id: string;
  active: boolean;
  badge: string;
  badge_color: string;
  tag: string;
  title: string;
  subtitle: string | null;
  accent_color: string;
  description: string | null;
  status: string;
  cta_label: string;
  cta_href: string;
  facilitators: Facilitator[] | null;
  highlights: Array<Highlight | string> | null;
  created_at: string;
  updated_at: string;
}

const EMPTY_FACILITATORS: Facilitator[] = [{ name:"", role:"", org:"", img:"" }];
const PLACEMENT_META_ICON = "__placement";

function getPromoPlacement(highlights: PromoRecord["highlights"]): PromoPlacement {
  const placement = (highlights ?? []).find((item) =>
    typeof item !== "string" && item.icon === PLACEMENT_META_ICON
  );
  return placement && typeof placement !== "string" && placement.text === "popup" ? "popup" : "banner";
}

function withoutPlacementMeta(highlights: PromoRecord["highlights"]): Highlight[] {
  return (highlights ?? [])
    .map((item) => typeof item === "string" ? { icon: "✅", text: item } : item)
    .filter((item) => item.text && item.icon !== PLACEMENT_META_ICON);
}

function withPlacementMeta(highlights: Highlight[], placement: PromoPlacement): Highlight[] {
  return [{ icon: PLACEMENT_META_ICON, text: placement }, ...highlights.filter((item) => item.icon !== PLACEMENT_META_ICON)];
}

export default function AdminPromo() {
  const [promos,      setPromos]      = useState<PromoRecord[]>([]);
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
  const [ctaHref,     setCtaHref]     = useState("mailto:grcc.ailg@gmail.com");
  const [facilitators,setFacilitators]= useState<Facilitator[]>([{ name:"", role:"", org:"", img:"" }]);
  const [highlights,  setHighlights]  = useState<Highlight[]>([]);
  const [placement,   setPlacement]   = useState<PromoPlacement>("banner");
  const [choosingPlacement, setChoosingPlacement] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [uploadingFacilitatorPhoto, setUploadingFacilitatorPhoto] = useState<number | null>(null);
  const [msg,         setMsg]         = useState("");
  const [loading,     setLoading]     = useState(true);

  const populateForm = (data: PromoRecord) => {
    const normalizedHighlights = withoutPlacementMeta(data.highlights);
    setId(data.id); setActive(data.active); setBadge(data.badge || "");
    setPlacement(getPromoPlacement(data.highlights));
    setBadgeColor(data.badge_color || "#EF4444"); setTag(data.tag || "");
    setTitle(data.title || ""); setSubtitle(data.subtitle ?? "");
    setAccentColor(data.accent_color || "#4F46E5"); setDesc(data.description ?? "");
    setStatus(data.status || "coming_soon"); setCtaLabel(data.cta_label || "Daftar & Info Lengkap");
    setCtaHref(data.cta_href || "mailto:grcc.ailg@gmail.com");
    setFacilitators(data.facilitators?.length ? data.facilitators : EMPTY_FACILITATORS);
    setHighlights(normalizedHighlights);
  };

  const resetForm = (nextPlacement: PromoPlacement = "banner") => {
    setId(null);
    setActive(true);
    setPlacement(nextPlacement);
    setBadge("Promo Baru");
    setBadgeColor("#EF4444");
    setTag("GRCC × AILG · Universitas Airlangga");
    setTitle("");
    setSubtitle("");
    setAccentColor("#4F46E5");
    setDesc(nextPlacement === "banner" ? "" : "Tuliskan informasi promo yang ingin ditampilkan di popup.");
    setStatus("open");
    setCtaLabel(nextPlacement === "banner" ? "Lihat Info" : "Daftar & Info Lengkap");
    setCtaHref("mailto:grcc.ailg@gmail.com");
    setFacilitators(EMPTY_FACILITATORS);
    setHighlights([]);
  };

  const applyCsslBatchTemplate = () => {
    setId(null);
    setActive(true);
    setPlacement("banner");
    setBadge("CSSL Batch 5");
    setBadgeColor("#EF4444");
    setTag("GRCC × AILG · Universitas Airlangga");
    setTitle("Certified Sustainability Strategist & Leader (CSSL) Batch 5");
    setSubtitle("Promo pendaftaran terbatas");
    setAccentColor("#EF4444");
    setDesc("Program sertifikasi untuk memperkuat kompetensi strategi, tata kelola, inovasi, pelaporan, dan kepemimpinan keberlanjutan.");
    setStatus("open");
    setCtaLabel("Daftar CSSL Batch 5");
    setCtaHref("/training");
    setFacilitators(EMPTY_FACILITATORS);
    setHighlights([
      { icon: "✓", text: "Sertifikasi profesional keberlanjutan" },
      { icon: "✓", text: "Materi strategi ESG dan leadership" },
      { icon: "✓", text: "Kuota peserta terbatas" },
    ]);
  };

  const loadPromos = async () => {
    const { data } = await supabase
      .from("promo")
      .select("*")
      .order("updated_at", { ascending: false });
    const rows = (data ?? []) as PromoRecord[];
    setPromos(rows);
    return rows;
  };

  useEffect(() => {
    (async () => {
      try {
        const rows = await loadPromos();
        if (rows[0]) populateForm(rows[0]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addFacilitator = () => setFacilitators([...facilitators, { name:"", role:"", org:"", img:"", main: false }]);
  const removeFacilitator = (i: number) => setFacilitators(facilitators.filter((_,idx) => idx !== i));
  const updateFacilitator = (i: number, field: keyof Facilitator, val: string | boolean) =>
    setFacilitators(facilitators.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  const uploadFacilitatorPhoto = async (i: number, file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setMsg("Format foto harus JPG, PNG, atau WebP.");
      setTimeout(() => setMsg(""), 2500);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setMsg("Foto fasilitator maksimal 15MB.");
      setTimeout(() => setMsg(""), 2500);
      return;
    }

    setUploadingFacilitatorPhoto(i);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `promo-facilitators/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("insight-images")
      .upload(filename, file, { contentType: file.type, upsert: false });

    setUploadingFacilitatorPhoto(null);
    if (error) {
      setMsg(`Gagal upload foto: ${error.message}`);
      setTimeout(() => setMsg(""), 3500);
      return;
    }

    const { data: pub } = supabase.storage.from("insight-images").getPublicUrl(data.path);
    updateFacilitator(i, "img", pub.publicUrl);
    setMsg("Foto fasilitator berhasil diupload!");
    setTimeout(() => setMsg(""), 2500);
  };

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
      facilitators, highlights: withPlacementMeta(highlights, placement), updated_at: new Date().toISOString(),
    };
    let savedId = id;
    if (id) {
      await supabase.from("promo").update(payload).eq("id", id);
    } else {
      const { data } = await supabase.from("promo").insert(payload).select().single();
      if (data) {
        savedId = data.id;
        setId(data.id);
      }
    }
    const rows = await loadPromos();
    const saved = rows.find((p) => p.id === savedId);
    if (saved) populateForm(saved);
    setSaving(false);
    setMsg("Promo berhasil disimpan!");
    setTimeout(() => setMsg(""), 2500);
  };

  const duplicatePromo = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("promo").insert({
      active: false,
      badge,
      badge_color: badgeColor,
      tag,
      title: `${title} (Copy)`,
      subtitle,
      accent_color: accentColor,
      description,
      status,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      facilitators,
      highlights: withPlacementMeta(highlights, placement),
      updated_at: new Date().toISOString(),
    }).select().single();
    const rows = await loadPromos();
    if (data) {
      const created = rows.find((p) => p.id === data.id);
      if (created) populateForm(created);
    }
    setSaving(false);
    setMsg("Promo berhasil diduplikasi. Status copy dibuat nonaktif.");
    setTimeout(() => setMsg(""), 3000);
  };

  const deletePromo = async () => {
    if (!id) return;
    if (!confirm(`Hapus promo "${title || "tanpa judul"}"? Promo yang dihapus tidak bisa dikembalikan.`)) return;
    setSaving(true);
    await supabase.from("promo").delete().eq("id", id);
    const rows = await loadPromos();
    if (rows[0]) populateForm(rows[0]);
    else resetForm();
    setSaving(false);
    setMsg("Promo berhasil dihapus.");
    setTimeout(() => setMsg(""), 2500);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-muted" /></div>;

  return (
    <div className="max-w-[1180px]">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Promo Website</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">Kelola iklan popup dan banner atas dalam satu tempat.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={applyCsslBatchTemplate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-100 text-[0.82rem] font-bold hover:bg-red-100 transition-colors">
            <Megaphone size={15} /> Isi Cepat CSSL Batch 5
          </button>
          <button onClick={() => setChoosingPlacement(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark text-white text-[0.82rem] font-bold hover:bg-dark/90 transition-colors">
            <Plus size={15} /> Tambah Promo
          </button>
        </div>
      </div>

      {choosingPlacement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setChoosingPlacement(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-[680px] rounded-3xl bg-white border border-border p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-muted">Pilih Jenis Iklan</p>
                <h2 className="text-[1.35rem] font-extrabold tracking-tight mt-1">Promo ini mau tampil di mana?</h2>
                <p className="text-muted text-[0.82rem] mt-1">Pilihan ini bisa diganti lagi saat mengedit promo.</p>
              </div>
              <button onClick={() => setChoosingPlacement(false)} className="p-2 rounded-xl border border-border text-muted hover:text-dark">
                <X size={16} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => { resetForm("banner"); setChoosingPlacement(false); }}
                className="text-left rounded-2xl border border-red-100 bg-red-50/70 p-5 hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <span className="inline-flex w-10 h-10 rounded-2xl bg-red-600 text-white items-center justify-center mb-4">
                  <Megaphone size={18} />
                </span>
                <p className="font-extrabold text-[1rem]">Banner Atas</p>
                <p className="text-[0.78rem] text-muted leading-relaxed mt-2">
                  Untuk pengumuman singkat, kode promo, atau info cepat satu pelatihan. Tampil tipis di atas navbar.
                </p>
              </button>

              <button
                onClick={() => { resetForm("popup"); setChoosingPlacement(false); }}
                className="text-left rounded-2xl border border-border bg-[#FAFAFA] p-5 hover:bg-white hover:border-dark/20 transition-colors"
              >
                <span className="inline-flex w-10 h-10 rounded-2xl bg-dark text-white items-center justify-center mb-4">
                  <Megaphone size={18} />
                </span>
                <p className="font-extrabold text-[1rem]">Popup Iklan</p>
                <p className="text-[0.78rem] text-muted leading-relaxed mt-2">
                  Untuk promo yang butuh penjelasan lebih lengkap, highlight program, dan tampilan visual di tengah layar.
                </p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {msg && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-5">
          <Check size={15} /> {msg}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">
        <div className="bg-white rounded-2xl border border-border p-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-muted">Daftar Promo</p>
            <span className="text-[0.7rem] font-semibold text-muted">{promos.length} item</span>
          </div>
          {promos.length === 0 ? (
            <div className="text-center py-10 text-muted">
              <p className="text-[0.82rem] font-semibold">Belum ada promo</p>
              <p className="text-[0.72rem] mt-1">Klik Tambah Promo untuk mulai.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {promos.map((promo) => (
                <button
                  key={promo.id}
                  onClick={() => populateForm(promo)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    id === promo.id
                      ? "border-dark bg-dark text-white"
                      : "border-border bg-[#FAFAFA] hover:bg-dark/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: promo.active ? "#10B981" : "#D4D4D4" }} />
                    <p className={`text-[0.78rem] font-extrabold line-clamp-1 ${id === promo.id ? "text-white" : "text-dark"}`}>
                      {promo.title || "Promo tanpa judul"}
                    </p>
                  </div>
                  <p className={`text-[0.68rem] line-clamp-1 ${id === promo.id ? "text-white/55" : "text-muted"}`}>
                    {getPromoPlacement(promo.highlights) === "popup" ? "Popup Iklan" : "Banner Atas"} · {promo.badge || "Tanpa badge"} · {promo.active ? "Aktif" : "Nonaktif"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

      <div className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-muted">
              {id ? "Edit Promo" : "Promo Baru"}
            </p>
            <p className="text-[0.76rem] text-muted mt-1">
              {id ? "Perubahan akan tersimpan ke promo yang sedang dipilih." : "Isi detail lalu simpan sebagai promo baru."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={duplicatePromo}
              disabled={saving || !title.trim()}
              className="p-2.5 rounded-xl border border-border text-muted hover:text-dark hover:bg-dark/[0.04] disabled:opacity-40 transition-colors"
              title="Duplikat promo"
            >
              <Copy size={15} />
            </button>
            {id && (
              <button
                onClick={deletePromo}
                disabled={saving}
                className="p-2.5 rounded-xl border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                title="Hapus promo"
              >
                <Trash2 size={15} />
              </button>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer pl-1">
              <span className="text-[0.8rem] font-semibold">{active ? "Aktif" : "Nonaktif"}</span>
              <div onClick={() => setActive(v => !v)}
                className={`w-11 h-6 rounded-full transition-colors relative ${active ? "bg-emerald-500" : "bg-dark/20"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${active ? "left-5" : "left-0.5"}`} />
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="label">Jenis Iklan</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlacement("banner")}
              className={`text-left rounded-2xl border px-4 py-3 transition-all ${placement === "banner" ? "border-red-200 bg-red-50 text-red-800" : "border-border bg-[#FAFAFA] text-dark/70 hover:border-dark/20"}`}
            >
              <p className="text-[0.82rem] font-extrabold">Banner Atas</p>
              <p className="text-[0.7rem] mt-1 opacity-75">Pengumuman singkat atau kode promo pelatihan.</p>
            </button>
            <button
              type="button"
              onClick={() => setPlacement("popup")}
              className={`text-left rounded-2xl border px-4 py-3 transition-all ${placement === "popup" ? "border-dark bg-dark text-white" : "border-border bg-[#FAFAFA] text-dark/70 hover:border-dark/20"}`}
            >
              <p className="text-[0.82rem] font-extrabold">Popup Iklan</p>
              <p className="text-[0.7rem] mt-1 opacity-75">Promo lengkap yang muncul di tengah layar.</p>
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border px-4 py-3 text-[0.78rem] ${placement === "banner" ? "border-red-100 bg-red-50/70 text-red-900" : "border-indigo-100 bg-indigo-50/70 text-indigo-900"}`}>
          <p className="font-extrabold">{placement === "banner" ? "Yang tampil di banner atas:" : "Yang tampil di popup:"}</p>
          <p className="mt-1 opacity-75">
            {placement === "banner"
              ? "Teks badge, judul program, subjudul, status aktif, teks tombol, dan link tombol."
              : "Badge, tag penyelenggara, judul, subjudul, deskripsi, highlights, fasilitator, dan tombol CTA."}
          </p>
        </div>

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
              <p className="text-[0.68rem] text-muted mt-0.5">Poin-poin unggulan untuk data promosi internal</p>
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
                  <div className="rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-2">
                    <input
                      id={`facilitator-photo-${i}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) uploadFacilitatorPhoto(i, file);
                        e.currentTarget.value = "";
                      }}
                    />
                    {f.img ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-white flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.img} alt={f.name || "Foto fasilitator"} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.72rem] font-bold text-emerald-700 truncate">Foto aktif</p>
                          <p className="text-[0.62rem] text-muted truncate">{f.img.split("/").pop()}</p>
                        </div>
                        <label
                          htmlFor={`facilitator-photo-${i}`}
                          className="cursor-pointer p-1.5 rounded-lg bg-dark text-white hover:bg-dark/90 transition-colors"
                          title="Ganti foto"
                        >
                          {uploadingFacilitatorPhoto === i ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        </label>
                        <button
                          type="button"
                          onClick={() => updateFacilitator(i, "img", "")}
                          className="p-1.5 rounded-lg border border-border text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Hapus foto"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`facilitator-photo-${i}`}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-white px-3 py-2 text-[0.75rem] font-bold text-dark/65 hover:bg-dark/[0.03] transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-dark/[0.06] flex items-center justify-center flex-shrink-0">
                          {uploadingFacilitatorPhoto === i ? <Loader2 size={14} className="animate-spin text-muted" /> : <ImageIcon size={14} className="text-muted" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block">Upload foto</span>
                          <span className="block text-[0.62rem] font-semibold text-muted">JPG, PNG, WebP · maks. 15MB</span>
                        </span>
                      </label>
                    )}
                  </div>
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
          {id ? "Simpan Perubahan" : "Simpan Promo Baru"}
        </motion.button>
      </div>
      </div>

      <style jsx global>{`
        .label { display:block; font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#888; margin-bottom:6px; }
        .input { width:100%; border:1px solid #E5E5E5; border-radius:10px; padding:9px 13px; font-size:0.85rem; outline:none; transition:border-color 0.15s; background:#FAFAFA; }
        .input:focus { border-color:#aaa; background:#fff; }
      `}</style>
    </div>
  );
}
