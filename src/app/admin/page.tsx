"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Megaphone, Newspaper, CalendarDays, Users, ArrowUpRight, TrendingUp,
  ClipboardList, Tag, Layers, Star, DollarSign, CheckCircle2, Clock, XCircle,
} from "lucide-react";

interface Stats {
  promo: number; insights: number; training: number; team: number;
  registrations: number; promoCodes: number; programs: number; testimonials: number;
}
interface RevenueStats { total: number; confirmed: number; pending: number; }
interface RecentReg { id: string; nama_lengkap: string; training_id: string | null; final_price: number | null; status: string; created_at: string; }
interface PopularTraining { title: string; count: number; color: string; }

const statCards = [
  { key: "programs",      label: "Program",          icon: Layers,       href: "/admin/programs",      color: "#06B6D4" },
  { key: "training",      label: "Training",         icon: CalendarDays, href: "/admin/training",      color: "#F59E0B" },
  { key: "registrations", label: "Registrasi",       icon: ClipboardList,href: "/admin/registrations", color: "#8B5CF6" },
  { key: "testimonials",  label: "Testimoni",        icon: Star,         href: "/admin/testimonials",  color: "#F97316" },
  { key: "insights",      label: "Insights",         icon: Newspaper,    href: "/admin/insights",      color: "#10B981" },
  { key: "team",          label: "Tim",              icon: Users,        href: "/admin/team",          color: "#EF4444" },
  { key: "promo",         label: "Promo Aktif",      icon: Megaphone,    href: "/admin/promo",         color: "#4F46E5" },
  { key: "promoCodes",    label: "Kode Promo",       icon: Tag,          href: "/admin/promo-codes",   color: "#0EA5E9" },
];

