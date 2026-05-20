"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

type Phase = "idle" | "in" | "hold" | "out";

const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const router = useRouter();
  const pathname = usePathname();
  const targetHref = useRef<string | null>(null);
  const prevPath = useRef(pathname);

  // When pathname changes while curtain is covering, start reveal
  useEffect(() => {
    if (prevPath.current !== pathname && phase === "hold") {
      prevPath.current = pathname;
      setTimeout(() => setPhase("out"), 60);
    }
  }, [pathname, phase]);

  const navigate = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      targetHref.current = href;
      setPhase("in");
    },
    [phase]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      {phase !== "idle" && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: phase === "out" ? "-100%" : "0%" }}
          transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (phase === "in") {
              router.push(targetHref.current!);
              targetHref.current = null;
              setPhase("hold");
            } else if (phase === "out") {
              setPhase("idle");
            }
          }}
          className="fixed inset-0 z-[9998] bg-[#0D0D0D] pointer-events-none"
        />
      )}
    </TransitionContext.Provider>
  );
}
