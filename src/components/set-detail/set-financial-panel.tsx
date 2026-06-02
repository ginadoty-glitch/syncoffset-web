import { Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { SetSectionEmpty } from "./set-section-empty";

const FINANCIAL_ROWS = ["Planned", "Authorized", "Committed", "Actual", "Paid", "Forecast", "Contingency"] as const;

export function SetFinancialPanel() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-base tracking-tight">Financial position</h2>
      <SetSectionEmpty
        icon={Wallet}
        title="Accounting unavailable"
        description="Production-cost lines for this set will populate planned, authorized, committed, actual, paid, forecast, and contingency."
      />
      <div className="grid gap-2">
        {FINANCIAL_ROWS.map((label) => (
          <Card key={label} className="border-border/50 bg-muted/10">
            <CardContent className="flex items-center justify-between py-3">
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className="font-mono text-muted-foreground/50 text-sm">—</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
