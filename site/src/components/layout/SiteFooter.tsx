import Image from "next/image";
import Link from "next/link";
import { heroWaves } from "@/components/waves/paths";
import { contactCta, primaryNav } from "@/lib/routes";

const serviceLinks = [
  { label: "Pre-Contract", href: "/services/pre-contract" },
  { label: "Post-Contract", href: "/services/post-contract" },
  { label: "Claims", href: "/services/claims" },
  { label: "Bank Monitoring", href: "/services/bank-monitoring" },
];

const footerWaveFills = [
  "var(--color-strata-600)",
  "var(--color-strata-800)",
  "var(--color-strata-900)",
];

export function SiteFooter() {
  return (
    <footer className="bg-anchor text-paper">
      {/* strata transition from page ground into the footer */}
      <div className="bg-paper" aria-hidden="true">
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="block h-20 w-full sm:h-28"
        >
          {footerWaveFills.map((fill, i) => (
            <path
              key={fill}
              d={heroWaves[i + 1]}
              fill={fill}
              transform={`translate(0 ${-120 + i * 40}) scale(1 0.9)`}
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto w-full max-w-7xl px-gutter pb-10 pt-4">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1.5fr]">
          <div className="space-y-6">
            <Image
              src="/brand/logo-white.svg"
              alt="Strata Cost Consulting"
              width={164}
              height={72}
              className="h-16 w-auto"
            />
            <p className="max-w-xs text-sm text-strata-200">
              Commercial and cost consultancy built on trust, technical
              excellence and long term partnership.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="eyebrow mb-4 text-strata-300">Explore</h2>
            <ul className="space-y-2.5">
              {[{ label: "About", href: "/about" }, ...primaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-strata-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="eyebrow mb-4 text-strata-300">Services</h2>
            <ul className="space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-strata-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow mb-4 text-strata-300">Contact</h2>
            <ul className="space-y-2.5 text-sm text-strata-200">
              <li>
                <Link
                  href={contactCta.href}
                  className="font-semibold text-white underline decoration-strata-400 underline-offset-4 hover:decoration-white"
                >
                  {contactCta.label}
                </Link>
              </li>
              <li>United Kingdom</li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  rel="noreferrer"
                  target="_blank"
                  className="transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-strata-800 pt-6 text-xs text-strata-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Strata Cost Consulting. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy and cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
