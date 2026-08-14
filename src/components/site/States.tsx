import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({
  error,
  label,
}: {
  error?: unknown;
  label?: string | undefined;
}) {
  const message =
    label ??
    (error instanceof Error && error.message
      ? error.message
      : "We couldn't load this content. Please check your connection and try again.");
  return (
    <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto size-6 text-destructive" />
      <p className="mt-3 text-sm text-foreground">Something went wrong</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string | undefined;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <Inbox className="mx-auto size-6 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
