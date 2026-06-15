/**
 * Print legend — explains the white-surface production color semantics that
 * the print day cells use (matching the reference PDF). Each entry shows a
 * colored sample of the actual treatment, not a generic swatch.
 */

const TEXT_KEYS: { className: string; sample: string; label: string }[] = [
  { className: "po-print__dnum", sample: "D1", label: "Shoot Day" },
  { className: "po-print__location", sample: "Location", label: "Filming Location" },
  { className: "po-print__scene", sample: "Int. Set (D)", label: "Scene / Set" },
  { className: "po-print__event", sample: "Meeting", label: "Event / Meeting / Scout" },
  { className: "po-print__milestone po-print__milestone--begin", sample: "Begin", label: "Milestone — Begin" },
  { className: "po-print__milestone po-print__milestone--end", sample: "End", label: "Milestone — End" },
];

const FILL_KEYS: { swatch: string; label: string }[] = [
  { swatch: "var(--po-orange)", label: "Company Day Off" },
  { swatch: "var(--po-red)", label: "Holiday / Hiatus" },
  { swatch: "var(--po-off-fill)", label: "Off / Dark Day" },
];

export function ProductionPrintLegend() {
  return (
    <div className="po-print__legend">
      {TEXT_KEYS.map((k) => (
        <div key={k.label} className="po-print__legend-item">
          <span className={`po-print__legend-key ${k.className}`} style={{ position: "static" }}>
            {k.sample}
          </span>
          <span className="po-print__legend-label">{k.label}</span>
        </div>
      ))}
      {FILL_KEYS.map((k) => (
        <div key={k.label} className="po-print__legend-item">
          <span className="po-print__legend-swatch" style={{ background: k.swatch }} />
          <span className="po-print__legend-label">{k.label}</span>
        </div>
      ))}
    </div>
  );
}
