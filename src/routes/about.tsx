import { createFileRoute } from "@tanstack/react-router";
import { Compass, Target } from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

const TIMELINE = [
  {
    year: "2020",
    title: "The Beginning",
    text: "Bharat Cloud Technologies starts its journey.",
  },
  {
    year: "2021–2023",
    title: "Learning & Experimentation",
    text: "Development skills and technology experience grow.",
  },
  {
    year: "2024–2025",
    title: "Product Development",
    text: "Multiple software and application projects take shape.",
  },
  {
    year: "2026",
    title: "Building the Product Ecosystem",
    text: "Focus expands toward AI, automation, creator tools and practical software products.",
  },
  {
    year: "Future",
    title: "Building What's Next",
    text: "Continue developing useful technology products.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Bharat Cloud Technologies" },
      {
        name: "description",
        content:
          "Our journey since 2020: building useful software, applications and automation products from India.",
      },
      { property: "og:title", content: "About | Bharat Cloud Technologies" },
      {
        property: "og:description",
        content:
          "Our journey since 2020: building useful software, applications and automation products from India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="About us" title="Our Journey" />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Bharat Cloud Technologies began its journey in 2020. What started as a learning and
              development journey has evolved into building real software products and applications.
            </p>
            <p>
              We believe technology should solve practical problems, simplify workflows and give
              people better digital tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Target className="size-5 text-saffron" />
              <h2 className="mt-3 text-base font-semibold text-foreground">Mission</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Build useful technology that people can actually use.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Compass className="size-5 text-leaf" />
              <h2 className="mt-3 text-base font-semibold text-foreground">Vision</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Build a growing technology ecosystem from India for users around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-gradient-warm">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Company Timeline</h2>
          <ol className="mt-8 space-y-6 border-l border-border pl-6">
            {TIMELINE.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[31px] mt-1.5 size-3 rounded-full bg-gradient-brand" />
                <p className="text-xs font-semibold tracking-[0.18em] text-saffron uppercase">
                  {item.year}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
