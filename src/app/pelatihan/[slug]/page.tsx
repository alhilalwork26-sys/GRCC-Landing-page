import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowUpRight, BookOpen, Calendar, CheckCircle2, MessageCircle, Search } from "lucide-react";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import type { SubProgramItem, TrainingItem } from "@/lib/supabase";
import { whatsappHref } from "@/lib/site-config";
import { getSeoLandingPage, seoLandingPages } from "@/lib/seo-landing-pages";
import { absoluteUrl, breadcrumbJsonLd, stripText, truncateText } from "@/lib/seo";
import { trainingDateLabel } from "@/lib/training-schedule";

type Props = {
  params: Promise<{ slug: string }>;
};

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function matchesTerms(value: string | null | undefined, terms: string[]) {
  const text = stripText(value).toLowerCase();
  return terms.some((term) => text.includes(term.toLowerCase()));
}

async function getRelatedData(terms: string[]) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { trainings: [], subPrograms: [] };

  const [{ data: trainings }, { data: subPrograms }] = await Promise.all([
    supabase.from("training").select("*").eq("published", true).order("created_at", { ascending: false }),
    supabase.from("sub_programs").select("*").eq("active", true).order("order_index"),
  ]);

  return {
    trainings: ((trainings ?? []) as TrainingItem[]).filter((item) =>
      matchesTerms([item.title, item.category, item.description].filter(Boolean).join(" "), terms)
    ),
    subPrograms: ((subPrograms ?? []) as SubProgramItem[]).filter((item) =>
      matchesTerms([item.name, item.description].filter(Boolean).join(" "), terms)
    ),
  };
}

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  if (!page) return {};

  const description = truncateText(page.description, 155);
  const canonical = absoluteUrl(`/pelatihan/${page.slug}`);

  return {
    title: page.title,
    description,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: page.title,
      description,
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  if (!page) notFound();

  const { trainings, subPrograms } = await getRelatedData(page.relatedTerms);
  const canonical = absoluteUrl(`/pelatihan/${page.slug}`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      name: page.title,
      description: page.description,
      url: canonical,
      inLanguage: "id-ID",
      about: page.keywords,
      publisher: { "@id": "https://grcc-landing-page.vercel.app/#organization" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    breadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Pelatihan", url: "/training" },
      { name: page.title, url: `/pelatihan/${page.slug}` },
    ]),
  ];

  const requestMessage = `Halo Tim GRCC, saya ingin informasi tentang *${page.title}*. Mohon info jadwal, biaya, dan opsi in-house training. Terima kasih.`;

  return (
    <>
      <JsonLd data={structuredData} />
      <Navbar />
      <main className="bg-[#F7F7F5] text-dark">
        <section className="relative overflow-hidden bg-[#0A0A0A] pt-32 pb-20">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }} />
          <div className="relative mx-auto max-w-[1180px] px-6 lg:px-16">
            <p className="mb-5 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-white/35">
              {page.eyebrow}
            </p>
            <h1 className="max-w-[820px] text-[clamp(2.4rem,6vw,5.4rem)] font-black leading-[0.98] tracking-tight text-white">
              {page.h1}
            </h1>
            <p className="mt-7 max-w-[680px] text-[1rem] leading-[1.9] text-white/58">
              {page.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={whatsappHref(requestMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[0.85rem] font-extrabold text-dark"
              >
                <MessageCircle size={16} /> Tanya Jadwal
              </a>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[0.85rem] font-bold text-white/76 hover:bg-white/10"
              >
                Lihat Semua Program <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-8 px-6 py-14 lg:grid-cols-[1fr_360px] lg:px-16">
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                  <Search size={19} />
                </div>
                <div>
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Keyword Fokus</p>
                  <h2 className="text-[1.35rem] font-black">Apa yang Dicari Peserta?</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {page.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-border bg-[#F7F7F5] px-3.5 py-2 text-[0.78rem] font-bold text-dark/72">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-7">
                <p className="mb-5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Cocok Untuk</p>
                <ul className="space-y-3">
                  {page.audience.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9rem] font-semibold text-dark/72">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-white p-7">
                <p className="mb-5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Hasil yang Diharapkan</p>
                <ul className="space-y-3">
                  {page.outcomes.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9rem] font-semibold text-dark/72">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#4F46E5]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-7">
              <p className="mb-5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Pertanyaan Umum</p>
              <div className="divide-y divide-border">
                {page.faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-[1rem] font-black">{faq.question}</h3>
                    <p className="mt-2 text-[0.92rem] leading-[1.8] text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-white p-6">
              <p className="mb-4 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Jadwal Terkait</p>
              {trainings.length > 0 ? (
                <div className="space-y-3">
                  {trainings.slice(0, 3).map((training) => (
                    <Link key={training.id} href={`/training/${training.id}`} className="block rounded-xl border border-border p-4 transition hover:border-dark/25">
                      <p className="text-[0.85rem] font-black leading-snug">{training.title}</p>
                      <p className="mt-2 flex items-center gap-2 text-[0.74rem] font-semibold text-muted">
                        <Calendar size={12} /> {trainingDateLabel(training) ?? "Jadwal menyusul"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[0.85rem] leading-[1.7] text-muted">Belum ada jadwal publik yang cocok. Tim GRCC dapat membantu menyiapkan jadwal kelas publik atau in-house.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <p className="mb-4 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-muted">Program Terkait</p>
              <div className="space-y-3">
                {subPrograms.slice(0, 5).map((sub) => (
                  <Link key={sub.id} href={`/programs/${sub.program_id}/${sub.slug}`} className="flex items-start gap-3 rounded-xl border border-border p-4 transition hover:border-dark/25">
                    <BookOpen size={15} className="mt-0.5 flex-shrink-0 text-[#4F46E5]" />
                    <span className="text-[0.82rem] font-bold leading-snug">{sub.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
