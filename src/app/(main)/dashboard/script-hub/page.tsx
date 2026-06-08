/** RUNTIME CLASSIFICATION: PRODUCTION — read-only canonical script hub; live Supabase only. */

import { ScriptHubWorkspace } from "@/components/script-hub/script-hub-workspace";
import { getActiveShow } from "@/lib/production/get-active-show";
import { loadScriptHub } from "@/lib/script-hub/load-script-hub";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ scriptId?: string; sceneId?: string }>;
};

export default async function ScriptHubPage({ searchParams }: PageProps) {
  const { scriptId, sceneId } = await searchParams;
  const [data, show] = await Promise.all([loadScriptHub(scriptId, sceneId), getActiveShow()]);

  return (
    <div className="mx-auto flex h-full max-w-[1600px] flex-col" data-content-padding="false">
      <ScriptHubWorkspace data={data} showName={show.name} />
    </div>
  );
}
