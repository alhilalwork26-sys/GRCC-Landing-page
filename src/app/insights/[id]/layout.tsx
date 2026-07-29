import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import JsonLd from "@/components/JsonLd";
import type { InsightItem } from "@/lib/supabase";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  insightArticleJsonLd,
  stripText,
  truncateText,
} from "@/lib/seo";

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

async function getInsight(id: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("insights")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return data as InsightItem | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getInsight(id);

  if (!item) {
    return {
      title: "Artikel Tidak Ditemukan",
      alternates: { canonical: absoluteUrl(`/insights/${id}`) },
    };
  }

  const description = truncateText(stripText(item.excerpt || item.content), 155);
  const image = item.img ? absoluteUrl(item.img) : absoluteUrl("/opengraph-image");

  return {
    title: item.title,
    description,
    alternates: { canonical: absoluteUrl(`/insights/${item.id}`) },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/insights/${item.id}`),
      title: item.title,
      description,
      publishedTime: item.created_at,
      images: [{ url: image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: [image],
    },
  };
}

export default async function InsightSeoLayout({ children, params }: Props) {
  const { id } = await params;
  const item = await getInsight(id);
  const structuredData = item
    ? [
        insightArticleJsonLd(item),
        breadcrumbJsonLd([
          { name: "Beranda", url: "/" },
          { name: "Artikel", url: "/insights" },
          { name: item.title, url: `/insights/${item.id}` },
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
