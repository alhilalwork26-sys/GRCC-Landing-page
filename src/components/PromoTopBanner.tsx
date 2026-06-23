"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Megaphone, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY_PREFIX = "grcc_promo_banner_dismissed";

interface PromoBannerData {
  id: string;
  active: boolean;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  status?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  highlights?: Array<string | { icon?: string; text?: string }> | null;
  updated_at?: string | null;
}

interface PromoTopBannerProps {
  onVisibleChange?: (visible: boolean) => void;
}

export default function PromoTopBanner({ onVisibleChange }: PromoTopBannerProps) {
  const [promo, setPromo] = useState<PromoBannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    supabase
      .from("promo")
      .select("id, active, badge, title, subtitle, status, cta_label, cta_href, highlights, updated_at")
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!active) return;
        const bannerPromo = ((data ?? []) as PromoBannerData[]).find((item) => getPlacement(item.highlights) === "banner");
        if (!bannerPromo) return;
        const hidden = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}_${bannerPromo.id}`) === "1";
        setPromo(bannerPromo);
        setDismissed(hidden);
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = !!promo && !dismissed;

  useEffect(() => {
    onVisibleChange?.(visible);
    return () => onVisibleChange?.(false);
  }, [onVisibleChange, visible]);

  const statusLabel = useMemo(() => {
    if (promo?.status === "closed") return "Pendaftaran Ditutup";
    if (promo?.status === "coming_soon") return "Segera Hadir";
    return promo?.badge || "Promo Aktif";
  }, [promo?.badge, promo?.status]);

  const closeBanner = () => {
    if (promo?.id) sessionStorage.setItem(`${STORAGE_KEY_PREFIX}_${promo.id}`, "1");
    setDismissed(true);
  };

  if (!promo) return null;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 40, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden border-b border-red-200/70 bg-[#FFF3F1] text-red-950"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
            animate={{ x: ["0%", "430%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 h-10 flex items-center gap-3">
            <span className="hidden sm:inline-flex w-6 h-6 rounded-full bg-red-600/10 text-red-600 items-center justify-center flex-shrink-0">
              <Megaphone size={13} />
            </span>

            <span className="inline-flex items-center rounded-full border border-red-200 bg-white/70 px-2.5 py-1 text-[0.62rem] font-extrabold tracking-[0.12em] uppercase text-red-700 whitespace-nowrap">
              {statusLabel}
            </span>

            <p className="min-w-0 flex-1 truncate text-[0.78rem] sm:text-[0.82rem] font-semibold text-red-950">
              <span className="font-extrabold">{promo.title || "Promo GRCC"}</span>
              {promo.subtitle ? (
                <span className="hidden md:inline text-red-900/70"> · {promo.subtitle}</span>
              ) : null}
            </p>

            {promo.cta_href ? (
              <a
                href={promo.cta_href}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[0.72rem] font-extrabold text-white shadow-sm shadow-red-600/15 hover:bg-red-700 transition-colors"
              >
                {promo.cta_label || "Lihat Promo"}
                <ArrowUpRight size={12} />
              </a>
            ) : null}

            <button
              type="button"
              onClick={closeBanner}
              className="w-7 h-7 rounded-full border border-red-200/80 bg-white/60 text-red-700 flex items-center justify-center hover:bg-white transition-colors flex-shrink-0"
              aria-label="Tutup banner promo"
            >
              <X size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getPlacement(highlights: PromoBannerData["highlights"]) {
  const placement = (highlights ?? []).find((item) =>
    typeof item !== "string" && item.icon === "__placement"
  );
  return placement && typeof placement !== "string" && placement.text === "popup" ? "popup" : "banner";
}
