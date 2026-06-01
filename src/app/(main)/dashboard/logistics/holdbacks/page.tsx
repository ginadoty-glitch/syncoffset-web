import { PauseOctagon } from "lucide-react";

import { ModulePlaceholder } from "../_components/module-placeholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Holdbacks"
      icon={PauseOctagon}
      description="Movements held for clearance, approval, or scheduling constraints. This workspace is being built."
    />
  );
}
