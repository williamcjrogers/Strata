/*
  Canonical strata wave geometry.
  Ratios are measured from the master logo mark
  (public/brand/logo-dark.svg): band thickness ~16% of mark width,
  arch amplitude ~0.155, gentle two-undulation arcs.
  Every wave motif on the site draws from this module so the whole
  system shares one geometry source.
*/

/** Layered hero bands. viewBox "0 0 1440 480", preserveAspectRatio "none". */
export const heroWaves = [
  "M0,120 C180,60 360,56 540,96 C760,146 980,140 1200,92 C1290,72 1380,70 1440,84 L1440,480 L0,480 Z",
  "M0,196 C200,140 400,132 600,172 C820,216 1020,210 1240,164 C1320,148 1400,148 1440,158 L1440,480 L0,480 Z",
  "M0,272 C220,220 420,210 620,248 C860,292 1060,286 1260,242 C1340,226 1410,226 1440,234 L1440,480 L0,480 Z",
  "M0,348 C240,300 440,292 640,326 C880,366 1080,360 1280,320 C1360,306 1420,306 1440,312 L1440,480 L0,480 Z",
] as const;

/** Single stroked divider arc. viewBox "0 0 1440 96". */
export const dividerWave =
  "M0,48 C240,12 480,10 720,36 C960,62 1200,58 1440,28" as const;

/** Fill sequences (back to front) for each ground. */
export const waveFillsDark = [
  "var(--color-strata-800)",
  "var(--color-strata-700)",
  "var(--color-strata-600)",
  "var(--color-strata-500)",
] as const;

export const waveFillsLight = [
  "var(--color-strata-200)",
  "var(--color-strata-100)",
  "var(--color-strata-50)",
  "var(--color-paper)",
] as const;
