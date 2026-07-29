import type { InsightItem, ProgramItem, SubProgramItem, TrainingItem } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";
import { trainingDateLabel, trainingTimeLabel } from "@/lib/training-schedule";

export const SITE_URL = "https://grcc-landing-page.vercel.app";
export const SITE_NAME = "GRCC";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripText(value?: string | null) {
  return (value ?? "")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(value: string, max = 155) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

export function organizationJsonLd() {
  const sameAs = [
    siteConfig.social.instagram,
    siteConfig.social.linkedin,
    siteConfig.social.youtube,
    siteConfig.social.twitter,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: "Center For Governance, Risk, Compliance, and Competitiveness",
    alternateName: "GRCC",
    url: SITE_URL,
    logo: absoluteUrl("/grcc-logo-2048.png"),
    email: siteConfig.contactEmail,
    telephone: siteConfig.phoneNumber ? `+${siteConfig.phoneNumber}` : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Surabaya",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    sameAs,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "id-ID",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function trainingJsonLd(training: TrainingItem) {
  const url = absoluteUrl(`/training/${training.id}`);
  const dateLabel = trainingDateLabel(training);
  const timeLabel = trainingTimeLabel(training);
  const description = truncateText(stripText(training.description), 220);
  const image = training.poster_url ? absoluteUrl(training.poster_url) : absoluteUrl("/opengraph-image");

  return [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${url}#course`,
      name: training.title,
      description,
      provider: { "@id": `${SITE_URL}/#organization` },
      url,
      image,
      courseMode: training.format,
      inLanguage: "id-ID",
      offers: training.price
        ? {
            "@type": "Offer",
            price: training.price,
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/daftar/${training.id}`),
          }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": `${url}#event`,
      name: training.title,
      description,
      url,
      image,
      eventAttendanceMode: training.format?.toLowerCase().includes("online")
        ? "https://schema.org/OnlineEventAttendanceMode"
        : training.format?.toLowerCase().includes("hybrid")
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: { "@id": `${SITE_URL}/#organization` },
      location: training.format?.toLowerCase().includes("online")
        ? {
            "@type": "VirtualLocation",
            url,
            name: training.location || "Online",
          }
        : {
            "@type": "Place",
            name: training.location || "GRCC",
            address: training.location || "Surabaya, Indonesia",
          },
      startDate: dateLabel,
      doorTime: timeLabel,
      offers: training.price
        ? {
            "@type": "Offer",
            price: training.price,
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/daftar/${training.id}`),
          }
        : undefined,
    },
  ];
}

export function insightArticleJsonLd(item: InsightItem) {
  const url = absoluteUrl(`/insights/${item.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: item.title,
    description: truncateText(stripText(item.excerpt || item.content), 220),
    image: item.img ? absoluteUrl(item.img) : absoluteUrl("/opengraph-image"),
    datePublished: item.created_at,
    dateModified: item.created_at,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    articleSection: item.type,
    keywords: [item.type, item.tag].filter(Boolean),
    inLanguage: "id-ID",
  };
}

export function subProgramCourseJsonLd(program: ProgramItem, sub: SubProgramItem) {
  const url = absoluteUrl(`/programs/${program.id}/${sub.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name: sub.name,
    description: truncateText(stripText(sub.description || program.description), 220),
    provider: { "@id": `${SITE_URL}/#organization` },
    url,
    about: program.title,
    inLanguage: "id-ID",
  };
}
