/** RUNTIME CLASSIFICATION: PRODUCTION — logistics maps workspace; live Supabase only. */

import Link from "next/link";

import { Upload } from "lucide-react";

import { ProductionMap } from "@/components/maps/production-map";
import { Button } from "@/components/ui/button";
import { loadLocations } from "@/lib/locations/load-locations";
import { getActiveShow } from "@/lib/production/get-active-show";

export const dynamic = "force-dynamic";

export default async function MapsPage() {
  const [data, show] = await Promise.all([loadLocations(), getActiveShow()]);
  const locations = data.rows.map((row) => ({ id: row.id, name: row.name, address: row.address }));

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex shrink-0 items-start justify-between gap-4">
        <div>
          {show.name ? <h1 className="font-extrabold text-2xl tracking-tight">{show.name}</h1> : null}
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Logistics</p>
          {show.name ? (
            <h2 className="text-xl tracking-tight">Maps</h2>
          ) : (
            <h1 className="text-2xl tracking-tight">Maps</h1>
          )}
          <p className="text-muted-foreground text-sm">Production maps, base camp layouts, and location routing.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/ingestion/upload?kind=reference-media&label=Site+Plan">
              <Upload className="mr-2 size-4" />
              Upload Site Plan
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/ingestion/upload?kind=reference-media&label=Map">
              <Upload className="mr-2 size-4" />
              Upload Map
            </Link>
          </Button>
        </div>
      </header>

      <ProductionMap locations={locations} />
    </div>
  );
}
