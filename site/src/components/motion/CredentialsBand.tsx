"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MM_MOTION } from "@/lib/motion";

export type StatItem = {
  value?: string | null;
  label?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
};

/*
  Oversized stats band (the Opera PM credentials pattern). The final
  value is server-rendered in the markup; the count-up is a purely
  visual enhancement driven from data attributes, so screen readers,
  reduced-motion users and no-JS visitors always read the real number.
  Numerals sit in a ch-reserved tabular-nums box: zero layout shift.
*/
function parseStat(value: string): {
  prefix: string;
  num: number | null;
  suffix: string;
  decimals: number;
} {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", num: null, suffix: "", decimals: 0 };
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, num: Number.parseFloat(numStr), suffix, decimals };
}

export function CredentialsBand({
  eyebrow,
  heading,
  stats,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  stats: StatItem[];
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM_MOTION, () => {
        gsap.from("[data-stat]", {
          y: 48,
          autoAlpha: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.12,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 75%",
            once: true,
          },
        });

        gsap.utils
          .toArray<HTMLElement>("[data-stat-num]")
          .forEach((el) => {
            const target = Number.parseFloat(el.dataset.target ?? "");
            if (Number.isNaN(target)) return;
            const decimals = Number.parseInt(el.dataset.decimals ?? "0", 10);
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: target,
              duration: 1.6,
              ease: "power1.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
              },
              onUpdate: () => {
                el.textContent = proxy.val.toLocaleString("en-GB", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                });
              },
            });
          });
      });
    },
    { scope },
  );

  const items = stats.filter((s) => s.value && s.label);

  return (
    <section ref={scope} className="bg-anchor py-section-sm text-paper">
      <div className="mx-auto w-full max-w-7xl px-gutter">
        {eyebrow ? <Eyebrow tone="dark">{eyebrow}</Eyebrow> : null}
        {heading ? <h2 className="type-h2 mt-4 max-w-3xl">{heading}</h2> : null}
        <dl
          className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 ${
            items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } ${eyebrow || heading ? "mt-14" : ""}`}
        >
          {items.map((item) => {
            const value = item.value as string;
            const label = item.label as string;
            const { prefix, num, suffix, decimals } = parseStat(value);
            return (
              <div key={label} data-stat className="border-t-2 border-strata-500 pt-5">
                <dt className="sr-only">{label}</dt>
                <dd className="whitespace-nowrap font-display text-5xl font-bold tabular-nums leading-none">
                  {num === null ? (
                    value
                  ) : (
                    <>
                      {prefix}
                      <span
                        data-stat-num
                        data-target={num}
                        data-decimals={decimals}
                        className="inline-block text-left"
                        style={{
                          minWidth: `${num.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).length}ch`,
                        }}
                      >
                        {num.toLocaleString("en-GB", {
                          minimumFractionDigits: decimals,
                          maximumFractionDigits: decimals,
                        })}
                      </span>
                      {suffix}
                    </>
                  )}
                </dd>
                <dd className="mt-3 max-w-[26ch] text-sm text-strata-200">
                  {label}
                  {item.source ? (
                    <span className="mt-1 block text-xs text-strata-400">
                      Source: {item.source}
                    </span>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
