import { useEffect, useState } from "react";

export default function Header({ onNav }: { onNav: (id: string) => void }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + (5.5 * 60 - d.getTimezoneOffset()) * 60000);
      setTime(ist.toISOString().slice(11, 19) + " IST");
    };
    t();
    const i = setInterval(t, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <header className="border-b border-foreground bg-background sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 md:px-10 py-3 mono text-[10px] uppercase tracking-[0.2em]">
        <span>EST. 2026 · No. 001</span>
        <span className="hidden md:inline">India Edition · Air & Rail</span>
        <span>{time}</span>
      </div>
      <div className="border-t border-foreground">
        <div className="flex items-end justify-between px-6 md:px-10 py-5 gap-6">
          <button onClick={() => onNav("top")} className="display text-3xl md:text-5xl leading-none tracking-tighter">
            Bharat<span className="italic">Rail&amp;Air</span>
          </button>
          <nav className="hidden md:flex gap-8 mono text-[11px] uppercase tracking-[0.2em] pb-2">
            <button onClick={() => onNav("search")} className="hover:underline underline-offset-4">Book</button>
            <button onClick={() => onNav("destinations")} className="hover:underline underline-offset-4">Destinations</button>
            <button onClick={() => onNav("schedule")} className="hover:underline underline-offset-4">Schedule</button>
            <button onClick={() => onNav("bookings")} className="hover:underline underline-offset-4">My Trips</button>
          </nav>
        </div>
      </div>
    </header>
  );
}
