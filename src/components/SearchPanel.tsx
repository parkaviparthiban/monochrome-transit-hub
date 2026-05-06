import { useMemo, useState } from "react";
import { airports, stations } from "@/data/mockData";
import { ArrowRight, ArrowUpDown, Plane, TrainFront } from "lucide-react";

export type SearchQuery = {
  kind: "flight" | "train";
  from: string;
  to: string;
  date: string;
  passengers: number;
  cabin: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export default function SearchPanel({ onSearch }: { onSearch: (q: SearchQuery) => void }) {
  const [kind, setKind] = useState<"flight" | "train">("flight");
  const list = kind === "flight" ? airports : stations;
  const [from, setFrom] = useState(list[0].code);
  const [to, setTo] = useState(list[1].code);
  const [date, setDate] = useState(today());
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState(kind === "flight" ? "Economy" : "Standard");

  const options = useMemo(() => list, [list]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const switchKind = (k: "flight" | "train") => {
    setKind(k);
    const l = k === "flight" ? airports : stations;
    setFrom(l[0].code);
    setTo(l[1].code);
    setCabin(k === "flight" ? "Economy" : "Standard");
  };

  return (
    <section id="search" className="border-t border-b border-foreground bg-paper">
      <div className="px-6 md:px-10 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="eyebrow">§ 01 — Reservations</span>
          <div className="flex border border-foreground">
            <button
              onClick={() => switchKind("flight")}
              className={`flex items-center gap-2 px-5 py-2 mono text-xs uppercase tracking-[0.18em] ${kind === "flight" ? "bg-foreground text-background" : ""}`}
            >
              <Plane className="w-3.5 h-3.5" /> Air
            </button>
            <button
              onClick={() => switchKind("train")}
              className={`flex items-center gap-2 px-5 py-2 mono text-xs uppercase tracking-[0.18em] border-l border-foreground ${kind === "train" ? "bg-foreground text-background" : ""}`}
            >
              <TrainFront className="w-3.5 h-3.5" /> Rail
            </button>
          </div>
        </div>

        <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-10 max-w-4xl">
          Where to,<br />
          <span className="italic text-muted-foreground">today?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="md:col-span-4">
            <label className="label-tiny">From</label>
            <select className="field" value={from} onChange={(e) => setFrom(e.target.value)}>
              {options.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.city} ({o.code}) — {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex md:justify-center">
            <button onClick={swap} aria-label="swap" className="border border-foreground p-2 hover:bg-foreground hover:text-background transition-colors">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-4">
            <label className="label-tiny">To</label>
            <select className="field" value={to} onChange={(e) => setTo(e.target.value)}>
              {options.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.city} ({o.code}) — {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="label-tiny">Departure</label>
            <input type="date" className="field" value={date} min={today()} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="md:col-span-3">
            <label className="label-tiny">Passengers</label>
            <input
              type="number"
              min={1}
              max={9}
              className="field"
              value={passengers}
              onChange={(e) => setPassengers(Math.max(1, Math.min(9, +e.target.value || 1)))}
            />
          </div>

          <div className="md:col-span-3">
            <label className="label-tiny">Class</label>
            <select className="field" value={cabin} onChange={(e) => setCabin(e.target.value)}>
              {(kind === "flight" ? ["Economy", "Business", "First"] : ["Standard", "Premium"]).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex md:justify-end">
            <button
              onClick={() => onSearch({ kind, from, to, date, passengers, cabin })}
              disabled={from === to}
              className="btn-ink w-full md:w-auto"
            >
              Search <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
