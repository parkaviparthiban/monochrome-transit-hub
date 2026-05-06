import { Trip } from "@/data/mockData";

export type Passenger = { fullName: string; email: string };
export type Booking = {
  ref: string;
  createdAt: number;
  trip: Trip;
  seat: string;
  passenger: Passenger;
  total: number;
  date: string;
};

const KEY = "bookings.v1";

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBooking(b: Booking) {
  const all = getBookings();
  all.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("bookings:update"));
}

export function cancelBooking(ref: string) {
  const all = getBookings().filter((b) => b.ref !== ref);
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("bookings:update"));
}

export function genRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
