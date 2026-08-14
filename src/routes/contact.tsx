import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hasValue, useSiteSettings } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  company: z.string().trim().max(120).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1, "Please write a message").max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Bharat Cloud Technologies" },
      {
        name: "description",
        content:
          "Get in touch with Bharat Cloud Technologies about products, collaboration or support.",
      },
      { property: "og:title", content: "Contact | Bharat Cloud Technologies" },
      {
        property: "og:description",
        content:
          "Get in touch with Bharat Cloud Technologies about products, collaboration or support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Your enquiry could not be sent. Please try again.");
      return;
    }
    toast.success("Thank you — your enquiry has been sent.");
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Let's Build Something Useful"
        description="Tell us about your idea, question or collaboration."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Get in touch</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We read every message and reply as soon as we can.
            </p>
            {hasValue(settings?.contact_email) && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-soft"
              >
                <Mail className="size-4 text-saffron" />
                {settings.contact_email}
              </a>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" error={errors["name"]} required />
              <Field label="Email" name="email" type="email" error={errors["email"]} required />
              <Field label="Company" name="company" error={errors["company"]} />
              <Field label="Subject" name="subject" error={errors["subject"]} />
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} maxLength={2000} />
              {errors["message"] && (
                <p className="text-xs text-destructive">{errors["message"]}</p>
              )}
            </div>
            <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={submitting}>
              <Send className="size-4" />
              {submitting ? "Sending…" : "Send Enquiry"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string | undefined;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={name} name={name} type={type} maxLength={255} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
