import { RefCode } from "./RefCode";

/*
  Drawdown S-curve: planned (dashed) against certified (solid), with a
  divergence annotation. Pure SVG on a dark panel; decorative.
*/
export function CashflowCurve({
  refCode = "SCC-DD-014",
  title = "Drawdown profile",
  annotation = "DRAWDOWN 14 // 62% CERTIFIED",
}: {
  refCode?: string;
  title?: string;
  annotation?: string;
}) {
  const w = 640;
  const h = 360;
  const left = 52;
  const right = 24;
  const top = 40;
  const bottom = 44;
  const pw = w - left - right;
  const ph = h - top - bottom;
  const cut = 0.62;

  const point = (t: number, scale: number) => {
    const s = t * t * (3 - 2 * t);
    return { x: left + pw * t, y: top + ph * (1 - s * scale) };
  };
  const path = (scale: number, upto = 1) => {
    const pts = [];
    for (let t = 0; t <= upto + 0.001; t += 0.04) {
      const { x, y } = point(Math.min(t, upto), scale);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  };
  const marker = point(cut, 0.94);

  return (
    <div aria-hidden="true" className="surface-panel p-6 text-paper sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-panel-line pb-4">
        <RefCode code={refCode} suffix="CUMULATIVE £" tone="dark" />
        <span className="type-mono text-strata-300">{title}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
        {/* gridlines and quarter ticks */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={left}
              y1={top + ph * (1 - t)}
              x2={left + pw}
              y2={top + ph * (1 - t)}
              stroke="var(--color-panel-line)"
              strokeWidth="1"
            />
            <text
              x={left - 10}
              y={top + ph * (1 - t) + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="12"
              fill="var(--color-strata-400)"
            >
              {Math.round(t * 100)}%
            </text>
          </g>
        ))}
        <line
          x1={left}
          y1={top + ph}
          x2={left + pw}
          y2={top + ph}
          stroke="var(--color-strata-600)"
          strokeWidth="1.5"
        />
        {["M1", "M6", "M12", "M18", "M24"].map((m, i) => (
          <text
            key={m}
            x={left + (pw * i) / 4}
            y={h - 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="12"
            fill="var(--color-strata-400)"
          >
            {m}
          </text>
        ))}
        {/* planned dashed, certified solid */}
        <path
          d={path(1)}
          fill="none"
          stroke="var(--color-strata-500)"
          strokeWidth="2"
          strokeDasharray="7 6"
          data-artefact-path
        />
        <path
          d={path(0.94, cut)}
          fill="none"
          stroke="var(--color-strata-300)"
          strokeWidth="2.5"
          data-artefact-path
        />
        <circle cx={marker.x} cy={marker.y} r="5" fill="var(--color-strata-300)" />
        <text
          x={marker.x + 12}
          y={marker.y - 10}
          fontFamily="var(--font-mono)"
          fontSize="12"
          fill="var(--color-strata-300)"
        >
          {annotation}
        </text>
      </svg>
      <p className="type-mono mt-3 border-t border-panel-line pt-4 text-strata-400">
        <span className="mr-3 inline-block w-6 border-t-2 border-dashed border-strata-500 align-middle" />
        planned
        <span className="ml-5 mr-3 inline-block w-6 border-t-2 border-strata-300 align-middle" />
        certified
      </p>
    </div>
  );
}
