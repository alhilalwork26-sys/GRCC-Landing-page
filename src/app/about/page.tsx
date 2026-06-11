"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, TeamMember } from "@/lib/supabase";

// ── animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.12, ease: "easeOut" },
  }),
};


const values = [
  {
    label: "Integritas",
    desc: "Kami menerapkan standar yang sama dengan standar yang kami bantu wujudkan bagi klien. Transparansi dan perilaku etis adalah prinsip yang tidak dapat ditawar.",
  },
  {
    label: "Dampak",
    desc: "Setiap pendampingan diukur dari hasil nyata, bukan sekadar laporan, melainkan tata kelola yang benar-benar berjalan.",
  },
  {
    label: "Independensi",
    desc: "Rekomendasi kami tidak dipengaruhi kepentingan vendor atau tekanan politik. Kami menyampaikan fakta secara jernih, bahkan ketika tidak mudah.",
  },
  {
    label: "Kolaborasi",
    desc: "Kami membangun bersama klien, bukan hanya untuk klien. Tata kelola berkelanjutan membutuhkan kepemilikan dari dalam organisasi.",
  },
];

// ── subcomponents ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <motion.span
      variants={fadeUp}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="font-mono text-[0.65rem] tracking-[0.22em] text-dark/30 uppercase mb-6 block"
    >
      {text}
    </motion.span>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark/[0.05] group cursor-default"
    >
      {/* Photo */}
      {member.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photo}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-dark/[0.07] flex items-center justify-center">
          <span className="font-mono text-[3rem] font-bold text-dark/20">{member.num}</span>
        </div>
      )}

      {/* Number badge — top left */}
      <div className="absolute top-5 left-5 flex items-center gap-1.5 z-20 bg-white/30 backdrop-blur-sm rounded-full px-2.5 py-1">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <rect width="4.5" height="4.5" rx="1" fill="#0A0A0A" opacity="0.5" />
          <rect x="5.5" width="4.5" height="4.5" rx="1" fill="#0A0A0A" opacity="0.25" />
          <rect y="5.5" width="4.5" height="4.5" rx="1" fill="#0A0A0A" opacity="0.25" />
          <rect x="5.5" y="5.5" width="4.5" height="4.5" rx="2.25" fill="#0A0A0A" opacity="0.5" />
        </svg>
        <span className="font-mono text-[0.65rem] tracking-[0.12em] text-dark/50">{member.num}</span>
      </div>

      {/* Default: bottom white-fade + name */}
      <div className="absolute inset-x-0 bottom-0 pt-24 pb-6 px-6 z-10 transition-opacity duration-300 group-hover:opacity-0"
        style={{ background: "linear-gradient(to top, rgba(245,245,243,0.97) 0%, rgba(245,245,243,0.7) 45%, transparent 100%)" }}
      >
        <p className="text-[1.05rem] font-bold text-dark leading-tight mb-1">{member.name}</p>
        <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-dark/40">{member.role}</p>
      </div>

      {/* Hover: bio overlay slides up */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <div className="bg-[#F5F5F3] px-6 pt-8 pb-7 h-full flex flex-col justify-between">
          <p className="text-[0.92rem] leading-[1.75] text-dark/75 flex-1">
            {member.bio}
          </p>
          <div className="mt-6 pt-5 border-t border-dark/10">
            <p className="text-[1rem] font-bold text-dark leading-tight mb-1">{member.name}</p>
            <p className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-dark/40">{member.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("*")
      .eq("active", true)
      .order("order_index")
      .then(({ data }) => {
        setTeam(data ?? []);
        setTeamLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="pt-[calc(72px+clamp(80px,10vw,120px))] pb-[clamp(60px,8vw,100px)] px-6 lg:px-16 max-w-[1280px] mx-auto">
          <SectionLabel text="/Tentang GRCC" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              {["Kami menjembatani", "ideal tata kelola", "dengan realitas", "organisasi."].map(
                (line, i) => (
                  <motion.span
                    key={i}
                    custom={i + 1}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="block text-[clamp(2.6rem,5.5vw,5.5rem)] font-extrabold leading-[1.0] tracking-[-0.03em] text-dark"
                  >
                    {line}
                  </motion.span>
                )
              )}

              <motion.p
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-8 text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.8] text-muted max-w-[520px]"
              >
                GRCC hadir untuk menjembatani teori dan praktik tata kelola.
                Kami bermitra dengan organisasi sektor publik dan swasta untuk
                membangun kerangka kerja yang transparan, akuntabel, dan
                berkelanjutan.
              </motion.p>
            </div>

            <motion.div
              custom={1}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="aspect-[4/3] rounded-lg overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80"
                alt="Tim GRCC"
                width={900}
                height={675}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </motion.div>
          </div>

          {/* Stat bar */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-[clamp(60px,8vw,100px)] grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden"
          >
            {[
              { value: "600", label: "Pakar" },
              { value: "2075", label: "Tenaga Kependidikan" },
              { value: "1000", label: "Partner" },
              { value: "12", label: "Jumlah Layanan" },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg px-8 py-10 text-center">
                <p className="text-[0.95rem] text-muted mb-3">{stat.label}</p>
                <p className="text-[clamp(2rem,3.5vw,3rem)] font-normal tracking-[0.02em] text-[#082B52] leading-none">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Origin Story ─────────────────────────────────────────────── */}
        <section className="bg-[#FAFAF8] py-[clamp(80px,10vw,130px)]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,6vw,100px)] items-center">
              {/* Parallax image */}
              <div
                ref={parallaxRef}
                className="relative aspect-[3/4] rounded-lg overflow-hidden order-2 lg:order-1"
              >
                <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
                  <Image
                    src="/unair-building.jpg"
                    alt="Gedung Universitas Airlangga — kampus GRCC"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                    className="object-cover object-top"
                    priority
                  />
                </motion.div>
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <SectionLabel text="/Cerita Kami" />
                <motion.h2
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-[clamp(2rem,3.5vw,3.2rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-dark mb-8"
                >
                  Awal mula GRCC
                </motion.h2>
                {[
                  "GRCC merupakan pusat layanan profesional yang berfokus pada penguatan tata kelola, manajemen risiko, kepatuhan, keberlanjutan, dan daya saing organisasi. Kami percaya bahwa tata kelola yang baik bukan hanya soal kepatuhan, tetapi juga fondasi strategis untuk membangun organisasi yang adaptif, tangguh, dan berdaya saing jangka panjang.",
                  "Dengan dukungan akademisi, praktisi, dan tenaga ahli lintas disiplin, GRCC mengintegrasikan kekuatan riset, pelatihan, konsultasi, asesmen, dan sertifikasi untuk menghasilkan solusi yang relevan, aplikatif, dan berdampak bagi organisasi mitra.",
                ].map((para, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    custom={i + 2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-[0.95rem] leading-[1.85] text-dark/60 mb-5"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <section className="py-[clamp(80px,10vw,130px)] px-6 lg:px-16 max-w-[1280px] mx-auto">
          <div className="mb-16">
            <SectionLabel text="/Prinsip Kami" />
            <motion.h2
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[clamp(2rem,3.5vw,3.2rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-dark max-w-[560px]"
            >
              Prinsip yang memandu setiap pendampingan
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="bg-bg px-8 py-10 group hover:bg-dark transition-colors duration-300"
              >
                <p className="font-mono text-[0.6rem] tracking-[0.2em] text-dark/25 group-hover:text-white/30 uppercase mb-5 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-[1.35rem] font-bold text-dark group-hover:text-white tracking-[-0.02em] mb-3 transition-colors">
                  {v.label}
                </h3>
                <p className="text-[0.88rem] leading-[1.75] text-dark/55 group-hover:text-white/55 transition-colors">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section className="bg-[#FAFAF8] py-[clamp(80px,10vw,130px)]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
            {/* Separator + label */}
            <div className="flex items-center gap-5 mb-12">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                style={{ originX: 0 }}
                className="h-px bg-dark/15 flex-1"
              />
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-mono text-[0.65rem] tracking-[0.22em] text-dark/30 uppercase whitespace-nowrap"
              >
                /Tim Kami
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
                style={{ originX: 1 }}
                className="h-px bg-dark/15 flex-1"
              />
            </div>

            <motion.h2
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[clamp(2rem,3.5vw,3.2rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-dark mb-14"
            >
              Tim Kami
            </motion.h2>

            {/* Card grid — 3 cols desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teamLoading
                ? [1,2,3,4,5,6].map((n) => (
                    <div key={n} className="aspect-[3/4] rounded-2xl bg-dark/[0.05] animate-pulse" />
                  ))
                : team.map((member, i) => (
                    <TeamCard key={member.id} member={member} index={i} />
                  ))
              }
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-[clamp(80px,10vw,130px)] px-6 lg:px-16 max-w-[1280px] mx-auto">
          <div className="bg-dark rounded-2xl px-[clamp(32px,6vw,80px)] py-[clamp(48px,6vw,80px)] overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.02] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-white/[0.02] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.p
                  variants={fadeUp}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-white/25 mb-6"
                >
                  /Bergabung
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white mb-6"
                >
                  Bentuk masa depan tata kelola
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-[0.95rem] leading-[1.8] text-white/45 max-w-[440px]"
                >
                  Kami selalu terbuka bagi talenta unggul yang memiliki komitmen
                  terhadap tata kelola yang lebih baik. Jika Anda ingin membantu
                  organisasi menjadi lebih transparan, akuntabel, dan berdaya
                  saing, kami ingin mengenal Anda.
                </motion.p>
              </div>

              <motion.div
                variants={fadeUp}
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col gap-4"
              >
                {[
                  { title: "Penasihat Senior Tata Kelola", type: "Penuh waktu · Surabaya" },
                  { title: "Analis Kepatuhan", type: "Penuh waktu · Surabaya" },
                  { title: "Rekan Riset ESG", type: "Kontrak · Jarak jauh" },
                ].map((job) => (
                  <a
                    key={job.title}
                    href="#"
                    className="flex items-center justify-between gap-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-lg px-6 py-4 transition-colors group"
                  >
                    <div>
                      <p className="text-[0.92rem] font-semibold text-white">{job.title}</p>
                      <p className="text-[0.78rem] text-white/35 mt-0.5">{job.type}</p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0"
                    />
                  </a>
                ))}

                <Link
                  href="#"
                  className="flex items-center gap-2 text-[0.85rem] font-semibold text-white/40 hover:text-white transition-colors mt-2 w-fit"
                >
                  Lihat semua posisi terbuka
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
