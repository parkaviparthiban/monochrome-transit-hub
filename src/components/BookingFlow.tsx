import { useMemo, useState } from "react";
import { Trip, durationLabel } from "@/data/mockData";
import SeatMap from "./SeatMap";
import { Booking, genRef, saveBooking } from "@/lib/bookingStore";
import { toast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function BookingFlow({
  trip,
  passengers,
  date,
  onClose,
  onBooked,
}: {
  trip: Trip;
  passengers: number;
  date: string;
  onClose: () => void;
  onBooked: (b: Booking) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [seat, setSeat] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const taken = useMemo(() => {
    let h = 0;
    for (let i = 0; i < trip.id.length; i++) h = (h * 31 + trip.id.charCodeAt(i)) >>> 0;
    const out: string[] = [];
    const cols = trip.kind === "flight" ? ["A", "B", "C", "D", "E", "F"] : ["A", "B", "C", "D"];
    const rows = trip.kind === "flight" ? 12 : 10;
    for (let i = 0; i < 18; i++) {
      const r = ((h >> (i % 8)) % rows) + 1;
      const c = cols[(h >> i) % cols.length];
      out.push(`${r}${c}`);
    }
    return Array.from(new Set(out));
  }, [trip]);

  const total = trip.price * passengers;

  const submit = () => {
    if (!name.trim() || !email.includes("@")) {
      toast({ title: "Missing details", description: "Please enter a valid name and email." });
      return;
    }
    const b: Booking = {
      ref: genRef(),
      createdAt: Date.now(),
      trip,
      seat,
      passenger: { fullName: name.trim(), email: email.trim() },
      total,
      date,
    };
    saveBooking(b);
    onBooked(b);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <span className="eyebrow">§ 03 — Reservation</span>
          <button onClick={onClose} className="border border-foreground p-2 hover:bg-foreground hover:text-background"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center gap-6 mb-8 mono text-[11px] uppercase tracking-[0.2em]">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`flex items-center gap-2 ${step >= n ? "" : "text-muted-foreground"}`}>
              <span className={`w-6 h-6 border border-foreground inline-flex items-center justify-center ${step >= n ? "bg-foreground text-background" : ""}`}>{n}</span>
              {n === 1 ? "Seat" : n === 2 ? "Passenger" : "Confirmed"}
            </div>
          ))}
        </div>

        <div className="border border-foreground bg-card p-6 md:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="eyebrow mb-1">{trip.carrier}</div>
              <div className="display text-3xl">{trip.number}</div>
              <div className="mono text-[11px] uppercase tracking-[0.2em] mt-2">{trip.cabin}</div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="display text-4xl">{trip.depart}</div>
                <div className="mono text-[11px] uppercase tracking-[0.2em]">{trip.from}</div>
              </div>
              <div className="text-center mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {durationLabel(trip.durationMin)}<br />→
              </div>
              <div className="text-center">
                <div className="display text-4xl">{trip.arrive}</div>
                <div className="mono text-[11px] uppercase tracking-[0.2em]">{trip.to}</div>
              </div>
            </div>
            <div className="md:text-right">
              <div className="eyebrow mb-1">Total · {passengers} pax</div>
              <div className="display text-4xl">₹{total.toLocaleString("en-IN")}</div>
              <div className="mono text-[11px] uppercase tracking-[0.2em] mt-2">{date}</div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <SeatMap kind={trip.kind} taken={taken} value={seat} onChange={setSeat} />
            <div className="flex justify-between items-center">
              <div className="mono text-xs uppercase tracking-[0.2em]">Selected: {seat || "—"}</div>
              <button disabled={!seat} onClick={() => setStep(2)} className="btn-ink">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 max-w-xl">
            <div>
              <label className="label-tiny">Full Name</label>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wright" />
            </div>
            <div>
              <label className="label-tiny">Email</label>
              <input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </div>
            <div>
              <label className="label-tiny">Card (demo — not charged)</label>
              <input className="field" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-outline-ink">Back</button>
              <button onClick={submit} className="btn-ink">Confirm Booking</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ticket p-8 md:p-12 text-center">
            <Check className="w-12 h-12 mx-auto mb-4" />
            <div className="display text-5xl mb-2">Booked.</div>
            <div className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Confirmation sent to {email}</div>
            <div className="ticket-perforation h-px my-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div><div className="eyebrow">Reference</div><div className="display text-2xl">{(window as any).__lastRef || ""}</div></div>
              <div><div className="eyebrow">Seat</div><div className="display text-2xl">{seat}</div></div>
              <div><div className="eyebrow">Passenger</div><div className="display text-xl">{name}</div></div>
              <div><div className="eyebrow">Total</div><div className="display text-2xl">₹{total.toLocaleString("en-IN")}</div></div>
            </div>
            <button onClick={onClose} className="btn-ink mt-8">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
