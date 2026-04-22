import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type Result = { ok: boolean; title: string; reasons: string[] } | null;

export function EligibilityChecker() {
  const [age, setAge] = useState("");
  const [citizen, setCitizen] = useState<string>("");
  const [registered, setRegistered] = useState<string>("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState<Result>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const reasons: string[] = [];
    const a = parseInt(age, 10);
    if (!a || a < 18) reasons.push("You must be at least 18 years old.");
    if (citizen !== "yes") reasons.push("You must be a citizen of the country where you wish to vote.");
    if (!location.trim()) reasons.push("A registered address is required to assign your polling station.");
    if (registered === "no") reasons.push("You'll need to register before voting — most authorities offer online registration.");

    const ok = reasons.length === 0;
    setResult({
      ok,
      title: ok ? "You're eligible to vote." : "Almost there.",
      reasons: ok
        ? ["Bring a valid government-issued ID to your polling station on election day."]
        : reasons,
    });

    // Anonymously log the submission so admins can see aggregate eligibility data.
    try {
      await supabase.from("eligibility_submissions").insert({
        age: a || 0,
        citizen: citizen === "yes",
        registered: registered === "yes",
        result: ok ? "eligible" : "not_eligible",
        notes: location.trim() || null,
      });
    } catch {
      // Silent — never block the user's result on logging.
    }
  }

  return (
    <section id="eligibility" className="bg-secondary/40 border-y border-border py-20 md:py-28">
      <div className="container grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="civic-chip mb-4">Quick Check</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Are you eligible to vote?</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Answer four questions and find out instantly. Submissions are anonymous —
            we don't link them to any account.
          </p>
          <ul className="space-y-3 text-sm">
            {["No personal identifiers stored", "Result is informational, not legal advice", "Always confirm with your local election office"].map(t => (
              <li key={t} className="flex gap-2.5"><CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" /><span>{t}</span></li>
            ))}
          </ul>
        </div>

        <form onSubmit={check} className="civic-card p-6 md:p-8 space-y-5">
          <div>
            <Label htmlFor="age">Your age</Label>
            <Input id="age" type="number" min="0" max="120" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 24" required className="mt-1.5" />
          </div>
          <div>
            <Label>Are you a citizen?</Label>
            <Select value={citizen} onValueChange={setCitizen} required>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <Label>Are you already registered to vote?</Label>
            <Select value={registered} onValueChange={setRegistered} required>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No / Not sure</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="loc">Constituency / city</Label>
            <Input id="loc" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai" required className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full h-11 rounded-sm bg-primary hover:bg-primary-glow font-semibold">
            Check eligibility
          </Button>

          {result && (
            <div className={`rounded-sm border p-4 animate-scale-in ${result.ok ? "bg-success/10 border-success/30" : "bg-accent/10 border-accent/30"}`}>
              <div className="flex items-center gap-2 font-serif text-xl font-bold mb-2">
                {result.ok
                  ? <CheckCircle2 className="h-5 w-5 text-success" />
                  : <AlertTriangle className="h-5 w-5 text-accent" />}
                {result.title}
              </div>
              <ul className="text-sm space-y-1.5 text-foreground/80">
                {result.reasons.map(r => (
                  <li key={r} className="flex gap-2">
                    {result.ok ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive/70 flex-shrink-0 mt-0.5" />}
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
