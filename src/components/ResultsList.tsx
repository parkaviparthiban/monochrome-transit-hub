import { useMemo, useState } from "react";
import { Trip, durationLabel } from "@/data/mockData";
import { ArrowRight, Plane, TrainFront, Wifi, Zap, Coffee, Tv, Bed, Bike, Volume2, Utensils } from "lucide-react";

const iconFor = (a: string) => {
  const map: Record<string, any> = {
    "Wi-Fi": Wifi, Power: Zap, "Café Car": Coffee, Entertainment: Tv,
    "Lie-flat": Bed, "Bike Storage": Bike, "Quiet Zone": Volume2, Meal: Utensils,
  };
  const Icon = map[a];
  return Icon ? <Icon className="w-3 h-3" /> : null;
};

export default function ResultsList({
  trips,
  onSelect,
  passengers,
}: {
  trips: Trip[];
  onSelect: (t: Trip) => void;
  passengers: number;
}) {
  const [sort, setSort] = useState<"depart" | "price" | "duration">("depart");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [stops, setStops] = useState<"any" | "0">("any");

  const sorted = useMemo(() => {
    let list = [...trips];
    if (stops === "0") list = list.filter((t) => t.stops === 0);
    if (maxPrice > 0) list = list.filter((t) => t.price <= maxPrice);
    list.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return a.durationMin - b.durationMin;
      return a.depart.localeCompare(b.depart);
    });
    return list;
  }, [trips, sort, maxPrice, stops]);

  const ceiling = useMemo(() => Math.max(...trips.map((t) => t.price), 0), [trips]);

  return (
    <section className="border-b border-foreground">
      <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="eyebrow">§ 02 — Departures · {sorted.length} of {trips.length}</span>
          <div className="flex items-center gap-4 mono text-[11px] uppercase tracking-[0.18em]">
            <label className="flex items-center gap-2">
              Sort
              <select className="bg-transparent border-b border-foreground px-1 py-0.5" value={sort} onChange={(e) => setSort(e.target.value as any)}>
                <option value="depart">Departure</option>
                <option value="price">Price</option>
                <option value="duration">Duration</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              Stops
              <select className="bg-transparent border-b border-foreground px-1 py-0.5" value={stops} onChange={(e) => setStops(e.target.value as any)}>
                <option value="any">Any</option>
                <option value="0">Direct</option>
              </select>
            </label>
            {ceiling > 0 && (
              <label className="hidden md:flex items-center gap-2">
                Max ₹{(maxPrice || ceiling).toLocaleString("en-IN")}
                <input type="range" min={50} max={ceiling} value={maxPrice || ceiling} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-foreground w-32" />
              </label>
            )}
          </div>
        </div>

        <div className="rule mb-0" />
        {sorted.length === 0 && (
          <div className="py-20 text-center display text-3xl italic text-muted-foreground">No departures match.</div>
        )}
        <ul>
          {sorted.map((t) => (
            <li key={t.id} className="border-b border-foreground py-6 grid grid-cols-12 gap-4 items-center group">
              <div className="col-span-12 md:col-span-2 flex items-center gap-3">
                {t.kind === "flight" ? <Plane className="w-5 h-5" /> : <TrainFront className="w-5 h-5" />}
                <div>
                  <div className="display text-xl leading-none">{t.carrier}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{t.number}{t.aircraft ? ` · ${t.aircraft}` : ""}</div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                <div className="text-right">
                  <div className="display text-3xl leading-none">{t.depart}</div>
                  <div className="mono text-[11px] uppercase tracking-[0.2em] mt-1">{t.from}</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{durationLabel(t.durationMin)}</div>
                  <div className="w-full h-px bg-foreground my-2 relative">
                    <span className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-foreground" />
                    <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-foreground" />
                  </div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t.stops === 0 ? "Direct" : `${t.stops} stop`}</div>
                </div>
                <div>
                  <div className="display text-3xl leading-none">{t.arrive}</div>
                  <div className="mono text-[11px] uppercase tracking-[0.2em] mt-1">{t.to}</div>
                </div>
              </div>

              <div className="col-span-6 md:col-span-2 flex flex-wrap gap-2">
                {t.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 border border-border px-2 py-0.5 mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {iconFor(a)} {a}
                  </span>
                ))}
              </div>

              <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="display text-3xl leading-none">₹{t.price.toLocaleString("en-IN")}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{t.cabin} · per pax</div>
                </div>
                <button onClick={() => onSelect(t)} className="btn-ink">
                  Select <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {sorted.length > 0 && (
          <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-4">
            Showing fares for {passengers} passenger{passengers > 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </section>
  );
}
