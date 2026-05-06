const rows = [
  ["07:15", "MA204", "JFK → LHR", "Boarding", "A12"],
  ["08:02", "CR118", "PAR → AMS", "On Time", "—"],
  ["08:45", "NL339", "CDG → FRA", "Delayed 12m", "B07"],
  ["09:10", "VL422", "ZUR → MIL", "On Time", "—"],
  ["09:55", "AS601", "DXB → SIN", "On Time", "C03"],
  ["10:30", "IL280", "BER → VIE", "On Time", "—"],
  ["11:15", "PS118", "SFO → HND", "Boarding", "G21"],
];

export default function Schedule() {
  return (
    <section id="schedule" className="border-b border-foreground bg-foreground text-background">
      <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-background/60">§ 06 — Departures Board</span>
            <h2 className="display text-5xl md:text-6xl mt-2">Today, <span className="italic">live</span></h2>
          </div>
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-background/60">Refreshed continuously</span>
        </div>
        <div className="border-t border-background">
          <div className="grid grid-cols-12 mono text-[10px] uppercase tracking-[0.2em] py-3 border-b border-background/30">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Service</div>
            <div className="col-span-5">Route</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Gate</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-12 py-4 border-b border-background/20 items-baseline">
              <div className="col-span-2 display text-2xl">{r[0]}</div>
              <div className="col-span-2 mono text-xs">{r[1]}</div>
              <div className="col-span-5 display text-xl">{r[2]}</div>
              <div className="col-span-2 mono text-[11px] uppercase tracking-[0.18em]">{r[3]}</div>
              <div className="col-span-1 text-right mono text-sm">{r[4]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
