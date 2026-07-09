import { drawMotif, gridLines, pal, type Motif } from "@/components/media/motifs";

/*
  Full drawing-sheet artefact for detail-page heroes: the discipline
  motif (building section, site plan, drawdown curve, claims variance,
  and so on) rendered on grid paper with a real title block carrying
  the project title and reference code. Decorative; the page heading
  carries the title for assistive tech.
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
  kind = "building",
  scale = "1:50",
  rev = "P1",
  ratio = "21:9",
  className,
}: {
  seed: string;
  code: string;
  title: string;
  kind?: Motif;
  scale?: string;
  rev?: string;
  ratio?: keyof typeof RATIOS;
  className?: string;
}) {
  const { w, h } = RATIOS[ratio];
  const p = pal("light");
  const blockH = Math.max(64, h * 0.17);
  const drawH = h - blockH;
  const fs = Math.max(17, w * 0.013);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className ?? "h-full w-full"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width={w} height={h} fill={p.ground} />
      {/* motif fills the sheet above the title block */}
      <svg x={0} y={0} width={w} height={drawH} viewBox={`0 0 ${w} ${drawH}`} overflow="hidden">
        {gridLines(w, drawH, p)}
        {drawMotif(kind, w, drawH, seed, p)}
      </svg>
      {/* title block */}
      <rect x={0} y={h - blockH} width={w} height={blockH} fill="var(--color-mist)" stroke="var(--color-line)" strokeWidth="1.5" />
      <line x1={w * 0.55} y1={h - blockH} x2={w * 0.55} y2={h} stroke="var(--color-line)" strokeWidth="1.5" />
      <line x1={w * 0.78} y1={h - blockH} x2={w * 0.78} y2={h} stroke="var(--color-line)" strokeWidth="1.5" />
      <text x={w * 0.02} y={h - blockH * 0.62 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-700)">
        {title.toUpperCase()}
      </text>
      <text x={w * 0.57} y={h - blockH * 0.62 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {`DWG ${code}`}
      </text>
      <text x={w * 0.8} y={h - blockH * 0.62 + fs * 0.36} fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {`SCALE ${scale} / REV ${rev}`}
      </text>
    </svg>
  );
}
