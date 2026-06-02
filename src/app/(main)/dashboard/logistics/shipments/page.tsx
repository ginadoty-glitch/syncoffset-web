/** RUNTIME CLASSIFICATION: PLACEHOLDER — not in production navigation. */
import { Package } from "lucide-react";

import { ModulePlaceholder } from "../_components/module-placeholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Shipments"
      icon={Package}
      description="Track inbound and outbound shipments, carriers, and delivery status. This workspace is being built."
    />
  );
}
