/** RUNTIME CLASSIFICATION: PRODUCTION — read-only canonical script hub; live Supabase only. */

import { ScriptHubWorkspace } from "@/components/script-hub/script-hub-workspace";
import { loadScriptHub } from "@/lib/script-hub/load-script-hub";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ scriptId?: string; sceneId?: string }>;
};

export default async function ScriptHubPage({ searchParams }: PageProps) {
  const { scriptId, sceneId } = await searchParams;
  const data = await loadScriptHub(scriptId, sceneId);

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col" data-content-padding="false">
      <ScriptHubWorkspace data={data} />
    </div>
  );
}
