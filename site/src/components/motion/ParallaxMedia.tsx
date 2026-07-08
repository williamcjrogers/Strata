"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MM_MOTION } from "@/lib/motion";

/*
  Subtle scroll-scrubbed depth on hero media. The inner element is
  rendered taller than its frame so movement never exposes edges;
  under reduced motion it stays static at full coverage.
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
  const wrapper = useRef<HTMLDivElement>(null);
  const clamped = Math.min(Math.abs(strength), 10);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM_MOTION, () => {
        gsap.fromTo(
          "[data-parallax-inner]",
          { yPercent: -clamped },
          {
            yPercent: clamped,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: wrapper },
  );

  return (
    <div ref={wrapper} className={`relative overflow-clip ${className ?? ""}`}>
      <div
        data-parallax-inner
        className="absolute inset-x-0"
        style={{ height: "116%", top: "-8%" }}
      >
        {children}
      </div>
    </div>
  );
}
