import Link from "next/link";
import { heroWaves, waveFillsDark } from "@/components/waves/paths";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-start justify-center overflow-clip bg-anchor px-gutter text-paper">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[45%] w-full"
      >
        {heroWaves.map((d, i) => (
          <path key={d} d={d} fill={waveFillsDark[i]} />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-7xl">
        <p className="eyebrow text-strata-300">Page not found</p>
        <h1 className="type-display mt-6">404</h1>
        <p className="mt-6 max-w-md text-lg text-strata-100">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center rounded-xs bg-paper px-6 text-sm font-semibold uppercase tracking-wide text-anchor hover:bg-strata-100"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
