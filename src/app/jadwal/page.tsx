"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Calendar, MapPin, Clock,
  Users, ArrowUpRight, Wifi, MonitorPlay, Building2, Search, X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, TrainingItem } from "@/lib/supabase";

// ── Constants ─────────────────────────────────────────────────────────────────
const BULAN_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];
const HARI_SHORT = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseDateID(str: string | null | undefined): Date | null {
  if (!str) return null;
  const match = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (!match) return null;
  const day   = parseInt(match[1]);
  const mIdx  = BULAN_ID.findIndex(m => m.toLowerCase() === match[2].toLowerCase());
  const year  = parseInt(match[3]);
  if (mIdx === -1 || isNaN(day) || isNaN(year)) return null;
  return new Date(year, mIdx, day);
}

function getTrainingDates(t: TrainingItem): Date[] {
  const start = parseDateID(t.date_start);
  if (!start) return [];
  const end = parseDateID(t.date_end);
  if (!end || end <= start) return [start];
  const dates: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function FormatIcon({ format }: { format: string }) {
  const f = (format ?? "").toLowerCase();
  if (f.includes("online")) return <Wifi size={10} />;
  if (f.includes("hybrid")) return <MonitorPlay size={10} />;
  return <Building2 size={10} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JadwalPage() {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [calMonth,  setCalMonth]  = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch]             = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("training").select("*")
      .eq("published", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => { setTrainings(data ?? []); setLoading(false); });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ── Calendar data ──────────────────────────────────────────────────────────
  const year  = calMonth.getFullYear();
  const month = calMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  let startPad   = firstDay.getDay() - 1; // Monday-first
  if (startPad < 0) startPad = 6;
  const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7;

  const calDays: (Date | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    const n = i - startPad + 1;
    calDays.push(n >= 1 && n <= lastDay.getDate() ? new Date(year, month, n) : null);
  }

  // Map date → trainings
  const dateMap = new Map<string, TrainingItem[]>();
  for (const t of trainings) {
    for (const d of getTrainingDates(t)) {
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!dateMap.has(key)) dateMap.set(key, []);
      dateMap.get(key)!.push(t);
    }
  }

  // ── Filtered / grouped list ────────────────────────────────────────────────
  const baseList = selectedDate
    ? trainings.filter(t => getTrainingDates(t).some(d => isSameDay(d, selectedDate)))
    : trainings;

  const displayed = baseList.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by month (only for non-date-filtered view)
  const grouped = new Map<string, TrainingItem[]>();
  for (const t of displayed) {
    const d   = parseDateID(t.date_start);
    const key = d ? `${d.getFullYear()}-${d.getMonth()}` : "unknown";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  const upcomingCount = trainings.filter(t => {
    const d = parseDateID(t.date_end || t.date_start);
    return d && d >= today;
  }).length;

  const prevMonth = () => setCalMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalMonth(new Date(year, month + 1, 1));

  // Scroll list to top when date changes
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedDate]);

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-border overflow-hidden">
        {/* Background dots */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #0D0D0D08 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16 py-[clamp(56px,7vw,80px)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-muted mb-3">
              Kalender Pelatihan
            </p>
            <h1
              className="font-extrabold leading-[1.08] tracking-[-0.028em] mb-4"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
            >
              Jadwal Program{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2px #4F46E5", color: "transparent" }}
              >
                Mendatang
              </span>
            </h1>
            <p className="text-[0.93rem] text-muted max-w-[460px] leading-[1.75]">
              Temukan program pelatihan yang sesuai waktu Anda dan daftar sebelum kuota habis.
            </p>
          </motion.div>

          {/* Stats chips */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 flex-wrap mt-6"
            >
              <div className="flex items-center gap-2 bg-dark/[0.05] px-3.5 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[0.75rem] font-bold">{upcomingCount} program aktif</span>
              </div>
              <div className="flex items-center gap-2 bg-dark/[0.05] px-3.5 py-1.5 rounded-full">
                <Calendar size={11} className="text-muted" />
                <span className="text-[0.75rem] font-bold">{trainings.length} total pelatihan</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────── */}
      <main className="bg-[#F7F7F5]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-[clamp(40px,5vw,64px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-start">

            {/* ══ LEFT SIDEBAR ══ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-4 lg:sticky lg:top-[90px]"
            >
              {/* ── Mini Calendar ── */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">

                {/* Month nav */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={prevMonth}
                    className="w-7 h-7 rounded-lg hover:bg-dark/[0.07] flex items-center justify-center transition-colors">
                    <ChevronLeft size={14} />
                  </motion.button>

                  <AnimatePresence mode="wait">
                    <motion.p key={`${year}-${month}`}
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="font-extrabold text-[0.88rem] tracking-tight"
                    >
                      {BULAN_ID[month]} {year}
                    </motion.p>
                  </AnimatePresence>

                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="w-7 h-7 rounded-lg hover:bg-dark/[0.07] flex items-center justify-center transition-colors">
                    <ChevronRight size={14} />
                  </motion.button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 px-2.5 pt-2.5 pb-1">
                  {HARI_SHORT.map(h => (
                    <div key={h} className="text-center text-[0.58rem] font-extrabold uppercase tracking-wider text-muted/50 py-1">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <AnimatePresence mode="wait">
                  <motion.div key={`${year}-${month}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-7 px-2.5 pb-3 gap-y-0.5"
                  >
                    {calDays.map((d, i) => {
                      if (!d) return <div key={i} />;
                      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                      const hasT = dateMap.has(key);
                      const colors = hasT ? [...new Set(dateMap.get(key)!.map(t => t.color || "#4F46E5"))].slice(0, 3) : [];
                      const isToday    = isSameDay(d, today);
                      const isSelected = !!selectedDate && isSameDay(d, selectedDate);
                      const isPast     = d < today && !isToday;

                      return (
                        <motion.button key={i}
                          whileHover={hasT ? { scale: 1.15 } : {}}
                          whileTap={hasT   ? { scale: 0.9  } : {}}
                          onClick={() => { if (!hasT) return; setSelectedDate(isSelected ? null : d); }}
                          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                            isSelected
                              ? "bg-dark text-white shadow-md"
                              : isToday
                              ? "bg-dark/[0.08] ring-1 ring-dark/20"
                              : hasT
                              ? "hover:bg-dark/[0.05] cursor-pointer"
                              : "cursor-default"
                          } ${isPast && !hasT ? "opacity-25" : ""}`}
                        >
                          <span className={`text-[0.75rem] font-bold leading-none ${
                            isSelected ? "text-white" : isToday ? "text-dark font-extrabold" : isPast ? "text-muted" : "text-dark/80"
                          }`}>
                            {d.getDate()}
                          </span>
                          {/* Dots */}
                          {colors.length > 0 && (
                            <div className="flex items-center gap-0.5 mt-1">
                              {colors.map((c, ci) => (
                                <div key={ci} className="w-1.5 h-1.5 rounded-full transition-colors"
                                  style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : c }} />
                              ))}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Selected date info */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-[0.73rem] font-bold text-dark">
                          {selectedDate.getDate()} {BULAN_ID[selectedDate.getMonth()]}
                          {" · "}
                          <span className="text-muted font-semibold">
                            {trainings.filter(t => getTrainingDates(t).some(d => isSameDay(d, selectedDate))).length} program
                          </span>
                        </p>
                        <button onClick={() => setSelectedDate(null)}
                          className="flex items-center gap-1 text-[0.68rem] text-muted hover:text-dark transition-colors font-semibold">
                          <X size={10} /> Reset
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Stats ── */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { label: "Total Program",   value: trainings.length,  color: "#0D0D0D" },
                    { label: "Akan Datang",      value: upcomingCount,     color: "#4F46E5" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="font-extrabold text-[1.6rem] leading-none"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </motion.p>
                      <p className="text-[0.67rem] text-muted font-semibold mt-1">{s.label}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* ── Legend ── */}
              <div className="bg-white rounded-xl border border-border px-4 py-3.5">
                <p className="text-[0.67rem] font-extrabold tracking-[0.12em] uppercase text-muted mb-2.5">Keterangan</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-dark/[0.08] ring-1 ring-dark/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[0.6rem] font-extrabold text-dark">9</span>
                    </div>
                    <span className="text-[0.72rem] text-muted">Hari ini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="text-[0.6rem] font-extrabold text-white">9</span>
                    </div>
                    <span className="text-[0.72rem] text-muted">Tanggal dipilih</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 w-5 justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    </div>
                    <span className="text-[0.72rem] text-muted">Ada pelatihan</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ══ RIGHT: List ══ */}
            <div className="flex flex-col gap-5">

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari program pelatihan…"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-border rounded-xl text-[0.85rem] outline-none focus:border-dark/30 transition-colors shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark/[0.07] hover:bg-dark/[0.12] flex items-center justify-center transition-colors">
                    <X size={10} className="text-muted" />
                  </button>
                )}
              </motion.div>

              {/* List */}
              <div ref={listRef}>
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[1,2,3].map(n => (
                      <div key={n} className="bg-white rounded-2xl border border-border p-5 animate-pulse flex gap-4">
                        <div className="w-[68px] h-[80px] rounded-xl bg-dark/[0.06] flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2 py-1">
                          <div className="h-2.5 w-20 bg-dark/[0.06] rounded-full" />
                          <div className="h-4 w-3/4 bg-dark/[0.07] rounded" />
                          <div className="h-2.5 w-1/2 bg-dark/[0.05] rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {selectedDate ? (
                      /* ── Selected date view ── */
                      <motion.div key="filtered"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-dark flex items-center justify-center flex-shrink-0">
                            <Calendar size={14} className="text-white" />
                          </div>
                          <p className="font-extrabold text-[0.95rem]">
                            {selectedDate.getDate()} {BULAN_ID[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          {displayed.length === 0 ? (
                            <EmptyState />
                          ) : (
                            displayed.map((t, i) => <TrainingRow key={t.id} t={t} index={i} today={today} />)
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* ── All, grouped by month ── */
                      <motion.div key="all"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {displayed.length === 0 ? (
                          <EmptyState />
                        ) : (
                          <div className="flex flex-col gap-8">
                            {[...grouped.entries()].map(([key, items], gi) => {
                              const [y2, m2] = key.split("-").map(Number);
                              const monthDate = new Date(y2, m2, 1);
                              const isPastMonth = new Date(y2, m2 + 1, 0) < today;
                              return (
                                <motion.div key={key}
                                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, margin: "-40px" }}
                                  transition={{ duration: 0.5, delay: gi * 0.06 }}
                                >
                                  {/* Month header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <motion.div
                                        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 300, delay: gi * 0.06 }}
                                        className={`w-2.5 h-2.5 rounded-full ${isPastMonth ? "bg-dark/20" : "bg-[#4F46E5]"}`}
                                      />
                                      <p className={`text-[0.7rem] font-extrabold tracking-[0.14em] uppercase ${isPastMonth ? "text-muted/60" : "text-dark/70"}`}>
                                        {BULAN_ID[monthDate.getMonth()]} {monthDate.getFullYear()}
                                      </p>
                                    </div>
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-[0.66rem] font-bold text-muted/60 flex-shrink-0">
                                      {items.length} program
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-3">
                                    {items.map((t, i) => (
                                      <TrainingRow key={t.id} t={t} index={i} today={today} />
                                    ))}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// ── Training Row Card ─────────────────────────────────────────────────────────
function TrainingRow({ t, index, today }: { t: TrainingItem; index: number; today: Date }) {
  const c     = t.color || "#4F46E5";
  const start = parseDateID(t.date_start);
  const end   = parseDateID(t.date_end);
  const isPast = end ? end < today : (start ? start < today : false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/training/${t.id}`} className="block group">
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.09)" }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-2xl border border-black/[0.06] overflow-hidden flex transition-all ${isPast ? "opacity-50 saturate-50" : ""}`}
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
        >
          {/* Left color bar */}
          <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: c }} />

          {/* Date column */}
          <div
            className="w-[72px] flex-shrink-0 flex flex-col items-center justify-center py-5 border-r border-black/[0.05]"
            style={{ backgroundColor: c + "0C" }}
          >
            {start ? (
              <>
                <p className="text-[0.58rem] font-extrabold tracking-[0.12em] uppercase mb-0.5"
                  style={{ color: c + "90" }}>
                  {BULAN_ID[start.getMonth()].slice(0, 3)}
                </p>
                <p className="font-black text-[1.7rem] leading-none" style={{ color: c }}>
                  {String(start.getDate()).padStart(2, "0")}
                </p>
                {end && (
                  <p className="text-[0.56rem] font-bold mt-0.5" style={{ color: c + "70" }}>
                    –{String(end.getDate()).padStart(2, "0")}
                  </p>
                )}
              </>
            ) : (
              <Calendar size={18} style={{ color: c + "60" }} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 px-5 py-4 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span
                    className="flex items-center gap-1 text-[0.57rem] font-extrabold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: c }}
                  >
                    <FormatIcon format={t.format} /> {t.format}
                  </span>
                  {t.category && (
                    <span className="text-[0.57rem] font-bold tracking-[0.07em] uppercase px-2 py-0.5 rounded-full bg-dark/[0.05] text-muted">
                      {t.category}
                    </span>
                  )}
                  {isPast && (
                    <span className="text-[0.57rem] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      Selesai
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[0.93rem] leading-snug tracking-tight line-clamp-2 mb-2 group-hover:text-dark transition-colors">
                  {t.title}
                </h3>

                <div className="flex items-center gap-3 flex-wrap">
                  {t.time && (
                    <span className="flex items-center gap-1 text-[0.71rem] text-muted">
                      <Clock size={9} /> {t.time}
                    </span>
                  )}
                  {t.location && (
                    <span className="flex items-center gap-1 text-[0.71rem] text-muted truncate max-w-[160px]">
                      <MapPin size={9} /> {t.location}
                    </span>
                  )}
                  {t.max_participants && (
                    <span className="flex items-center gap-1 text-[0.71rem] text-muted">
                      <Users size={9} /> Maks. {t.max_participants}
                    </span>
                  )}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                {(t.price || t.price_label) && (
                  <p className="font-extrabold text-[0.88rem] tracking-tight whitespace-nowrap" style={{ color: c }}>
                    {t.price ? formatRupiah(t.price) : t.price_label}
                  </p>
                )}
                {!isPast && (
                  <motion.div
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={(e) => { e.preventDefault(); window.location.href = `/daftar/${t.id}`; }}
                    className="flex items-center gap-1.5 text-white text-[0.71rem] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                    style={{ backgroundColor: c }}
                  >
                    Daftar <ArrowUpRight size={11} />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border border-border py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-dark/[0.05] flex items-center justify-center mx-auto mb-4">
        <Calendar size={24} className="text-muted/50" />
      </div>
      <p className="font-bold text-[0.9rem] text-dark/60 mb-1">Tidak ada program ditemukan</p>
      <p className="text-[0.78rem] text-muted">Coba kata kunci lain atau pilih tanggal berbeda</p>
    </motion.div>
  );
}
