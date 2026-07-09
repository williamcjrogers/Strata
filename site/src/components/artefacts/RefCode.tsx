/*
  Drafting-style reference code: `SCC-HP-001 // COST PLAN // NRM1`.
  Decorative labelling only, so always hidden from assistive tech.
*/
export function RefCode({
  code,
  suffix,
  tone = "light",
  className,
}: {
  code: string;
  suffix?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`type-mono ${
        tone === "dark" ? "text-strata-400" : "text-strata-600"
      } ${className ?? ""}`}
    >
      {code}
      {suffix ? (
        <span className={tone === "dark" ? "text-strata-400" : "text-strata-600"}>
          {` // ${suffix}`}
        </span>
      ) : null}
    </span>
  );
}
