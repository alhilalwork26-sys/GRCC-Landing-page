"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    num: "01",
    title: "Governance Advisory",
    desc: "Strategic guidance and roadmap development for building robust governance structures aligned with your organizational goals and regulatory landscape.",
  },
  {
    num: "02",
    title: "Risk Management",
    desc: "Comprehensive enterprise risk identification, assessment, and mitigation frameworks that protect your organization from operational, financial, and reputational risks.",
  },
  {
    num: "03",
    title: "Compliance Solutions",
    desc: "End-to-end compliance programs tailored to industry standards and regulatory requirements, ensuring your organization meets obligations efficiently.",
  },
  {
    num: "04",
    title: "Competitiveness Strategy",
    desc: "Data-driven strategies that leverage governance excellence as a competitive differentiator, positioning your organization for sustainable market leadership.",
  },
  {
    num: "05",
    title: "ESG & Sustainability",
    desc: "Environmental, Social, and Governance framework development and reporting to meet stakeholder expectations and global sustainability standards.",
  },
  {
    num: "06",
    title: "Training & Capacity Building",
    desc: "Tailored training programs that build governance and compliance capabilities across all levels of your organization, from board to operational teams.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function Services() {
  return (
    <section id="services" className="py-[clamp(80px,10vw,140px)] bg-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[clamp(40px,6vw,80px)]"
        >
          <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted mb-4">
            Our Services
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
            Expert capabilities across{" "}
            <br className="hidden md:block" />
            the governance spectrum
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg overflow-hidden"
        >
          {services.map((s) => (
            <motion.div
              key={s.num}
              variants={item}
              whileHover={{ backgroundColor: "#EFEDE7" }}
              className="flex flex-col p-[clamp(28px,3vw,44px)] border-b border-r border-border last:border-b-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 transition-colors duration-300 group"
            >
              <span className="text-[0.73rem] font-bold tracking-[0.1em] text-muted mb-7">
                {s.num}
              </span>
              <div className="flex-1 mb-8">
                <h3 className="text-[1.1rem] font-bold tracking-tight mb-3">{s.title}</h3>
                <p className="text-[0.875rem] leading-[1.7] text-muted">{s.desc}</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold tracking-[0.05em] text-dark"
              >
                Learn more
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
