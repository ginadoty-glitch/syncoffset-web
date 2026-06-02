import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { AssetRow } from "@/lib/sets/workspace-types";
import { ASSET_STATUS_REGISTRY } from "@/types/core/asset/asset-status";

export function AssetDetailHeader({
  asset,
  setId,
  setName,
  setNumber,
}: {
  asset: AssetRow | null;
  setId: string | null;
  setName: string | null;
  setNumber: string | null;
}) {
  if (!asset) {
    return (
      <header className="flex flex-col gap-2 rounded-xl border bg-card/40 p-6">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">Asset workspace</span>
        <h1 className="text-2xl tracking-tight">Asset not found</h1>
        <p className="text-muted-foreground text-sm">No asset record for this ID.</p>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-3 rounded-xl border bg-card/40 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs tabular-nums">
          {asset.asset_number}
        </Badge>
        <Badge variant="secondary" className="text-xs capitalize">
          {ASSET_STATUS_REGISTRY[asset.status]?.label ?? asset.status}
        </Badge>
        {setId && setName ? (
          <Link
            href={`/dashboard/sets/${setId}`}
            className="text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
          >
            Set {setNumber ?? "—"} · {setName}
          </Link>
        ) : null}
      </div>
      <h1 className="font-medium text-2xl tracking-tight md:text-3xl">{asset.asset_name}</h1>
      {asset.vendor_display_name && <p className="text-muted-foreground text-sm">{asset.vendor_display_name}</p>}
    </header>
  );
}
