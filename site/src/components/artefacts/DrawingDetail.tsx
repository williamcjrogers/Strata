import { fnvHash } from "@/lib/refcode";

/*
  Full drawing-sheet artefact for detail-page heroes: seeded take-off
  vignette on grid paper with a real project title in the title block.
  Decorative; the page heading carries the title for assistive tech.
*/
const RATIOS = {
  "3:2": { w: 1200, h: 800 },
  "16:9": { w: 1280, h: 720 },
  "21:9": { w: 1680, h: 720 },
} as const;

export function DrawingDetail({
  seed,
  code,
  title,
  scale = "1:20",
  rev = "P1",
  ratio = "21:9",
  className,
}: {
  seed: string;
  code: string;
  title: string;
  scale?: string;
  rev?: string;
  ratio?: keyof typeof RATIOS;
  className?: string;
}) {
  const { w, h } = RATIOS[ratio];
  const n = fnvHash(seed);
  const blockH = Math.max(52, h * 0.11);
  const fs = Math.max(17, w * 0.013);
  const gridStep = Math.round(w / 40);

  // three seeded plan outlines across the sheet
  const shapes = Array.from({ length: 3 }, (_, i) => {
    const sx = w * (0.1 + i * 0.28) + ((n >> (i * 4)) % 5) * (w * 0.01);
    const sy = h * 0.18 + ((n >> (i * 6)) % 6) * (h * 0.02);
    const sw = w * (0.16 + (((n >> (i * 3)) % 10) / 100));
    const sh = h * (0.3 + (((n >> (i * 5)) % 14) / 100));
    return { sx, sy, sw, sh, i };
  });
  const dim = shapes[1];
  const dimY = dim.sy + dim.sh + h * 0.08;

  const gridLines = [];
  for (let x = gridStep; x < w; x += gridStep) {
    gridLines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={h - blockH} stroke="var(--color-grid-ink)" />,
    );
  }
  for (let y = gridStep; y < h - blockH; y += gridStep) {
    gridLines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke="var(--color-grid-ink)" />,
    );
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className ?? "h-full w-full"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width={w} height={h} fill="var(--color-paper)" />
      <g strokeWidth="1.5">{gridLines}</g>
      <defs>
        <pattern
          id={`dd-hatch-${n % 97}`}
          width="14"
          height="14"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke="var(--color-strata-300)" strokeWidth="2" />
        </pattern>
      </defs>
      {shapes.map(({ sx, sy, sw, sh, i }) => (
        <g key={i}>
          <rect
            x={sx}
            y={sy}
            width={sw}
            height={sh}
            fill={i === 1 ? `url(#dd-hatch-${n % 97})` : "none"}
            stroke="var(--color-strata-600)"
            strokeWidth="2"
          />
          <line
            x1={sx}
            y1={sy + sh * 0.4}
            x2={sx + sw}
            y2={sy + sh * 0.4}
            stroke="var(--color-strata-400)"
            strokeWidth="1.5"
          />
        </g>
      ))}
      {/* dimension line under the hatched bay */}
      <line x1={dim.sx} y1={dimY} x2={dim.sx + dim.sw} y2={dimY} stroke="var(--color-strata-600)" strokeWidth="1.5" />
      <line x1={dim.sx} y1={dimY - 8} x2={dim.sx} y2={dimY + 8} stroke="var(--color-strata-600)" strokeWidth="1.5" />
      <line x1={dim.sx + dim.sw} y1={dimY - 8} x2={dim.sx + dim.sw} y2={dimY + 8} stroke="var(--color-strata-600)" strokeWidth="1.5" />
      <text x={dim.sx + dim.sw / 2} y={dimY - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {5400 + (n % 30) * 50}
      </text>
      {/* section marker */}
      <circle cx={w * 0.9} cy={h * 0.22} r={w * 0.022} fill="none" stroke="var(--color-strata-500)" strokeWidth="2" />
      <text x={w * 0.9} y={h * 0.22 + fs * 0.36} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        A-A
      </text>
      {/* title block */}
      <rect x={0} y={h - blockH} width={w} height={blockH} fill="var(--color-mist)" stroke="var(--color-line)" strokeWidth="1.5" />
      <line x1={w * 0.55} y1={h - blockH} x2={w * 0.55} y2={h} stroke="var(--color-line)" strokeWidth="1.5" />
      <line x1={w * 0.78} y1={h - blockH} x2={w * 0.78} y2={h} stroke="var(--color-line)" strokeWidth="1.5" />
      <text x={w * 0.02} y={h - blockH / 2 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-700)">
        {title.toUpperCase()}
      </text>
      <text x={w * 0.57} y={h - blockH / 2 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {`DWG ${code}`}
      </text>
      <text x={w * 0.8} y={h - blockH / 2 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {`SCALE ${scale} / REV ${rev}`}
      </text>
    </svg>
  );
}
