import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Image, LayoutDashboard, LogOut, Package, Settings, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/bct-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { LoadingState } from "@/components/site/States";

const LINKS = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", Icon: Package, exact: false },
  { to: "/admin/media", label: "Media", Icon: Image, exact: false },
  { to: "/admin/settings", label: "Settings", Icon: Settings, exact: false },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { loading, user, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Checking your access…" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <ShieldAlert className="mx-auto size-6 text-destructive" />
          <h1 className="mt-4 text-lg font-semibold text-foreground">Unauthorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) does not have admin access to this dashboard.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" width={32} height={32} className="size-8 object-contain" />
            <span className="text-sm font-semibold text-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:block">{user.email}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                toast.success("Signed out");
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
        <nav className="border-t border-border">
          <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
            {LINKS.map(({ to, label, Icon, exact }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Could not sign in.");
      return;
    }
    toast.success("Signed in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm px-4">
      <form
        onSubmit={signIn}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <img src={logo} alt="" width={48} height={48} className="size-12 object-contain" />
        <h1 className="mt-5 text-lg font-semibold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Restricted area. Authorized administrators only.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
