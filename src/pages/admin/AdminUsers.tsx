import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
};

export default function AdminUsers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("admin_list_users");
      if (error) toast.error(error.message);
      else setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter(r => r.email?.toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminShell title="Users">
      <div className="mb-5 flex items-center justify-between gap-4">
        <Input placeholder="Search by email…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
        <span className="text-sm text-muted-foreground">{filtered.length} of {rows.length}</span>
      </div>
      <div className="civic-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Signed up</th>
              <th className="px-4 py-3 font-semibold">Last sign-in</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>}
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{r.email}</td>
                <td className="px-4 py-3">
                  {r.is_admin
                    ? <Badge className="bg-accent text-accent-foreground gap-1"><ShieldCheck className="h-3 w-3" />Admin</Badge>
                    : <Badge variant="secondary" className="gap-1"><UserIcon className="h-3 w-3" />User</Badge>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.last_sign_in_at ? new Date(r.last_sign_in_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Passwords are never stored or visible — they're securely hashed by the authentication system.
      </p>
    </AdminShell>
  );
}
