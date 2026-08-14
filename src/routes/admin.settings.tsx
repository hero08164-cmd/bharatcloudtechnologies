import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, Section } from "@/components/admin/ProductForm";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ErrorState, LoadingState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteSettings, type SiteSettings } from "@/lib/cms";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Draft = {
  company_name: string;
  tagline: string;
  description: string;
  founded_year: string;
  contact_email: string;
  website_url: string;
  github_url: string;
  linkedin_url: string;
  x_url: string;
  instagram_url: string;
  youtube_url: string;
  logo_url: string | null;
};

function toDraft(settings: SiteSettings | null): Draft {
  return {
    company_name: settings?.company_name ?? "Bharat Cloud Technologies",
    tagline: settings?.tagline ?? "",
    description: settings?.description ?? "",
    founded_year: settings?.founded_year ? String(settings.founded_year) : "",
    contact_email: settings?.contact_email ?? "",
    website_url: settings?.website_url ?? "",
    github_url: settings?.github_url ?? "",
    linkedin_url: settings?.linkedin_url ?? "",
    x_url: settings?.x_url ?? "",
    instagram_url: settings?.instagram_url ?? "",
    youtube_url: settings?.youtube_url ?? "",
    logo_url: settings?.logo_url ?? null,
  };
}

const SOCIALS: { key: keyof Draft; label: string }[] = [
  { key: "website_url", label: "Website URL" },
  { key: "github_url", label: "GitHub URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "x_url", label: "X (Twitter) URL" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "youtube_url", label: "YouTube URL" },
];

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const [draft, setDraft] = useState<Draft>(() => toDraft(null));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (data !== undefined && !ready) {
      setDraft(toDraft(data));
      setReady(true);
    }
  }, [data, ready]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const save = useMutation({
    mutationFn: async () => {
      const blank = (v: string) => (v.trim() === "" ? null : v.trim());
      const body = {
        company_name: draft.company_name.trim() || "Bharat Cloud Technologies",
        tagline: blank(draft.tagline),
        description: blank(draft.description),
        founded_year: draft.founded_year ? Number(draft.founded_year) : null,
        contact_email: blank(draft.contact_email),
        website_url: blank(draft.website_url),
        github_url: blank(draft.github_url),
        linkedin_url: blank(draft.linkedin_url),
        x_url: blank(draft.x_url),
        instagram_url: blank(draft.instagram_url),
        youtube_url: blank(draft.youtube_url),
        logo_url: draft.logo_url,
      };

      if (data?.id) {
        const { error } = await supabase.from("site_settings").update(body).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(body);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Site settings">
      {isPending && <LoadingState />}
      {isError && <ErrorState error={error} />}

      {!isPending && !isError && (
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Section title="Company">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name">
                <Input
                  value={draft.company_name}
                  onChange={(e) => set("company_name", e.target.value)}
                />
              </Field>
              <Field label="Founded year">
                <Input
                  type="number"
                  value={draft.founded_year}
                  onChange={(e) => set("founded_year", e.target.value)}
                />
              </Field>
              <Field label="Tagline">
                <Input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </Field>
              <Field label="Contact email">
                <Input
                  type="email"
                  value={draft.contact_email}
                  onChange={(e) => set("contact_email", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Company description">
              <Textarea
                rows={4}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <MediaPicker
              label="Company logo"
              value={draft.logo_url}
              onChange={(url) => set("logo_url", url)}
              folder="logos"
            />
          </Section>

          <Section title="Links & social profiles" description="Empty links are hidden on the site.">
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIALS.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <Input
                    type="url"
                    value={(draft[key] as string) ?? ""}
                    onChange={(e) => set(key, e.target.value as Draft[typeof key])}
                    placeholder="https://"
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save settings"}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
