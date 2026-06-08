import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  imageUrl: string | null;
  alt: string;
  aspectClass?: string;
  className?: string;
  emptyLabel?: string;
};

export function SetHeroImage({
  imageUrl,
  alt,
  aspectClass = "aspect-video",
  className,
  emptyLabel = "No photo",
}: Props) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/30",
        aspectClass,
        className,
      )}
    >
      {imageUrl ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 size-full bg-center bg-cover"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <>
          <ImageIcon className="size-10 text-muted-foreground/35" />
          <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
            {emptyLabel}
          </span>
        </>
      )}
    </div>
  );
}
