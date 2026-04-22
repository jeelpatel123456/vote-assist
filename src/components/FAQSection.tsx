import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";

interface Faq { id: string; question: string; answer: string; }

export function FAQSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("faqs").select("*").order("created_at");
      if (data) setFaqs(data as Faq[]);
    };
    load();
    const ch = supabase.channel("faqs-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "faqs" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return faqs;
    return faqs.filter(f => f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s));
  }, [faqs, q]);

  return (
    <section id="faq" className="bg-secondary/40 border-t border-border py-20 md:py-28">
      <div className="container max-w-3xl">
        <div className="civic-chip mb-4">Help Center</div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Questions, answered.</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Common questions about voting, eligibility, and the election process.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search FAQs…" className="pl-10 h-12 rounded-sm bg-background" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">No matching questions.</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {filtered.map(f => (
              <AccordionItem key={f.id} value={f.id} className="civic-card px-5 border-border">
                <AccordionTrigger className="font-serif text-lg font-semibold hover:no-underline text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
