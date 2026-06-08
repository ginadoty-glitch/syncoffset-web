import { cn } from "@/lib/utils";

type LogoVariant = "mark" | "wordmark" | "full";

type SyncOffsetLogoProps = {
  variant?: LogoVariant;
  size?: number;
  className?: string;
};

/**
 * SyncOffset brand mark — gold "S" monogram.
 *
 * Uses CSS custom property `--desk-marigold` for brand color consistency
 * across light and dark themes. Falls back to #C8922A.
 *
 * Variants:
 * - `mark`     — "S" monogram only (default)
 * - `wordmark` — "SyncOffset" text only
 * - `full`     — monogram + wordmark side by side
 */
export function SyncOffsetLogo({ variant = "mark", size = 24, className }: SyncOffsetLogoProps) {
  if (variant === "wordmark") {
    return (
      <span className={cn("font-semibold tracking-tight", className)} style={{ fontSize: size * 0.7 }}>
        SyncOffset
      </span>
    );
  }

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", variant === "mark" ? className : undefined)}
      aria-label="SyncOffset"
      role="img"
    >
      <rect width="48" height="48" rx="10" fill="var(--desk-marigold, #C8922A)" />
      <path
        d="M24.2 13C19.1 13 15.6 15.8 15.6 20c0 3.6 2.4 5.8 7.2 6.8l2.8.6c3 .6 4.2 1.6 4.2 3.4 0 2.2-2 3.6-5.2 3.6-3 0-5.2-1.2-5.6-3.6h-4c.4 4.2 3.8 7 9.6 7 5.4 0 9.2-2.8 9.2-7.2 0-3.8-2.6-5.8-7.4-6.8l-2.6-.6c-2.8-.6-4-1.6-4-3.2 0-2 1.8-3.4 4.6-3.4 2.6 0 4.4 1.4 4.8 3.4h4C33 16 29.6 13 24.2 13Z"
        fill="white"
      />
    </svg>
  );

  if (variant === "full") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        {mark}
        <span className="font-semibold text-base tracking-tight">SyncOffset</span>
      </span>
    );
  }

  return mark;
}
