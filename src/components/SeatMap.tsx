import { useMemo, useState } from "react";

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

  const seats = useMemo(() => {
    const out: { row: number; col: string; id: string }[] = [];
    for (let r = 1; r <= rows; r++) for (const c of cols) out.push({ row: r, col: c, id: `${r}${c}` });
    return out;
  }, [rows, cols]);

  return (
    <div>
      <div className="flex items-center gap-4 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
        <span className="flex items-center gap-2"><span className="w-3 h-3 border border-foreground inline-block" /> Available</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-foreground inline-block" /> Selected</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 bg-muted border border-border inline-block" /> Taken</span>
      </div>
      <div className="border border-foreground p-4 inline-block bg-paper">
        <div className="text-center mono text-[10px] uppercase tracking-[0.2em] mb-2">{kind === "flight" ? "Cabin" : "Carriage"}</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${cols.length + 1}, minmax(28px, 1fr))` }}>
          <div />
          {cols.map((c, i) => (
            <>
              <div key={c} className="text-center mono text-[10px] uppercase">{c}</div>
              {i === aisleAfter && <div key={`a-${c}`} />}
            </>
          ))}
          {Array.from({ length: rows }, (_, r) => r + 1).map((row) => (
            <>
              <div key={`r-${row}`} className="mono text-[10px] flex items-center justify-end pr-2">{row}</div>
              {cols.map((c, i) => {
                const id = `${row}${c}`;
                const isTaken = taken.includes(id);
                const isSel = value === id;
                return (
                  <>
                    <button
                      key={id}
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
                    {i === aisleAfter && <div key={`a-${row}-${c}`} />}
                  </>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
