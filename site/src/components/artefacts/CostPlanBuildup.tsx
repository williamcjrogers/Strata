import { RefCode } from "./RefCode";
import type { CostPlanRow } from "./presets";

/*
  The flagship artefact: an elemental cost plan rendered as paired
  baseline / out-turn bars on a dark panel. Illustrative data, so the
  body is decorative; surrounding section copy carries the message.
*/
export function CostPlanBuildup({
  refCode = "SCC-CP-001",
  title = "Elemental build-up",
  unit = "£k",
  rows,
  footnote,
  compact = false,
}: {
  refCode?: string;
  title?: string;
  unit?: string;
  rows: CostPlanRow[];
  footnote?: string;
  compact?: boolean;
}) {
  const max = Math.max(...rows.map((r) => Math.max(r.baseline, r.outturn)));

  return (
    <div
      aria-hidden="true"
      className={`surface-panel text-paper ${compact ? "p-5" : "p-6 sm:p-8"}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-panel-line pb-4">
        <RefCode code={refCode} suffix={`BASIS: NRM1 / ${unit}`} tone="dark" />
        <span className="type-mono text-strata-300">{title}</span>
      </div>
      <div className={`space-y-5 ${compact ? "mt-5" : "mt-7"}`}>
        {rows.map((row) => (
          <div key={row.code} data-reveal data-artefact-bar>
            <div className="flex items-baseline justify-between gap-4">
              <p className="type-mono text-strata-300">
                <span className="text-strata-400">{row.code}</span> {row.label}
                {row.flag ? (
                  <span className="ml-2 bg-paper px-1.5 py-0.5 text-strata-950">
                    VARIANCE
                  </span>
                ) : null}
              </p>
              <p className="type-mono shrink-0 text-strata-100">
                <span className="text-strata-400">
                  {row.baseline.toLocaleString("en-GB")}
                </span>
                {" / "}
                {row.outturn.toLocaleString("en-GB")}
              </p>
            </div>
            <div className="mt-2 space-y-1">
              <div
                className="h-1.5 bg-strata-700"
                style={{ width: `${(row.baseline / max) * 100}%` }}
              />
              <div
                className={`h-1.5 ${row.flag ? "bg-paper" : "bg-strata-400"}`}
                style={{ width: `${(row.outturn / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-panel-line pt-4">
        <p className="type-mono text-strata-400">
          <span className="mr-3 inline-block h-1.5 w-6 bg-strata-700 align-middle" />
          baseline
          <span className="ml-5 mr-3 inline-block h-1.5 w-6 bg-strata-400 align-middle" />
          out-turn
        </p>
        {footnote ? (
          <p className="type-mono text-strata-400">{footnote}</p>
        ) : null}
      </div>
    </div>
  );
}
