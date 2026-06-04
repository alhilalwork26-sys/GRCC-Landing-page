import type { Metadata } from "next";
import "./globals.css";
import { TransitionProvider } from "@/components/TransitionProvider";
import ChatWidget from "@/components/ChatWidget";
import { GoogleAnalytics } from "@next/third-parties/google";

const BASE_URL = "https://grcc-landing-page.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GRCC | Pusat Tata Kelola, Risiko, Kepatuhan & Daya Saing",
    template: "%s | GRCC",
  },
  description:
    "GRCC menyediakan pelatihan & solusi di bidang tata kelola, manajemen risiko, kepatuhan, dan daya saing untuk organisasi Indonesia.",
  keywords: [
    "pelatihan tata kelola", "manajemen risiko", "pelatihan kepatuhan",
    "GRC Indonesia", "internal control", "GRCC", "pelatihan profesional",
    "manajemen risiko", "tata kelola perusahaan", "Universitas Airlangga",
  ],
  authors: [{ name: "GRCC – Pusat Tata Kelola, Risiko & Kepatuhan" }],
  creator: "GRCC",
  publisher: "GRCC",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "GRCC",
    title: "GRCC | Pusat Tata Kelola, Risiko, Kepatuhan & Daya Saing",
    description:
      "Pelatihan & solusi tata kelola, manajemen risiko, dan kepatuhan untuk organisasi Indonesia. Tersertifikasi, praktis, dan relevan.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "GRCC – Pusat Tata Kelola, Risiko & Kepatuhan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GRCC | Pusat Tata Kelola, Risiko & Kepatuhan",
    description: "Pelatihan GRC profesional untuk organisasi Indonesia.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans">
        <TransitionProvider>{children}</TransitionProvider>
        <ChatWidget />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
