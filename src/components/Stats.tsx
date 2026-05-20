"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { target: 200, suffix: "+", label: "Organizations Served" },
  { target: 15,  suffix: "+", label: "Years of Experience" },
  { target: 98,  suffix: "%", label: "Client Satisfaction" },
  { target: 40,  suffix: "+", label: "Expert Consultants" },
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
    <section className="py-[clamp(60px,8vw,100px)] bg-dark text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center text-center py-[clamp(32px,4vw,56px)] px-4 border-r border-white/10 last:border-r-0 even:border-r-0 lg:even:border-r"
            >
              <div className="leading-none mb-3">
                <span className="text-[clamp(3rem,5vw,5.5rem)] font-extrabold tracking-[-0.04em]">
                  <Counter target={s.target} suffix={s.suffix} />
                </span>
                <span className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold tracking-[-0.03em] text-white/40 ml-0.5">
                  {s.suffix}
                </span>
              </div>
              <p className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase text-white/45">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
