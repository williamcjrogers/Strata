import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { hrefForDoc } from "@/lib/links";
import { urlFor } from "@/sanity/lib/image";

/* Parse intrinsic dimensions from a Sanity image ref (image-<id>-WxH-fmt). */
function dimsFromRef(ref?: string): { width: number; height: number } {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return { width: 1600, height: 1067 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="max-w-[65ch] text-base text-ink">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="max-w-[30ch] pt-6 font-display text-3xl font-medium tracking-tighter text-strata-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="type-h3 max-w-[36ch] pt-4 text-strata-900">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="max-w-[55ch] border-l-2 border-accent pl-6 text-lg text-strata-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="max-w-[65ch] list-none space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="max-w-[65ch] list-decimal space-y-2 pl-5 marker:text-accent-ink">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3">
        <span aria-hidden="true" className="mt-2.5 block h-1.5 w-1.5 shrink-0 bg-accent" />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    externalLink: ({ children, value }) => (
      <a
        href={value?.href}
        rel="noreferrer noopener"
        target="_blank"
        className="text-accent-ink underline decoration-strata-300 underline-offset-4 transition-colors hover:decoration-strata-600"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        href={hrefForDoc(value?.reference?._type, value?.reference?.slug)}
        className="text-accent-ink underline decoration-strata-300 underline-offset-4 transition-colors hover:decoration-strata-600"
      >
        {children}
      </Link>
    ),
  },
  types: {
    figure: ({ value }) => {
      if (!value?.asset?._ref) return null;
      const { width, height } = dimsFromRef(value.asset._ref);
      return (
        <figure className="pt-2">
          <Image
            src={urlFor(value).width(1600).auto("format").url()}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 60rem, 100vw"
          />
          {value.caption ? (
            <figcaption className="meta-line mt-3 text-strata-700">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    pullQuote: ({ value }) => (
      <div className="py-6">
        <QuoteBlock quote={value} variant="editorial" />
      </div>
    ),
    statGroup: ({ value }) => (
      <dl className="grid gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {(value?.stats ?? []).map(
          (s: { _key?: string; value?: string; label?: string }) => (
            <div key={s._key ?? s.label} className="border-t-2 border-accent pt-4">
              <dd className="font-display text-4xl font-bold tabular-nums text-strata-900">
                {s.value}
              </dd>
              <dt className="mt-2 text-sm text-strata-700">{s.label}</dt>
            </div>
          ),
        )}
      </dl>
    ),
  },
};

export function Prose({ value }: { value: unknown }) {
  if (!value) return null;
  return (
    <div className="space-y-5">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
