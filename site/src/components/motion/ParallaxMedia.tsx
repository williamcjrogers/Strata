import type { CSSProperties, ReactNode } from "react";

/*
  Subtle scroll-scrubbed depth on hero media, driven by a CSS
  scroll-driven animation (see .parallax-inner in globals.css). The
  inner element is rendered taller than its frame so movement never
  exposes edges; under reduced motion, without JS, or in browsers
  without animation-timeline support it stays static at full coverage.
*/
export function ParallaxMedia({
  children,
  className,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const clamped = Math.min(Math.abs(strength), 10);

  return (
    <div className={`relative overflow-clip ${className ?? ""}`}>
      <div
        className="parallax-inner absolute inset-x-0"
        style={
          {
            height: "116%",
            top: "-8%",
            "--parallax-strength": clamped,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
