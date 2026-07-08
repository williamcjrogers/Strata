export type QuoteData = {
  text?: string | null;
  attributionName?: string | null;
  attributionRole?: string | null;
} | null;

export function QuoteBlock({
  quote,
  variant = "band",
}: {
  quote: QuoteData;
  variant?: "band" | "editorial";
}) {
  if (!quote?.text) return null;

  const figure = (
    <figure className="relative max-w-3xl">
      <span
        aria-hidden="true"
        className={`absolute -left-2 -top-10 select-none font-display text-[7rem] leading-none ${
          variant === "band" ? "text-strata-200/60" : "text-strata-200"
        }`}
      >
        &ldquo;
      </span>
      <blockquote className="type-h3 relative">{quote.text}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 text-sm">
        <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-accent" />
        <span>
          <strong className="font-semibold">{quote.attributionName}</strong>
          {quote.attributionRole ? (
            <span className="text-strata-700">, {quote.attributionRole}</span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );

  if (variant === "editorial") return figure;

  return (
    <section className="bg-mist py-section-sm">
      <div className="mx-auto w-full max-w-7xl px-gutter">{figure}</div>
    </section>
  );
}
