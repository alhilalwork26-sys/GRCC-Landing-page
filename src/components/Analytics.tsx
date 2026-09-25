"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Analytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = isAdmin;
  }, [isAdmin, gaId]);

  if (isAdmin) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
