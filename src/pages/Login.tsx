import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import logo from "@/assets/logo.png";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
}).required();

export default function Login() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav("/", { replace: true });
  }, [user, loading, nav]);

  async function submit(e: React.FormEvent<HTMLFormElement>, mode: "in" | "up") {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const { email, password } = parsed.data;
    if (email.toLowerCase() === "admin@gmail.com") {
      toast.error("This email is reserved. Please use the Admin login page.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="ElectionGuide logo" width={64} height={64} className="mx-auto mb-4 h-16 w-16" />
            <h1 className="font-serif text-3xl font-bold">User Account</h1>
            <p className="text-muted-foreground text-sm mt-2 flex items-center justify-center gap-1.5">
              <UserCircle2 className="h-4 w-4" /> Sign in or create your civic account
            </p>
          </div>

          <div className="civic-card p-6">
            <Tabs defaultValue="in">
              <TabsList className="grid grid-cols-2 w-full mb-5">
                <TabsTrigger value="in">Sign in</TabsTrigger>
                <TabsTrigger value="up">Create account</TabsTrigger>
              </TabsList>

              {(["in", "up"] as const).map(m => (
                <TabsContent key={m} value={m}>
                  <form onSubmit={(e) => submit(e, m)} className="space-y-4">
                    <div>
                      <Label htmlFor={`email-${m}`}>Email</Label>
                      <Input id={`email-${m}`} name="email" type="email" required className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor={`pw-${m}`}>Password</Label>
                      <Input id={`pw-${m}`} name="password" type="password" required minLength={8} className="mt-1.5" />
                    </div>
                    <Button type="submit" disabled={busy} className="w-full h-11 rounded-sm font-semibold">
                      {busy ? "Please wait…" : m === "in" ? "Sign in" : "Create account"}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
            <p className="text-xs text-muted-foreground mt-5 text-center">
              Looking for the admin console? <Link to="/admin-login" className="text-primary font-medium hover:underline">Admin login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
