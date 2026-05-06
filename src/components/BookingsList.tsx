import { useEffect, useState } from "react";
import { Booking, cancelBooking, getBookings } from "@/lib/bookingStore";
import { durationLabel } from "@/data/mockData";
import { Plane, TrainFront, Trash2 } from "lucide-react";

export default function BookingsList() {
  const [list, setList] = useState<Booking[]>([]);
  useEffect(() => {
    const refresh = () => setList(getBookings());
    refresh();
    window.addEventListener("bookings:update", refresh);
    return () => window.removeEventListener("bookings:update", refresh);
  }, []);

  return (
    <section id="bookings" className="border-b border-foreground">
      <div className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">§ 04 — My Trips</span>
            <h2 className="display text-5xl md:text-6xl mt-2">Reservations <span className="italic text-muted-foreground">on file</span></h2>
          </div>
          <span className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{list.length} record{list.length === 1 ? "" : "s"}</span>
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-foreground py-20 text-center">
            <div className="display text-3xl italic text-muted-foreground">No reservations yet.</div>
            <div className="mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Book a trip above.</div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((b) => (
              <li key={b.ref} className="ticket p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {b.trip.kind === "flight" ? <Plane className="w-4 h-4" /> : <TrainFront className="w-4 h-4" />}
                    <span className="mono text-[10px] uppercase tracking-[0.2em]">{b.trip.carrier} · {b.trip.number}</span>
                  </div>
                  <button onClick={() => cancelBooking(b.ref)} className="text-muted-foreground hover:text-foreground" aria-label="cancel">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="display text-3xl leading-none">{b.trip.depart}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] mt-1">{b.trip.from}</div>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground pb-1">{durationLabel(b.trip.durationMin)} →</div>
                  <div className="text-right">
                    <div className="display text-3xl leading-none">{b.trip.arrive}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.2em] mt-1">{b.trip.to}</div>
                  </div>
                </div>
                <div className="ticket-perforation h-px my-4" />
                <div className="grid grid-cols-4 gap-3 text-left">
                  <div><div className="eyebrow">Ref</div><div className="display text-lg">{b.ref}</div></div>
                  <div><div className="eyebrow">Seat</div><div className="display text-lg">{b.seat}</div></div>
                  <div><div className="eyebrow">Date</div><div className="mono text-xs mt-1">{b.date}</div></div>
                  <div className="text-right"><div className="eyebrow">Paid</div><div className="display text-lg">₹{b.total.toLocaleString("en-IN")}</div></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
