import { Fragment, useMemo } from "react";

export default function SeatMap({
  kind,
  taken,
  value,
  onChange,
}: {
  kind: "flight" | "train";
  taken: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  const rows = kind === "flight" ? 12 : 10;
  const cols = kind === "flight" ? ["A", "B", "C", "D", "E", "F"] : ["A", "B", "C", "D"];
  const aisleAfter = kind === "flight" ? 2 : 1;

  const gridCols = `auto repeat(${cols.length + 1}, minmax(28px, 1fr))`;

  const headerCells = useMemo(() => {
    const arr: JSX.Element[] = [];
    cols.forEach((c, i) => {
      arr.push(<div key={`h-${c}`} className="text-center mono text-[10px] uppercase">{c}</div>);
      if (i === aisleAfter) arr.push(<div key={`h-aisle-${c}`} />);
    });
    return arr;
  }, [cols, aisleAfter]);

  return (
    <div>
      <div className="flex items-center gap-4 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 flex-wrap">
        <span className="flex items-center gap-2"><span className="w-3 h-3 border border-foreground inline-block" /> Available</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-foreground inline-block" /> Selected</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-muted border border-border inline-block" /> Taken</span>
      </div>
      <div className="border border-foreground p-4 inline-block bg-paper overflow-x-auto max-w-full">
        <div className="text-center mono text-[10px] uppercase tracking-[0.2em] mb-2">{kind === "flight" ? "Cabin" : "Carriage"}</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: gridCols }}>
          <div />
          {headerCells}
          {Array.from({ length: rows }, (_, r) => r + 1).map((row) => (
            <Fragment key={`row-${row}`}>
              <div className="mono text-[10px] flex items-center justify-end pr-2">{row}</div>
              {cols.map((c, i) => {
                const id = `${row}${c}`;
                const isTaken = taken.includes(id);
                const isSel = value === id;
                return (
                  <Fragment key={`cell-${id}`}>
                    <button
                      disabled={isTaken}
                      onClick={() => onChange(id)}
                      className={`w-7 h-7 border text-[9px] mono transition-colors ${
                        isTaken
                          ? "bg-muted border-border text-muted-foreground cursor-not-allowed"
                          : isSel
                            ? "bg-foreground text-background border-foreground"
                            : "border-foreground hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {id}
                    </button>
                    {i === aisleAfter && <div />}
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
