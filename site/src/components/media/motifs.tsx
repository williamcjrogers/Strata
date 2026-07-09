import type { ReactNode } from "react";
import { fnvHash, refFromSeed } from "@/lib/refcode";

/*
  Shared technical-drawing motifs. Each function draws its content into a
  local [0,0]-[w,h] box and returns SVG children; the container supplies
  the ground and grid. Pure functions (no hooks) so both the server
  templates and the client SanityImage fallback can use them. Every motif
  is tone-aware and strongly seed-varied, so no two cards read alike.
*/

export type Tone = "light" | "dark";
export type Motif =
  | "building"
  | "plan"
  | "cashflow"
  | "benchmark"
  | "variance"
  | "figure";

export type Pal = {
  ground: string;
  grid: string;
  ink: string;
  sub: string;
  faint: string;
  fill: string;
  fillHi: string;
  hatch: string;
  text: string;
};

export function pal(tone: Tone): Pal {
  return tone === "dark"
    ? {
        ground: "var(--color-panel)",
        grid: "var(--color-grid-ink-dark)",
        ink: "var(--color-strata-300)",
        sub: "var(--color-strata-400)",
        faint: "var(--color-strata-700)",
        fill: "var(--color-strata-700)",
        fillHi: "var(--color-strata-400)",
        hatch: "var(--color-strata-500)",
        text: "var(--color-strata-400)",
      }
    : {
        ground: "var(--color-paper)",
        grid: "var(--color-grid-ink)",
        ink: "var(--color-strata-700)",
        sub: "var(--color-strata-500)",
        faint: "var(--color-strata-300)",
        fill: "var(--color-strata-300)",
        fillHi: "var(--color-strata-500)",
        hatch: "var(--color-strata-400)",
        text: "var(--color-strata-600)",
      };
}

const MONO = "var(--font-mono)";

export function gridLines(w: number, h: number, p: Pal): ReactNode {
  const step = Math.round(w / 24);
  const lines: ReactNode[] = [];
  for (let x = step; x < w; x += step)
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} stroke={p.grid} />);
  for (let y = step; y < h; y += step)
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} stroke={p.grid} />);
  return <g strokeWidth="1.5">{lines}</g>;
}

function header(w: number, h: number, p: Pal, code: string, suffix: string): ReactNode {
  const fs = Math.max(12, w * 0.019);
  return (
    <text x={w * 0.06} y={h * 0.11} fontFamily={MONO} fontSize={fs} fill={p.text}>
      {`${code} // ${suffix}`}
    </text>
  );
}

