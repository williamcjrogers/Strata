"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MM_MOTION, STAGGER } from "@/lib/motion";

/*
  Layered "geological" reveal: children marked with data-reveal arrive
  bottom-up as the section enters the viewport. Transform and opacity
  only; the trigger fires once and disposes of itself. Without JS or
  with reduced motion the content simply sits in its final state.
*/
export function SectionReveal({
  children,
  as: Tag = "section",
  className,
  stagger = STAGGER,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM_MOTION, () => {
        const targets = scope.current?.querySelectorAll("[data-reveal]");
        if (!targets || targets.length === 0) return;
        gsap.from(targets, {
          y: 48,
          autoAlpha: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
