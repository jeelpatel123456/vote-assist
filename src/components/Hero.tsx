import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative py-24 md:py-32">
        <div className="max-w-3xl animate-fade-up">
          <div className="civic-chip mb-6 bg-accent/20 text-accent border-accent/40">
            <ShieldCheck className="h-3 w-3" /> Official Civic Resource
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-6">
            Understand Elections<br />
            <span className="italic text-accent">in Minutes.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-10 leading-relaxed">
            A clear, interactive guide to how the democratic process works — from registering to vote
            through to counting the final ballot.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 h-12 px-6 rounded-sm shadow-civic" asChild>
              <a href="#timeline">Start Learning <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-12 px-6 rounded-sm" asChild>
              <a href="#eligibility">Check Eligibility</a>
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-md border-t border-primary-foreground/15 pt-6">
            <div>
              <div className="font-serif text-3xl font-bold text-accent">6</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Steps</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-accent">3 min</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Read</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-accent">100%</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60 mt-1">Free</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