/* -------- building section: residential / social housing -------- */
function building(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const storeys = 3 + (n % 3);
  const bx = w * 0.26;
  const bw = w * 0.4;
  const top = h * 0.2;
  const ground = h * 0.82;
  const bh = ground - top;
  const sh = bh / storeys;
  const fs = Math.max(11, w * 0.016);
  const bays = 3;

  const floors: ReactNode[] = [];
  for (let s = 0; s <= storeys; s++) {
    const y = ground - s * sh;
    floors.push(
      <line key={`fl${s}`} x1={bx} y1={y} x2={bx + bw} y2={y} stroke={p.ink} strokeWidth={s === 0 || s === storeys ? 2.5 : 1.5} />,
    );
    // level marker
    floors.push(
      <g key={`lv${s}`}>
        <path d={`M${bx - 16} ${y} l-9 -5 v10 z`} fill={p.sub} />
        <text x={w * 0.03} y={y + fs * 0.35} fontFamily={MONO} fontSize={fs} fill={p.text}>
          {`+${(s * 3).toFixed(2)}`}
        </text>
      </g>,
    );
  }

  const windows: ReactNode[] = [];
  for (let s = 0; s < storeys; s++) {
    for (let i = 0; i < bays; i++) {
      const wx = bx + bw * (0.1 + i * 0.3);
      const wy = ground - (s + 1) * sh + sh * 0.28;
      windows.push(
        <rect key={`wn${s}-${i}`} x={wx} y={wy} width={bw * 0.16} height={sh * 0.42} fill="none" stroke={p.sub} strokeWidth="1.5" />,
      );
    }
  }

  // earth hatch below ground
  const earth: ReactNode[] = [];
  for (let x = bx - 20; x < bx + bw + 20; x += 16)
    earth.push(<line key={`e${x}`} x1={x} y1={ground} x2={x - 14} y2={ground + 16} stroke={p.hatch} strokeWidth="1.5" />);

  const dimX = bx + bw + w * 0.06;

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-D", seed), "SECTION A-A")}
      {/* walls */}
      <line x1={bx} y1={top} x2={bx} y2={ground} stroke={p.ink} strokeWidth="2.5" />
      <line x1={bx + bw} y1={top} x2={bx + bw} y2={ground} stroke={p.ink} strokeWidth="2.5" />
      {/* parapet coping */}
      <rect x={bx - 8} y={top - 8} width={bw + 16} height={8} fill={p.fill} stroke={p.ink} strokeWidth="1.5" />
      {floors}
      {windows}
      {earth}
      {/* dimension chain */}
      <line x1={dimX} y1={top} x2={dimX} y2={ground} stroke={p.sub} strokeWidth="1.5" />
      {Array.from({ length: storeys + 1 }, (_, s) => (
        <line key={`dt${s}`} x1={dimX - 6} y1={ground - s * sh} x2={dimX + 6} y2={ground - s * sh} stroke={p.sub} strokeWidth="1.5" />
      ))}
      <text x={dimX + 14} y={(top + ground) / 2} fontFamily={MONO} fontSize={fs} fill={p.text} transform={`rotate(-90 ${dimX + 14} ${(top + ground) / 2})`} textAnchor="middle">
        {`${storeys} STOREYS`}
      </text>
      {/* section marker */}
      <circle cx={w * 0.88} cy={h * 0.24} r={w * 0.028} fill="none" stroke={p.sub} strokeWidth="2" />
      <text x={w * 0.88} y={h * 0.24 + fs * 0.35} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill={p.text}>
        A-A
      </text>
    </>
  );
}

/* -------- site plan: infrastructure -------- */
function plan(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const fs = Math.max(11, w * 0.015);
  const bandY = h * 0.46;
  const bandH = h * 0.16;
  const x0 = w * 0.08;
  const x1 = w * 0.82;

  const chain: ReactNode[] = [];
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const x = x0 + ((x1 - x0) * i) / ticks;
    chain.push(<line key={`c${i}`} x1={x} y1={bandY + bandH} x2={x} y2={bandY + bandH + 12} stroke={p.sub} strokeWidth="1.5" />);
    chain.push(
      <text key={`ct${i}`} x={x} y={bandY + bandH + 28} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill={p.text}>
        {`0+${String(i * 5).padStart(2, "0")}`}
      </text>,
    );
  }
  // dashed centreline
  const dashes: ReactNode[] = [];
  for (let x = x0 + 10; x < x1; x += 34)
    dashes.push(<line key={`d${x}`} x1={x} y1={bandY + bandH / 2} x2={x + 18} y2={bandY + bandH / 2} stroke={p.sub} strokeWidth="2" />);
  // thresholds
  const thr: ReactNode[] = [];
  for (let i = 0; i < 4; i++) {
    thr.push(<line key={`tl${i}`} x1={x0 + 8 + i * 7} y1={bandY + bandH * 0.2} x2={x0 + 8 + i * 7} y2={bandY + bandH * 0.8} stroke={p.sub} strokeWidth="1.5" />);
    thr.push(<line key={`tr${i}`} x1={x1 - 8 - i * 7} y1={bandY + bandH * 0.2} x2={x1 - 8 - i * 7} y2={bandY + bandH * 0.8} stroke={p.sub} strokeWidth="1.5" />);
  }
  // branching taxiway
  const bx = x0 + (x1 - x0) * (0.4 + (n % 20) / 100);

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-P", seed), "SITE PLAN 1:500")}
      <rect x={x0} y={bandY} width={x1 - x0} height={bandH} fill="none" stroke={p.ink} strokeWidth="2.5" />
      {dashes}
      {thr}
      {chain}
      {/* taxiway branch */}
      <path d={`M${bx} ${bandY} L${bx + w * 0.06} ${bandY - h * 0.22} L${bx + w * 0.16} ${bandY - h * 0.22}`} fill="none" stroke={p.ink} strokeWidth="2" />
      <path d={`M${bx + w * 0.03} ${bandY} L${bx + w * 0.09} ${bandY - h * 0.22}`} fill="none" stroke={p.faint} strokeWidth="1.5" />
      {/* north arrow */}
      <g transform={`translate(${w * 0.9} ${h * 0.26})`}>
        <circle r={w * 0.03} fill="none" stroke={p.sub} strokeWidth="1.5" />
        <path d={`M0 ${-w * 0.026} l${w * 0.012} ${w * 0.03} h${-w * 0.024} z`} fill={p.sub} />
        <text y={w * 0.05} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill={p.text}>
          N
        </text>
      </g>
      {/* scale bar */}
      <g transform={`translate(${x0} ${h * 0.86})`}>
        <rect x={0} y={0} width={w * 0.06} height={6} fill={p.ink} />
        <rect x={w * 0.06} y={0} width={w * 0.06} height={6} fill="none" stroke={p.ink} strokeWidth="1.5" />
        <text x={0} y={22} fontFamily={MONO} fontSize={fs} fill={p.text}>
          0
        </text>
        <text x={w * 0.12} y={22} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill={p.text}>
          100m
        </text>
      </g>
    </>
  );
}

