const items = [
  { city: "Tokyo", code: "HND", note: "Neon & quiet temples", from: 612 },
  { city: "Paris", code: "CDG", note: "Light, of course", from: 248 },
  { city: "Zürich", code: "ZUR", note: "Alpine arrival", from: 132 },
  { city: "New York", code: "JFK", note: "The skyline rule", from: 320 },
  { city: "Singapore", code: "SIN", note: "Equatorial precision", from: 740 },
  { city: "Rome", code: "ROM", note: "By rail, slowly", from: 89 },
];

export default function Destinations() {
  return (
    <section id="destinations" className="border-b border-foreground">
      <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow">§ 05 — Index</span>
            <h2 className="display text-5xl md:text-6xl mt-2">Selected <span className="italic">destinations</span></h2>
          </div>
          <p className="hidden md:block max-w-sm text-sm text-muted-foreground">A curated index of cities reached by air and by rail. Fares typical, in USD.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-border">
          {items.map((it) => (
            <article key={it.code} className="border-r border-b border-border p-8 group hover:bg-foreground hover:text-background transition-colors">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-background/70">{it.code}</div>
              <h3 className="display text-4xl mt-2">{it.city}</h3>
              <p className="italic display text-base mt-2 text-muted-foreground group-hover:text-background/70">{it.note}</p>
              <div className="rule-soft my-6 group-hover:border-background/30" />
              <div className="flex items-end justify-between">
                <span className="mono text-[10px] uppercase tracking-[0.2em]">From</span>
                <span className="display text-3xl">${it.from}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
