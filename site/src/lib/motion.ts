/** Shared motion constants: one vocabulary for every animation. */
export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  hero: 1.2,
} as const;

export const STAGGER = 0.08;

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  none: "none",
} as const;

/** All tweens register only inside this media context. */
export const MM_MOTION = "(prefers-reduced-motion: no-preference)";
