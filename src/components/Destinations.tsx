const items = [
  { city: "Jaipur", code: "JAI", note: "The pink city, by air or rail", from: 2499 },
  { city: "Goa", code: "GOI", note: "Coastline & quiet mornings", from: 3299 },
  { city: "Varanasi", code: "VNS", note: "Ghats at first light", from: 3899 },
  { city: "Srinagar", code: "SXR", note: "Dal Lake, in winter", from: 5499 },
  { city: "Kochi", code: "COK", note: "Backwaters, slowly", from: 4299 },
  { city: "Darjeeling", code: "DJL", note: "Tea & toy trains", from: 1899 },
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
                <span className="display text-3xl">₹{it.from.toLocaleString("en-IN")}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
