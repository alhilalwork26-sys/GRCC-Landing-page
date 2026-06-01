import type { Metadata } from "next";
import "./globals.css";
import { TransitionProvider } from "@/components/TransitionProvider";
import ChatWidget from "@/components/ChatWidget";
import { GoogleAnalytics } from "@next/third-parties/google";

const BASE_URL = "https://grcc-landing-page.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GRCC | Center for Governance, Risk, Compliance & Competitiveness",
    template: "%s | GRCC",
  },
  description:
    "GRCC menyediakan pelatihan & solusi di bidang Governance, Risk Management, Compliance, dan Competitiveness untuk organisasi Indonesia.",
  keywords: [
    "pelatihan governance", "risk management", "compliance training",
    "GRC Indonesia", "internal control", "GRCC", "pelatihan profesional",
    "manajemen risiko", "tata kelola perusahaan", "Universitas Airlangga",
  ],
  authors: [{ name: "GRCC – Center for Governance, Risk & Compliance" }],
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
    title: "GRCC | Center for Governance, Risk, Compliance & Competitiveness",
    description:
      "Pelatihan & solusi governance, risk management, dan compliance untuk organisasi Indonesia. Tersertifikasi, praktis, dan relevan.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GRCC – Center for Governance, Risk & Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GRCC | Center for Governance, Risk & Compliance",
    description: "Pelatihan GRC profesional untuk organisasi Indonesia.",
    images: [`${BASE_URL}/og-image.png`],
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
