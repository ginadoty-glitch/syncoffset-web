import Link from "next/link";

import { AssetDetailWorkspace } from "@/components/asset-detail/asset-detail-workspace";
import { loadAssetWorkspace } from "@/lib/assets/load-asset-workspace";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ assetId: string }>;
};

export default async function AssetWorkspacePage({ params }: PageProps) {
  const { assetId } = await params;
  const data = await loadAssetWorkspace(assetId);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <Link
        href={data.setId ? `/dashboard/sets/${data.setId}` : "/dashboard/sets"}
        className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
      >
        ← {data.setName ? `Back to ${data.setName}` : "All sets"}
      </Link>
      <AssetDetailWorkspace data={data} />
    </div>
  );
}
