import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/media";

const FOLDERS = ["uploads", "logos", "icons", "banners", "screenshots"];

export const Route = createFileRoute("/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const [folder, setFolder] = useState("uploads");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin", "media", folder],
    queryFn: () => listMedia(folder),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "media", folder] });

  const upload = useMutation({
    mutationFn: (file: File) => uploadMedia(file, folder),
    onSuccess: () => {
      toast.success("Uploaded");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (path: string) => deleteMedia(path),
    onSuccess: () => {
      toast.success("Deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Media library">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FOLDERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = "";
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
          <Upload className="size-4" />
          {upload.isPending ? "Uploading…" : "Upload image"}
        </Button>
      </div>

      <div className="mt-6">
        {isPending && <LoadingState />}
        {isError && <ErrorState error={error} />}
        {data && data.length === 0 && (
          <EmptyState title="No files in this folder" description="Upload an image to get started." />
        )}

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((file) => (
            <div key={file.path} className="rounded-xl border border-border bg-card p-3 shadow-soft">
              <img
                src={file.url}
                alt={file.name}
                className="h-32 w-full rounded-lg bg-secondary object-contain"
              />
              <p className="mt-2 truncate text-xs text-muted-foreground">{file.name}</p>
              <div className="mt-2 flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                    toast.success("URL copied");
                  }}
                >
                  <Copy className="size-4" />
                  Copy URL
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${file.name}`}
                  onClick={() => {
                    if (confirm(`Delete ${file.name}?`)) remove.mutate(file.path);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
