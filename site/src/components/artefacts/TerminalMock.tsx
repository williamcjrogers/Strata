import type { TerminalLine } from "./presets";

/*
  CLI panel dressed as the in-house engine. Entirely illustrative, so
  the whole artefact is decorative; the adjacent section copy carries
  the actual message.
*/
const LINE_STYLE: Record<TerminalLine["kind"], string> = {
  cmd: "text-strata-100",
  out: "text-strata-300",
  ok: "text-strata-400",
  note: "text-strata-400",
};

export function TerminalMock({
  title = "strata://engine",
  lines,
  showCaret = true,
}: {
  title?: string;
  lines: TerminalLine[];
  showCaret?: boolean;
}) {
  return (
    <div aria-hidden="true" className="surface-panel scanlines text-paper">
      <div className="flex items-center gap-3 border-b border-panel-line px-5 py-3">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="inline-block h-2 w-2 rounded-full border border-strata-600"
            />
          ))}
        </span>
        <span className="type-mono text-strata-400">{title}</span>
      </div>
      <div className="space-y-2 p-5 font-mono text-xs leading-relaxed sm:p-6 sm:text-sm">
        {lines.map((line, i) => (
          <p key={i} data-reveal className={LINE_STYLE[line.kind]}>
            {line.kind === "cmd" ? (
              <span className="mr-2 text-strata-400">$</span>
            ) : line.kind === "ok" ? (
              <span className="mr-2">OK</span>
            ) : (
              <span className="mr-2 text-strata-400">&gt;</span>
            )}
            {line.text}
          </p>
        ))}
        {showCaret ? (
          <p className="text-strata-300">
            <span className="mr-2 text-strata-400">$</span>
            <span className="terminal-caret inline-block h-4 w-2 translate-y-0.5 bg-strata-300" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
