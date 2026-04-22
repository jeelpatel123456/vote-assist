import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

const candidates = [
  { id: "a", name: "Aria Nakamura", party: "Civic Renewal", color: "215 75% 14%" },
  { id: "b", name: "Marcus Okafor", party: "Progress Union", color: "152 60% 36%" },
  { id: "c", name: "Lena Voss", party: "Heritage Front", color: "0 72% 50%" },
  { id: "d", name: "Sam Patel", party: "Independent", color: "42 92% 52%" },
];

export function SimulatedVoting() {
  const [pick, setPick] = useState<string | null>(null);
  const [cast, setCast] = useState(false);

  return (
    <section id="vote" className="container py-20 md:py-28">
      <div className="max-w-2xl mb-12">
        <div className="civic-chip mb-4">Practice</div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Cast a practice ballot.</h2>
        <p className="text-muted-foreground text-lg">
          A risk-free simulation of what happens at the polling booth. Your selection is never recorded.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="civic-card p-1.5 bg-card">
          <div className="border-2 border-dashed border-border rounded-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Official Ballot</div>
                <div className="font-serif text-xl font-bold mt-0.5">General Election — Sample</div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">№ 0001</div>
            </div>

            {!cast ? (
              <>
                <p className="text-sm text-muted-foreground mb-5">Select <strong className="text-foreground">one</strong> candidate.</p>
                <div className="space-y-2.5">
                  {candidates.map(c => (
                    <label key={c.id}
                      className={`flex items-center gap-4 p-4 rounded-sm border-2 cursor-pointer transition-all ${pick === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <input type="radio" name="cand" className="sr-only" checked={pick === c.id} onChange={() => setPick(c.id)} />
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${pick === c.id ? "border-primary" : "border-border"}`}>
                        {pick === c.id && <div className="h-3 w-3 rounded-full bg-primary" />}
                      </div>
                      <div className="h-10 w-1.5 rounded-sm" style={{ background: `hsl(${c.color})` }} />
                      <div className="flex-1">
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.party}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <Button
                  disabled={!pick}
                  onClick={() => setCast(true)}
                  className="w-full mt-6 h-12 rounded-sm bg-primary hover:bg-primary-glow font-semibold"
                >
                  Cast Ballot
                </Button>
              </>
            ) : (
              <div className="text-center py-10 animate-scale-in">
                <div className="inline-flex h-16 w-16 rounded-full bg-success/15 items-center justify-center mb-5">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2">Ballot received.</h3>
                <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">
                  In a real election your vote would now be sealed and counted anonymously alongside thousands of others.
                </p>
                <Button variant="outline" onClick={() => { setPick(null); setCast(false); }} className="gap-2 rounded-sm">
                  <RotateCcw className="h-4 w-4" /> Try again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
