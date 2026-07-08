import { dividerWave } from "./paths";

const strokesLight = [
  "var(--color-strata-200)",
  "var(--color-strata-300)",
  "var(--color-strata-500)",
];

const strokesDark = [
  "var(--color-strata-700)",
  "var(--color-strata-500)",
  "var(--color-strata-400)",
];

export function WaveDivider({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const strokes = tone === "light" ? strokesLight : strokesDark;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={className ?? "h-12 w-full"}
      fill="none"
    >
      {strokes.map((stroke, i) => (
        <path
          key={stroke}
          d={dividerWave}
          stroke={stroke}
          strokeWidth={2}
          transform={`translate(0 ${i * 14})`}
        />
      ))}
    </svg>
  );
}
