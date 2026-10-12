"use client";

import { useEffect, useState } from "react";
import TestimonialCarousel, { CarouselApi } from "@/components/TestimonialCarousel";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase, TestimonialItem } from "@/lib/supabase";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 400 }}
        >
          <Star
            size={13}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-dark/15"}
          />
        </motion.div>
      ))}
    </div>
  );
}

function Avatar({ name, src, color }: { name: string; src?: string | null; color: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
    );
  }
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-[0.78rem] border-2 border-white shadow-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function shortProgramLabel(name: string | null) {
  if (!name) return "Program";
  const abbr = name.match(/\(([A-Za-z]{2,})\)/)?.[1] ?? name.match(/\b([A-Z]{3,})\b/)?.[1];
  const batch = name.match(/batch\s*\d+/i)?.[0];
  if (abbr) return batch ? `${abbr} ${batch.replace(/batch/i, "Batch")}` : abbr;
  return name.length > 28 ? name.slice(0, 26) + "…" : name;
}

const ACCENT_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#0EA5E9"];

function TestimonialCard({ t, index, api }: { t: TestimonialItem; index: number; api: CarouselApi }) {
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const [open, setOpen] = useState(false);
  const long = t.content.length > 240;

  const toggle = () => {
    api.hold(!open);
    setOpen(!open);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-black/[0.07] p-6 flex flex-col gap-4 h-full select-none"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <StarRating rating={t.rating} />
        <motion.div
          animate={{ rotate: [0, -5, 5, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, delay: index * 0.5 }}
        >
          <Quote size={28} style={{ color: color + "30" }} className="fill-current" />
        </motion.div>
      </div>

      <div className="flex-1">
        <p className={`text-[0.88rem] leading-[1.85] text-dark/65 italic ${open || !long ? "" : "line-clamp-6"}`}>
          &ldquo;{t.content}&rdquo;
        </p>
        {long && (
          <button
            type="button"
            onClick={toggle}
            onPointerDownCapture={(e) => e.stopPropagation()}
            className="mt-2 text-[0.76rem] font-extrabold"
            style={{ color }}
          >
            {open ? "Tutup" : "Baca selengkapnya"}
          </button>
        )}
      </div>

      {t.training_name && (
        <div
          className="text-[0.65rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full self-start"
          style={{ backgroundColor: color + "12", color }}
        >
          {t.training_name}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06]">
        <Avatar name={t.name} src={t.avatar_url} color={color} />
        <div className="min-w-0">
          <p className="font-extrabold text-[0.88rem] text-dark truncate">{t.name}</p>
          {(t.position || t.company) && (
            <p className="text-[0.73rem] text-muted truncate">
              {[t.position, t.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-3.5 h-3.5 rounded bg-dark/[0.06]" />)}</div>
        <div className="w-7 h-7 rounded bg-dark/[0.04]" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-dark/[0.06] rounded w-full" />
        <div className="h-3 bg-dark/[0.06] rounded w-5/6" />
        <div className="h-3 bg-dark/[0.06] rounded w-4/5" />
        <div className="h-3 bg-dark/[0.06] rounded w-3/4" />
      </div>
      <div className="h-5 w-24 bg-dark/[0.05] rounded-full" />
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className="w-11 h-11 rounded-full bg-dark/[0.06]" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-28 bg-dark/[0.07] rounded" />
          <div className="h-2.5 w-36 bg-dark/[0.05] rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [items, setItems]   = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  if (!loading && items.length === 0) return null;

  const tabs = Array.from(
    new Map(items.filter(i => i.training_id).map(i => [i.training_id as string, shortProgramLabel(i.training_name)])).entries()
  );
  const shown = tab === "all" ? items.slice(0, 12) : items.filter(i => i.training_id === tab).slice(0, 12);

  return (
    <section className="py-[clamp(80px,10vw,140px)] bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-[0.72rem] font-bold tracking-[0.18em] uppercase text-muted mb-4">
            Testimoni Alumni
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
            Apa kata para{" "}
            <span className="relative">
              peserta
              <motion.span
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#4F46E5] origin-left rounded-full"
              />
            </span>
            {" "}kami?
          </h2>
        </motion.div>

        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {[["all", "Semua"] as [string, string], ...tabs].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`relative text-[0.78rem] font-bold px-4 py-2 rounded-full border transition-colors ${tab === key ? "text-white border-dark" : "text-dark/65 border-black/[0.1] hover:border-dark/30"}`}>
                {tab === key && (
                  <motion.span layoutId="testi-tab" className="absolute inset-0 rounded-full bg-dark" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <TestimonialCarousel
            key={tab}
            items={shown}
            accent="#4F46E5"
            renderItem={(t, i, api) => <TestimonialCard t={t} index={i} api={api} />}
          />
        )}

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          <div className="flex -space-x-2">
            {["#4F46E5","#10B981","#F59E0B"].map((c,i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[0.55rem] font-black text-white"
                style={{ backgroundColor: c }}>
                {["B","S","A"][i]}
              </div>
            ))}
          </div>
          <p className="text-[0.78rem] text-muted">
            Bergabung dengan <span className="font-bold text-dark">500+ alumni</span> program GRCC
          </p>
        </motion.div>
      </div>
    </section>
  );
}
