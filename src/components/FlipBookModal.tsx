"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, BookOpen, Download, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

// ── Lazy-load pdfjs only on client ────────────────────────────────────────────
async function loadPdfPages(url: string): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const pdf = await pdfjs.getDocument({ url, withCredentials: false }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    pages.push(canvas.toDataURL("image/jpeg", 0.92));
  }
  return pages;
}

// ── Single page component for flip book ───────────────────────────────────────
import React from "react";

const FlipPage = React.forwardRef<HTMLDivElement, { src: string; pageNum: number; total: number }>(
  ({ src, pageNum, total }, ref) => (
    <div
      ref={ref}
      className="relative bg-white shadow-[inset_-4px_0_8px_rgba(0,0,0,0.08)]"
      style={{ width: "100%", height: "100%" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Halaman ${pageNum}`}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />
      {/* Page number */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span className="text-[0.6rem] text-black/25 font-medium select-none">
          {pageNum} / {total}
        </span>
      </div>
    </div>
  )
);
FlipPage.displayName = "FlipPage";

// ── Cover page ────────────────────────────────────────────────────────────────
const CoverPage = React.forwardRef<HTMLDivElement, { src: string; title: string; accent: string }>(
  ({ src, title, accent }, ref) => (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)`,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Cover"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />
    </div>
  )
);
CoverPage.displayName = "CoverPage";

// ── Empty back cover ──────────────────────────────────────────────────────────
const BackCover = React.forwardRef<HTMLDivElement, { accent: string; title: string }>(
  ({ accent, title }, ref) => (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center"
      style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`,
      }}
    >
      <BookOpen size={48} style={{ color: accent + "40" }} />
      <p className="mt-4 text-[0.75rem] font-semibold text-center px-6" style={{ color: accent + "60" }}>
        {title}
      </p>
    </div>
  )
);
BackCover.displayName = "BackCover";

// ── Main Modal ────────────────────────────────────────────────────────────────
interface Props {
  pdfUrl: string;
  title: string;
  accent: string;
  onClose: () => void;
}

export default function FlipBookModal({ pdfUrl, title, accent, onClose }: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipRef = useRef<any>(null);

  // Load PDF on mount
  useEffect(() => {
    loadPdfPages(pdfUrl)
      .then((p) => { setPages(p); setLoading(false); })
      .catch(() => { setError("Gagal memuat PDF. Pastikan URL valid."); setLoading(false); });
  }, [pdfUrl]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const goNext = useCallback(() => flipRef.current?.pageFlip()?.flipNext(), []);
  const goPrev = useCallback(() => flipRef.current?.pageFlip()?.flipPrev(), []);

  const totalPages = pages.length;
  const bookWidth = Math.min(Math.floor((window?.innerWidth ?? 1200) * 0.38), 420);
  const bookHeight = Math.floor(bookWidth * 1.41);

  return (
    <AnimatePresence>
      <motion.div
        key="flipbook-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[20000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          key="flipbook-modal"
          initial={{ opacity: 0, scale: 0.88, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center gap-6 max-w-[95vw]"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: accent + "25" }}
              >
                <BookOpen size={15} style={{ color: accent }} />
              </div>
              <div>
                <p className="text-white font-bold text-[0.9rem] leading-tight line-clamp-1 max-w-[340px]">
                  {title}
                </p>
                <p className="text-white/35 text-[0.65rem] font-mono">
                  {loading ? "Memuat..." : `${totalPages} halaman`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-white/50 hover:text-white px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 transition-all"
              >
                <Download size={12} /> Unduh
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X size={14} className="text-white/70" />
              </button>
            </div>
          </div>

          {/* Book + Nav */}
          <div className="flex items-center gap-6">
            {/* Prev */}
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={goPrev}
              disabled={loading || currentPage === 0}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-25 flex items-center justify-center transition-all flex-shrink-0"
            >
              <ChevronLeft size={20} className="text-white" />
            </motion.button>

            {/* Flip Book */}
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                width: bookWidth * 2,
                height: bookHeight,
                boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)`,
              }}
            >
              {loading ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 bg-[#1a1a1a]"
                  style={{ width: bookWidth * 2, height: bookHeight }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={32} style={{ color: accent }} />
                  </motion.div>
                  <p className="text-white/40 text-[0.8rem]">Memuat brosur PDF…</p>
                </div>
              ) : error ? (
                <div
                  className="flex flex-col items-center justify-center gap-3 bg-[#1a1a1a] p-8 text-center"
                  style={{ width: bookWidth * 2, height: bookHeight }}
                >
                  <BookOpen size={40} className="text-white/20" />
                  <p className="text-white/50 text-[0.85rem]">{error}</p>
                  <a
                    href={pdfUrl} target="_blank" rel="noreferrer"
                    className="text-[0.78rem] font-semibold px-4 py-2 rounded-lg"
                    style={{ backgroundColor: accent, color: "#fff" }}
                  >
                    Buka di Tab Baru
                  </a>
                </div>
              ) : (
                <HTMLFlipBook
                  ref={flipRef}
                  width={bookWidth}
                  height={bookHeight}
                  size="fixed"
                  minWidth={bookWidth}
                  maxWidth={bookWidth}
                  minHeight={bookHeight}
                  maxHeight={bookHeight}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                  className="flip-book"
                  style={{}}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={700}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize={false}
                  clickEventForward={true}
                  useMouseEvents={true}
                  swipeDistance={30}
                  showPageCorners={true}
                  disableFlipByClick={false}
                >
                  {/* Cover */}
                  <CoverPage src={pages[0]} title={title} accent={accent} />

                  {/* Inner pages */}
                  {pages.slice(1).map((src, idx) => (
                    <FlipPage
                      key={idx}
                      src={src}
                      pageNum={idx + 2}
                      total={totalPages}
                    />
                  ))}

                  {/* Back cover */}
                  <BackCover accent={accent} title={title} />
                </HTMLFlipBook>
              )}
            </div>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.92 }}
              onClick={goNext}
              disabled={loading || currentPage >= totalPages - 1}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-25 flex items-center justify-center transition-all flex-shrink-0"
            >
              <ChevronRight size={20} className="text-white" />
            </motion.button>
          </div>

          {/* Page indicator dots */}
          {!loading && !error && totalPages > 0 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 15) }).map((_, i) => {
                const pageIdx = totalPages > 15
                  ? Math.floor(i * totalPages / 15)
                  : i;
                const active = currentPage === pageIdx || (i === 14 && currentPage >= pageIdx);
                return (
                  <motion.button
                    key={i}
                    animate={{ width: active ? 20 : 6, opacity: active ? 1 : 0.3 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => flipRef.current?.pageFlip()?.flip(pageIdx)}
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: active ? accent : "#ffffff" }}
                  />
                );
              })}
            </div>
          )}

          {/* Tip */}
          <p className="text-white/20 text-[0.65rem] text-center">
            Klik halaman atau tekan ← → untuk membalik halaman · Esc untuk menutup
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
