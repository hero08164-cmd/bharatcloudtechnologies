import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, ExternalLink, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasValue, type Product } from "@/lib/cms";

export function ProductLogo({ product, size = 56 }: { product: Product; size?: number }) {
  const src = product.logo_url || product.icon_url;
  if (!hasValue(src)) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-border bg-secondary"
        style={{ width: size, height: size }}
      >
        <Package className="size-5 text-muted-foreground" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${product.name} logo`}
      loading="lazy"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-xl border border-border bg-card object-contain p-1.5"
    />
  );
}

export function ProductCard({ product }: { product: Product }) {
  const downloadLabel = hasValue(product.apk_url) ? "Download APK" : null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex items-start gap-4">
        <ProductLogo product={product} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-foreground">{product.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {hasValue(product.category) && (
              <Badge variant="secondary" className="font-medium">
                {product.category}
              </Badge>
            )}
            {hasValue(product.version) && (
              <span className="text-xs text-muted-foreground">v{product.version}</span>
            )}
          </div>
        </div>
      </div>

      {hasValue(product.short_description) && (
        <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
          {product.short_description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2 pt-0">
        <Button asChild size="sm">
          <Link to="/products/$slug" params={{ slug: product.slug }}>
            Explore {product.name}
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {downloadLabel && (
          <Button asChild size="sm" variant="outline">
            <a href={product.apk_url!} target="_blank" rel="noreferrer noopener">
              <Download className="size-4" />
              {downloadLabel}
            </a>
          </Button>
        )}

        {hasValue(product.website_url) && (
          <Button asChild size="sm" variant="outline">
            <a href={product.website_url} target="_blank" rel="noreferrer noopener">
              <ExternalLink className="size-4" />
              Website
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
