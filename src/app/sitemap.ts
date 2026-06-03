import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

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

  const supabaseServer = createSupabaseServerClient();
  if (!supabaseServer) return statics;

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

  return [...statics, ...trainingPages, ...insightPages];
}
