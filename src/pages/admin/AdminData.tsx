import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Row = Record<string, any>;

function DataTable({ table, columns }: { table: "election_steps" | "faqs"; columns: string[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = await supabase.from(table).select("*");
    setRows((data ?? []) as Row[]);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [table]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return rows;
    return rows.filter(r => columns.some(c => String(r[c] ?? "").toLowerCase().includes(s)));
  }, [rows, q, columns]);

  async function del(id: string) {
    if (!confirm("Delete this row?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="pl-9 rounded-sm" />
      </div>
      <div className="civic-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider">
            <tr>
              {columns.map(c => <th key={c} className="text-left px-4 py-3 font-semibold">{c}</th>)}
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-secondary/30">
                {columns.map(c => (
                  <td key={c} className="px-4 py-3 font-mono text-xs max-w-xs truncate">
                    {c === "id" ? String(r[c]).slice(0, 8) + "…" : String(r[c] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center py-10 text-muted-foreground">No rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{filtered.length} of {rows.length} rows</p>
    </>
  );
}

export default function AdminData() {
  return (
    <AdminShell title="Database">
      <Tabs defaultValue="steps">
        <TabsList className="mb-5">
          <TabsTrigger value="steps">election_steps</TabsTrigger>
          <TabsTrigger value="faqs">faqs</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <DataTable table="election_steps" columns={["id", "order", "title", "description", "icon", "updated_at"]} />
        </TabsContent>
        <TabsContent value="faqs">
          <DataTable table="faqs" columns={["id", "question", "answer", "updated_at"]} />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
