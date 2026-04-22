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

interface Faq { id: string; question: string; answer: string; }

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("faqs").select("*").order("created_at", { ascending: false });
    setFaqs((data ?? []) as Faq[]);
  };
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.question || !editing?.answer) return toast.error("Question & answer required");
    const payload = {
      question: editing.question.trim().slice(0, 300),
      answer: editing.answer.trim().slice(0, 3000),
    };
    const { error } = editing.id
      ? await supabase.from("faqs").update(payload).eq("id", editing.id)
      : await supabase.from("faqs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <AdminShell title="FAQs" actions={
      <Button onClick={() => setEditing({})} className="rounded-sm gap-1.5">
        <Plus className="h-4 w-4" /> New FAQ
      </Button>
    }>
      <div className="space-y-3">
        {faqs.map(f => (
          <div key={f.id} className="civic-card p-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold mb-1">{f.question}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{f.answer}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={() => setEditing(f)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-center py-10 text-muted-foreground">No FAQs yet.</p>}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input value={editing?.question ?? ""} onChange={e => setEditing({ ...editing, question: e.target.value })} maxLength={300} className="mt-1.5" />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea value={editing?.answer ?? ""} onChange={e => setEditing({ ...editing, answer: e.target.value })} maxLength={3000} rows={6} className="mt-1.5" />
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
