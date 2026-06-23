import IntroOverlay from "@/components/IntroOverlay";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Challenges from "@/components/Challenges";
import TrustMarquee from "@/components/TrustMarquee";
import Services from "@/components/Services";
import UseCases from "@/components/UseCases";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import VideoProfile from "@/components/VideoProfile";
import Insights from "@/components/Insights";
import Testimonials from "@/components/Testimonials";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      {/* Content is always in the SSR HTML for search engine indexing.
          The CSS animation holds opacity:0 until the intro overlay finishes (6.9s),
          matching the previous introDone behaviour without blocking SSR. */}
      <main style={{ animation: "mainFadeIn 0.5s ease-out 6.9s both" }}>
        <Navbar />
        <Hero />
        <Challenges />
        <TrustMarquee />
        <Services />
        <UseCases />
        <Stats />
        <VideoProfile />
        <Process />
        <Insights />
        <Testimonials />
        <CTABand />
        <Footer />
        <PromoModal />
      </main>
    </>
  );
}
