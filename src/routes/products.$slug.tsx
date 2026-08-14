import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Github,
  Shield,
  Sparkles,
  Store,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductLogo } from "@/components/site/ProductCard";
import { ErrorState, LoadingState } from "@/components/site/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hasValue, useProduct } from "@/lib/cms";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Product | Bharat Cloud Technologies" },
      {
        name: "description",
        content: "Product details from Bharat Cloud Technologies.",
      },
      { property: "og:title", content: "Product | Bharat Cloud Technologies" },
      { property: "og:description", content: "Product details from Bharat Cloud Technologies." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/products/${params.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/products/${params.slug}` }],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data, isPending, isError, error } = useProduct(slug);

  if (isPending) {
    return (
      <SiteLayout>
        <LoadingState label="Loading product…" />
      </SiteLayout>
    );
  }

  if (isError) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <ErrorState error={error} />
        </div>
      </SiteLayout>
    );
  }

  if (!data) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-md px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This product doesn't exist or isn't published yet.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">
              <ArrowLeft className="size-4" />
              Back to products
            </Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const { product, features, screenshots, changelog } = data;

  const links = [
    { url: product.apk_url, label: "Download APK", Icon: Download, primary: true },
    { url: product.website_url, label: "Visit Website", Icon: ExternalLink },
    { url: product.play_store_url, label: "Google Play", Icon: Store },
    { url: product.apkpure_url, label: "APKPure", Icon: Store },
    { url: product.github_url, label: "GitHub", Icon: Github },
    { url: product.documentation_url, label: "Documentation", Icon: BookOpen },
  ].filter((l) => hasValue(l.url));

  const policies = [
    { url: product.privacy_url, label: "Privacy Policy", Icon: Shield },
    { url: product.terms_url, label: "Terms", Icon: FileText },
  ].filter((l) => hasValue(l.url));

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-warm">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All products
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <ProductLogo product={product} size={80} />
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-semibold break-words text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {hasValue(product.category) && <Badge variant="secondary">{product.category}</Badge>}
                <Badge className="capitalize">{product.status}</Badge>
                {hasValue(product.version) && (
                  <span className="text-sm text-muted-foreground">Version {product.version}</span>
                )}
                {hasValue(product.release_date) && (
                  <span className="text-sm text-muted-foreground">
                    Released {product.release_date}
                  </span>
                )}
              </div>
              {hasValue(product.short_description) && (
                <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                  {product.short_description}
                </p>
              )}

              {links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {links.map(({ url, label, Icon, primary }) => (
                    <Button key={label} asChild variant={primary ? "default" : "outline"} size="sm">
                      <a href={url!} target="_blank" rel="noreferrer noopener">
                        <Icon className="size-4" />
                        {label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {hasValue(product.banner_url) && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
          <img
            src={product.banner_url}
            alt={`${product.name} banner`}
            loading="lazy"
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {hasValue(product.description) && (
          <section className="max-w-3xl">
            <h2 className="text-xl font-semibold text-foreground">About {product.name}</h2>
            <p className="mt-3 text-base leading-relaxed whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </section>
        )}

        {features.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-foreground">Features</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <Sparkles className="size-4 text-saffron" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
                  {hasValue(f.description) && (
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {screenshots.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-foreground">Screenshots</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((s) => (
                <figure key={s.id}>
                  <img
                    src={s.image_url}
                    alt={s.title || `${product.name} screenshot`}
                    loading="lazy"
                    className="w-full rounded-xl border border-border bg-card object-cover"
                  />
                  {hasValue(s.title) && (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {s.title}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {changelog.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-foreground">Changelog</h2>
            <div className="mt-5 space-y-4">
              {changelog.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">v{c.version}</Badge>
                    {hasValue(c.release_date) && (
                      <span className="text-xs text-muted-foreground">{c.release_date}</span>
                    )}
                  </div>
                  {hasValue(c.title) && (
                    <h3 className="mt-2 text-sm font-semibold text-foreground">{c.title}</h3>
                  )}
                  {hasValue(c.changes) && (
                    <p className="mt-1.5 text-sm whitespace-pre-line text-muted-foreground">
                      {c.changes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {policies.length > 0 && (
          <section className="mt-14 flex flex-wrap gap-2 border-t border-border pt-6">
            {policies.map(({ url, label, Icon }) => (
              <Button key={label} asChild variant="ghost" size="sm">
                <a href={url!} target="_blank" rel="noreferrer noopener">
                  <Icon className="size-4" />
                  {label}
                </a>
              </Button>
            ))}
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
