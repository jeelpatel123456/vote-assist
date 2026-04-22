import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListOrdered, MessageSquareText, Database, ArrowLeft, LogOut, Users, ClipboardList } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/submissions", icon: ClipboardList, label: "Submissions" },
  { to: "/admin/steps", icon: ListOrdered, label: "Election Steps" },
  { to: "/admin/faqs", icon: MessageSquareText, label: "FAQs" },
  { to: "/admin/data", icon: Database, label: "Database" },
];

export function AdminShell({ children, title, actions }: { children: ReactNode; title: string; actions?: ReactNode }) {
  const { signOut, user } = useAuth();
  const loc = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="font-serif font-bold text-lg text-sidebar-primary">ElectionGuide</div>
          <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60 font-mono mt-0.5">Admin Console</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => {
            const active = item.end ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-1.5">
          <div className="px-3 py-1.5 text-xs text-sidebar-foreground/60 truncate">{user?.email}</div>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Public site</Link>
          </Button>
          <Button onClick={() => signOut()} variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card">
          <h1 className="font-serif text-2xl font-bold">{title}</h1>
          <div>{actions}</div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
