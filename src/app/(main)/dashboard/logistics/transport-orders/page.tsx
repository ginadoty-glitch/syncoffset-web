/** RUNTIME CLASSIFICATION: PLACEHOLDER — not in production navigation. */
import { Truck } from "lucide-react";

import { ModulePlaceholder } from "../_components/module-placeholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Transport Orders"
      icon={Truck}
      description="Create, assign, and manage transport orders across the production. This workspace is being built."
    />
  );
}
