export type Airport = { code: string; city: string; name: string };
export type Station = { code: string; city: string; name: string };

export const airports: Airport[] = [
  { code: "JFK", city: "New York", name: "John F. Kennedy" },
  { code: "LHR", city: "London", name: "Heathrow" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "HND", city: "Tokyo", name: "Haneda" },
  { code: "DXB", city: "Dubai", name: "Dubai Intl" },
  { code: "SFO", city: "San Francisco", name: "SFO Intl" },
  { code: "SIN", city: "Singapore", name: "Changi" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt am Main" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith" },
];

export const stations: Station[] = [
  { code: "PAR", city: "Paris", name: "Gare du Nord" },
  { code: "LDN", city: "London", name: "St. Pancras" },
  { code: "BRU", city: "Brussels", name: "Bruxelles-Midi" },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Centraal" },
  { code: "BER", city: "Berlin", name: "Hauptbahnhof" },
  { code: "ROM", city: "Rome", name: "Roma Termini" },
  { code: "MAD", city: "Madrid", name: "Atocha" },
  { code: "ZUR", city: "Zürich", name: "Zürich HB" },
  { code: "VIE", city: "Vienna", name: "Wien Hbf" },
  { code: "MIL", city: "Milan", name: "Milano Centrale" },
];

export type Trip = {
  id: string;
  kind: "flight" | "train";
  carrier: string;
  number: string;
  from: string; // code
  to: string;
  depart: string; // HH:MM
  arrive: string;
  durationMin: number;
  price: number;
  cabin: "Economy" | "Business" | "First" | "Standard" | "Premium";
  stops: number;
  aircraft?: string;
  amenities: string[];
};

const carriers = {
  flight: [
    { name: "Meridian Air", prefix: "MA", craft: "Boeing 787" },
    { name: "Northline", prefix: "NL", craft: "Airbus A350" },
    { name: "Atlas Sky", prefix: "AS", craft: "Boeing 777" },
    { name: "Pole Star", prefix: "PS", craft: "Airbus A320neo" },
    { name: "Cardinal", prefix: "CD", craft: "Boeing 737 MAX" },
  ],
  train: [
    { name: "Continental Rail", prefix: "CR" },
    { name: "Northbound Express", prefix: "NX" },
    { name: "Iron Line", prefix: "IL" },
    { name: "Velocity", prefix: "VL" },
  ],
};

const flightAmenities = ["Wi-Fi", "Power", "Meal", "Entertainment", "Lie-flat"];
const trainAmenities = ["Wi-Fi", "Power", "Café Car", "Quiet Zone", "Bike Storage"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function pick<T>(arr: T[], seed: number) { return arr[seed % arr.length]; }
function fmtTime(mins: number) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTrips(
  kind: "flight" | "train",
  from: string,
  to: string,
  date: string
): Trip[] {
  if (!from || !to || from === to) return [];
  const seedBase = hash(`${kind}-${from}-${to}-${date}`);
  const list: Trip[] = [];
  const cs = carriers[kind];
  const count = 6 + (seedBase % 4);
  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 97;
    const c = pick(cs, seed);
    const departMin = 5 * 60 + ((seed * 17) % (16 * 60));
    const baseDur = kind === "flight" ? 90 + ((seed * 11) % 720) : 60 + ((seed * 13) % 480);
    const arriveMin = departMin + baseDur;
    const stops = kind === "flight" ? (seed % 5 === 0 ? 1 : 0) : 0;
    const cabinList: Trip["cabin"][] =
      kind === "flight" ? ["Economy", "Business", "First"] : ["Standard", "Premium"];
    const cabin = pick(cabinList, seed);
    const cabinMult = cabin === "Economy" || cabin === "Standard" ? 1 : cabin === "Premium" || cabin === "Business" ? 2.4 : 4.2;
    const price = Math.round((40 + (baseDur / 60) * 35 + (seed % 80)) * cabinMult);
    list.push({
      id: `${kind}-${c.prefix}${100 + i}-${from}-${to}-${date}`,
      kind,
      carrier: c.name,
      number: `${c.prefix}${100 + ((seed * 7) % 900)}`,
      from,
      to,
      depart: fmtTime(departMin),
      arrive: fmtTime(arriveMin),
      durationMin: baseDur,
      price,
      cabin,
      stops,
      aircraft: kind === "flight" ? (c as any).craft : undefined,
      amenities: (kind === "flight" ? flightAmenities : trainAmenities).filter(
        (_, idx) => (seed >> idx) & 1
      ),
    });
  }
  return list.sort((a, b) => a.depart.localeCompare(b.depart));
}

export function durationLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
