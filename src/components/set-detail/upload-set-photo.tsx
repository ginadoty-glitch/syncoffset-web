"use client";

import { useRef, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadSetHeroPhoto } from "@/server/set-photo-actions";

const ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export function UploadSetPhoto({ setId }: { setId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadSetHeroPhoto(setId, formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Set photo uploaded");
      router.refresh();
    });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        className="gap-1.5"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" />
        {pending ? "Uploading…" : "Upload set photo"}
      </Button>
    </>
  );
}
