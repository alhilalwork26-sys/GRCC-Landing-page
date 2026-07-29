import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import JsonLd from "@/components/JsonLd";
import type { ProgramItem, SubProgramItem } from "@/lib/supabase";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  stripText,
  subProgramCourseJsonLd,
  truncateText,
} from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ programId: string; subSlug: string }>;
};

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getProgramPage(programId: string, subSlug: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { program: null, sub: null };

  const [{ data: program }, { data: sub }] = await Promise.all([
    supabase.from("programs").select("*").eq("id", programId).eq("active", true).maybeSingle(),
    supabase
      .from("sub_programs")
      .select("*")
      .eq("program_id", programId)
      .eq("slug", subSlug)
      .eq("active", true)
      .maybeSingle(),
  ]);

  return {
    program: program as ProgramItem | null,
    sub: sub as SubProgramItem | null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programId: string; subSlug: string }>;
}): Promise<Metadata> {
  const { programId, subSlug } = await params;
  const { program, sub } = await getProgramPage(programId, subSlug);
  const canonical = absoluteUrl(`/programs/${programId}/${subSlug}`);

  if (!program || !sub) {
    return {
      title: "Program Tidak Ditemukan",
      alternates: { canonical },
    };
  }

  const title = `${sub.name} | Pelatihan ${program.short || program.title}`;
  const description = truncateText(
    stripText(sub.description || program.description) ||
      `Program pelatihan ${sub.name} dari GRCC untuk penguatan tata kelola, risiko, kepatuhan, dan daya saing organisasi.`,
    155
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export default async function SubProgramSeoLayout({ children, params }: Props) {
  const { programId, subSlug } = await params;
  const { program, sub } = await getProgramPage(programId, subSlug);
  const structuredData = program && sub
    ? [
        subProgramCourseJsonLd(program, sub),
        breadcrumbJsonLd([
          { name: "Beranda", url: "/" },
          { name: "Program", url: "/programs" },
          { name: program.title, url: "/programs" },
          { name: sub.name, url: `/programs/${program.id}/${sub.slug}` },
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
