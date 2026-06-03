"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Registration, TrainingItem } from "@/lib/supabase";
import {
  Search, Filter, CheckCircle2, XCircle, Clock, Eye,
  Download, ExternalLink, X, ChevronDown, Users2,
  FileText, Phone, Mail, Building2, Briefcase,
  Receipt, Tag, RefreshCw, AlertCircle, Users,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "#F59E0B", bg: "#FEF3C7", icon: Clock         },
  confirmed: { label: "Confirmed", color: "#10B981", bg: "#D1FAE5", icon: CheckCircle2  },
  rejected:  { label: "Rejected",  color: "#EF4444", bg: "#FEE2E2", icon: XCircle       },
} as const;

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: Registration["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  reg, training, onClose, onStatusChange,
}: {
  reg: Registration;
  training: TrainingItem | undefined;
  onClose: () => void;
  onStatusChange: (id: string, status: Registration["status"]) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function resolveProofUrl() {
      if (!reg.bukti_pembayaran_url) {
        setProofUrl(null);
        return;
      }
      if (/^https?:\/\//i.test(reg.bukti_pembayaran_url)) {
        setProofUrl(reg.bukti_pembayaran_url);
        return;
      }
      const { data } = await supabase.storage
        .from("payment-proofs")
        .createSignedUrl(reg.bukti_pembayaran_url, 60 * 60);
      if (alive) setProofUrl(data?.signedUrl ?? null);
    }
    resolveProofUrl();
    return () => { alive = false; };
  }, [reg.bukti_pembayaran_url]);

  const updateStatus = async (status: Registration["status"]) => {
    setUpdating(true);
    const { error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", reg.id);
    if (!error) {
      onStatusChange(reg.id, status);
      // Kirim email notifikasi ke peserta saat confirmed/rejected
      if (status === "confirmed" || status === "rejected") {
        fetch("/api/status-update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId: reg.id, newStatus: status }),
        }).catch(() => {/* silent */});
      }
    }
    setUpdating(false);
  };

  const fields = [
    { icon: FileText,  label: "Nama Lengkap",    value: reg.nama_lengkap },
    { icon: Building2, label: "Asal Instansi",   value: reg.instansi },
    { icon: Briefcase, label: "Jabatan",          value: reg.jabatan },
    { icon: Mail,      label: "Email",            value: reg.email },
    { icon: Phone,     label: "Nomor Telepon",    value: reg.telepon },
    { icon: Tag,       label: "NPWP",             value: reg.npwp || "—" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <StatusBadge status={reg.status} />
                {reg.is_group && (
                  <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    <Users size={9} /> GRUP · {reg.participant_count} peserta
                  </span>
                )}
                <span className="text-[0.68rem] text-muted">{formatDate(reg.created_at)}</span>
              </div>
              <h2 className="text-[1.15rem] font-extrabold tracking-tight truncate">
                {reg.nama_lengkap}
                {reg.is_group && <span className="text-muted font-normal text-[0.85rem] ml-2">(PIC)</span>}
              </h2>
              {training && (
                <p className="text-[0.8rem] text-muted mt-0.5 truncate">{training.title}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-dark/[0.06] transition-colors text-muted"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Core fields */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                {reg.is_group ? "Data PIC / Koordinator" : "Data Peserta"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F7F5]">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                      <Icon size={13} className="text-dark/50" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.62rem] text-muted font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-[0.82rem] font-semibold text-dark break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants list (group only) */}
            {reg.is_group && reg.participants && reg.participants.length > 0 && (
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                  Daftar Peserta ({reg.participants.length} orang)
                </p>
                <div className="flex flex-col gap-2">
                  {reg.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F5]">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 text-[0.68rem] font-extrabold">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.82rem] font-semibold text-dark">{p.nama}</p>
                        <p className="text-[0.7rem] text-muted">{p.jabatan} · {p.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom fields */}
            {reg.custom_data && Object.keys(reg.custom_data).length > 0 && (
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                  Kolom Tambahan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(reg.custom_data).map(([key, val]) => {
                    // Find matching custom field label from training
                    const cf = training?.custom_fields?.find((f) => f.id === key);
                    return (
                      <div key={key} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F7F5]">
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
                          <Tag size={13} className="text-dark/50" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.62rem] text-muted font-semibold uppercase tracking-wide">
                            {cf?.label ?? key}
                          </p>
                          <p className="text-[0.82rem] font-semibold text-dark break-words">{val || "—"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price & Promo */}
            {(reg.original_price != null || reg.final_price != null || reg.promo_code) && (
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                  Harga & Diskon
                </p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="flex flex-col divide-y divide-border">
                    {reg.original_price != null && (
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-[0.78rem] text-muted">Harga Awal
                          {reg.is_group && reg.participant_count > 1 && (
                            <span className="ml-1 text-[0.7rem]">× {reg.participant_count}</span>
                          )}
                        </p>
                        <p className="text-[0.82rem] font-semibold text-dark">
                          Rp {reg.original_price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    )}
                    {reg.promo_code && (
                      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50">
                        <div className="flex items-center gap-2">
                          <Tag size={12} className="text-emerald-600" />
                          <p className="text-[0.78rem] font-bold text-emerald-700">
                            {reg.promo_code}
                          </p>
                        </div>
                        {reg.discount_amount != null && (
                          <p className="text-[0.82rem] font-bold text-emerald-700">
                            − Rp {reg.discount_amount.toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                    )}
                    {reg.final_price != null && (
                      <div className="flex items-center justify-between px-4 py-3 bg-[#F7F7F5]">
                        <p className="text-[0.82rem] font-bold text-dark">Total Pembayaran</p>
                        <p className="text-[0.95rem] font-extrabold text-dark">
                          Rp {reg.final_price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bukti Pembayaran */}
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-3">
                Bukti Pembayaran
              </p>
              {reg.bukti_pembayaran_url ? (
                <div className="rounded-xl border border-border overflow-hidden">
                  {reg.bukti_pembayaran_url.match(/\.(jpg|jpeg|png|webp|gif)$/i) && proofUrl ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proofUrl}
                        alt="Bukti Pembayaran"
                        className="w-full max-h-64 object-contain bg-[#F7F7F5]"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-[#F7F7F5]">
                      <Receipt size={20} className="text-muted" />
                      <p className="text-[0.82rem] text-dark font-medium flex-1 truncate">
                        {reg.bukti_pembayaran_url.split("/").pop()}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 p-3 border-t border-border bg-white">
                    <a
                      href={proofUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-dark hover:text-dark/70 transition-colors"
                    >
                      <ExternalLink size={13} />
                      Buka di Tab Baru
                    </a>
                    <a
                      href={proofUrl ?? "#"}
                      download
                      className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-muted hover:text-dark transition-colors ml-4"
                    >
                      <Download size={13} />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-[#F7F7F5] text-muted text-[0.82rem]">
                  <AlertCircle size={15} />
                  Belum ada bukti pembayaran
                </div>
              )}
            </div>

            {/* Admin notes */}
            {reg.notes && (
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted mb-2">Catatan</p>
                <p className="text-[0.82rem] text-dark bg-[#F7F7F5] rounded-xl p-3">{reg.notes}</p>
              </div>
            )}
          </div>

          {/* Footer — Status Actions */}
          <div className="border-t border-border p-5 bg-[#FAFAFA]">
            <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted mb-3">
              Ubah Status
            </p>
            <div className="flex gap-2">
              {(["pending", "confirmed", "rejected"] as const).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const Icon = cfg.icon;
                const isActive = reg.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={updating || isActive}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[0.78rem] font-bold transition-all border disabled:opacity-60 disabled:cursor-not-allowed"
                    style={
                      isActive
                        ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color + "40" }
                        : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }
                    }
                  >
                    {updating ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <Icon size={13} />
                    )}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
function RegistrationRow({
  reg, training, index, onSelect,
}: {
  reg: Registration;
  training: TrainingItem | undefined;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onSelect}
      className="border-b border-border hover:bg-[#F7F7F5] cursor-pointer transition-colors group"
    >
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[0.85rem] font-bold text-dark leading-tight">{reg.nama_lengkap}</p>
          {reg.is_group && (
            <span className="inline-flex items-center gap-0.5 text-[0.58rem] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex-shrink-0">
              <Users size={8} /> {reg.participant_count}
            </span>
          )}
        </div>
        <p className="text-[0.72rem] text-muted mt-0.5">{reg.email}</p>
      </td>
      <td className="py-4 px-3 hidden md:table-cell">
        <p className="text-[0.78rem] text-dark font-medium">{reg.instansi}</p>
        <p className="text-[0.7rem] text-muted">{reg.jabatan}</p>
      </td>
      <td className="py-4 px-3 hidden lg:table-cell">
        <p className="text-[0.78rem] text-dark font-medium line-clamp-1">
          {training?.title ?? <span className="text-muted">—</span>}
        </p>
        <p className="text-[0.7rem] text-muted">{training?.date_start ?? ""}</p>
      </td>
      <td className="py-4 px-3">
        <StatusBadge status={reg.status} />
      </td>
      <td className="py-4 px-3 hidden sm:table-cell">
        <p className="text-[0.72rem] text-muted">{formatDate(reg.created_at)}</p>
      </td>
      <td className="py-4 pl-3 pr-6">
        <div className="flex items-center justify-end">
          <span className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-dark/[0.08] transition-all text-muted">
            <Eye size={15} />
          </span>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Registration["status"]>("all");
  const [filterTraining, setFilterTraining] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "individu" | "grup">("all");
  const [showFilters, setShowFilters] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: regs }, { data: trs }] = await Promise.all([
      supabase.from("registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("training").select("*"),
    ]);
    setRegistrations(regs ?? []);
    setTrainings(trs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Update selected when status changes
  const handleStatusChange = (id: string, status: Registration["status"]) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const trainingMap = Object.fromEntries(trainings.map((t) => [t.id, t]));

  // Filtered list
  const filtered = registrations.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterTraining !== "all" && r.training_id !== filterTraining) return false;
    if (filterType === "grup" && !r.is_group) return false;
    if (filterType === "individu" && r.is_group) return false;
    if (search) {
      const q = search.toLowerCase();
      const t = trainingMap[r.training_id ?? ""];
      const inParticipants = r.is_group && r.participants?.some(
        (p) => p.nama.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      );
      return (
        r.nama_lengkap.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.instansi.toLowerCase().includes(q) ||
        t?.title.toLowerCase().includes(q) ||
        !!inParticipants
      );
    }
    return true;
  });

  // Counts
  const counts = {
    all:       registrations.length,
    pending:   registrations.filter((r) => r.status === "pending").length,
    confirmed: registrations.filter((r) => r.status === "confirmed").length,
    rejected:  registrations.filter((r) => r.status === "rejected").length,
    grup:      registrations.filter((r) => r.is_group).length,
  };

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-[1.6rem] font-extrabold tracking-tight">Registrasi</h1>
          <p className="text-muted text-[0.88rem] mt-1">Kelola semua pendaftaran pelatihan</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-dark/[0.05] text-[0.82rem] font-semibold text-dark/70 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {([
          ["all",       "Total",     "#4F46E5", Users2,       "status" ],
          ["pending",   "Pending",   "#F59E0B", Clock,        "status" ],
          ["confirmed", "Confirmed", "#10B981", CheckCircle2, "status" ],
          ["rejected",  "Rejected",  "#EF4444", XCircle,      "status" ],
          ["grup",      "Grup",      "#6366F1", Users,        "type"   ],
        ] as const).map(([key, label, color, Icon, kind], idx) => {
          const isActive = kind === "status"
            ? filterStatus === key
            : filterType === (key === "grup" ? "grup" : "all");
          return (
            <motion.button
              key={key}
              onClick={() => {
                if (kind === "status") setFilterStatus(key as "all" | Registration["status"]);
                else setFilterType((prev) => prev === "grup" ? "all" : "grup");
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? "border-transparent shadow-md"
                  : "border-border bg-white hover:border-dark/20"
              }`}
              style={isActive ? { backgroundColor: color + "12", borderColor: color + "30" } : {}}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color + "18" }}
              >
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p className="text-[1.2rem] font-extrabold leading-none" style={{ color: isActive ? color : "#111" }}>
                  {counts[key as keyof typeof counts]}
                </p>
                <p className="text-[0.7rem] text-muted font-semibold mt-0.5">{label}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-[#F7F7F5] rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari nama, email, instansi, atau training..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[0.84rem] outline-none text-dark placeholder:text-muted"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F7F7F5] border border-border">
          {([["all","Semua"],["individu","Individu"],["grup","Grup"]] as const).map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => setFilterType(val)}
              className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-semibold transition-all ${
                filterType === val
                  ? "bg-white text-dark shadow-sm border border-border"
                  : "text-muted hover:text-dark"
              }`}
            >
              {lbl}
              {val === "grup" && counts.grup > 0 && (
                <span className="ml-1.5 text-[0.65rem] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                  {counts.grup}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Training filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-[0.82rem] font-semibold text-dark/70 hover:bg-dark/[0.04] transition-colors"
          >
            <Filter size={14} />
            {filterTraining === "all" ? "Semua Training" : trainingMap[filterTraining]?.title.slice(0, 22) + "…"}
            <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-border shadow-xl z-10 py-1.5 max-h-72 overflow-y-auto"
              >
                <button
                  onClick={() => { setFilterTraining("all"); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[0.82rem] font-semibold transition-colors ${filterTraining === "all" ? "text-dark bg-dark/[0.05]" : "text-muted hover:text-dark hover:bg-dark/[0.03]"}`}
                >
                  Semua Training
                </button>
                {trainings.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setFilterTraining(t.id); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[0.82rem] transition-colors ${filterTraining === t.id ? "font-semibold text-dark bg-dark/[0.05]" : "text-muted hover:text-dark hover:bg-dark/[0.03]"}`}
                  >
                    <p className="font-semibold line-clamp-1">{t.title}</p>
                    <p className="text-[0.68rem] mt-0.5">{t.date_start}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-[0.76rem] text-muted ml-auto">
          {filtered.length} dari {registrations.length} registrasi
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-4 px-6 py-4 border-b border-border">
                <div className="flex-1">
                  <div className="h-4 w-36 bg-dark/[0.06] rounded animate-pulse mb-2" />
                  <div className="h-3 w-28 bg-dark/[0.04] rounded animate-pulse" />
                </div>
                <div className="h-3 w-24 bg-dark/[0.04] rounded animate-pulse hidden md:block" />
                <div className="h-6 w-20 bg-dark/[0.04] rounded-full animate-pulse" />
                <div className="h-3 w-28 bg-dark/[0.04] rounded animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <Users2 size={32} className="mb-3 opacity-30" />
            <p className="text-[0.88rem] font-semibold">Belum ada registrasi</p>
            <p className="text-[0.78rem] mt-1 opacity-70">
              {search || filterStatus !== "all" || filterTraining !== "all"
                ? "Coba ubah filter pencarian"
                : "Registrasi akan muncul di sini setelah peserta mendaftar"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#FAFAFA]">
                  <th className="text-left py-3 pl-6 pr-3 text-[0.68rem] font-bold uppercase tracking-widest text-muted">
                    Peserta
                  </th>
                  <th className="text-left py-3 px-3 text-[0.68rem] font-bold uppercase tracking-widest text-muted hidden md:table-cell">
                    Instansi
                  </th>
                  <th className="text-left py-3 px-3 text-[0.68rem] font-bold uppercase tracking-widest text-muted hidden lg:table-cell">
                    Training
                  </th>
                  <th className="text-left py-3 px-3 text-[0.68rem] font-bold uppercase tracking-widest text-muted">
                    Status
                  </th>
                  <th className="text-left py-3 px-3 text-[0.68rem] font-bold uppercase tracking-widest text-muted hidden sm:table-cell">
                    Daftar
                  </th>
                  <th className="py-3 pl-3 pr-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg, i) => (
                  <RegistrationRow
                    key={reg.id}
                    reg={reg}
                    training={trainingMap[reg.training_id ?? ""]}
                    index={i}
                    onSelect={() => setSelected(reg)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          reg={selected}
          training={trainingMap[selected.training_id ?? ""]}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
