import { fnvHash, refFromSeed } from "@/lib/refcode";

/*
  Deterministic technical artefacts standing in for photography: every
  content item gets a stable piece of drawing-sheet, benchmark, figure
  or ID-panel artwork generated from its slug. Pure SVG, no JS, always
  decorative (the card copy carries the meaning). Client-safe so
  SanityImage can fall back to it.
*/

const RATIOS = {
  "3:2": { w: 1200, h: 800 },
  "4:5": { w: 800, h: 1000 },
  "16:9": { w: 1280, h: 720 },
  "21:9": { w: 1680, h: 720 },
} as const;

export type ArtefactKind = "drawing" | "benchmark" | "figure" | "id";

const MONO = "var(--font-mono)";

function Grid({ w, h, dark = false }: { w: number; h: number; dark?: boolean }) {
  const step = Math.round(w / 24);
  const stroke = dark ? "var(--color-grid-ink-dark)" : "var(--color-grid-ink)";
  const lines = [];
  for (let x = step; x < w; x += step) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} stroke={stroke} />);
  }
  for (let y = step; y < h; y += step) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke={stroke} />);
  }
  return <g strokeWidth="1.5">{lines}</g>;
}

/* drawing sheet: hatched take-off vignette, dimension line, title block */
function Drawing({ w, h, seed }: { w: number; h: number; seed: string }) {
  const n = fnvHash(seed);
  const bx = w * 0.16 + (n % 5) * (w * 0.015);
  const by = h * 0.2 + ((n >> 3) % 5) * (h * 0.015);
  const bw = w * 0.42;
  const bh = h * 0.36;
  const wall = Math.max(10, w * 0.022);
  const blockH = Math.max(46, h * 0.12);
  const fs = Math.max(18, w * 0.019);
  const dimY = by + bh + h * 0.09;

  return (
    <>
      <rect width={w} height={h} fill="var(--color-paper)" />
      <Grid w={w} h={h} />
      <defs>
        <pattern
          id={`hatch-${n % 97}`}
          width="14"
          height="14"
          patternTransform={`rotate(${n % 2 === 0 ? 45 : -45})`}
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke="var(--color-strata-400)" strokeWidth="2" />
        </pattern>
      </defs>
      {/* wall build-up */}
      <rect x={bx} y={by} width={bw} height={wall} fill={`url(#hatch-${n % 97})`} stroke="var(--color-strata-700)" strokeWidth="2" />
      <rect x={bx} y={by + wall + 6} width={bw} height={wall * 0.6} fill="var(--color-strata-100)" stroke="var(--color-strata-600)" strokeWidth="1.5" />
      <rect x={bx} y={by + wall * 1.6 + 12} width={bw} height={bh - wall * 1.6 - 12} fill="none" stroke="var(--color-strata-700)" strokeWidth="2" />
      {/* interior detail lines */}
      <line x1={bx + bw * 0.3} y1={by + wall * 1.6 + 12} x2={bx + bw * 0.3} y2={by + bh} stroke="var(--color-strata-500)" strokeWidth="1.5" />
      <line x1={bx + bw * 0.72} y1={by + wall * 1.6 + 12} x2={bx + bw * 0.72} y2={by + bh} stroke="var(--color-strata-500)" strokeWidth="1.5" />
      {/* dimension line with end ticks */}
      <line x1={bx} y1={dimY} x2={bx + bw} y2={dimY} stroke="var(--color-strata-700)" strokeWidth="1.5" />
      <line x1={bx} y1={dimY - 8} x2={bx} y2={dimY + 8} stroke="var(--color-strata-700)" strokeWidth="1.5" />
      <line x1={bx + bw} y1={dimY - 8} x2={bx + bw} y2={dimY + 8} stroke="var(--color-strata-700)" strokeWidth="1.5" />
      <text x={bx + bw / 2} y={dimY - 10} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill="var(--color-strata-600)">
        {3600 + (n % 40) * 25}
      </text>
      {/* section marker */}
      <circle cx={bx + bw + w * 0.09} cy={by + bh * 0.4} r={w * 0.032} fill="none" stroke="var(--color-strata-600)" strokeWidth="2" />
      <text x={bx + bw + w * 0.09} y={by + bh * 0.4 + fs * 0.36} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill="var(--color-strata-600)">
        A-A
      </text>
      {/* title block */}
      <rect x={0} y={h - blockH} width={w} height={blockH} fill="var(--color-mist)" stroke="var(--color-line)" strokeWidth="1.5" />
      <text x={w * 0.025} y={h - blockH / 2 + fs * 0.36} fontFamily={MONO} fontSize={fs} fill="var(--color-strata-700)">
        {`DWG ${refFromSeed("SCC-D", seed)} / SCALE 1:${n % 2 === 0 ? "20" : "50"} / REV P${(n % 3) + 1}`}
      </text>
    </>
  );
}

