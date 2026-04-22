import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Reactive guard: if the session is lost while inside admin (token expired,
  // signed out in another tab, etc.), kick the user back to /admin-login.
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Session expired. Please sign in again.");
      navigate("/admin-login", {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    }
  }, [loading, user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex h-14 w-14 rounded-sm bg-destructive/10 items-center justify-center mb-5">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3">Access denied</h1>
          <p className="text-muted-foreground mb-6">
            This area is restricted to administrators. Your account does not have the admin role.
          </p>
          <Button asChild className="rounded-sm"><Link to="/">Return home</Link></Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
