import { Link } from "@tanstack/react-router";
import logo from "@/assets/bct-logo.png";
import { useSiteSettings } from "@/lib/cms";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = 40,
}: {
  className?: string;
  showText?: boolean;
  size?: number;
}) {
  const { data: settings } = useSiteSettings();
  const src = settings?.logo_url || logo;
  const name = settings?.company_name || "Bharat Cloud Technologies";

  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label={name}>
      <img
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain"
      />
      {showText && (
        <span className="hidden font-display text-[15px] leading-tight font-semibold text-charcoal sm:block">
          Bharat Cloud
          <span className="block text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Technologies
          </span>
        </span>
      )}
    </Link>
  );
}