/* dark benchmark panel: baseline vs out-turn bar pairs */
function Benchmark({ w, h, seed }: { w: number; h: number; seed: string }) {
  const n = fnvHash(seed);
  const rows = 4;
  const left = w * 0.08;
  const right = w * 0.08;
  const top = h * 0.18;
  const gap = (h * 0.66) / rows;
  const fs = Math.max(18, w * 0.019);
  const bars = Array.from({ length: rows }, (_, i) => {
    const base = 0.35 + (((n >> (i * 4)) % 50) / 100) * 0.9;
    const out = base * (0.72 + (((n >> (i * 6)) % 40) / 100) * 0.5);
    return { base: Math.min(base, 1), out: Math.min(out, 1) };
  });

  return (
    <>
      <rect width={w} height={h} fill="var(--color-panel)" />
      <Grid w={w} h={h} dark />
      <text x={left} y={h * 0.11} fontFamily={MONO} fontSize={fs} fill="var(--color-strata-400)">
        {`${refFromSeed("SCC-BM", seed)} // BENCHMARK £/M²`}
      </text>
      {bars.map((b, i) => {
        const y = top + i * gap;
        const span = w - left - right;
        return (
          <g key={i}>
            <rect x={left} y={y} width={span * b.base} height={gap * 0.26} fill="var(--color-strata-700)" />
            <rect x={left} y={y + gap * 0.34} width={span * b.out} height={gap * 0.26} fill="var(--color-strata-400)" />
          </g>
        );
      })}
    </>
  );
}

/* light figure panel: planned-vs-actual S-curve */
function Figure({ w, h, seed }: { w: number; h: number; seed: string }) {
  const n = fnvHash(seed);
  const left = w * 0.08;
  const right = w * 0.06;
  const top = h * 0.2;
  const bottom = h * 0.14;
  const pw = w - left - right;
  const ph = h - top - bottom;
  const fs = Math.max(18, w * 0.019);
  const bend = 0.3 + ((n % 30) / 100) * 1;
  const cut = 0.55 + ((n >> 5) % 30) / 100 / 2;

  const curve = (scale: number, upto = 1) => {
    const pts = [];
    for (let t = 0; t <= upto + 0.001; t += 0.05) {
      const s = t * t * (3 - 2 * t); // smoothstep S-curve
      const x = left + pw * t;
      const y = top + ph * (1 - s * scale * (1 - bend * 0.12));
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  };

  return (
    <>
      <rect width={w} height={h} fill="var(--color-paper)" />
      <Grid w={w} h={h} />
      <text x={left} y={h * 0.12} fontFamily={MONO} fontSize={fs} fill="var(--color-strata-600)">
        {`${refFromSeed("SCC-FIG", seed)} // CUMULATIVE VALUE`}
      </text>
      <line x1={left} y1={top + ph} x2={left + pw} y2={top + ph} stroke="var(--color-strata-300)" strokeWidth="2" />
      <path d={curve(1)} fill="none" stroke="var(--color-strata-500)" strokeWidth="2.5" strokeDasharray="8 7" />
      <path d={curve(0.92, cut)} fill="none" stroke="var(--color-strata-700)" strokeWidth="3" />
      <circle cx={left + pw * cut} cy={top + ph * (1 - cut * cut * (3 - 2 * cut) * 0.92 * (1 - bend * 0.12))} r={6} fill="var(--color-strata-700)" />
    </>
  );
}

/* grid-paper ID panel: initials monogram plus reference code */
function IdPanel({ w, h, seed }: { w: number; h: number; seed: string }) {
  const initials = seed
    .split(/[^a-zA-Z]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const fs = Math.max(18, w * 0.024);
  const tick = w * 0.045;

  return (
    <>
      <rect width={w} height={h} fill="var(--color-mist)" />
      <Grid w={w} h={h} />
      {/* corner registration ticks */}
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
      <text
        x={w / 2}
        y={h * 0.52}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize={w * 0.3}
        fontWeight="500"
        fill="var(--color-strata-300)"
      >
        {initials || "S"}
      </text>
      <text x={w / 2} y={h * 0.85} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill="var(--color-strata-600)">
        {refFromSeed("SCC-PPL", seed)}
      </text>
    </>
  );
}

export function ArtefactPlaceholder({
  seed,
  kind,
  ratio = "3:2",
  className,
}: {
  seed: string;
  kind: ArtefactKind;
  ratio?: keyof typeof RATIOS;
  className?: string;
}) {
  const { w, h } = RATIOS[ratio];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {kind === "drawing" ? <Drawing w={w} h={h} seed={seed} /> : null}
      {kind === "benchmark" ? <Benchmark w={w} h={h} seed={seed} /> : null}
      {kind === "figure" ? <Figure w={w} h={h} seed={seed} /> : null}
      {kind === "id" ? <IdPanel w={w} h={h} seed={seed} /> : null}
    </svg>
  );
}
