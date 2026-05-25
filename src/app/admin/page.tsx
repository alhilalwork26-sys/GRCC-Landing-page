"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Megaphone, Newspaper, CalendarDays, Users, ArrowUpRight, TrendingUp, ClipboardList, Tag, Layers } from "lucide-react";

interface Stats { promo: number; insights: number; training: number; team: number; registrations: number; promoCodes: number; programs: number; }

const cards = [
  { key: "promo",         label: "Promo Aktif",      icon: Megaphone,    href: "/admin/promo",          color: "#4F46E5" },
  { key: "programs",      label: "Program",          icon: Layers,       href: "/admin/programs",       color: "#06B6D4" },
  { key: "insights",      label: "Total Insights",   icon: Newspaper,    href: "/admin/insights",       color: "#10B981" },
  { key: "training",      label: "Program Training", icon: CalendarDays, href: "/admin/training",       color: "#F59E0B" },
  { key: "registrations", label: "Registrasi",       icon: ClipboardList,href: "/admin/registrations",  color: "#8B5CF6" },
  { key: "team",          label: "Anggota Tim",      icon: Users,        href: "/admin/team",           color: "#EF4444" },
  { key: "promoCodes",    label: "Kode Promo",       icon: Tag,          href: "/admin/promo-codes",    color: "#0EA5E9" },
];

const quickActions = [
  { label: "Lihat Registrasi",    href: "/admin/registrations", icon: ClipboardList, color: "#8B5CF6" },
  { label: "Tambah Insight Baru", href: "/admin/insights",      icon: Newspaper,     color: "#10B981" },
  { label: "Kelola Program",      href: "/admin/programs",      icon: Layers,        color: "#06B6D4" },
  { label: "Tambah Training",     href: "/admin/training",      icon: CalendarDays,  color: "#F59E0B" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ promo: 0, insights: 0, training: 0, team: 0, registrations: 0, promoCodes: 0, programs: 0 });

  useEffect(() => {
    const load = async () => {
      const [p, i, tr, tm, rg, pc, pr] = await Promise.all([
        supabase.from("promo").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("insights").select("id", { count: "exact", head: true }),
        supabase.from("training").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("registrations").select("id", { count: "exact", head: true }),
        supabase.from("promo_codes").select("id", { count: "exact", head: true }),
        supabase.from("programs").select("id", { count: "exact", head: true }).eq("active", true),
      ]);
      setStats({
        promo:         p.count  ?? 0,
        insights:      i.count  ?? 0,
        training:      tr.count ?? 0,
        team:          tm.count ?? 0,
        registrations: rg.count ?? 0,
        promoCodes:    pc.count ?? 0,
        programs:      pr.count ?? 0,
      });
    };
    load();
  }, []);

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[1.6rem] font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted text-[0.88rem] mt-1">Selamat datang di GRCC Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ key, label, icon: Icon, href, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <Link
              href={href}
              className="flex flex-col gap-3 p-5 bg-white rounded-2xl border border-border hover:shadow-md hover:border-transparent transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <ArrowUpRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-[1.6rem] font-extrabold leading-none">{stats[key as keyof Stats]}</p>
                <p className="text-muted text-[0.75rem] mt-1">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-muted" />
          <h2 className="font-bold text-[0.95rem]">Aksi Cepat</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-transparent hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "15" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-[0.84rem] font-semibold">{label}</span>
              <ArrowUpRight size={13} className="ml-auto text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-[#4F46E5]/[0.06] border border-[#4F46E5]/20 rounded-2xl p-5"
      >
        <p className="text-[0.82rem] font-semibold text-[#4F46E5] mb-1">💡 Cara kerja admin panel ini</p>
        <p className="text-[0.8rem] text-dark/60 leading-[1.7]">
          Setiap perubahan yang Anda simpan akan <strong>langsung terlihat di website</strong> tanpa perlu deploy ulang.
          Gunakan menu di sidebar untuk mengelola konten — Promo Modal, Insights, Training, dan Tim.
        </p>
      </motion.div>
    </div>
  );
}
