"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, ProgramItem, SubProgramItem } from "@/lib/supabase";
import {
  Plus, Pencil, Trash2, X, Check, Loader2, ChevronDown, ChevronUp,
  GripVertical, Eye, EyeOff, ArrowUpRight,
} from "lucide-react";

// ── Icon options (maps to Lucide names used in public pages) ──────────────────
const ICON_OPTIONS = [
  "Shield","Leaf","BookOpen","Search","TrendingUp","Users","Cpu","FlaskConical",
  "Star","Zap","Globe","Target","Award","BarChart2","Brain","Layers",
  "Settings","Database","Code","Heart",
];

const ACCENT_COLORS = [
  "#4F46E5","#10B981","#F59E0B","#EF4444","#0EA5E9","#8B5CF6",
  "#06B6D4","#F97316","#EC4899","#14B8A6",
];

const BG_COLORS = [
  "#0D0D0D","#1A1A2E","#071A0F","#1C0E00","#1A0A0A","#0A1520",
  "#120A1E","#071A1E","#1A0D00","#0A0A14",
];

// ── Empty states ──────────────────────────────────────────────────────────────
const EMPTY_PROGRAM: Omit<ProgramItem,"id"|"created_at"|"updated_at"> = {
  title: "", short: "", accent: "#4F46E5", bg: "#0D0D0D",
  tagline: "", description: "", icon_name: "Shield",
  order_index: 0, active: true,
};

