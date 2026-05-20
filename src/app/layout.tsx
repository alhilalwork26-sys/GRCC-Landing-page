import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/TransitionProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
