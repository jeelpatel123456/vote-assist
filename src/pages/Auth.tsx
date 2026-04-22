import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
}).required();

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@2547";

export default function Auth() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from || "/admin";

  useEffect(() => {
    if (!loading && user) {
      nav(isAdmin ? redirectTo : "/", { replace: true });
    }
  }, [user, isAdmin, loading, nav, redirectTo]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const { email, password } = parsed.data;
    setBusy(true);
    try {
      // Try sign-in first
      let { error } = await supabase.auth.signInWithPassword({ email, password });

      // If admin account doesn't exist yet, auto-provision it the first time
      // the correct admin credentials are entered.
      if (error && email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const signUp = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUp.error) throw signUp.error;
        // Sign in immediately (auto-confirm is on; trigger grants admin role)
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (retry.error) throw retry.error;
        error = null;
      }

      if (error) throw error;
      toast.success("Signed in to admin console");
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero text-primary-foreground flex flex-col">
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="ElectionGuide logo" width={64} height={64} className="mx-auto mb-4 h-16 w-16" />
            <h1 className="font-serif text-3xl font-bold">Admin Console</h1>
            <p className="text-primary-foreground/70 text-sm mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Restricted access — administrators only
            </p>
          </div>

          <div className="bg-background text-foreground rounded-md p-6 shadow-civic">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin email</Label>
                <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="admin@gmail.com" />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" name="password" type="password" required minLength={8} className="mt-1.5" />
              </div>
              <Button type="submit" disabled={busy} className="w-full h-11 rounded-sm bg-primary hover:bg-primary-glow font-semibold">
                {busy ? "Please wait…" : "Sign in to Admin"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-5 text-center">
              Not an admin? <Link to="/login" className="text-primary font-medium hover:underline">Go to user login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
