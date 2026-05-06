export default function Hero({ onScroll }: { onScroll: () => void }) {
  return (
    <section id="top" className="border-b border-foreground">
      <div className="px-6 md:px-10 pt-12 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mono text-[10px] uppercase tracking-[0.2em] mb-10">
          <span>Vol. I</span>
          <span>Air · Rail · India</span>
          <span>Issue 06.05.26</span>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <h1 className="display text-[14vw] md:text-[10rem] leading-[0.85] tracking-tighter">
              Quiet<br />
              <span className="italic">travel,</span><br />
              precisely
              <span className="text-muted-foreground"> booked.</span>
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:border-l md:border-foreground md:pl-6 flex flex-col justify-end">
            <p className="display text-2xl leading-snug mb-6">
              One ticket — across India, by sky and by rail. A reservation system designed in the manner of a printed timetable.
            </p>
            <button onClick={onScroll} className="btn-ink self-start">Begin</button>
          </div>
        </div>
      </div>
      <div className="border-t border-foreground overflow-hidden">
        <div className="flex marquee whitespace-nowrap py-3 mono text-[11px] uppercase tracking-[0.3em]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10 pr-10">
              {["DEL ↔ BOM · 06:15", "NDLS → LKO · 07:02", "BLR → DEL · 07:45", "HYD → MAA · 08:55", "GOI → BLR · 10:15", "JAI → AMD · 12:30", "MAS → SBC · 14:20"].map((s) => (
                <span key={s}>◆ {s}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
