"use client";

import Link from "next/link";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { heroWaves, waveFillsDark } from "@/components/waves/paths";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MM_MOTION, STAGGER } from "@/lib/motion";

/*
  The signature hero: stacked strata bands settle into place while the
  headline reveals through line masks. Markup renders in its final
  state, so no-JS, SSR and reduced-motion users see the composed hero;
  all tweens are `from` tweens registered inside a reduced-motion
  matchMedia context.
*/
export function StrataHero({
  eyebrow,
  title,
  lede,
  cta,
  compact = false,
}: {
  eyebrow?: string | null;
  title: string;
  lede?: string | null;
  cta?: { label: string; href: string } | null;
  compact?: boolean;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM_MOTION, () => {
        const bands = gsap.utils.toArray<SVGPathElement>("[data-hero-band]");

        // strata settle: rear band first, front band travels furthest
        gsap.from(bands, {
          y: (i: number) => 70 + i * 35,
          autoAlpha: 0,
          duration: DUR.hero,
          ease: EASE.out,
          stagger: 0.12,
        });

        // headline line-mask reveal; autoSplit re-splits on font load
        const heading = scope.current?.querySelector("[data-hero-title]");
        if (heading) {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "auto",
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: DUR.slow,
                ease: EASE.out,
                stagger: STAGGER,
                delay: 0.3,
              }),
          });
        }

        gsap.from("[data-hero-item]", {
          y: 24,
          autoAlpha: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: 0.1,
          delay: 0.65,
        });
      });

      // idle drift: desktop, motion-tolerant only; paused offscreen
      mm.add(`${MM_MOTION} and (min-width: 1024px)`, () => {
        gsap.utils.toArray<SVGPathElement>("[data-hero-band]").forEach((band, i) => {
          gsap.to(band, {
            y: `+=${4 + i * 2}`,
            duration: 7 + i * 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: DUR.hero,
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-dark-hero
      className={`relative flex flex-col justify-center overflow-clip bg-anchor text-paper ${
        compact ? "min-h-[52vh] pb-24 pt-36" : "min-h-[78vh] pb-32 pt-44"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[52%] w-full"
      >
        {heroWaves.map((d, i) => (
          <path key={d} d={d} fill={waveFillsDark[i]} data-hero-band />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-gutter">
        {eyebrow ? (
          <div data-hero-item>
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1 data-hero-title className="type-display mt-6 max-w-4xl">
          {title}
        </h1>
        {lede ? (
          <p data-hero-item className="mt-6 max-w-xl text-lg text-strata-100">
            {lede}
          </p>
        ) : null}
        {cta ? (
          <div data-hero-item className="mt-10">
            <Link
              href={cta.href}
              className="inline-flex h-12 items-center rounded-xs bg-paper px-6 text-sm font-semibold uppercase tracking-wide text-anchor transition-colors hover:bg-strata-100"
            >
              {cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
