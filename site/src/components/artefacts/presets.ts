/*
  Single source for every hardcoded artefact dataset. All figures are
  illustrative set-dressing (the components render aria-hidden), so
  they never enter the CMS and never need editorial control. Cost
  vocabulary only: NRM1 elements, valuations, drawdowns.
*/

export type CostPlanRow = {
  code: string;
  label: string;
  baseline: number;
  outturn: number;
  flag?: boolean;
};

export const costPlanRows: CostPlanRow[] = [
  { code: "1.0", label: "Substructure", baseline: 4820, outturn: 4655 },
  { code: "2.0", label: "Superstructure", baseline: 11240, outturn: 11020 },
  { code: "3.0", label: "Internal finishes", baseline: 3610, outturn: 3985, flag: true },
  { code: "5.0", label: "Services", baseline: 6480, outturn: 6320 },
  { code: "9.0", label: "Preliminaries", baseline: 2890, outturn: 2890 },
  { code: "10.0", label: "OH and P", baseline: 1420, outturn: 1420 },
];

export type ValuationRow = {
  ref: string;
  item: string;
  amount: string;
  status: "AGREED" | "ASSESSED" | "QUERIED" | "CRITICAL";
};

export const interimValuationRows: ValuationRow[] = [
  { ref: "1.01", item: "Measured works", amount: "12,684,200", status: "AGREED" },
  { ref: "2.04", item: "Variations to date", amount: "486,350", status: "ASSESSED" },
  { ref: "3.02", item: "Materials on site", amount: "212,940", status: "AGREED" },
  { ref: "4.01", item: "Loss and expense", amount: "394,600", status: "QUERIED" },
];

export const finalAccountRows: ValuationRow[] = [
  { ref: "A.1", item: "Contract sum", amount: "48,250,000", status: "AGREED" },
  { ref: "B.3", item: "Instructed variations", amount: "1,846,220", status: "ASSESSED" },
  { ref: "C.2", item: "Provisional sums adjustment", amount: "-312,480", status: "AGREED" },
  { ref: "D.1", item: "Prolongation", amount: "1,240,000", status: "CRITICAL" },
  { ref: "E.4", item: "Retention release", amount: "603,120", status: "QUERIED" },
];

export const heroValuationRows: ValuationRow[] = [
  { ref: "1.01", item: "Measured works", amount: "12,684,200", status: "AGREED" },
  { ref: "2.04", item: "Variations", amount: "486,350", status: "ASSESSED" },
  { ref: "4.01", item: "Loss and expense", amount: "394,600", status: "QUERIED" },
  { ref: "5.02", item: "Prolongation", amount: "1,240,000", status: "CRITICAL" },
];

export type EngineNode = {
  code: string;
  label: string;
  sub?: string;
};

export const engineNodes: EngineNode[] = [
  { code: "01", label: "Instruct", sub: "director brief" },
  { code: "02", label: "Measure", sub: "take-off / audit" },
  { code: "03", label: "Benchmark", sub: "cost data" },
  { code: "04", label: "Report", sub: "director review" },
];

export const instructionNodes: EngineNode[] = [
  { code: "01", label: "Conflict check", sub: "same working day" },
  { code: "02", label: "Scope and fee", sub: "fixed or capped" },
  { code: "03", label: "Instruct", sub: "senior team deployed" },
];

export type TerminalLine = {
  kind: "cmd" | "out" | "ok" | "note";
  text: string;
};

export const engineTerminalLines: TerminalLine[] = [
  { kind: "cmd", text: "strata ingest ./valuation-14 --basis nrm1" },
  { kind: "out", text: "parsing 4,812 cost items across 22 packages" },
  { kind: "ok", text: "measured against benchmark set LDN-RESI-2026" },
  { kind: "out", text: "variance flags raised: 3 (internal finishes)" },
  { kind: "ok", text: "draft valuation routed to director review" },
  { kind: "note", text: "automation prepares. judgment decides." },
];

export type ComparisonRow = {
  dimension: string;
  traditional: string;
  strata: string;
};

export const comparisonRows: ComparisonRow[] = [
  {
    dimension: "Who does the work",
    traditional: "Junior staff produce; seniors review at the end",
    strata: "Senior specialists lead from first instruction",
  },
  {
    dimension: "Speed to deploy",
    traditional: "Weeks to mobilise a team",
    strata: "Working within days, not weeks",
  },
  {
    dimension: "Tooling",
    traditional: "Spreadsheets assembled by hand",
    strata: "Structured cost data, benchmarked and auditable",
  },
  {
    dimension: "Claims discipline",
    traditional: "Entitlement argued after the event",
    strata: "Records built claim-ready from day one",
  },
  {
    dimension: "Fee model",
    traditional: "Open-ended time charge",
    strata: "Fixed or capped, agreed before we start",
  },
];

export const tickerItems: string[] = [
  "COST PLANNING",
  "PROCUREMENT",
  "TENDER ANALYSIS",
  "VALUATIONS",
  "VARIATIONS",
  "FINAL ACCOUNTS",
  "CLAIMS",
  "BANK MONITORING",
  "BENCHMARKING",
  "EMPLOYER'S AGENT",
];
