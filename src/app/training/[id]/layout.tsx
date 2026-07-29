import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import JsonLd from "@/components/JsonLd";
import type { TrainingItem } from "@/lib/supabase";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  stripText,
  trainingJsonLd,
  truncateText,
} from "@/lib/seo";
import { trainingDateLabel } from "@/lib/training-schedule";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getTraining(id: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("training")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as TrainingItem | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const training = await getTraining(id);

  if (!training) {
    return {
      title: "Training Tidak Ditemukan",
      alternates: { canonical: absoluteUrl(`/training/${id}`) },
    };
  }

  const dateLabel = trainingDateLabel(training);
  const description = truncateText(
    stripText(training.description) ||
      `${training.title}${dateLabel ? ` pada ${dateLabel}` : ""}. Pelatihan profesional GRCC di bidang tata kelola, risiko, kepatuhan, dan daya saing.`,
    155
  );
  const image = training.poster_url ? absoluteUrl(training.poster_url) : absoluteUrl(`/training/${training.id}/opengraph-image`);

  return {
    title: training.title,
    description,
    alternates: { canonical: absoluteUrl(`/training/${training.id}`) },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/training/${training.id}`),
      title: training.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: training.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: training.title,
      description,
      images: [image],
    },
  };
}

export default async function TrainingSeoLayout({ children, params }: Props) {
  const { id } = await params;
  const training = await getTraining(id);
  const structuredData = training
    ? [
        ...trainingJsonLd(training),
        breadcrumbJsonLd([
          { name: "Beranda", url: "/" },
          { name: "Training", url: "/training" },
          { name: training.title, url: `/training/${training.id}` },
        ]),
      ]
    : null;

  return (
    <>
      {structuredData && <JsonLd data={structuredData} />}
      {children}
    </>
  );
}
