import Link from "next/link";

import { SetsIndex } from "@/components/sets/sets-index";
import { listProductionSets } from "@/lib/sets/list-production-sets";

export const dynamic = "force-dynamic";

export default async function SetsListPage() {
  const data = await listProductionSets();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Production · Art</p>
          <h1 className="text-2xl tracking-tight">Sets</h1>
        </div>
        <p className="max-w-2xl text-muted-foreground text-sm">
          Choose a set to open the art department workspace. Data loads from persistence only — empty until you seed{" "}
          <code className="rounded bg-muted px-1 text-xs">production_sets</code>.
        </p>
      </header>

      <SetsIndex data={data} />
    </div>
  );
}
