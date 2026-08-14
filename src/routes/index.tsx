import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Lightbulb, Rocket, Workflow, type LucideIcon } from "lucide-react";
import logo from "@/assets/bct-logo.png";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { usePublishedProducts } from "@/lib/cms";

const PILLARS: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "Innovate", text: "Turning ideas into useful solutions.", Icon: Lightbulb },
  { title: "Develop", text: "Building practical digital products.", Icon: Cpu },
  { title: "Automate", text: "Making repetitive work simpler.", Icon: Workflow },
  { title: "Empower", text: "Giving users better technology.", Icon: Rocket },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat Cloud Technologies | AI, Apps & Automation" },
      {
        name: "description",
        content:
          "Bharat Cloud Technologies builds useful software, applications, AI tools and automation products from India.",
      },
      { property: "og:title", content: "Bharat Cloud Technologies | AI, Apps & Automation" },
      {
        property: "og:description",
        content:
          "Bharat Cloud Technologies builds useful software, applications, AI tools and automation products from India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: products, isPending, isError, error } = usePublishedProducts();

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-warm">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-24 size-80 rounded-full bg-saffron-soft blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-leaf-soft blur-3xl"
        />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <img
            src={logo}
            alt="Bharat Cloud Technologies logo"
            width={140}
            height={140}
            className="size-28 object-contain sm:size-36"
          />
          <span className="mt-6 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            🇮🇳 Building from India since 2020
          </span>
          <h1 className="mt-6 text-4xl leading-[1.1] font-semibold text-foreground sm:text-6xl">
            Building Technology for a{" "}
            <span className="text-gradient-brand">Better Tomorrow.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Bharat Cloud Technologies builds useful software, applications and technology products
            designed to make digital work simpler, smarter and more accessible.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/products">
                Explore Our Products
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Company introduction */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            We Build Useful Technology.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Bharat Cloud Technologies started its journey in 2020 with a simple goal: learn, build
            and create useful technology. Today, we are developing applications and software
            products for creators, businesses and everyday users.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ title, text, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-leaf-soft">
                <Icon className="size-5 text-leaf" />
              </span>
              <h3 className="mt-4 text-xs font-semibold tracking-[0.18em] text-charcoal uppercase">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="border-y border-border bg-gradient-warm">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Our Products</h2>
              <p className="mt-3 text-base text-muted-foreground">
                Explore the products we are building and improving.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                View all products
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            {isPending && <LoadingState label="Loading products…" />}
            {isError && <ErrorState error={error} />}
            {!isPending && !isError && (products ?? []).length === 0 && (
              <EmptyState title="No products published yet" />
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(products ?? []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft sm:p-16">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Let's Build Something Useful
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Have an idea, a question, or a project in mind? We'd love to hear from you.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">
              Contact us
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
