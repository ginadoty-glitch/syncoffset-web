"use server";

import { revalidatePath } from "next/cache";

import {
  buildHeroStorageRef,
  heroObjectPath,
  isAllowedHeroFile,
  mimeTypeForHeroFileName,
  SET_PHOTOS_BUCKET,
} from "@/lib/sets/hero-photo";
import { createServiceClient } from "@/lib/supabase/server";

export type UploadSetHeroPhotoResult = { ok: true; heroImageUrl: string } | { ok: false; error: string };

export async function uploadSetHeroPhoto(setId: string, formData: FormData): Promise<UploadSetHeroPhotoResult> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "No file provided." };
  }

  if (!isAllowedHeroFile(file)) {
    return { ok: false, error: "Use JPG, PNG, or WEBP only." };
  }

  const mimeType = mimeTypeForHeroFileName(file.name);
  if (!mimeType) {
    return { ok: false, error: "Could not determine image type." };
  }

  const supabase = createServiceClient();

  const { data: set, error: setError } = await supabase
    .from("production_sets")
    .select("id, production_id, hero_image_url")
    .eq("id", setId)
    .maybeSingle();

  if (setError || !set) {
    return { ok: false, error: "Set not found." };
  }

  const productionId = set.production_id as string;
  const storageRef = buildHeroStorageRef(productionId, setId, file.name);
  const objectPath = heroObjectPath(productionId, setId, file.name);

  if (set.hero_image_url) {
    try {
      const oldPath = heroObjectPathFromRef(set.hero_image_url as string);
      if (oldPath) {
        await supabase.storage.from(SET_PHOTOS_BUCKET).remove([oldPath]);
      }
    } catch {
      // best-effort cleanup
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: storageError } = await supabase.storage.from(SET_PHOTOS_BUCKET).upload(objectPath, buffer, {
    contentType: mimeType,
    upsert: true,
  });

  if (storageError) {
    return { ok: false, error: `Storage upload failed: ${storageError.message}` };
  }

  const { error: updateError } = await supabase
    .from("production_sets")
    .update({
      hero_image_url: storageRef,
      modified_at: new Date().toISOString(),
    })
    .eq("id", setId);

  if (updateError) {
    await supabase.storage.from(SET_PHOTOS_BUCKET).remove([objectPath]);
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/dashboard/sets");
  revalidatePath(`/dashboard/sets/${setId}`);

  return { ok: true, heroImageUrl: storageRef };
}

function heroObjectPathFromRef(storageRef: string): string | null {
  const slash = storageRef.indexOf("/");
  if (slash <= 0) return null;
  const bucket = storageRef.slice(0, slash);
  if (bucket !== SET_PHOTOS_BUCKET) return null;
  return storageRef.slice(slash + 1);
}
