import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Cloud,
  Code2,
  Cpu,
  Globe,
  Plug,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

const AREAS: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: "AI Applications", text: "Practical AI tools for creators and everyday work.", Icon: Cpu },
  { title: "Mobile Apps", text: "Android applications built for real daily use.", Icon: Smartphone },
  { title: "Web Applications", text: "Fast, accessible web products and dashboards.", Icon: Globe },
  { title: "Automation", text: "Workflows that remove repetitive manual work.", Icon: Bot },
  { title: "APIs & Integrations", text: "Connecting systems and services together.", Icon: Plug },
  { title: "Cloud & Backend Systems", text: "Reliable backends and data services.", Icon: Cloud },
  { title: "Developer Tools", text: "Utilities that make building software simpler.", Icon: Code2 },
];

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology | Bharat Cloud Technologies" },
      {
        name: "description",
        content:
          "What we build: AI applications, mobile and web apps, automation, APIs, cloud backends and developer tools.",
      },
      { property: "og:title", content: "Technology | Bharat Cloud Technologies" },
      {
        property: "og:description",
        content:
          "What we build: AI applications, mobile and web apps, automation, APIs, cloud backends and developer tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/technology" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/technology" }],
  }),
  component: TechnologyPage,
});

function TechnologyPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Technology"
        title="What We Build"
        description="The areas we work in, and the kind of products we develop."
      />
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(({ title, text, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-saffron-soft">
                <Icon className="size-5 text-saffron" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
