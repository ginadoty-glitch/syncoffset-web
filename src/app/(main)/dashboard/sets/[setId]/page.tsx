import Link from "next/link";

import { SetDetailWorkspace } from "@/components/set-detail/set-detail-workspace";
import { listProductionSets } from "@/lib/sets/list-production-sets";
import { loadSetWorkspace } from "@/lib/sets/load-set-workspace";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ setId: string }>;
};

export default async function SetDetailPage({ params }: PageProps) {
  const { setId } = await params;
  const [data, setsList] = await Promise.all([loadSetWorkspace(setId), listProductionSets()]);
  const allSets = setsList.sets.map((s) => ({
    id: s.id,
    setNumber: s.set_number,
    setName: s.set_name,
  }));

  return (
    <div className="min-h-full px-4 py-6 md:px-6 md:py-8">
      <Link
        href="/dashboard/sets"
        className="mb-4 inline-block text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
      >
        ← All sets
      </Link>
      <SetDetailWorkspace data={data} allSets={allSets} />
    </div>
  );
}
