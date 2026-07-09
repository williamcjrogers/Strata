import { refFromSeed } from "@/lib/refcode";
import { drawMotif, gridLines, pal, type Motif, type Tone } from "./motifs";

/*
  Deterministic technical artefact standing in for photography: each
  content item gets a discipline-appropriate, seed-varied drawing
  (building section, site plan, drawdown curve, cost benchmark, claims
  variance, trend). Pure SVG, no JS, always decorative; the card copy
  carries the meaning. Client-safe so SanityImage can fall back to it.
*/
const RATIOS = {
  "3:2": { w: 1200, h: 800 },
  "4:5": { w: 800, h: 1000 },
  "16:9": { w: 1280, h: 720 },
  "21:9": { w: 1680, h: 720 },
} as const;

export type ArtefactKind = Motif | "id";

export function ArtefactPlaceholder({
  seed,
  kind,
  tone = "light",
  ratio = "3:2",
  className,
}: {
  seed: string;
  kind: ArtefactKind;
  tone?: Tone;
  ratio?: keyof typeof RATIOS;
  className?: string;
}) {
  const { w, h } = RATIOS[ratio];
  const p = pal(tone);

  if (kind === "id") return <IdPanel w={w} h={h} seed={seed} className={className} />;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width={w} height={h} fill={p.ground} />
      {gridLines(w, h, p)}
      {drawMotif(kind, w, h, seed, p)}
    </svg>
  );
}

/* grid-paper ID panel: initials monogram plus reference code */
function IdPanel({
  w,
  h,
  seed,
  className,
}: {
  w: number;
  h: number;
  seed: string;
  className?: string;
}) {
  const p = pal("light");
  const initials =
    seed
      .split(/[^a-zA-Z]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";
  const fs = Math.max(18, w * 0.024);
  const tick = w * 0.045;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width={w} height={h} fill="var(--color-mist)" />
      {gridLines(w, h, p)}
      {(
        [
          [w * 0.06, h * 0.05, 1, 1],
          [w * 0.94, h * 0.05, -1, 1],
          [w * 0.06, h * 0.95, 1, -1],
          [w * 0.94, h * 0.95, -1, -1],
        ] as const
      ).map(([x, y, dx, dy], i) => (
        <g key={i} stroke="var(--color-strata-400)" strokeWidth="2.5">
          <line x1={x} y1={y} x2={x + tick * dx} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + tick * dy} />
        </g>
      ))}
      <text x={w / 2} y={h * 0.52} textAnchor="middle" fontFamily="var(--font-display)" fontSize={w * 0.3} fontWeight="500" fill="var(--color-strata-300)">
        {initials}
      </text>
      <text x={w / 2} y={h * 0.85} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={fs} fill="var(--color-strata-600)">
        {refFromSeed("SCC-PPL", seed)}
      </text>
    </svg>
  );
}
