import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductStatus } from "@/lib/cms";

export type ProductDraft = {
  name: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  version: string;
  release_date: string;
  status: ProductStatus;
  is_featured: boolean;
  display_order: number;
  logo_url: string | null;
  icon_url: string | null;
  banner_url: string | null;
  website_url: string;
  play_store_url: string;
  apk_url: string;
  apkpure_url: string;
  github_url: string;
  documentation_url: string;
  privacy_url: string;
  terms_url: string;
  seo_title: string;
  seo_description: string;
};

export const EMPTY_DRAFT: ProductDraft = {
  name: "",
  slug: "",
  category: "",
  short_description: "",
  description: "",
  version: "",
  release_date: "",
  status: "draft",
  is_featured: false,
  display_order: 100,
  logo_url: null,
  icon_url: null,
  banner_url: null,
  website_url: "",
  play_store_url: "",
  apk_url: "",
  apkpure_url: "",
  github_url: "",
  documentation_url: "",
  privacy_url: "",
  terms_url: "",
  seo_title: "",
  seo_description: "",
};

export function toDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category ?? "",
    short_description: product.short_description ?? "",
    description: product.description ?? "",
    version: product.version ?? "",
    release_date: product.release_date ?? "",
    status: product.status,
    is_featured: product.is_featured,
    display_order: product.display_order,
    logo_url: product.logo_url,
    icon_url: product.icon_url,
    banner_url: product.banner_url,
    website_url: product.website_url ?? "",
    play_store_url: product.play_store_url ?? "",
    apk_url: product.apk_url ?? "",
    apkpure_url: product.apkpure_url ?? "",
    github_url: product.github_url ?? "",
    documentation_url: product.documentation_url ?? "",
    privacy_url: product.privacy_url ?? "",
    terms_url: product.terms_url ?? "",
    seo_title: product.seo_title ?? "",
    seo_description: product.seo_description ?? "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function payload(draft: ProductDraft) {
  const blankToNull = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    name: draft.name.trim(),
    slug: slugify(draft.slug || draft.name),
    category: blankToNull(draft.category),
    short_description: blankToNull(draft.short_description),
    description: blankToNull(draft.description),
    version: blankToNull(draft.version),
    release_date: blankToNull(draft.release_date),
    status: draft.status,
    is_featured: draft.is_featured,
    display_order: Number(draft.display_order) || 100,
    logo_url: draft.logo_url,
    icon_url: draft.icon_url,
    banner_url: draft.banner_url,
    website_url: blankToNull(draft.website_url),
    play_store_url: blankToNull(draft.play_store_url),
    apk_url: blankToNull(draft.apk_url),
    apkpure_url: blankToNull(draft.apkpure_url),
    github_url: blankToNull(draft.github_url),
    documentation_url: blankToNull(draft.documentation_url),
    privacy_url: blankToNull(draft.privacy_url),
    terms_url: blankToNull(draft.terms_url),
    seo_title: blankToNull(draft.seo_title),
    seo_description: blankToNull(draft.seo_description),
  };
}

const LINK_FIELDS: { key: keyof ProductDraft; label: string }[] = [
  { key: "website_url", label: "Website URL" },
  { key: "play_store_url", label: "Play Store URL" },
  { key: "apk_url", label: "Direct APK URL" },
  { key: "apkpure_url", label: "APKPure URL" },
  { key: "github_url", label: "GitHub URL" },
  { key: "documentation_url", label: "Documentation URL" },
  { key: "privacy_url", label: "Privacy policy URL" },
  { key: "terms_url", label: "Terms URL" },
];

export function ProductForm({
  initial,
  productId,
}: {
  initial: ProductDraft;
  productId?: string;
}) {
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const save = useMutation({
    mutationFn: async () => {
      if (!draft.name.trim()) throw new Error("Product name is required.");
      const body = payload(draft);
      if (productId) {
        const { error } = await supabase.from("products").update(body).eq("id", productId);
        if (error) throw error;
        return productId;
      }
      const { data, error } = await supabase.from("products").insert(body).select("id").single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      toast.success("Product saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "published"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", id] });
      if (!productId) navigate({ to: "/admin/products/$id", params: { id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field label="Slug" hint="Used in the product URL. Auto-generated from the name.">
            <Input
              value={draft.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={slugify(draft.name)}
            />
          </Field>
          <Field label="Category">
            <Input
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="AI Tool, Android App…"
            />
          </Field>
          <Field label="Version">
            <Input value={draft.version} onChange={(e) => set("version", e.target.value)} />
          </Field>
          <Field label="Release date">
            <Input
              type="date"
              value={draft.release_date}
              onChange={(e) => set("release_date", e.target.value)}
            />
          </Field>
          <Field label="Display order">
            <Input
              type="number"
              value={draft.display_order}
              onChange={(e) => set("display_order", Number(e.target.value))}
            />
          </Field>
          <Field label="Status">
            <Select
              value={draft.status}
              onValueChange={(value) => set("status", value as ProductStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="featured"
              checked={draft.is_featured}
              onCheckedChange={(checked) => set("is_featured", checked)}
            />
            <Label htmlFor="featured">Featured product</Label>
          </div>
        </div>

        <Field label="Short description" hint="Shown on product cards.">
          <Textarea
            rows={2}
            value={draft.short_description}
            onChange={(e) => set("short_description", e.target.value)}
          />
        </Field>
        <Field label="Full description">
          <Textarea
            rows={7}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Media">
        <MediaPicker
          label="Logo"
          value={draft.logo_url}
          onChange={(url) => set("logo_url", url)}
          folder="logos"
        />
        <MediaPicker
          label="Icon"
          value={draft.icon_url}
          onChange={(url) => set("icon_url", url)}
          folder="icons"
        />
        <MediaPicker
          label="Banner"
          value={draft.banner_url}
          onChange={(url) => set("banner_url", url)}
          folder="banners"
        />
      </Section>

      <Section title="Links" description="Empty links are hidden automatically on the website.">
        <div className="grid gap-4 sm:grid-cols-2">
          {LINK_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                type="url"
                value={draft[key] as string}
                onChange={(e) => set(key, e.target.value as ProductDraft[typeof key])}
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="SEO">
        <Field label="SEO title">
          <Input value={draft.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
        </Field>
        <Field label="SEO description">
          <Textarea
            rows={3}
            value={draft.seo_description}
            onChange={(e) => set("seo_description", e.target.value)}
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-border bg-background/95 py-4 backdrop-blur">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/products" })}>
          Back to products
        </Button>
      </div>
    </form>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-soft">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
