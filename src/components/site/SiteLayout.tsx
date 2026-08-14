import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
}) {
  return (
    <section className="border-b border-border bg-gradient-warm">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
