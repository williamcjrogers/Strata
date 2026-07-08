import type { ReactNode } from "react";

/**
 * Uppercase tracked label with the "strata tick": a short accent rule
 * that anchors every eyebrow to the brand's band motif.
 */
export function Eyebrow({
  children,
  tone = "light",
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  as?: "p" | "span" | "h2";
}) {
  return (
    <Tag
      className={`eyebrow flex items-center gap-3 ${
        tone === "dark" ? "text-strata-300" : "text-accent-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-0.5 w-6 ${
          tone === "dark" ? "bg-strata-400" : "bg-accent"
        }`}
      />
      {children}
    </Tag>
  );
}
