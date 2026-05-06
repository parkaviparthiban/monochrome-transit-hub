import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchPanel, { SearchQuery } from "@/components/SearchPanel";
import ResultsList from "@/components/ResultsList";
import BookingFlow from "@/components/BookingFlow";
import BookingsList from "@/components/BookingsList";
import Destinations from "@/components/Destinations";
import Schedule from "@/components/Schedule";
import Footer from "@/components/Footer";
import { Trip, generateTrips } from "@/data/mockData";
import { Booking } from "@/lib/bookingStore";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [query, setQuery] = useState<SearchQuery | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [active, setActive] = useState<Trip | null>(null);

  const onSearch = (q: SearchQuery) => {
    const t = generateTrips(q.kind, q.from, q.to, q.date);
    setQuery(q);
    setTrips(t);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const onNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onBooked = (b: Booking) => {
    (window as any).__lastRef = b.ref;
    toast({ title: "Reservation confirmed", description: `Ref ${b.ref} · Seat ${b.seat}` });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNav={onNav} />
      <Hero onScroll={() => onNav("search")} />
      <SearchPanel onSearch={onSearch} />
      {query && (
        <div id="results">
          <ResultsList trips={trips} passengers={query.passengers} onSelect={(t) => setActive(t)} />
        </div>
      )}
      <Destinations />
      <Schedule />
      <BookingsList />
      <Footer />
      {active && query && (
        <BookingFlow
          trip={active}
          passengers={query.passengers}
          date={query.date}
          onClose={() => setActive(null)}
          onBooked={onBooked}
        />
      )}
    </div>
  );
};

export default Index;
