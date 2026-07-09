/*
  Deterministic reference codes and seeded variation, shared by the
  artefact placeholders and card meta lines. Same FNV-1a hash as
  StrataPlaceholder so a given slug always yields the same artwork
  and the same code.
*/
export function fnvHash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable drafting code, e.g. refFromSeed("SCC-PRJ", slug) -> SCC-PRJ-041 */
export function refFromSeed(prefix: string, seed: string): string {
  return `${prefix}-${String(fnvHash(seed) % 1000).padStart(3, "0")}`;
}
