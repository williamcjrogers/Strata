import type { Motif } from "@/components/media/motifs";

/*
  Maps a discipline label (sector title, project sector, insight topic)
  to the technical artefact that represents that kind of QS work, so a
  bank-monitoring card draws a drawdown curve, an infrastructure card a
  site plan, a claims card a claimed-v-assessed chart, and so on. Keyed
  on the human label the card already carries, so no slug lookup needed.
  Order matters: "social housing claims" must match claims before housing.
*/
export function artefactKindForLabel(label?: string | null): Motif {
  const s = (label ?? "").toLowerCase();
  if (s.includes("bank") || s.includes("monitor") || s.includes("loan")) return "cashflow";
  if (s.includes("infra")) return "plan";
  if (s.includes("claim") || s.includes("dispute")) return "variance";
  if (s.includes("contract")) return "benchmark";
  if (s.includes("housing") || s.includes("residential")) return "building";
  return "figure";
}
