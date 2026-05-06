export type Airport = { code: string; city: string; name: string };
export type Station = { code: string; city: string; name: string };

export const airports: Airport[] = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi Intl" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda Intl" },
  { code: "MAA", city: "Chennai", name: "Chennai Intl" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi Intl" },
  { code: "COK", city: "Kochi", name: "Cochin Intl" },
  { code: "GOI", city: "Goa", name: "Dabolim" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel" },
  { code: "PNQ", city: "Pune", name: "Pune Intl" },
  { code: "JAI", city: "Jaipur", name: "Jaipur Intl" },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh" },
  { code: "IXC", city: "Chandigarh", name: "Chandigarh Intl" },
  { code: "SXR", city: "Srinagar", name: "Sheikh ul-Alam Intl" },
  { code: "GAU", city: "Guwahati", name: "Lokpriya Gopinath Bordoloi" },
];

export const stations: Station[] = [
  { code: "NDLS", city: "New Delhi", name: "New Delhi Railway Station" },
  { code: "CSMT", city: "Mumbai", name: "Chhatrapati Shivaji Terminus" },
  { code: "MAS", city: "Chennai", name: "Chennai Central" },
  { code: "HWH", city: "Kolkata", name: "Howrah Junction" },
  { code: "SBC", city: "Bengaluru", name: "KSR Bengaluru" },
  { code: "SC", city: "Hyderabad", name: "Secunderabad Junction" },
  { code: "PUNE", city: "Pune", name: "Pune Junction" },
  { code: "ADI", city: "Ahmedabad", name: "Ahmedabad Junction" },
  { code: "JP", city: "Jaipur", name: "Jaipur Junction" },
  { code: "LKO", city: "Lucknow", name: "Lucknow Charbagh" },
  { code: "BPL", city: "Bhopal", name: "Bhopal Junction" },
  { code: "BBS", city: "Bhubaneswar", name: "Bhubaneswar" },
  { code: "TVC", city: "Trivandrum", name: "Thiruvananthapuram Central" },
  { code: "ERS", city: "Kochi", name: "Ernakulam Junction" },
  { code: "CDG", city: "Chandigarh", name: "Chandigarh Junction" },
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
    { name: "IndiGo", prefix: "6E", craft: "Airbus A320neo" },
    { name: "Air India", prefix: "AI", craft: "Boeing 787" },
    { name: "Vistara", prefix: "UK", craft: "Airbus A321neo" },
    { name: "SpiceJet", prefix: "SG", craft: "Boeing 737 MAX" },
    { name: "Akasa Air", prefix: "QP", craft: "Boeing 737 MAX 8" },
    { name: "Air India Express", prefix: "IX", craft: "Boeing 737-800" },
  ],
  train: [
    { name: "Vande Bharat Express", prefix: "VB" },
    { name: "Rajdhani Express", prefix: "RJ" },
    { name: "Shatabdi Express", prefix: "SH" },
    { name: "Duronto Express", prefix: "DR" },
    { name: "Tejas Express", prefix: "TJ" },
    { name: "Garib Rath", prefix: "GR" },
  ],
};

const flightAmenities = ["Wi-Fi", "Power", "Meal", "Entertainment", "Extra Legroom"];
const trainAmenities = ["Wi-Fi", "Charging Point", "Pantry Car", "Bedroll", "AC Coach"];

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
    const departMin = 4 * 60 + ((seed * 17) % (18 * 60));
    const baseDur = kind === "flight" ? 75 + ((seed * 11) % 240) : 240 + ((seed * 13) % 1320);
    const arriveMin = departMin + baseDur;
    const stops = kind === "flight" ? (seed % 5 === 0 ? 1 : 0) : 0;
    const cabinList: Trip["cabin"][] =
      kind === "flight" ? ["Economy", "Business", "First"] : ["Standard", "Premium"];
    const cabin = pick(cabinList, seed);
    const cabinMult = cabin === "Economy" || cabin === "Standard" ? 1 : cabin === "Premium" || cabin === "Business" ? 2.6 : 4.5;
    const basePrice = kind === "flight" ? 2800 + (baseDur / 60) * 1400 + (seed % 1500) : 450 + (baseDur / 60) * 90 + (seed % 400);
    const price = Math.round(basePrice * cabinMult);
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
