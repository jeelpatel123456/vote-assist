import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  age: number;
  citizen: boolean;
  registered: boolean;
  result: string;
  notes: string | null;
  created_at: string;
};

export default function AdminSubmissions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from("eligibility_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    const { error } = await supabase.from("eligibility_submissions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setRows(rs => rs.filter(r => r.id !== id)); }
  }

  const filtered = rows.filter(r =>
    r.notes?.toLowerCase().includes(q.toLowerCase()) || r.result.includes(q.toLowerCase())
  );

  const eligibleCount = rows.filter(r => r.result === "eligible").length;

  return (
    <AdminShell title="Eligibility Submissions">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="civic-card p-4"><div className="text-xs uppercase text-muted-foreground">Total</div><div className="text-3xl font-serif font-bold">{rows.length}</div></div>
        <div className="civic-card p-4"><div className="text-xs uppercase text-muted-foreground">Eligible</div><div className="text-3xl font-serif font-bold text-success">{eligibleCount}</div></div>
        <div className="civic-card p-4"><div className="text-xs uppercase text-muted-foreground">Not eligible</div><div className="text-3xl font-serif font-bold text-accent">{rows.length - eligibleCount}</div></div>
      </div>

      <div className="mb-4">
        <Input placeholder="Search city or result…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
      </div>

      <div className="civic-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">When</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Citizen</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold">City</th>
              <th className="px-4 py-3 font-semibold">Result</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No submissions yet.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">{r.age}</td>
                <td className="px-4 py-3">{r.citizen ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive/70" />}</td>
                <td className="px-4 py-3">{r.registered ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive/70" />}</td>
                <td className="px-4 py-3">{r.notes || "—"}</td>
                <td className="px-4 py-3">
                  {r.result === "eligible"
                    ? <Badge className="bg-success/15 text-success border-success/30">Eligible</Badge>
                    : <Badge variant="secondary">Not eligible</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button onClick={() => remove(r.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
