"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { observeInViewOnce } from "@/lib/in-view";
import { MM_MOTION } from "@/lib/motion";

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

  useEffect(() => {
    const root = scope.current;
    if (!root || !window.matchMedia(MM_MOTION).matches) return;

    root
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el, i) => el.style.setProperty("--reveal-index", String(i)));
    root.classList.add("reveal-ready");

    let raf = 0;
    const unobserve = observeInViewOnce(root, () => {
      root.classList.add("is-inview");
      root.querySelectorAll<HTMLElement>("[data-stat-num]").forEach((el) => {
        const target = Number.parseFloat(el.dataset.target ?? "");
        if (Number.isNaN(target)) return;
        const decimals = Number.parseInt(el.dataset.decimals ?? "0", 10);
        const format = (val: number) =>
          val.toLocaleString("en-GB", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
        const started = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - started) / 1600, 1);
          // 1-(1-t)^2 decelerates like the previous power1.out
          el.textContent = format(target * (1 - (1 - t) * (1 - t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    });

    return () => {
      unobserve();
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = stats.filter((s) => s.value && s.label);

  return (
    <section
      ref={scope}
      className="bg-anchor py-section-sm text-paper"
      style={{ "--reveal-stagger": "0.12s" } as CSSProperties}
    >
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
              <div key={label} data-reveal className="border-t-2 border-strata-500 pt-5">
                <dt className="sr-only">{label}</dt>
                <dd className="whitespace-nowrap font-display text-5xl font-bold tabular-nums leading-none">
                  {num === null ? (
                    value
                  ) : (
                    <>
                      {prefix}
                      {/* invisible sizer reserves the exact final width, so
                          the count-up never shifts layout */}
                      <span className="relative inline-block">
                        <span aria-hidden="true" className="invisible">
                          {num.toLocaleString("en-GB", {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals,
                          })}
                        </span>
                        <span
                          data-stat-num
                          data-target={num}
                          data-decimals={decimals}
                          className="absolute inset-y-0 right-0 text-right"
                        >
                          {num.toLocaleString("en-GB", {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals,
                          })}
                        </span>
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
