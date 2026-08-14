import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/site/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/cms";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: ["products", "published"] });
  };

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ list, from, to }: { list: Product[]; from: number; to: number }) => {
      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      await Promise.all(
        next.map((p, index) =>
          supabase.from("products").update({ display_order: index + 1 }).eq("id", p.id),
        ),
      );
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Product["status"] }) => {
      const { error } = await supabase.from("products").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = data ?? [];

  return (
    <AdminShell title="Products">
      <div className="mb-6">
        <Button asChild>
          <Link to="/admin/products/new">
            <PlusCircle className="size-4" />
            Add product
          </Link>
        </Button>
      </div>

      {isPending && <LoadingState />}
      {isError && <ErrorState error={error} />}
      {!isPending && !isError && list.length === 0 && (
        <EmptyState title="No products yet" description="Create your first product to publish it." />
      )}

      <div className="space-y-3">
        {list.map((p, index) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/admin/products/$id"
                  params={{ id: p.id }}
                  className="text-sm font-semibold text-foreground hover:underline"
                >
                  {p.name}
                </Link>
                <Badge variant={p.status === "published" ? "default" : "secondary"}>
                  {p.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">/{p.slug}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Move up"
                disabled={index === 0 || reorder.isPending}
                onClick={() => reorder.mutate({ list, from: index, to: index - 1 })}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Move down"
                disabled={index === list.length - 1 || reorder.isPending}
                onClick={() => reorder.mutate({ list, from: index, to: index + 1 })}
              >
                <ArrowDown className="size-4" />
              </Button>
              {p.status !== "published" ? (
                <Button
                  size="sm"
                  onClick={() => setStatus.mutate({ id: p.id, status: "published" })}
                >
                  Publish
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus.mutate({ id: p.id, status: "draft" })}
                >
                  Unpublish
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStatus.mutate({ id: p.id, status: "archived" })}
              >
                Archive
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/products/$id" params={{ id: p.id }}>
                  Edit
                </Link>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Delete ${p.name}`}
                onClick={() => {
                  if (confirm(`Delete "${p.name}"? This cannot be undone.`)) remove.mutate(p.id);
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
