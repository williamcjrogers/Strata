"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerScrollHandlers } from "@/lib/scroll-lock";

/*
  Single rAF loop: Lenis rides GSAP's ticker (autoRaf: false) and
  ScrollTrigger updates on Lenis scroll. Under prefers-reduced-motion
  the Lenis instance is destroyed, leaving native scrolling.
*/
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.destroy();
      return;
    }

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const unregister = registerScrollHandlers(
      () => lenis.stop(),
      () => lenis.start(),
    );

    return () => {
      gsap.ticker.remove(update);
      unregister();
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false, anchors: true }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
