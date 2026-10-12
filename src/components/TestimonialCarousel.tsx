"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP = 20;
const INTERVAL = 5000;
const EASE = [0.32, 0.72, 0, 1] as const;

export interface CarouselApi {
  hold: (on: boolean) => void;
}

export default function TestimonialCarousel<T extends { id: string }>({
  items,
  accent,
  renderItem,
}: {
  items: T[];
  accent: string;
  renderItem: (item: T, index: number, api: CarouselApi) => ReactNode;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [holds, setHolds] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible = width >= 1000 ? 3 : width >= 640 ? 2 : 1;
  const cardW = (width - GAP * (visible - 1)) / visible;
  const step = cardW + GAP;
  const max = Math.max(0, items.length - visible);
  const current = Math.min(index, max);
  const paused = hover || dragging || holds > 0;

  useEffect(() => {
    const ctrl = animate(x, -current * step, { duration: reduce ? 0 : 0.9, ease: EASE });
    return () => ctrl.stop();
  }, [current, step, x, reduce]);

  useEffect(() => {
    if (reduce || max === 0 || paused) return;
    const id = setTimeout(() => setIndex(current >= max ? 0 : current + 1), INTERVAL);
    return () => clearTimeout(id);
  }, [current, max, paused, reduce]);

  const api: CarouselApi = { hold: (on) => setHolds((h) => Math.max(0, h + (on ? 1 : -1))) };

  const onDragEnd = (_: unknown, info: { velocity: { x: number } }) => {
    setDragging(false);
    const projected = -(x.get() + info.velocity.x * 0.18) / step;
    const target = Math.max(0, Math.min(max, Math.round(projected)));
    if (target === current) animate(x, -target * step, { duration: 0.6, ease: EASE });
    else setIndex(target);
  };

  const prev = () => setIndex(current <= 0 ? max : current - 1);
  const next = () => setIndex(current >= max ? 0 : current + 1);

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div ref={wrapRef} className="-my-4 overflow-hidden py-4">
        <motion.div
          style={{ x, touchAction: "pan-y" }}
          drag={max > 0 ? "x" : false}
          dragConstraints={{ left: -max * step, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
          className={`flex items-stretch ${max > 0 ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {items.map((item, i) => (
            <div key={item.id} style={{ width: cardW, flex: "none", marginRight: i < items.length - 1 ? GAP : 0 }}>
              {renderItem(item, i, api)}
            </div>
          ))}
        </motion.div>
      </div>

      {max > 0 && (
        <div className="mt-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: max + 1 }).map((_, i) => {
              const active = i === current;
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Ke testimoni ${i + 1}`}
                  className="relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
                  style={{ width: active ? 40 : 8, backgroundColor: accent + "30" }}
                >
                  {active && (
                    <motion.span
                      key={`${current}-${paused}`}
                      className="absolute inset-0 origin-left rounded-full"
                      style={{ backgroundColor: accent }}
                      initial={{ scaleX: paused || reduce ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused || reduce ? 0 : INTERVAL / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: "Sebelumnya", onClick: prev, icon: <ChevronLeft size={16} /> },
              { label: "Berikutnya", onClick: next, icon: <ChevronRight size={16} /> },
            ].map((b) => (
              <motion.button
                key={b.label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={b.onClick}
                aria-label={b.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.1] bg-white text-dark/70 transition-colors hover:text-dark"
              >
                {b.icon}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
