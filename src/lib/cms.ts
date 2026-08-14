import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductFeature = Database["public"]["Tables"]["product_features"]["Row"];
export type ProductScreenshot = Database["public"]["Tables"]["product_screenshots"]["Row"];
export type ProductChangelog = Database["public"]["Tables"]["product_changelog"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type ProductStatus = Database["public"]["Enums"]["product_status"];

export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function usePublishedProducts() {
  return useQuery({ queryKey: ["products", "published"], queryFn: fetchPublishedProducts });
}

export async function fetchProductBySlug(slug: string) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!product) return null;

  const [features, screenshots, changelog] = await Promise.all([
    supabase
      .from("product_features")
      .select("*")
      .eq("product_id", product.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("product_screenshots")
      .select("*")
      .eq("product_id", product.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("product_changelog")
      .select("*")
      .eq("product_id", product.id)
      .order("release_date", { ascending: false, nullsFirst: false }),
  ]);

  return {
    product,
    features: features.data ?? [],
    screenshots: screenshots.data ?? [],
    changelog: changelog.data ?? [],
  };
}

export function useProduct(slug: string) {
  return useQuery({ queryKey: ["product", slug], queryFn: () => fetchProductBySlug(slug) });
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function useSiteSettings() {
  return useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings, staleTime: 60_000 });
}

/** Non-empty link helper — used so buttons for missing links never render. */
export function hasValue(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
