/**
 * Print header band — copies the reference PDF masthead:
 *   [PRODUCTION — red]   [PRODUCTION CALENDAR — black]   [MONTH YYYY]   [DATED m/d/yy]
 * White surface only; consumes the same month data as the screen calendar.
 */

function formatDated(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = String(date.getFullYear()).slice(2);
  return `${m}/${d}/${y}`;
}

export function ProductionPrintHeader({
  showName,
  monthLabel,
  calendarName,
}: {
  showName?: string | null;
  monthLabel: string;
  calendarName?: string | null;
}) {
  return (
    <div className="po-print__header">
      <div className="po-print__header-left">
        <span className="po-print__tag">{showName?.trim() || "Production"}</span>
        <span className="po-print__doc">Production Calendar</span>
      </div>
      <div className="po-print__month">{monthLabel}</div>
      <div className="po-print__dated">
        {calendarName?.trim() ? <div>{calendarName}</div> : null}
        <div>Dated {formatDated(new Date())}</div>
      </div>
    </div>
  );
}
