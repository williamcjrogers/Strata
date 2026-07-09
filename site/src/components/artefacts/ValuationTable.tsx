import { RefCode } from "./RefCode";
import type { ValuationRow } from "./presets";

/*
  Decorative valuation ledger: mono rows with liability status chips
  and a monochrome-inverted CRITICAL state. CSS grid, not a table,
  because the figures are illustrative and hidden from assistive tech.
*/
const STATUS_STYLE: Record<ValuationRow["status"], string> = {
  AGREED: "border-strata-600 text-strata-300",
  ASSESSED: "border-strata-600 text-strata-200",
  QUERIED: "border-strata-400 text-strata-100",
  CRITICAL: "border-paper bg-paper text-strata-950",
};

export function ValuationTable({
  refCode = "SCC-VAL-014",
  title = "Interim valuation No. 14",
  rows,
  total,
  compact = false,
}: {
  refCode?: string;
  title?: string;
  rows: ValuationRow[];
  total?: string;
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`surface-panel text-paper ${compact ? "p-4" : "p-6 sm:p-8"}`}
    >
      <div
        className={`flex flex-wrap items-baseline justify-between gap-3 border-b border-panel-line ${
          compact ? "pb-3" : "pb-4"
        }`}
      >
        <RefCode code={refCode} tone="dark" />
        <span className="type-mono text-strata-300">{title}</span>
      </div>
      <div className={compact ? "mt-2" : "mt-3"}>
        {rows.map((row) => (
          <div
            key={row.ref}
            data-reveal
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-3 border-b border-panel-line ${
              compact ? "py-2.5" : "py-3.5"
            } sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-x-5`}
          >
            <span className="type-mono text-strata-400">{row.ref}</span>
            <span className={`text-strata-100 ${compact ? "text-xs" : "text-sm"}`}>
              {row.item}
            </span>
            <span className="type-mono text-right text-strata-100">
              £{row.amount}
            </span>
            <span
              className={`type-mono hidden border px-2 py-0.5 sm:inline-block ${STATUS_STYLE[row.status]}`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
      {total ? (
        <div
          className={`flex items-baseline justify-between ${compact ? "pt-3" : "pt-4"}`}
        >
          <span className="type-mono text-strata-400">Gross valuation</span>
          <span className="type-mono text-paper">£{total}</span>
        </div>
      ) : null}
    </div>
  );
}
