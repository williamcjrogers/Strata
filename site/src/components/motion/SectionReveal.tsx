"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { observeInViewOnce } from "@/lib/in-view";
import { MM_MOTION } from "@/lib/motion";

/*
  Layered "geological" reveal: children marked with data-reveal arrive
  bottom-up as the section enters the viewport, staggered in DOM order.
  The hidden state (.reveal-ready) and the trigger are created in the
  same effect, so content can never be stuck hidden. Without JS or with
  reduced motion the content simply sits in its final state.
*/
export function SectionReveal({
  children,
  as: Tag = "section",
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root || !window.matchMedia(MM_MOTION).matches) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;
    targets.forEach((el, i) => el.style.setProperty("--reveal-index", String(i)));
    root.classList.add("reveal-ready");
    return observeInViewOnce(root, () => root.classList.add("is-inview"));
  }, []);

  return (
    <Tag
      ref={scope}
      className={className}
      style={{ "--reveal-stagger": `${stagger}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