/* -------- drawdown S-curve, filled: bank monitoring -------- */
function cashflow(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const fs = Math.max(11, w * 0.015);
  const left = w * 0.1;
  const right = w * 0.06;
  const top = h * 0.2;
  const bottom = h * 0.16;
  const pw = w - left - right;
  const ph = h - top - bottom;
  const cut = 0.5 + ((n % 30) / 100);

  const pt = (t: number, scale: number) => {
    const s = t * t * (3 - 2 * t);
    return { x: left + pw * t, y: top + ph * (1 - s * scale) };
  };
  const line = (scale: number, upto = 1) => {
    const parts: string[] = [];
    for (let t = 0; t <= upto + 0.001; t += 0.04) {
      const { x, y } = pt(Math.min(t, upto), scale);
      parts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return parts;
  };
  const certified = line(0.94, cut);
  const area = `M${left},${top + ph} L${certified.join(" L")} L${left + pw * cut},${top + ph} Z`;
  const marker = pt(cut, 0.94);

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-DD", seed), "DRAWDOWN £")}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={left} y1={top + ph * (1 - t)} x2={left + pw} y2={top + ph * (1 - t)} stroke={p.grid} strokeWidth="1" />
      ))}
      <path d={area} fill={p.fill} opacity="0.5" />
      <line x1={left} y1={top + ph} x2={left + pw} y2={top + ph} stroke={p.sub} strokeWidth="1.5" />
      <path d={`M${line(1).join(" L")}`} fill="none" stroke={p.sub} strokeWidth="2" strokeDasharray="7 6" />
      <path d={`M${certified.join(" L")}`} fill="none" stroke={p.ink} strokeWidth="2.5" />
      <circle cx={marker.x} cy={marker.y} r="5" fill={p.ink} />
      {["M1", "M12", "M24"].map((m, i) => (
        <text key={m} x={left + (pw * i) / 2} y={h - bottom + 24} textAnchor="middle" fontFamily={MONO} fontSize={fs} fill={p.text}>
          {m}
        </text>
      ))}
    </>
  );
}

/* -------- cost benchmark bars: contracting / pre & post contract -------- */
function benchmark(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const fs = Math.max(11, w * 0.015);
  const left = w * 0.08;
  const top = h * 0.2;
  const rows = 5;
  const gap = (h * 0.58) / rows;
  const span = w * 0.78;

  const bars = Array.from({ length: rows }, (_, i) => 0.3 + (((n >> (i * 4)) % 60) / 100) * 0.95);
  const median = left + span * 0.62;

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-BM", seed), "BENCHMARK £/M²")}
      {bars.map((b, i) => {
        const y = top + i * gap;
        return (
          <g key={i}>
            <text x={left} y={y - 6} fontFamily={MONO} fontSize={fs * 0.85} fill={p.text}>
              {`EL.${i + 1}`}
            </text>
            <rect x={left} y={y} width={Math.min(span * b, span)} height={gap * 0.4} fill={i % 2 === 0 ? p.fillHi : p.fill} />
          </g>
        );
      })}
      {/* median reference */}
      <line x1={median} y1={top - 6} x2={median} y2={top + rows * gap - gap * 0.5} stroke={p.ink} strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={median} y={top - 12} textAnchor="middle" fontFamily={MONO} fontSize={fs * 0.85} fill={p.text}>
        MEDIAN
      </text>
      {/* axis */}
      <line x1={left} y1={top + rows * gap - gap * 0.4} x2={left + span} y2={top + rows * gap - gap * 0.4} stroke={p.sub} strokeWidth="1.5" />
    </>
  );
}

