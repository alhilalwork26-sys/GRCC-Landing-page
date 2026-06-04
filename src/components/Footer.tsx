import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type FooterLink = { label: string; href: string };
type FooterCol = { heading: string; links: FooterLink[] };

const footerNav: FooterCol[] = [
  {
    heading: "Layanan",
    links: [
      { label: "Konsultasi Tata Kelola", href: "/programs" },
      { label: "Manajemen Risiko",       href: "/programs" },
      { label: "Solusi Kepatuhan",       href: "/programs" },
      { label: "Kerangka ESG",           href: "/programs" },
      { label: "Program Pelatihan",      href: "/programs" },
    ],
  },
  {
    heading: "Program",
    links: [
      { label: "Tata Kelola Korporasi", href: "/programs" },
      { label: "Reformasi Sektor Publik", href: "/programs" },
      { label: "Anti-Korupsi",          href: "/programs" },
      { label: "Privasi Data",          href: "/programs" },
      { label: "Pelaporan ESG",         href: "/programs" },
    ],
  },
  {
    heading: "Perusahaan",
    links: [
      { label: "Tentang GRCC", href: "/about" },
      { label: "Jadwal",       href: "/jadwal" },
      { label: "Artikel",      href: "/insights" },
      { label: "Kontak",       href: "/contact" },
      { label: "Cek Status",   href: "/cek-status" },
    ],
  },
  {
    heading: "Hubungi Kami",
    links: [
      { label: "grcc.ailg@gmail.com",  href: "mailto:grcc.ailg@gmail.com" },
      { label: "Jakarta, Indonesia",   href: "https://maps.google.com/?q=Jakarta,Indonesia" },
      { label: "Hubungi via WhatsApp", href: "https://wa.me/62" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60 border-t border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 pt-[clamp(60px,8vw,100px)]">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[clamp(40px,6vw,80px)] pb-[clamp(48px,6vw,80px)] border-b border-white/[0.08]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/grcc-logo.png"
                alt="GRCC"
                style={{ height: 110, width: "auto", display: "block" }}
              />
            </Link>
            <p className="text-[0.86rem] leading-[1.7] text-white/35 mb-7">
              Pusat Tata Kelola,<br />
              Risiko, Kepatuhan &amp;<br />
              Daya Saing
            </p>
            <div className="flex gap-2.5">
              {/* Instagram */}
              <a href={siteConfig.social.instagram || "#"} target={siteConfig.social.instagram ? "_blank" : undefined} rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white/[0.08] hover:bg-white/[0.16] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.4" opacity=".7"/>
                  <circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.4" opacity=".7"/>
                  <circle cx="11.5" cy="4.5" r="0.75" fill="white" opacity=".7"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href={siteConfig.social.linkedin || "#"} target={siteConfig.social.linkedin ? "_blank" : undefined} rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white/[0.08] hover:bg-white/[0.16] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 6h2v7H3V6zm1-3.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM7 6h2v1h.03C9.42 6.4 10.28 6 11.25 6 13.3 6 14 7.2 14 9.4V13h-2V9.8c0-.9-.02-2.05-1.25-2.05S9.25 8.8 9.25 9.7V13H7V6z" fill="white" opacity=".7"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href={siteConfig.social.youtube || "#"} target={siteConfig.social.youtube ? "_blank" : undefined} rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white/[0.08] hover:bg-white/[0.16] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="4" width="13" height="8" rx="2.5" stroke="white" strokeWidth="1.4" opacity=".7"/>
                  <path d="M6.5 6l4 2-4 2V6z" fill="white" opacity=".7"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href={siteConfig.social.twitter || "#"} target={siteConfig.social.twitter ? "_blank" : undefined} rel="noopener noreferrer" aria-label="X / Twitter"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-white/[0.08] hover:bg-white/[0.16] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 1.5l11 11M12.5 1.5l-5 5M1.5 12.5l5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[0.75rem] font-bold tracking-[0.1em] uppercase text-white/75 mb-4">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-[0.84rem] text-white/35 hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
          <p className="text-[0.76rem] text-white/22">
            &copy; 2025 GRCC — Pusat Tata Kelola, Risiko, Kepatuhan &amp; Daya Saing. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex gap-6 flex-wrap items-center">
            {["Kebijakan Privasi", "Ketentuan Penggunaan", "Tata Kelola Bertanggung Jawab"].map((l) => (
              <a key={l} href="#" className="text-[0.76rem] text-white/22 hover:text-white/55 transition-colors">
                {l}
              </a>
            ))}
            <a href="/admin" className="text-[0.72rem] text-white/15 hover:text-white/40 transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
