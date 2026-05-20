"use client";

import { motion } from "framer-motion";

const cases = [
  {
    title: "Corporate Governance",
    desc: "Board structure optimization, director accountability frameworks, and shareholder rights protection for private and public entities.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="9" height="9" rx="2" fill="#0A0A0A" />
        <rect x="16" y="3" width="9" height="9" rx="2" fill="#0A0A0A" opacity=".35" />
        <rect x="3" y="16" width="9" height="9" rx="2" fill="#0A0A0A" opacity=".35" />
        <rect x="16" y="16" width="9" height="9" rx="2" fill="#0A0A0A" opacity=".7" />
      </svg>
    ),
  },
  {
    title: "Regulatory Compliance",
    desc: "Systematic compliance mapping and monitoring for financial, health, environmental, and sector-specific regulations.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 14C4 8.477 8.477 4 14 4s10 4.477 10 10-4.477 10-10 10S4 19.523 4 14z" fill="#0A0A0A" opacity=".15" />
        <path d="M14 8v6l4 2" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Public Sector Reform",
    desc: "Government institutions and state-owned enterprise transformation through accountability, transparency, and performance management systems.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 22V10l8-6 8 6v12H6z" fill="#0A0A0A" opacity=".15" />
        <rect x="11" y="14" width="6" height="8" rx="1" fill="#0A0A0A" />
      </svg>
    ),
  },
  {
    title: "Financial Risk Management",
    desc: "Credit, market, liquidity, and operational risk frameworks for banks, insurers, and financial institutions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L10 14l4 4 4-5 6 7" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Anti-Corruption & Integrity",
    desc: "Anti-bribery policies, whistleblowing mechanisms, and integrity management systems aligned with UN and OECD standards.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" fill="#0A0A0A" opacity=".2" />
        <path d="M6 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Data Privacy & Security",
    desc: "GDPR, PDPA, and data governance frameworks ensuring your organization responsibly manages personal data and digital assets.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2" fill="#0A0A0A" opacity=".15" />
        <path d="M9 8V6a5 5 0 0110 0v2" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="15" r="2" fill="#0A0A0A" />
      </svg>
    ),
  },
  {
    title: "ESG Reporting",
    desc: "GRI, SASB, and TCFD-aligned sustainability reporting frameworks connecting environmental and social performance to business strategy.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 18C8 14 12 10 14 10s5 6 9 4" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 23H23" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Competitiveness Analytics",
    desc: "Benchmarking studies, policy impact analysis, and competitiveness indices that inform strategic decisions at the organizational level.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4l2.5 7.5H24l-6.5 4.5 2.5 7.5L14 19l-6 4.5 2.5-7.5L4 11.5h7.5L14 4z" fill="#0A0A0A" opacity=".2" stroke="#0A0A0A" strokeWidth="1.2" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

export default function UseCases() {
  return (
    <section id="programs" className="py-[clamp(80px,10vw,140px)] bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-[clamp(40px,6vw,80px)]"
        >
          <p className="text-[0.78rem] font-bold tracking-[0.12em] uppercase text-muted mb-4">
            Programs & Solutions
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-0.025em]">
            Across industries and sectors,{" "}
            <br className="hidden md:block" />
            we drive governance outcomes
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5"
        >
          {cases.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              whileHover={{ backgroundColor: "#FFFFFF", y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-bg p-[clamp(24px,3vw,40px)] cursor-default"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-dark/[0.06] rounded-xl mb-6">
                {c.icon}
              </div>
              <h3 className="text-[0.97rem] font-bold tracking-tight mb-2.5">{c.title}</h3>
              <p className="text-[0.84rem] leading-[1.7] text-muted">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
