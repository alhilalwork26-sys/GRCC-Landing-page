"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, CheckCircle2, Clock, XCircle, ArrowUpRight, Calendar, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

interface RegResult {
  id: string;
  nama_lengkap: string;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
  final_price: number | null;
  is_group: boolean;
  participant_count: number;
  training: {
    id: string;
    title: string;
    date_start: string;
    date_end: string | null;
    location: string;
    color: string;
  } | null;
}

const STATUS = {
  confirmed: {
    label: "Dikonfirmasi",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    desc: "Pendaftaran Anda telah diverifikasi. Bersiap untuk pelatihan!",
  },
  pending: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    color: "#F59E0B",
    bg: "#fffbeb",
    border: "#fde68a",
    desc: "Kami sedang memverifikasi pembayaran Anda. Proses 1–2 hari kerja.",
  },
  rejected: {
    label: "Tidak Dikonfirmasi",
    icon: XCircle,
    color: "#EF4444",
    bg: "#fef2f2",
    border: "#fecaca",
    desc: "Pendaftaran tidak dapat diproses. Hubungi kami untuk info lebih lanjut.",
  },
};

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function CekStatusPage() {
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RegResult[] | null>(null);
  const [error,   setError]   = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    const { data, error: err } = await supabase
      .from("registrations")
      .select(`
        id, nama_lengkap, status, created_at, final_price, is_group, participant_count,
        training:training_id (id, title, date_start, date_end, location, color)
      `)
      .eq("email", email.trim().toLowerCase())
      .order("created_at", { ascending: false });

    setLoading(false);

    if (err) { setError("Terjadi kesalahan. Silakan coba lagi."); return; }

    const mapped: RegResult[] = (data ?? []).map((r: any) => ({
      ...r,
      training: Array.isArray(r.training) ? r.training[0] ?? null : r.training,
    }));

    setResults(mapped);
    if (mapped.length === 0) setError("Tidak ada pendaftaran ditemukan untuk email ini.");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F7F5]">

        {/* Hero */}
        <section className="bg-white border-b border-border">
          <div className="max-w-[640px] mx-auto px-6 py-[clamp(48px,6vw,72px)] text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="w-16 h-16 rounded-2xl bg-dark/[0.06] flex items-center justify-center mx-auto mb-6">
                <Search size={26} className="text-dark/40" />
              </div>
              <p className="text-[0.72rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">Cek Pendaftaran</p>
              <h1 className="font-extrabold text-[clamp(1.8rem,4vw,2.8rem)] tracking-tight leading-[1.1] mb-4">
                Status Pendaftaran Anda
              </h1>
              <p className="text-muted text-[0.93rem] leading-[1.75]">
                Masukkan email yang digunakan saat mendaftar untuk melihat status pendaftaran pelatihan Anda.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[640px] mx-auto px-6 py-12">

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl border border-border p-6 mb-6 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted mb-2">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 text-[0.9rem] outline-none focus:border-dark/30 bg-[#FAFAFA] transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !email.trim()}
                className="flex items-center justify-center gap-2.5 bg-dark text-white font-bold text-[0.88rem] py-3.5 rounded-xl disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Search size={15} />
                )}
                {loading ? "Mencari…" : "Cek Status"}
              </motion.button>
            </div>
          </motion.form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 text-[0.85rem] text-amber-800 font-medium"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <p className="text-[0.78rem] font-bold text-muted uppercase tracking-wider">
                  {results.length} pendaftaran ditemukan
                </p>

                {results.map((reg, i) => {
                  const s = STATUS[reg.status];
                  const Icon = s.icon;
                  const c = reg.training?.color || "#4F46E5";

                  return (
                    <motion.div
                      key={reg.id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm"
                    >
                      {/* Color bar */}
                      <div className="h-1.5" style={{ backgroundColor: c }} />

                      <div className="p-5">
                        {/* Status badge */}
                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 w-fit"
                          style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                        >
                          <Icon size={14} style={{ color: s.color }} />
                          <span className="text-[0.75rem] font-extrabold" style={{ color: s.color }}>
                            {s.label}
                          </span>
                        </div>

                        {/* Training info */}
                        {reg.training ? (
                          <div className="mb-4">
                            <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted mb-1">Program</p>
                            <p className="font-bold text-[1rem] text-dark leading-snug mb-2">{reg.training.title}</p>
                            <div className="flex flex-wrap gap-3">
                              {reg.training.date_start && (
                                <span className="flex items-center gap-1.5 text-[0.74rem] text-muted">
                                  <Calendar size={11} />
                                  {reg.training.date_start}{reg.training.date_end ? ` – ${reg.training.date_end}` : ""}
                                </span>
                              )}
                              {reg.training.location && (
                                <span className="flex items-center gap-1.5 text-[0.74rem] text-muted">
                                  <MapPin size={11} /> {reg.training.location}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted text-[0.85rem] mb-3">Program tidak ditemukan</p>
                        )}

                        {/* Status description */}
                        <p className="text-[0.82rem] text-dark/60 leading-relaxed mb-4">{s.desc}</p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3 text-[0.72rem] text-muted">
                            {reg.final_price && <span className="font-bold text-dark">{formatRp(reg.final_price)}</span>}
                            {reg.is_group && <span>Grup · {reg.participant_count} peserta</span>}
                            <span>{new Date(reg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                          </div>
                          {reg.training && (
                            <Link href={`/training/${reg.training.id}`}
                              className="flex items-center gap-1 text-[0.72rem] font-bold hover:text-dark transition-colors text-muted">
                              Detail <ArrowUpRight size={11} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Help note */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-border p-5 text-center"
                >
                  <p className="text-[0.82rem] text-muted mb-3">
                    Ada pertanyaan tentang pendaftaran Anda?
                  </p>
                  <a
                    href={`https://wa.me/6288298989171?text=${encodeURIComponent("Halo Tim GRCC, saya ingin menanyakan status pendaftaran pelatihan saya.")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-[0.82rem] px-5 py-2.5 rounded-xl"
                  >
                    💬 Hubungi Tim GRCC
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[0.8rem] text-muted hover:text-dark transition-colors font-semibold">
              <ArrowLeft size={13} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
