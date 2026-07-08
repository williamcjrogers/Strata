import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { heroWaves, waveFillsDark } from "@/components/waves/paths";

/*
  Temporary composed home placeholder.
  Replaced by the Sanity-driven page at build step 9.
*/
export default function HomePage() {
  return (
    <section
      data-dark-hero
      className="relative flex min-h-[80vh] flex-col justify-center overflow-clip bg-anchor pb-32 pt-40 text-paper"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
      >
        {heroWaves.map((d, i) => (
          <path key={d} d={d} fill={waveFillsDark[i]} />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-gutter">
        <Eyebrow tone="dark">Strata Cost Consulting</Eyebrow>
        <h1 className="type-display mt-6 max-w-4xl">
          Commercial clarity, layer by layer
        </h1>
        <p className="mt-6 max-w-xl text-lg text-strata-100">
          Commercial and cost consultancy built on trust, technical excellence
          and long term partnership.
        </p>
        <div className="mt-10">
          <Button href="/contact" tone="dark">
            Start a conversation
          </Button>
        </div>
      </div>
    </section>
  );
}
