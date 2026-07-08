/*
  Deterministic branded placeholder: layered strata waves generated
  from a seed string, so every content item gets a stable, unique
  piece of brand artwork until photography exists. Pure SVG, no JS.
*/

const RATIOS = {
  "3:2": { w: 1200, h: 800 },
  "4:5": { w: 800, h: 1000 },
  "16:9": { w: 1280, h: 720 },
  "21:9": { w: 1680, h: 720 },
} as const;

const DARK_GROUND = "var(--color-strata-900)";
const DARK_BANDS = [
  "var(--color-strata-800)",
  "var(--color-strata-700)",
  "var(--color-strata-600)",
];
const LIGHT_GROUND = "var(--color-strata-50)";
const LIGHT_BANDS = [
  "var(--color-strata-200)",
  "var(--color-strata-100)",
  "var(--color-paper)",
];

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wavePath(
  w: number,
  h: number,
  baseline: number,
  amplitude: number,
  phase: number,
): string {
  // two gentle undulations echoing the logo mark's arcs
  const y = (t: number) => baseline + amplitude * Math.sin(phase + t * Math.PI * 2);
  const seg = w / 4;
  let d = `M0,${y(0).toFixed(1)}`;
  for (let i = 0; i < 4; i++) {
    const x0 = i * seg;
    const x1 = (i + 1) * seg;
    const midY = y(i / 4 + 0.125);
    d += ` Q${(x0 + seg / 2).toFixed(1)},${(2 * midY - (y(i / 4) + y((i + 1) / 4)) / 2).toFixed(1)} ${x1.toFixed(1)},${y((i + 1) / 4).toFixed(1)}`;
  }
  d += ` L${w},${h} L0,${h} Z`;
  return d;
}

export function StrataPlaceholder({
  seed,
  ratio = "3:2",
  tone = "dark",
  className,
  label,
}: {
  seed: string;
  ratio?: keyof typeof RATIOS;
  tone?: "dark" | "light";
  className?: string;
  label?: string;
}) {
  const { w, h } = RATIOS[ratio];
  const n = hash(seed);
  const bands = tone === "dark" ? DARK_BANDS : LIGHT_BANDS;
  const ground = tone === "dark" ? DARK_GROUND : LIGHT_GROUND;

  const paths = bands.map((fill, i) => {
    const baseline = h * (0.38 + 0.2 * i) + ((n >> (i * 5)) % 40) - 20;
    const amplitude = h * (0.05 + (((n >> (i * 7)) % 20) / 100) * 0.5);
    const phase = (((n >> (i * 3)) % 628) / 100) * (i % 2 === 0 ? 1 : -1);
    return { d: wavePath(w, h, baseline, amplitude, phase), fill };
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <rect width={w} height={h} fill={ground} />
      {paths.map((p) => (
        <path key={p.fill} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
