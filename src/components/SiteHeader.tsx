import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Shield, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="ElectionGuide" width={40} height={40} className="h-10 w-10" />
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-lg tracking-tight">ElectionGuide</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Civic Resource</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <a href="/#timeline" className="hover:text-accent transition-colors">Timeline</a>
          <a href="/#eligibility" className="hover:text-accent transition-colors">Eligibility</a>
          <a href="/#vote" className="hover:text-accent transition-colors">Try Voting</a>
          <a href="/#faq" className="hover:text-accent transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="gap-1.5">
                <UserCircle2 className="h-4 w-4" /> Login
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin-login")} className="gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Admin
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
