import { RefCode } from "./RefCode";
import type { ComparisonRow } from "./presets";

/*
  Traditional consultancy vs Strata, two columns. Unlike the other
  artefacts this is real content, so it is a genuine accessible table;
  narrow viewports scroll it inside its own container.
*/
export function ComparisonTable({
  caption = "How Strata differs from a traditional consultancy",
  leftLabel = "Traditional consultancy",
  rightLabel = "Strata",
  rows,
}: {
  caption?: string;
  leftLabel?: string;
  rightLabel?: string;
  rows: ComparisonRow[];
}) {
  return (
    <div data-reveal className="border border-line">
      <div className="flex items-baseline justify-between gap-4 border-b border-line bg-mist px-5 py-3">
        <RefCode code="SCC-CMP-001" suffix="THE DIFFERENCE" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-1/4 px-5 py-4 align-bottom">
                <span className="eyebrow text-strata-600">Dimension</span>
              </th>
              <th scope="col" className="w-[37.5%] px-5 py-4 align-bottom">
                <span className="eyebrow text-strata-600">{leftLabel}</span>
              </th>
              <th
                scope="col"
                className="w-[37.5%] border-l-2 border-accent bg-mist px-5 py-4 align-bottom"
              >
                <span className="eyebrow text-strata-900">{rightLabel}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dimension} className="border-b border-line last:border-b-0">
                <th scope="row" className="px-5 py-4 align-top">
                  <span className="text-sm font-semibold text-strata-900">
                    {row.dimension}
                  </span>
                </th>
                <td className="px-5 py-4 align-top text-sm text-strata-700">
                  {row.traditional}
                </td>
                <td className="border-l-2 border-accent bg-mist px-5 py-4 align-top text-sm text-strata-900">
                  {row.strata}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
