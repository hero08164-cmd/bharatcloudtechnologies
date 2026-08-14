import { Link } from "@tanstack/react-router";
import { Github, Instagram, Linkedin, Youtube } from "lucide-react";
import { hasValue, usePublishedProducts, useSiteSettings } from "@/lib/cms";
import { Logo } from "./Logo";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: products } = usePublishedProducts();

  const socials = [
    { url: settings?.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: settings?.youtube_url, Icon: Youtube, label: "YouTube" },
    { url: settings?.github_url, Icon: Github, label: "GitHub" },
    { url: settings?.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: settings?.x_url, Icon: XIcon, label: "X" },
  ].filter((s) => hasValue(s.url));

  return (
    <footer className="border-t border-border bg-gradient-warm">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {settings?.description || "Building useful technology from India."}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Products</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(products ?? []).map((p) => (
                <li key={p.id}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-foreground"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2020–2026 {settings?.company_name || "Bharat Cloud Technologies"}. All rights
            reserved.
          </p>
          <p>🇮🇳 Proudly building from India</p>
        </div>
      </div>
    </footer>
  );
}
