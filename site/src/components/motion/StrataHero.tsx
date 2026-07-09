import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { heroWaves, waveFillsDark } from "@/components/waves/paths";

/*
  The signature hero: stacked strata bands settle into place while the
  headline words rise through inline masks. Pure CSS (see the hero-*
  classes in globals.css), so the entrance plays from first paint with
  zero client JS; reduced-motion users see the composed hero because
  every pre-animation state lives inside the no-preference media query.
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
  const words = title.split(/\s+/).filter(Boolean);
  let item = 0;

  return (
    <section
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
          <path
            key={d}
            d={d}
            fill={waveFillsDark[i]}
            className="hero-band"
            style={{ "--band-index": i } as CSSProperties}
          />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-gutter">
        {eyebrow ? (
          <div
            className="hero-item"
            style={{ "--item-index": item++ } as CSSProperties}
          >
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h1 aria-label={title} className="type-display mt-6 max-w-4xl">
          <span aria-hidden="true">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="hero-word-mask">
                  <span
                    className="hero-word"
                    style={{ "--word-index": i } as CSSProperties}
                  >
                    {word}
                  </span>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        </h1>
        {lede ? (
          <p
            className="hero-item mt-6 max-w-xl text-lg text-strata-100"
            style={{ "--item-index": item++ } as CSSProperties}
          >
            {lede}
          </p>
        ) : null}
        {cta ? (
          <div
            className="hero-item mt-10"
            style={{ "--item-index": item++ } as CSSProperties}
          >
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
