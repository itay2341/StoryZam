import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ExampleCarousel } from "@/components/landing/ExampleCarousel";
import { SocialProof } from "@/components/landing/SocialProof";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => (
  <div className="relative min-h-screen overflow-hidden">
    <AuroraBackground />
    <Navbar />
    <main className="relative z-10">
      <Hero />
      <HowItWorks />
      <ExampleCarousel />
      <SocialProof />

      {/* Final CTA */}
      <section className="relative px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight gradient-text">
            Every song is hiding a story.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">Find yours in under ten seconds.</p>
          <Link
            to="/detect"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_hsl(270_95%_60%/0.55)] transition hover:scale-[1.03]"
          >
            Tap to Storyzam <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Index;
