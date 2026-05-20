"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./TransitionProvider";

const links = [
  { label: "Services",  href: "#services",  page: false },
  { label: "Programs",  href: "/programs",  page: true  },
  { label: "About",     href: "/about",     page: true  },
  { label: "Insights",  href: "/insights",  page: true  },
  { label: "Careers",   href: "#careers",   page: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (href: string) => {
    setOpen(false);
    if (pathname !== "/") {
      navigate("/" + href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handlePage = (href: string) => {
    setOpen(false);
    if (pathname !== href) navigate(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-bg border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 h-[72px] flex items-center gap-8">
        {/* Logo */}
        <button onClick={() => handlePage("/")} className="flex items-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/grcc-logo.png"
            alt="GRCC"
            style={{ height: 64, width: "auto", display: "block" }}
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10 ml-auto">
          {links.map((l) =>
            l.page ? (
              <button
                key={l.label}
                onClick={() => handlePage(l.href)}
                className={`text-[0.8rem] font-semibold tracking-[0.08em] uppercase text-dark relative group ${pathname === l.href ? "opacity-100" : ""}`}
              >
                {l.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-dark transition-all duration-300 ${pathname === l.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ) : (
              <button
                key={l.label}
                onClick={() => handleAnchor(l.href)}
                className="text-[0.8rem] font-semibold tracking-[0.08em] uppercase text-dark relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-dark transition-all duration-300 group-hover:w-full" />
              </button>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4 ml-8">
          <button className="p-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <Search size={18} />
          </button>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-dark text-white text-[0.85rem] font-semibold px-5 py-3 rounded-[4px] border border-dark hover:bg-[#222] transition-colors"
          >
            Get in touch
            <ArrowUpRight size={14} />
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-auto lg:hidden p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border bg-bg lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l, i) =>
                l.page ? (
                  <button
                    key={l.label}
                    onClick={() => handlePage(l.href)}
                    className="text-left text-base font-semibold py-3 border-b border-border last:border-0"
                  >
                    {l.label}
                  </button>
                ) : (
                  <motion.button
                    key={l.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleAnchor(l.href)}
                    className="text-left text-base font-semibold py-3 border-b border-border last:border-0"
                  >
                    {l.label}
                  </motion.button>
                )
              )}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center gap-2 bg-dark text-white text-[0.9rem] font-semibold px-5 py-3 rounded-[4px] w-fit"
              >
                Get in touch <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
