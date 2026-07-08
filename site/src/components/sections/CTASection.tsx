import Link from "next/link";
import { heroWaves } from "@/components/waves/paths";

const ctaWaveFills = [
  "var(--color-strata-800)",
  "var(--color-strata-700)",
  "var(--color-strata-600)",
];

export function CTASection({
  heading,
  text,
  link,
}: {
  heading: string;
  text?: string | null;
  link: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-clip bg-anchor py-section-sm text-paper">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-2/5 w-full opacity-70"
      >
        {ctaWaveFills.map((fill, i) => (
          <path key={fill} d={heroWaves[i + 1]} fill={fill} />
        ))}
      </svg>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-gutter md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="type-h2">{heading}</h2>
          {text ? <p className="mt-5 max-w-xl text-lg text-strata-100">{text}</p> : null}
        </div>
        <Link
          href={link.href}
          className="inline-flex h-12 shrink-0 items-center rounded-xs bg-paper px-6 text-sm font-semibold uppercase tracking-wide text-anchor transition-colors hover:bg-strata-100"
        >
          {link.label}
        </Link>
      </div>
    </section>
  );
}
