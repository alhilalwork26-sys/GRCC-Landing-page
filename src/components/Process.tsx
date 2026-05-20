"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Diagnose",
    desc: "We begin with a comprehensive assessment of your current governance structures, risk exposure, and compliance gaps to establish a clear baseline and identify priorities.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Our experts co-design bespoke frameworks and roadmaps tailored to your industry, regulatory environment, and organizational culture — practical, not theoretical.",
  },
  {
    num: "03",
    title: "Implement",
    desc: "We lead or support hands-on implementation of governance policies, risk controls, and compliance programs, integrating seamlessly with your existing operations.",
  },
  {
    num: "04",
    title: "Sustain",
    desc: "Ongoing monitoring, training, and refinement ensures governance excellence is embedded in your culture and continuously adapts to evolving regulatory conditions.",
  },
];

export default function Process() {
  return (
    <section id="about" className="py-[clamp(80px,10vw,140px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[clamp(40px,6vw,80px)]"
        >
          <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted mb-4">
            How We Work
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
            A proven methodology{" "}
            <br className="hidden md:block" />
            for lasting governance change
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-border rounded-lg overflow-hidden">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ backgroundColor: "#EFEDE7" }}
              className="p-8 lg:p-12 border-r border-border last:border-r-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r relative transition-colors duration-300 group"
            >
              <span className="block text-[0.73rem] font-bold tracking-[0.12em] text-muted mb-8">
                {s.num}
              </span>
              <h3 className="text-[1.35rem] font-extrabold tracking-[-0.02em] mb-4">{s.title}</h3>
              <p className="text-[0.86rem] leading-[1.7] text-muted">{s.desc}</p>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <span className="absolute right-[-10px] top-8 lg:top-12 text-border text-sm hidden lg:block z-10">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
