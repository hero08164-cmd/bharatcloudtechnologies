import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

const TEN_YEARS = 60 * 60 * 24 * 3650;

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported file type. Use PNG, JPG, WEBP or SVG.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "File is too large. Maximum size is 5 MB.";
  }
  return null;
}

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const invalid = validateImage(file);
  if (invalid) throw new Error(invalid);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("Could not create image URL.");
  return data.signedUrl;
}

export type MediaFile = { name: string; path: string; url: string; size: number | null };

export async function listMedia(folder = "uploads"): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;

  const files = (data ?? []).filter((f) => f.id !== null);
  if (files.length === 0) return [];

  const paths = files.map((f) => `${folder}/${f.name}`);
  const { data: signed, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrls(paths, TEN_YEARS);
  if (signError) throw signError;

  return files.map((f, i) => ({
    name: f.name,
    path: paths[i]!,
    url: signed?.[i]?.signedUrl ?? "",
    size: (f.metadata as { size?: number } | null)?.size ?? null,
  }));
}

export async function deleteMedia(path: string) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}
