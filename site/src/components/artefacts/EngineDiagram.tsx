import { RefCode } from "./RefCode";
import type { EngineNode } from "./presets";

/*
  Process topology: bordered node boxes joined by dashed arrow
  connectors. Horizontal on large screens (stacked below), or always
  stacked with orientation="vertical". The step content is real (it
  describes how engagement works), so nodes stay visible to assistive
  tech; only the connector art is hidden.
*/
function Arrow({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 12" className="h-3 w-10 text-strata-500" fill="none">
        <line
          x1="0"
          y1="6"
          x2="30"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path d="M30 1.5 38 6l-8 4.5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function EngineDiagram({
  refCode = "SCC-SYS-01",
  nodes,
  orientation = "horizontal",
  tone = "dark",
}: {
  refCode?: string;
  nodes: EngineNode[];
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const horizontal = orientation === "horizontal";

  return (
    <div
      className={
        dark
          ? "surface-panel p-6 text-paper sm:p-8"
          : "border border-line bg-mist p-6 sm:p-8"
      }
    >
      <div className={`border-b pb-4 ${dark ? "border-panel-line" : "border-line"}`}>
        <RefCode code={refCode} suffix="PROCESS TOPOLOGY" tone={tone} />
      </div>
      <ol className={`mt-6 flex flex-col ${horizontal ? "lg:flex-row" : ""}`}>
        {nodes.map((node, i) => (
          <li
            key={node.code}
            className={`flex flex-col ${horizontal ? "lg:flex-1 lg:flex-row" : ""}`}
          >
            {i > 0 ? (
              <Arrow
                className={`py-2 [&>svg]:rotate-90 ${
                  horizontal ? "lg:px-1 lg:py-0 lg:[&>svg]:rotate-0" : ""
                }`}
              />
            ) : null}
            <div
              data-reveal
              data-artefact-node
              className={`flex-1 border p-4 ${
                dark ? "border-panel-line bg-panel-raised" : "border-line bg-paper"
              }`}
            >
              <p
                aria-hidden="true"
                className={`type-mono ${dark ? "text-strata-300" : "text-strata-600"}`}
              >
                PROC.{node.code}
              </p>
              <p className={`type-h3 mt-2 ${dark ? "text-paper" : "text-strata-900"}`}>
                {node.label}
              </p>
              {node.sub ? (
                <p
                  className={`type-mono mt-2 ${
                    dark ? "text-strata-300" : "text-strata-600"
                  }`}
                >
                  {node.sub}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