const EMPTY_SUB: Omit<SubProgramItem,"id"|"program_id"|"created_at"|"updated_at"> = {
  name: "", slug: "", description: "", order_index: 0, active: true,
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── Sub-program form modal ────────────────────────────────────────────────────
function SubModal({
  sub, onSave, onClose, saving,
}: {
  sub: typeof EMPTY_SUB & { id?: string };
  onSave: (data: typeof EMPTY_SUB & { id?: string }) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(sub);
  const [slugManual, setSlugManual] = useState(!!sub.slug);

  const handleNameChange = (v: string) => {
    setForm(f => ({ ...f, name: v, slug: slugManual ? f.slug : toSlug(v) }));
  };

  return (
    <>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.96 }} transition={{ type:"spring", stiffness:320, damping:26 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="flex items-center justify-between px-7 py-4 border-b border-border">
            <h3 className="font-extrabold">{form.id ? "Edit Sub-Program" : "Tambah Sub-Program"}</h3>
            <button onClick={onClose}><X size={18} className="text-muted hover:text-dark" /></button>
          </div>
          <div className="px-7 py-6 flex flex-col gap-4">
            <div>
              <label className="label">Nama Sub-Program *</label>
              <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                placeholder="Nama program pelatihan" className="input" />
            </div>
            <div>
              <label className="label">Slug URL</label>
              <input value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                placeholder="otomatis dari nama" className="input font-mono text-[0.8rem]" />
              <p className="text-[0.68rem] text-muted mt-1">
                URL: /programs/[program-id]/<strong>{form.slug || "slug-otomatis"}</strong>
              </p>
            </div>
            <div>
              <label className="label">Deskripsi</label>
              <textarea rows={8} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi lengkap sub-program&#10;&#10;Paragraf baru dipisah baris kosong"
                className="input resize-y font-[inherit]" style={{ minHeight: 180 }} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${form.active ? "bg-dark" : "bg-dark/20"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.active ? "left-5" : "left-0.5"}`} />
              </div>
              <span className="text-[0.82rem] font-semibold">Aktif (tampil di website)</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 px-7 py-5 border-t border-border">
            <button onClick={onClose} className="text-[0.82rem] font-semibold px-4 py-2.5 rounded-xl hover:bg-dark/[0.06]">Batal</button>
            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
              onClick={() => onSave(form)} disabled={saving || !form.name || !form.slug}
              className="flex items-center gap-2 bg-dark text-white text-[0.82rem] font-bold px-5 py-2.5 rounded-xl disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Simpan
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminPrograms() {
  const [programs, setPrograms]       = useState<ProgramItem[]>([]);
  const [subs,     setSubs]           = useState<SubProgramItem[]>([]);
  const [loading,  setLoading]        = useState(true);
  const [selected, setSelected]       = useState<string | null>(null);  // program id
  const [editProg, setEditProg]       = useState<typeof EMPTY_PROGRAM | null>(null);
  const [editProgId, setEditProgId]   = useState<string | null>(null);
  const [subModal, setSubModal]       = useState<(typeof EMPTY_SUB & { id?: string }) | null>(null);
  const [saving,   setSaving]         = useState(false);
  const [savingSub, setSavingSub]     = useState(false);
  const [msg,      setMsg]            = useState("");
  const [expandDesc, setExpandDesc]   = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    const [{ data: progs }, { data: subData }] = await Promise.all([
      supabase.from("programs").select("*").order("order_index"),
      supabase.from("sub_programs").select("*").order("order_index"),
    ]);
    setPrograms(progs ?? []);
    setSubs(subData ?? []);
    if (!selected && progs && progs.length > 0) setSelected(progs[0].id);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  const selectedProg = programs.find(p => p.id === selected);
  const selectedSubs = subs.filter(s => s.program_id === selected).sort((a, b) => a.order_index - b.order_index);

  // ── Save program (edit existing) ────────────────────────────────────────────
  const saveProg = async () => {
    if (!editProg || !editProgId) return;
    setSaving(true);
    const { error } = await supabase.from("programs").update(editProg).eq("id", editProgId);
    setSaving(false);
    if (error) { flash(`Gagal: ${error.message}`); return; }
    flash("Program diperbarui!");
    setEditProg(null); setEditProgId(null);
    load();
  };

  // ── Toggle program active ────────────────────────────────────────────────────
  const toggleProg = async (id: string, val: boolean) => {
    await supabase.from("programs").update({ active: !val }).eq("id", id);
    load();
  };

  // ── Reorder programs ─────────────────────────────────────────────────────────
  const moveProg = async (id: string, dir: -1 | 1) => {
    const idx = programs.findIndex(p => p.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= programs.length) return;
    const a = programs[idx], b = programs[swapIdx];
    await Promise.all([
      supabase.from("programs").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("programs").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    load();
  };

  // ── Save sub-program ─────────────────────────────────────────────────────────
  const saveSub = async (data: typeof EMPTY_SUB & { id?: string }) => {
    if (!selected) return;
    setSavingSub(true);
    if (data.id) {
      await supabase.from("sub_programs").update({
        name: data.name, slug: data.slug, description: data.description,
        active: data.active,
      }).eq("id", data.id);
    } else {
      const maxOrder = selectedSubs.length > 0 ? Math.max(...selectedSubs.map(s => s.order_index)) + 1 : 0;
      await supabase.from("sub_programs").insert({
        program_id: selected, name: data.name, slug: data.slug,
        description: data.description, active: data.active, order_index: maxOrder,
      });
    }
    setSavingSub(false);
    flash(data.id ? "Sub-program diperbarui!" : "Sub-program ditambahkan!");
    setSubModal(null);
    load();
  };

  // ── Delete sub-program ────────────────────────────────────────────────────────
  const deleteSub = async (id: string) => {
    if (!confirm("Hapus sub-program ini?")) return;
    await supabase.from("sub_programs").delete().eq("id", id);
    flash("Sub-program dihapus.");
    load();
  };

  // ── Toggle sub active ─────────────────────────────────────────────────────────
  const toggleSub = async (id: string, val: boolean) => {
    await supabase.from("sub_programs").update({ active: !val }).eq("id", id);
    load();
  };

  // ── Reorder subs ──────────────────────────────────────────────────────────────
  const moveSub = async (id: string, dir: -1 | 1) => {
    const idx = selectedSubs.findIndex(s => s.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= selectedSubs.length) return;
    const a = selectedSubs[idx], b = selectedSubs[swapIdx];
    await Promise.all([
      supabase.from("sub_programs").update({ order_index: b.order_index }).eq("id", a.id),
      supabase.from("sub_programs").update({ order_index: a.order_index }).eq("id", b.id),
    ]);
    load();
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-muted" /></div>
  );

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.4rem] font-extrabold tracking-tight">Program</h1>
          <p className="text-muted text-[0.83rem] mt-0.5">{programs.length} program · {subs.length} sub-program</p>
        </div>
        <a href="/programs" target="_blank"
          className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-muted hover:text-dark transition-colors border border-border rounded-xl px-3.5 py-2">
          <ArrowUpRight size={13} /> Lihat di Website
        </a>
      </div>

      {/* Flash message */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[0.82rem] font-semibold px-4 py-3 rounded-xl mb-4">
            <Check size={15} /> {msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5 items-start">
        {/* ── Left: program list ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#F7F7F5]">
            <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-muted">Program</p>
          </div>
          <div className="divide-y divide-border">
            {programs.map((p, i) => (
              <div key={p.id}
                onClick={() => { setSelected(p.id); setEditProg(null); setEditProgId(null); setExpandDesc(false); }}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${selected === p.id ? "bg-dark/[0.05]" : "hover:bg-dark/[0.02]"}`}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.accent }} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.82rem] font-semibold truncate ${selected === p.id ? "text-dark" : "text-dark/60"}`}>{p.title}</p>
                  <p className="text-[0.65rem] text-muted">{p.short} · {subs.filter(s => s.program_id === p.id).length} sub</p>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); moveProg(p.id, -1); }} disabled={i === 0}
                    className="p-1 rounded hover:bg-dark/[0.07] disabled:opacity-20 transition-colors"><ChevronUp size={12} /></button>
                  <button onClick={e => { e.stopPropagation(); moveProg(p.id, 1); }} disabled={i === programs.length - 1}
                    className="p-1 rounded hover:bg-dark/[0.07] disabled:opacity-20 transition-colors"><ChevronDown size={12} /></button>
                  <button onClick={e => { e.stopPropagation(); toggleProg(p.id, p.active); }}
                    className="p-1 rounded hover:bg-dark/[0.07] transition-colors">
                    {p.active ? <Eye size={12} className="text-emerald-500" /> : <EyeOff size={12} className="text-muted" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: detail + subs ─────────────────────────────────────────── */}
        {selectedProg && (
          <div className="flex flex-col gap-4">
            {/* Program card */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#F7F7F5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProg.accent }} />
                  <p className="font-extrabold text-[0.95rem]">
                    {selectedProg.short} — {selectedProg.title}
                  </p>
                </div>
                {editProgId !== selectedProg.id ? (
                  <button onClick={() => { setEditProg({ ...selectedProg }); setEditProgId(selectedProg.id); setExpandDesc(false); }}
                    className="flex items-center gap-1.5 text-[0.75rem] font-bold text-dark/50 hover:text-dark border border-border rounded-xl px-3 py-1.5 transition-all">
                    <Pencil size={12} /> Edit Program
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditProg(null); setEditProgId(null); }}
                      className="text-[0.75rem] font-semibold text-muted hover:text-dark px-3 py-1.5">Batal</button>
                    <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      onClick={saveProg} disabled={saving}
                      className="flex items-center gap-1.5 bg-dark text-white text-[0.75rem] font-bold px-4 py-1.5 rounded-xl disabled:opacity-50">
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Simpan
                    </motion.button>
                  </div>
                )}
              </div>

              {editProgId === selectedProg.id && editProg ? (
                /* ── Edit form ── */
                <div className="px-6 py-5 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label">Judul Program *</label>
                    <input value={editProg.title} onChange={e => setEditProg({ ...editProg, title: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className="label">Singkatan</label>
                    <input value={editProg.short} onChange={e => setEditProg({ ...editProg, short: e.target.value })} className="input" placeholder="GRC, ESG…" />
                  </div>
                  <div>
                    <label className="label">Icon</label>
                    <select value={editProg.icon_name} onChange={e => setEditProg({ ...editProg, icon_name: e.target.value })} className="input">
                      {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Warna Aksen</label>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {ACCENT_COLORS.map(c => (
                        <button key={c} onClick={() => setEditProg({ ...editProg, accent: c })}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${editProg.accent === c ? "border-dark scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                      <input type="color" value={editProg.accent}
                        onChange={e => setEditProg({ ...editProg, accent: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent p-0" title="Custom color" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Warna Background (dark)</label>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {BG_COLORS.map(c => (
                        <button key={c} onClick={() => setEditProg({ ...editProg, bg: c })}
                          className={`w-7 h-7 rounded-lg border-2 transition-all ${editProg.bg === c ? "border-dark scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                      <input type="color" value={editProg.bg}
                        onChange={e => setEditProg({ ...editProg, bg: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent p-0" title="Custom color" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="label">Tagline</label>
                    <input value={editProg.tagline} onChange={e => setEditProg({ ...editProg, tagline: e.target.value })} className="input" placeholder="Kalimat singkat yang ditampilkan di hero" />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Deskripsi Program</label>
                    <textarea rows={4} value={editProg.description} onChange={e => setEditProg({ ...editProg, description: e.target.value })}
                      className="input resize-y" placeholder="Deskripsi lengkap program yang tampil di halaman program" />
                  </div>
                </div>
              ) : (
                /* ── Display view ── */
                <div className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-3 text-[0.78rem]">
                    <span className="px-2.5 py-1 rounded-full font-bold text-white text-[0.68rem]" style={{ backgroundColor: selectedProg.accent }}>{selectedProg.short}</span>
                    <span className="text-muted">Icon: <strong className="text-dark">{selectedProg.icon_name}</strong></span>
                    <span className="text-muted">Aksen: <strong className="font-mono">{selectedProg.accent}</strong></span>
                    <span className="text-muted">BG: <strong className="font-mono">{selectedProg.bg}</strong></span>
                  </div>
                  {selectedProg.tagline && <p className="text-[0.82rem] italic text-dark/60">&ldquo;{selectedProg.tagline}&rdquo;</p>}
                  <div>
                    <p className={`text-[0.82rem] text-dark/65 leading-[1.7] ${!expandDesc ? "line-clamp-2" : ""}`}>{selectedProg.description}</p>
                    {selectedProg.description.length > 120 && (
                      <button onClick={() => setExpandDesc(v => !v)} className="text-[0.72rem] font-bold text-dark/40 hover:text-dark mt-1 transition-colors">
                        {expandDesc ? "Sembunyikan ↑" : "Baca selengkapnya ↓"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sub-programs */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-[#F7F7F5]">
                <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-muted">
                  Sub-Program ({selectedSubs.length})
                </p>
                <button onClick={() => setSubModal({ ...EMPTY_SUB })}
                  className="flex items-center gap-1.5 bg-dark text-white text-[0.72rem] font-bold px-3 py-1.5 rounded-lg">
                  <Plus size={12} /> Tambah
                </button>
              </div>

              {selectedSubs.length === 0 ? (
                <div className="py-10 text-center text-muted text-[0.85rem]">
                  Belum ada sub-program.{" "}
                  <button onClick={() => setSubModal({ ...EMPTY_SUB })} className="font-bold underline">Tambah sekarang</button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {selectedSubs.map((sub, i) => (
                    <div key={sub.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-dark/[0.02] transition-colors group">
                      <GripVertical size={14} className="text-muted/40 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.85rem] font-semibold truncate">{sub.name}</p>
                        <p className="text-[0.68rem] text-muted font-mono">/programs/{selectedProg.id}/{sub.slug}</p>
                      </div>
                      <p className="text-[0.72rem] text-muted/50 hidden md:block line-clamp-1 max-w-[200px] flex-shrink-0">
                        {sub.description.slice(0, 60)}{sub.description.length > 60 ? "…" : ""}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveSub(sub.id, -1)} disabled={i === 0}
                          className="p-1 rounded hover:bg-dark/[0.07] disabled:opacity-20"><ChevronUp size={13} /></button>
                        <button onClick={() => moveSub(sub.id, 1)} disabled={i === selectedSubs.length - 1}
                          className="p-1 rounded hover:bg-dark/[0.07] disabled:opacity-20"><ChevronDown size={13} /></button>
                        <button onClick={() => toggleSub(sub.id, sub.active)}
                          className="p-1 rounded hover:bg-dark/[0.07]">
                          {sub.active ? <Eye size={13} className="text-emerald-500" /> : <EyeOff size={13} className="text-muted" />}
                        </button>
                        <button onClick={() => setSubModal({ ...sub })}
                          className="p-1.5 hover:bg-dark/[0.07] rounded-lg"><Pencil size={13} /></button>
                        <button onClick={() => deleteSub(sub.id)}
                          className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sub-program modal */}
      <AnimatePresence>
        {subModal && (
          <SubModal sub={subModal} onSave={saveSub} onClose={() => setSubModal(null)} saving={savingSub} />
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
