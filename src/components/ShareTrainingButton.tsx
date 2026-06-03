"use client";

import { MouseEvent, useState } from "react";
import { Check, Share2 } from "lucide-react";

type ShareTrainingButtonProps = {
  trainingId: string;
  title: string;
  accent?: string;
  className?: string;
  label?: string;
  variant?: "icon" | "outline";
};

export default function ShareTrainingButton({
  trainingId,
  title,
  accent = "#4F46E5",
  className = "",
  label = "Bagikan",
  variant = "outline",
}: ShareTrainingButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const url = new URL(`/training/${trainingId}`, window.location.origin).toString();
    const shareData = {
      title: `${title} | GRCC`,
      text: `Saya ingin membagikan pelatihan GRCC: ${title}`,
      url,
    };
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {
      if (isMobile && navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyLink(url);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      await copyLink(url);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Link tersalin" : `Bagikan ${title}`}
        title={copied ? "Link tersalin" : "Bagikan pelatihan"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark/70 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-dark active:scale-95 ${className}`}
      >
        {copied ? <Check size={15} style={{ color: accent }} /> : <Share2 size={15} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 rounded-xl border font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98] ${className}`}
      style={{ borderColor: accent + "55", color: accent }}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Link tersalin" : label}
    </button>
  );
}
