import { parseStorageRef } from "@/lib/ingestion/storage-download";
import { createServiceClient } from "@/lib/supabase/server";

export const SET_PHOTOS_BUCKET = "set-photos" as const;

const EXTENSION_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export function mimeTypeForHeroFileName(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  for (const ext of Object.keys(EXTENSION_MIME)) {
    if (lower.endsWith(ext)) {
      return EXTENSION_MIME[ext] ?? null;
    }
  }
  return null;
}

export function isAllowedHeroFile(file: File): boolean {
  return mimeTypeForHeroFileName(file.name) !== null;
}

export function buildHeroStorageRef(productionId: string, setId: string, fileName: string): string {
  const lower = fileName.toLowerCase();
  let ext = ".jpg";
  for (const candidate of [".webp", ".png", ".jpeg", ".jpg"]) {
    if (lower.endsWith(candidate)) {
      ext = candidate === ".jpeg" ? ".jpg" : candidate;
      break;
    }
  }
  return `${SET_PHOTOS_BUCKET}/${productionId}/${setId}/hero${ext}`;
}

export function heroObjectPath(productionId: string, setId: string, fileName: string): string {
  const ref = buildHeroStorageRef(productionId, setId, fileName);
  return ref.slice(ref.indexOf("/") + 1);
}

/** Signed URL for display in RSC (private bucket). */
export async function resolveHeroImageDisplayUrl(heroImageUrl: string | null): Promise<string | null> {
  if (!heroImageUrl?.trim()) {
    return null;
  }

  try {
    const { bucket, objectPath } = parseStorageRef(heroImageUrl);
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60 * 60);

    if (error || !data?.signedUrl) {
      return null;
    }
    return data.signedUrl;
  } catch {
    return null;
  }
}
