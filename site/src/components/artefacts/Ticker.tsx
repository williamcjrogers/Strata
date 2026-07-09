import { Fragment, type CSSProperties } from "react";

/*
  Keyword marquee. The track holds the items twice; the duplicate is
  aria-hidden and the CSS loop travels -50% for a seamless join. With
  reduced motion (or no JS state at all: the animation is pure CSS)
  the first copy simply sits as a static row.
*/
export function Ticker({
  items,
  tone = "light",
  speed = 40,
}: {
  items: string[];
  tone?: "light" | "dark";
  speed?: number;
}) {
  const dark = tone === "dark";
  const row = (hidden: boolean) => (
    <span
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <Fragment key={item}>
          <span className="px-5">{item}</span>
          <span
            aria-hidden="true"
            className={dark ? "text-strata-600" : "text-strata-300"}
          >
            /
          </span>
        </Fragment>
      ))}
    </span>
  );

  return (
    <div
      className={`overflow-clip border-y ${
        dark
          ? "border-strata-800 bg-panel text-strata-300"
          : "border-line bg-paper text-strata-600"
      }`}
    >
      <div
        className="ticker-track flex w-max py-3.5 type-mono"
        style={{ "--ticker-speed": `${speed}s` } as CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
