"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Megaphone, Newspaper,
  CalendarDays, Users, LogOut, ExternalLink, Menu, X, ClipboardList, Tag, Layers, Star
} from "lucide-react";

const nav = [
  { href: "/admin",                 icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/admin/promo",           icon: Megaphone,        label: "Promo Modal"   },
  { href: "/admin/programs",        icon: Layers,           label: "Program"        },
  { href: "/admin/insights",        icon: Newspaper,        label: "Insights"      },
  { href: "/admin/training",        icon: CalendarDays,     label: "Training"      },
  { href: "/admin/promo-codes",     icon: Tag,              label: "Kode Promo"    },
  { href: "/admin/registrations",   icon: ClipboardList,    label: "Registrasi"    },
  { href: "/admin/testimonials",    icon: Star,             label: "Testimoni"     },
  { href: "/admin/team",            icon: Users,            label: "Tim"           },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Auth is handled server-side by middleware.ts — no client-side auth check needed.

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[230px] bg-[#0D0D0D] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.07]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/grcc-logo.png" alt="GRCC" style={{ height: 36, width: "auto" }} />
          <div>
            <p className="text-white text-[0.78rem] font-extrabold leading-none">GRCC</p>
            <p className="text-white/30 text-[0.6rem] tracking-wider uppercase mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.82rem] font-semibold transition-all ${
                  active
                    ? "bg-white/[0.1] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.07] flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/35 hover:text-white text-[0.75rem] transition-colors"
          >
            <ExternalLink size={13} />
            Lihat Website
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/35 hover:text-red-400 text-[0.75rem] transition-colors"
          >
            <LogOut size={13} />
            Keluar
          </button>
          <p className="text-white/20 text-[0.65rem] px-3 truncate">GRCC Admin</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-[230px] flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border h-14 flex items-center px-6 gap-4">
          <button onClick={() => setOpen(o => !o)} className="lg:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-[0.8rem] font-semibold text-dark/50 ml-auto">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