/* -------- claimed v assessed: claims -------- */
function variance(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const fs = Math.max(11, w * 0.015);
  const left = w * 0.08;
  const top = h * 0.2;
  const rows = 4;
  const gap = (h * 0.6) / rows;
  const span = w * 0.8;

  const items = Array.from({ length: rows }, (_, i) => {
    const claimed = 0.55 + (((n >> (i * 5)) % 45) / 100);
    const assessed = claimed * (0.55 + (((n >> (i * 3)) % 35) / 100));
    return { claimed: Math.min(claimed, 1), assessed };
  });

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-VR", seed), "CLAIMED v ASSESSED")}
      {items.map((it, i) => {
        const y = top + i * gap;
        return (
          <g key={i}>
            <rect x={left} y={y} width={span * it.claimed} height={gap * 0.24} fill="none" stroke={p.sub} strokeWidth="1.5" />
            <rect x={left} y={y + gap * 0.3} width={span * it.assessed} height={gap * 0.24} fill={p.fillHi} />
            {i === 0 ? (
              <>
                <line x1={left + span * it.assessed} y1={y - 4} x2={left + span * it.claimed} y2={y - 4} stroke={p.ink} strokeWidth="1.5" />
                <text x={left + span * (it.assessed + it.claimed) / 2} y={y - 10} textAnchor="middle" fontFamily={MONO} fontSize={fs * 0.85} fill={p.text}>
                  Δ
                </text>
              </>
            ) : null}
          </g>
        );
      })}
      <text x={left} y={top + rows * gap + fs} fontFamily={MONO} fontSize={fs * 0.85} fill={p.text}>
        {"— CLAIMED   ▪ ASSESSED"}
      </text>
    </>
  );
}

/* -------- generic trend: default / insights fallback -------- */
function figure(w: number, h: number, seed: string, p: Pal): ReactNode {
  const n = fnvHash(seed);
  const left = w * 0.1;
  const right = w * 0.06;
  const top = h * 0.2;
  const bottom = h * 0.16;
  const pw = w - left - right;
  const ph = h - top - bottom;

  const pts = Array.from({ length: 7 }, (_, i) => {
    const x = left + (pw * i) / 6;
    const v = 0.2 + (((n >> (i * 3)) % 70) / 100);
    return { x, y: top + ph * (1 - Math.min(v, 1)) };
  });
  const path = `M${pts.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" L")}`;

  return (
    <>
      {header(w, h, p, refFromSeed("SCC-FIG", seed), "TREND")}
      {[0.33, 0.66, 1].map((t) => (
        <line key={t} x1={left} y1={top + ph * (1 - t)} x2={left + pw} y2={top + ph * (1 - t)} stroke={p.grid} strokeWidth="1" />
      ))}
      <line x1={left} y1={top + ph} x2={left + pw} y2={top + ph} stroke={p.sub} strokeWidth="1.5" />
      <path d={path} fill="none" stroke={p.ink} strokeWidth="2.5" />
      {pts.map((q, i) => (
        <circle key={i} cx={q.x} cy={q.y} r="4" fill={p.fillHi} />
      ))}
    </>
  );
}

const MOTIFS: Record<Motif, (w: number, h: number, seed: string, p: Pal) => ReactNode> = {
  building,
  plan,
  cashflow,
  benchmark,
  variance,
  figure,
};

export function drawMotif(
  motif: Motif,
  w: number,
  h: number,
  seed: string,
  p: Pal,
): ReactNode {
  return MOTIFS[motif](w, h, seed, p);
}
