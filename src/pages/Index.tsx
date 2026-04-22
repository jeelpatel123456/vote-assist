import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { EligibilityChecker } from "@/components/EligibilityChecker";
import { SimulatedVoting } from "@/components/SimulatedVoting";
import { FAQSection } from "@/components/FAQSection";
import { SiteFooter } from "@/components/SiteFooter";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      <Hero />
      <Timeline />
      <EligibilityChecker />
      <SimulatedVoting />
      <FAQSection />
    </main>
    <SiteFooter />
  </div>
);

export default Index;
