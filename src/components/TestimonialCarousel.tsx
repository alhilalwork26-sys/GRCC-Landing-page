"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

const GAP = 20;
const SPEED = 38; // px per second

export interface CarouselApi {
  hold: (on: boolean) => void;
}

export default function TestimonialCarousel<T extends { id: string }>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number, api: CarouselApi) => ReactNode;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [holds, setHolds] = useState(0);
  const [visible, setVisible] = useState(true);
  const x = useMotionValue(0);

  const paused = hover || pressed || holds > 0 || !visible;
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const cardW = width >= 640 ? 360 : 280;
  const step = cardW + GAP;
  const loop = items.length * step;
  const marquee = !reduce && items.length >= 3;
  const copies = marquee ? Math.ceil(width / loop) + 1 : 1;

  useEffect(() => {
    if (!marquee) { x.set(0); return; }
    let raf = 0;
    let last = performance.now();
    let speed = 1;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = pausedRef.current ? 0 : 1;
      speed += (target - speed) * (1 - Math.exp(-dt * 5));
      let next = x.get() - SPEED * speed * dt;
      if (next <= -loop) next += loop;
      x.set(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [marquee, loop, x]);

  const api: CarouselApi = { hold: (on) => setHolds((h) => Math.max(0, h + (on ? 1 : -1))) };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      <div
        ref={wrapRef}
        className={`-my-4 py-4 ${marquee ? "overflow-hidden" : "overflow-x-auto"}`}
        style={marquee ? { maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)" } : undefined}
      >
        <motion.div
          style={{ x: marquee ? x : 0, width: "max-content" }}
          className={`flex items-stretch will-change-transform ${!marquee && items.length < 3 ? "mx-auto" : ""}`}
        >
          {Array.from({ length: copies }).flatMap((_, c) =>
            items.map((item, i) => (
              <div key={`${item.id}-${c}`} style={{ width: cardW, flex: "none", marginRight: GAP }}>
                {renderItem(item, i, api)}
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
