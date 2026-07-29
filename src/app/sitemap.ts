import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { seoLandingPages } from "@/lib/seo-landing-pages";

const BASE_URL = "https://grcc-landing-page.vercel.app";

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL,             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/programs`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/jadwal`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/insights`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const seoPages: MetadataRoute.Sitemap = seoLandingPages.map((page) => ({
    url: `${BASE_URL}/pelatihan/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));

  const supabaseServer = createSupabaseServerClient();
  if (!supabaseServer) return [...statics, ...seoPages];

  // Dynamic training pages
  const { data: trainings } = await supabaseServer
    .from("training")
    .select("id, created_at")
    .eq("published", true);

  const trainingPages: MetadataRoute.Sitemap = (trainings ?? []).map((t) => ({
    url: `${BASE_URL}/training/${t.id}`,
    lastModified: new Date(t.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Dynamic insight pages
  const { data: insights } = await supabaseServer
    .from("insights")
    .select("id, created_at")
    .eq("published", true);

  const insightPages: MetadataRoute.Sitemap = (insights ?? []).map((i) => ({
    url: `${BASE_URL}/insights/${i.id}`,
    lastModified: new Date(i.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic program detail pages
  const { data: subPrograms } = await supabaseServer
    .from("sub_programs")
    .select("program_id, slug, updated_at, created_at, active")
    .eq("active", true);

  const programPages: MetadataRoute.Sitemap = (subPrograms ?? []).map((p) => ({
    url: `${BASE_URL}/programs/${p.program_id}/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.created_at ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...statics, ...seoPages, ...trainingPages, ...insightPages, ...programPages];
}