function formatRp(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function statusBadge(status: string) {
  if (status === "confirmed") return <span className="flex items-center gap-1 text-[0.6rem] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full"><CheckCircle2 size={9}/>Confirmed</span>;
  if (status === "rejected")  return <span className="flex items-center gap-1 text-[0.6rem] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full"><XCircle size={9}/>Ditolak</span>;
  return <span className="flex items-center gap-1 text-[0.6rem] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full"><Clock size={9}/>Pending</span>;
}

export default function AdminDashboard() {
  const [stats,    setStats]    = useState<Stats>({ promo:0, insights:0, training:0, team:0, registrations:0, promoCodes:0, programs:0, testimonials:0 });
  const [revenue,  setRevenue]  = useState<RevenueStats>({ total: 0, confirmed: 0, pending: 0 });
  const [recent,   setRecent]   = useState<RecentReg[]>([]);
  const [popular,  setPopular]  = useState<PopularTraining[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Basic counts
      const [p, i, tr, tm, rg, pc, pr, te] = await Promise.all([
        supabase.from("promo").select("id",          { count: "exact", head: true }).eq("active", true),
        supabase.from("insights").select("id",       { count: "exact", head: true }),
        supabase.from("training").select("id",       { count: "exact", head: true }),
        supabase.from("team_members").select("id",   { count: "exact", head: true }),
        supabase.from("registrations").select("id",  { count: "exact", head: true }),
        supabase.from("promo_codes").select("id",    { count: "exact", head: true }),
        supabase.from("programs").select("id",       { count: "exact", head: true }).eq("active", true),
        supabase.from("testimonials").select("id",   { count: "exact", head: true }),
      ]);
      setStats({
        promo: p.count??0, insights: i.count??0, training: tr.count??0, team: tm.count??0,
        registrations: rg.count??0, promoCodes: pc.count??0, programs: pr.count??0, testimonials: te.count??0,
      });

      // Revenue
      const { data: regs } = await supabase
        .from("registrations")
        .select("final_price, status");
      if (regs) {
        const total     = regs.reduce((s, r) => s + (r.final_price ?? 0), 0);
        const confirmed = regs.filter(r => r.status === "confirmed").reduce((s, r) => s + (r.final_price ?? 0), 0);
        const pending   = regs.filter(r => r.status === "pending").reduce((s, r) => s + (r.final_price ?? 0), 0);
        setRevenue({ total, confirmed, pending });
      }

      // Recent registrations
      const { data: recentData } = await supabase
        .from("registrations")
        .select("id, nama_lengkap, training_id, final_price, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecent(recentData ?? []);

      // Popular training
      const { data: allRegs } = await supabase
        .from("registrations")
        .select("training_id");
      const { data: trainingList } = await supabase
        .from("training")
        .select("id, title, color");

      if (allRegs && trainingList) {
        const countMap = new Map<string, number>();
        for (const r of allRegs) {
          if (r.training_id) countMap.set(r.training_id, (countMap.get(r.training_id) ?? 0) + 1);
        }
        const sorted = [...countMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([id, count]) => {
            const t = trainingList.find(t => t.id === id);
            return { title: t?.title ?? "Unknown", count, color: t?.color ?? "#4F46E5" };
          });
        setPopular(sorted);
      }

      setLoadingExtra(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[1.6rem] font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted text-[0.88rem] mt-1">Ringkasan aktivitas GRCC</p>
      </div>

      {/* ── Revenue Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Pendapatan",  value: formatRp(revenue.total),     icon: DollarSign,  color: "#4F46E5", bg: "#4F46E505" },
          { label: "Terkonfirmasi",     value: formatRp(revenue.confirmed),  icon: CheckCircle2,color: "#10B981", bg: "#10B98108" },
          { label: "Menunggu Verifikasi",value: formatRp(revenue.pending),   icon: Clock,       color: "#F59E0B", bg: "#F59E0B08" },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-white rounded-2xl border border-border p-5"
            style={{ backgroundColor: loadingExtra ? undefined : bg }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-[1.5rem] font-extrabold tracking-tight" style={{ color: loadingExtra ? undefined : color }}>
              {loadingExtra ? <span className="block h-7 w-28 bg-dark/[0.07] rounded animate-pulse" /> : value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map(({ key, label, icon: Icon, href, color }, i) => (
          <motion.div key={key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.45 }}>
            <Link href={href}
              className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-border hover:shadow-md hover:border-transparent transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <ArrowUpRight size={13} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-[1.5rem] font-extrabold leading-none">{stats[key as keyof Stats]}</p>
                <p className="text-muted text-[0.72rem] mt-1">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom row: Recent + Popular ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Recent Registrations */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={15} className="text-muted" />
              <h2 className="font-bold text-[0.95rem]">Registrasi Terbaru</h2>
            </div>
            <Link href="/admin/registrations" className="text-[0.72rem] font-semibold text-muted hover:text-dark flex items-center gap-1 transition-colors">
              Semua <ArrowUpRight size={11} />
            </Link>
          </div>
          {loadingExtra ? (
            <div className="flex flex-col gap-3">
              {[1,2,3,4,5].map(n => <div key={n} className="h-10 bg-dark/[0.04] rounded-lg animate-pulse" />)}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-muted text-[0.82rem] text-center py-6">Belum ada registrasi</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-[0.62rem] font-extrabold text-[#8B5CF6]">
                        {r.nama_lengkap.split(" ")[0][0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.82rem] font-semibold truncate">{r.nama_lengkap}</p>
                      <p className="text-[0.68rem] text-muted">{new Date(r.created_at).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.final_price ? (
                      <span className="text-[0.75rem] font-bold text-dark">{formatRp(r.final_price)}</span>
                    ) : null}
                    {statusBadge(r.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Popular Training */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
          className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-muted" />
            <h2 className="font-bold text-[0.95rem]">Training Terpopuler</h2>
          </div>
          {loadingExtra ? (
            <div className="flex flex-col gap-3">
              {[1,2,3,4].map(n => <div key={n} className="h-10 bg-dark/[0.04] rounded-lg animate-pulse" />)}
            </div>
          ) : popular.length === 0 ? (
            <p className="text-muted text-[0.82rem] text-center py-6">Belum ada data</p>
          ) : (
            <div className="flex flex-col gap-3">
              {popular.map((t, i) => {
                const max = popular[0]?.count ?? 1;
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.78rem] font-semibold text-dark/75 truncate pr-2 leading-snug">{t.title}</p>
                      <span className="text-[0.72rem] font-extrabold flex-shrink-0" style={{ color: t.color }}>{t.count}</span>
                    </div>
                    <div className="h-1.5 bg-dark/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${(t.count / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.4,0,0.2,1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Info box */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
        className="bg-[#4F46E5]/[0.06] border border-[#4F46E5]/20 rounded-2xl p-5 mt-5">
        <p className="text-[0.82rem] font-semibold text-[#4F46E5] mb-1">💡 Tips</p>
        <p className="text-[0.8rem] text-dark/60 leading-[1.7]">
          Setiap perubahan langsung terlihat di website tanpa deploy ulang.
          Tambah testimoni alumni di <Link href="/admin/testimonials" className="font-bold underline">halaman Testimoni</Link> untuk meningkatkan kepercayaan calon peserta.
        </p>
      </motion.div>
    </div>
  );
}
