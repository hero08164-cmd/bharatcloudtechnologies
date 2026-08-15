import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Download, Mail, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function csvCell(value: string | null) {
  return `"${(value ?? "").replace(/"/g, '""')}"`;
}

function toCsv(rows: Message[]) {
  const head = ["Date", "Name", "Email", "Company", "Subject", "Message"];
  const body = rows.map((r) =>
    [
      new Date(r.created_at).toISOString(),
      r.name,
      r.email,
      r.company,
      r.subject,
      r.message,
    ]
      .map(csvCell)
      .join(","),
  );
  return [head.join(","), ...body].join("\n");
}

function MessagesPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: fetchMessages,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((m) =>
      [m.name, m.email, m.company, m.subject, m.message]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [data, query]);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function exportCsv() {
    if (filtered.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} message(s)`);
  }

  return (
    <AdminShell title="Messages">
      {isPending && <LoadingState />}
      {isError && <ErrorState error={error} />}

      {data && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, company, subject or message…"
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="size-4" />
              Export CSV
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {filtered.length} of {data.length} enquiries
          </p>

          {filtered.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No enquiries found"
                description="Messages sent from the website contact form will appear here."
              />
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {filtered.map((m) => {
                const open = openId === m.id;
                return (
                  <div key={m.id} className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : m.id)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {m.subject?.trim() || "(No subject)"}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {m.name} · {m.email}
                          {m.company ? ` · ${m.company}` : ""}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="hidden text-xs text-muted-foreground sm:block">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                        <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>

                    {open && (
                      <div className="mt-3 rounded-lg bg-secondary/50 p-4">
                        <p className="text-sm whitespace-pre-wrap text-foreground">{m.message}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "Your enquiry")}`}>
                              <Mail className="size-4" />
                              Reply
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={remove.isPending}
                            onClick={() => remove.mutate(m.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
