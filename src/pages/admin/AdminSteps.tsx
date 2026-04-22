import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Step { id: string; title: string; description: string; order: number; icon: string | null; }

export default function AdminSteps() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [editing, setEditing] = useState<Partial<Step> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("election_steps").select("*").order("order");
    setSteps((data ?? []) as Step[]);
  };
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.title || !editing?.description) return toast.error("Title & description required");
    const payload = {
      title: editing.title.trim().slice(0, 200),
      description: editing.description.trim().slice(0, 2000),
      order: Number(editing.order ?? steps.length + 1),
      icon: editing.icon?.trim() || null,
    };
    const { error } = editing.id
      ? await supabase.from("election_steps").update(payload).eq("id", editing.id)
      : await supabase.from("election_steps").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this step?")) return;
    const { error } = await supabase.from("election_steps").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <AdminShell title="Election Steps" actions={
      <Button onClick={() => setEditing({ order: steps.length + 1 })} className="rounded-sm gap-1.5">
        <Plus className="h-4 w-4" /> New step
      </Button>
    }>
      <div className="civic-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 w-16">#</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3 w-32">Icon</th>
              <th className="px-4 py-3 w-28"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {steps.map(s => (
              <tr key={s.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono">{s.order}</td>
                <td className="px-4 py-3 font-semibold">{s.title}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-md truncate">{s.description}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.icon}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {steps.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No steps yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit step" : "New step"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={editing?.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} maxLength={200} className="mt-1.5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editing?.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} maxLength={2000} rows={5} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order</Label>
                <Input type="number" value={editing?.order ?? 0} onChange={e => setEditing({ ...editing, order: Number(e.target.value) })} className="mt-1.5" />
              </div>
              <div>
                <Label>Icon (Lucide name)</Label>
                <Input value={editing?.icon ?? ""} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="e.g. Vote" className="mt-1.5" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} className="rounded-sm">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
