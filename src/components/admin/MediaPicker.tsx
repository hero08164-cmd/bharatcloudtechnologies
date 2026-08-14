import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/lib/media";

export function MediaPicker({
  label,
  value,
  onChange,
  folder = "uploads",
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt=""
              className="size-16 rounded-lg border border-border bg-card object-contain p-1"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
            <ImagePlus className="size-5" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {busy ? "Uploading…" : "Upload image"}
          </Button>
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="…or paste an image URL"
            className="w-full sm:w-80"
          />
        </div>
      </div>
    </div>
  );
}
