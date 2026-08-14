import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, ProductForm, Section, toDraft } from "@/components/admin/ProductForm";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ErrorState, LoadingState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductChangelog, ProductFeature, ProductScreenshot } from "@/lib/cms";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProductPage,
});

function useProductAdmin(id: string) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      const [product, features, screenshots, changelog] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("product_features")
          .select("*")
          .eq("product_id", id)
          .order("display_order", { ascending: true }),
        supabase
          .from("product_screenshots")
          .select("*")
          .eq("product_id", id)
          .order("display_order", { ascending: true }),
        supabase
          .from("product_changelog")
          .select("*")
          .eq("product_id", id)
          .order("release_date", { ascending: false, nullsFirst: false }),
      ]);
      if (product.error) throw product.error;
      return {
        product: product.data as Product | null,
        features: (features.data ?? []) as ProductFeature[],
        screenshots: (screenshots.data ?? []) as ProductScreenshot[],
        changelog: (changelog.data ?? []) as ProductChangelog[],
      };
    },
  });
}

function EditProductPage() {
  const { id } = Route.useParams();
  const { data, isPending, isError, error } = useProductAdmin(id);

  return (
    <AdminShell title={data?.product ? `Edit: ${data.product.name}` : "Edit product"}>
      {isPending && <LoadingState />}
      {isError && <ErrorState error={error} />}
      {data && !data.product && <ErrorState error={new Error("Product not found.")} />}
      {data?.product && (
        <div className="space-y-8">
          <ProductForm initial={toDraft(data.product)} productId={id} />
          <FeaturesPanel productId={id} features={data.features} />
          <ScreenshotsPanel productId={id} screenshots={data.screenshots} />
          <ChangelogPanel productId={id} entries={data.changelog} />
        </div>
      )}
    </AdminShell>
  );
}

function useRelated(productId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    queryClient.invalidateQueries({ queryKey: ["product"] });
  };
}

function FeaturesPanel({
  productId,
  features,
}: {
  productId: string;
  features: ProductFeature[];
}) {
  const refresh = useRelated(productId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Feature title is required.");
      const { error } = await supabase.from("product_features").insert({
        product_id: productId,
        title: title.trim(),
        description: description.trim() || null,
        display_order: features.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      toast.success("Feature added");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (featureId: string) => {
      const { error } = await supabase.from("product_features").delete().eq("id", featureId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feature removed");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section title="Features">
      <div className="space-y-2">
        {features.map((f) => (
          <Row key={f.id} onDelete={() => remove.mutate(f.id)} label={f.title}>
            {f.description && <p className="text-sm text-muted-foreground">{f.description}</p>}
          </Row>
        ))}
        {features.length === 0 && (
          <p className="text-sm text-muted-foreground">No features added yet.</p>
        )}
      </div>

      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <Field label="Feature title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Feature description">
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>
      <Button type="button" variant="outline" onClick={() => add.mutate()} disabled={add.isPending}>
        <Plus className="size-4" />
        Add feature
      </Button>
    </Section>
  );
}

function ScreenshotsPanel({
  productId,
  screenshots,
}: {
  productId: string;
  screenshots: ProductScreenshot[];
}) {
  const refresh = useRelated(productId);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      if (!imageUrl) throw new Error("Upload or paste an image first.");
      const { error } = await supabase.from("product_screenshots").insert({
        product_id: productId,
        image_url: imageUrl,
        title: title.trim() || null,
        display_order: screenshots.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setImageUrl(null);
      setTitle("");
      toast.success("Screenshot added");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (shotId: string) => {
      const { error } = await supabase.from("product_screenshots").delete().eq("id", shotId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Screenshot removed");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section title="Screenshots">
      <div className="grid gap-4 sm:grid-cols-3">
        {screenshots.map((s) => (
          <div key={s.id} className="rounded-lg border border-border p-2">
            <img
              src={s.image_url}
              alt={s.title ?? ""}
              className="h-32 w-full rounded object-cover"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-xs text-muted-foreground">{s.title ?? "Untitled"}</span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete screenshot"
                onClick={() => remove.mutate(s.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {screenshots.length === 0 && (
          <p className="text-sm text-muted-foreground">No screenshots yet.</p>
        )}
      </div>

      <div className="space-y-4 border-t border-border pt-4">
        <MediaPicker
          label="Screenshot image"
          value={imageUrl}
          onChange={setImageUrl}
          folder="screenshots"
        />
        <Field label="Caption">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Button
          type="button"
          variant="outline"
          onClick={() => add.mutate()}
          disabled={add.isPending}
        >
          <Plus className="size-4" />
          Add screenshot
        </Button>
      </div>
    </Section>
  );
}

function ChangelogPanel({
  productId,
  entries,
}: {
  productId: string;
  entries: ProductChangelog[];
}) {
  const refresh = useRelated(productId);
  const [version, setVersion] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [changes, setChanges] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      if (!version.trim()) throw new Error("Version is required.");
      const { error } = await supabase.from("product_changelog").insert({
        product_id: productId,
        version: version.trim(),
        release_date: releaseDate || null,
        changes: changes.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setVersion("");
      setReleaseDate("");
      setChanges("");
      toast.success("Changelog entry added");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase.from("product_changelog").delete().eq("id", entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry removed");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section title="Changelog">
      <div className="space-y-2">
        {entries.map((entry) => (
          <Row
            key={entry.id}
            onDelete={() => remove.mutate(entry.id)}
            label={`v${entry.version}${entry.release_date ? ` — ${entry.release_date}` : ""}`}
          >
            {entry.changes && (
              <p className="text-sm whitespace-pre-line text-muted-foreground">{entry.changes}</p>
            )}
          </Row>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No changelog entries yet.</p>
        )}
      </div>

      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <Field label="Version">
          <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.2.0" />
        </Field>
        <Field label="Release date">
          <Input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </Field>
      </div>
      <Field label="Changes">
        <Textarea rows={4} value={changes} onChange={(e) => setChanges(e.target.value)} />
      </Field>
      <Button type="button" variant="outline" onClick={() => add.mutate()} disabled={add.isPending}>
        <Plus className="size-4" />
        Add entry
      </Button>
    </Section>
  );
}

function Row({
  label,
  children,
  onDelete,
}: {
  label: string;
  children?: React.ReactNode;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {children}
      </div>
      <Button size="icon" variant="ghost" aria-label={`Delete ${label}`} onClick={onDelete}>
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
