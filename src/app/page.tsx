"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Challenges from "@/components/Challenges";
import TrustMarquee from "@/components/TrustMarquee";
import Services from "@/components/Services";
import UseCases from "@/components/UseCases";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Insights from "@/components/Insights";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";

export default function Home() {
  const [introDone, setIntroD] = useState(false);

  return (
    <>
      <Intro onComplete={() => setIntroD(true)} />

      <AnimatePresence>
        {introDone && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Navbar />
            <Hero />
            <Challenges />
            <TrustMarquee />
            <Services />
            <UseCases />
            <Stats />
            <Process />
            <Insights />
            <CTABand />
            <Footer />
            <PromoModal />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
