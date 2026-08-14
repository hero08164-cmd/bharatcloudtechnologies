import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/site/States";
import { Input } from "@/components/ui/input";
import { usePublishedProducts } from "@/lib/cms";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products | Bharat Cloud Technologies" },
      {
        name: "description",
        content:
          "Explore the software, AI and automation products built by Bharat Cloud Technologies.",
      },
      { property: "og:title", content: "Products | Bharat Cloud Technologies" },
      {
        property: "og:description",
        content:
          "Explore the software, AI and automation products built by Bharat Cloud Technologies.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/products" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data, isPending, isError, error } = usePublishedProducts();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((p) =>
      [p.name, p.category, p.short_description, p.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [data, query]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Products"
        title="Our Products"
        description="Explore the products we are building and improving."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative mb-8 max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category or description"
            aria-label="Search products"
            className="pl-9"
          />
        </div>

        {isPending && <LoadingState label="Loading products…" />}
        {isError && <ErrorState error={error} />}
        {!isPending && !isError && results.length === 0 && (
          <EmptyState
            title={query ? "No products match your search" : "No products published yet"}
            description={query ? "Try a different keyword." : undefined}
          />
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
