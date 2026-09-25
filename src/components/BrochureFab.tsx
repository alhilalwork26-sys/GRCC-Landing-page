"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BrochureItem {
  key: string;
  title: string;
  url: string;
}

export default function BrochureFab() {
  const pathname = usePathname();
  const [items, setItems] = useState<BrochureItem[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      supabase.from("training").select("id,title,brochure_url").eq("published", true).not("brochure_url", "is", null).order("created_at", { ascending: false }),
      supabase.from("sub_programs").select("id,name,brochure_url").eq("active", true).not("brochure_url", "is", null).order("order_index"),
    ]).then(([trainings, subs]) => {
      if (cancelled) return;
      const list: BrochureItem[] = [
        ...(trainings.data ?? []).map((t) => ({ key: `t-${t.id}`, title: t.title as string, url: t.brochure_url as string })),
        ...(subs.data ?? []).map((s) => ({ key: `s-${s.id}`, title: s.name as string, url: s.brochure_url as string })),
      ];
      setItems(list);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (pathname?.startsWith("/admin") || items.length === 0) return null;

  return (
    <div ref={wrapRef} className="fixed bottom-[5.5rem] right-6 z-[190] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[320px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-black/[0.06]">
              <div>
                <p className="text-[0.86rem] font-extrabold text-dark">Download Brosur</p>
                <p className="text-[0.68rem] text-muted mt-0.5">Brosur program GRCC (PDF)</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Tutup"
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-black/[0.05] transition-colors">
                <X size={14} />
              </button>
            </div>
            <ul className="max-h-[300px] overflow-y-auto p-2">
              {items.map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[#4F46E5]/[0.06]"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]">
                      <FileText size={16} />
                    </span>
                    <span className="min-w-0 flex-1 text-[0.78rem] font-bold leading-snug text-dark line-clamp-2">{item.title}</span>
                    <Download size={15} className="flex-shrink-0 text-muted transition-all group-hover:translate-y-0.5 group-hover:text-[#4F46E5]" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen((v) => !v)}
        title="Download Brosur Program"
        aria-label="Download Brosur Program"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#4F46E5] shadow-[0_10px_28px_-8px_rgba(0,0,0,0.25)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "x" : "d"} initial={{ rotate: -60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 60, opacity: 0 }} transition={{ duration: 0.15 }}>
            {open ? <X size={20} /> : <Download size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
