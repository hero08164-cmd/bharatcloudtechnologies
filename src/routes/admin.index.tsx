import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Archive, FileEdit, Image, Mail, PlusCircle, Settings, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ErrorState, LoadingState } from "@/components/site/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchMessages } from "@/routes/admin.messages";
import type { Product } from "@/lib/cms";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: fetchMessages });

  const total = data?.length ?? 0;
  const published = data?.filter((p) => p.status === "published").length ?? 0;
  const drafts = data?.filter((p) => p.status === "draft").length ?? 0;
  const archived = data?.filter((p) => p.status === "archived").length ?? 0;

  return (
    <AdminShell title="Dashboard">
      {isPending && <LoadingState />}
      {isError && <ErrorState error={error} />}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Total products" value={total} Icon={Sparkles} />
            <Stat label="Published" value={published} Icon={Sparkles} />
            <Stat label="Drafts" value={drafts} Icon={FileEdit} />
            <Stat label="Archived" value={archived} Icon={Archive} />
            <Stat label="Enquiries" value={messages.data?.length ?? 0} Icon={Mail} />
          </div>


          <div className="mt-8 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/admin/products/new">
                <PlusCircle className="size-4" />
                Add product
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/products">
                <FileEdit className="size-4" />
                Manage products
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/media">
                <Image className="size-4" />
                Manage media
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/settings">
                <Settings className="size-4" />
                Settings
              </Link>
            </Button>
          </div>

          <section className="mt-10">
            <h2 className="text-base font-semibold text-foreground">Recently updated</h2>
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {data.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  to="/admin/products/$id"
                  params={{ id: p.id }}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/60"
                >
                  <span className="min-w-0 truncate text-sm font-medium text-foreground">
                    {p.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <Badge variant={p.status === "published" ? "default" : "secondary"}>
                      {p.status}
                    </Badge>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </span>
                </Link>
              ))}
              {data.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground">No products yet.</p>
              )}
            </div>
          </section>
        </>
      )}
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <Icon className="size-4 text-saffron" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
