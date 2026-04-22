import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { ListOrdered, MessageSquareText, Clock } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ steps: 0, faqs: 0 });
  const [recent, setRecent] = useState<{ kind: string; title: string; at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [s, f, rs, rf] = await Promise.all([
        supabase.from("election_steps").select("*", { count: "exact", head: true }),
        supabase.from("faqs").select("*", { count: "exact", head: true }),
        supabase.from("election_steps").select("title, updated_at").order("updated_at", { ascending: false }).limit(3),
        supabase.from("faqs").select("question, updated_at").order("updated_at", { ascending: false }).limit(3),
      ]);
      setStats({ steps: s.count ?? 0, faqs: f.count ?? 0 });
      const list = [
        ...(rs.data ?? []).map(r => ({ kind: "Step", title: r.title, at: r.updated_at })),
        ...(rf.data ?? []).map(r => ({ kind: "FAQ", title: r.question, at: r.updated_at })),
      ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 5);
      setRecent(list);
    })();
  }, []);

  const cards = [
    { label: "Election Steps", value: stats.steps, icon: ListOrdered, hint: "Timeline entries" },
    { label: "FAQ Entries", value: stats.faqs, icon: MessageSquareText, hint: "Help center items" },
    { label: "Total Content", value: stats.steps + stats.faqs, icon: Clock, hint: "Combined records" },
  ];

  return (
    <AdminShell title="Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map(c => (
          <div key={c.label} className="civic-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{c.label}</div>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="font-serif text-4xl font-bold">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="civic-card p-6">
        <h2 className="font-serif text-xl font-bold mb-4">Recent updates</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No content yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((r, i) => (
              <li key={i} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground">{r.kind}</span>
                  <span className="truncate">{r.title}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{new Date(r.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
