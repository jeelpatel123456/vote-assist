import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as Icons from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  order: number;
  icon: string | null;
}

export function Timeline() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [active, setActive] = useState<Step | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("election_steps").select("*").order("order");
      if (data) setSteps(data as Step[]);
    };
    load();
    const ch = supabase.channel("steps-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "election_steps" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <section id="timeline" className="container py-20 md:py-28">
      <div className="max-w-2xl mb-14">
        <div className="civic-chip mb-4">The Process</div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Six steps to a result.</h2>
        <p className="text-muted-foreground text-lg">
          Click any stage to see what happens, who's involved, and why it matters.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((step, i) => {
          const Icon = (Icons[step.icon as keyof typeof Icons] as any) || Icons.Circle;
          return (
            <button
              key={step.id}
              onClick={() => setActive(step)}
              className="civic-card p-6 text-left group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="h-11 w-11 rounded-sm bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  STEP / {String(step.order).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{step.description}</p>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                Read more →
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="font-mono text-xs text-muted-foreground mb-2">
                  STEP {String(active.order).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </div>
                <DialogTitle className="text-3xl font-serif">{active.title}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base text-foreground/80 leading-relaxed">
                {active.description}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
