import type { Metadata } from "next";
import "./globals.css";
import { TransitionProvider } from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "GRCC | Center for Governance, Risk, Compliance & Competitiveness",
  description:
    "GRCC delivers governance frameworks, risk management, and compliance solutions that drive organizational competitiveness.",
  keywords: "governance, risk management, compliance, competitiveness, GRCC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
