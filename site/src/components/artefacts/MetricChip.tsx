/*
  Bordered mono status chip with an optional pulsing dot: the
  "ACCEPTING INSTRUCTIONS" register shared by CTAs, hero and contact.
*/
export function MetricChip({
  label,
  tone = "dark",
  pulse = false,
}: {
  label: string;
  tone?: "light" | "dark";
  pulse?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1.5 type-mono ${
        dark ? "border-strata-600 text-strata-200" : "border-line text-strata-700"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          dark ? "bg-strata-400" : "bg-strata-500"
        } ${pulse ? "chip-pulse" : ""}`}
      />
      {label}
    </span>
  );
}
