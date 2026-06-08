"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { target: 600,  suffix: "", label: "Pakar" },
  { target: 2075, suffix: "", label: "Tenaga Kependidikan" },
  { target: 1000, suffix: "", label: "Partner" },
  { target: 12,   suffix: "", label: "Jumlah Layanan" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  return (
    <section className="py-[clamp(60px,8vw,100px)] bg-bg text-dark">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-bg flex flex-col items-center text-center py-[clamp(34px,5vw,64px)] px-5"
            >
              <p className="text-[clamp(0.95rem,1.4vw,1.15rem)] text-muted mb-3">
                {s.label}
              </p>
              <div className="leading-none">
                <span className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-normal tracking-[0.02em] text-[#082B52]">
                  <Counter target={s.target} suffix={s.suffix} />
                </span>
                {s.suffix && (
                  <span className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold tracking-[-0.03em] text-dark/35 ml-0.5">
                    {s.suffix}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
