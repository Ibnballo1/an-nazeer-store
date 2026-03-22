import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Nigerian Naira */
export function formatNaira(amount: number | string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/** Generate a unique order number — ANH-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ANH-${y}${m}${d}-${rand}`;
}

/** Generate a Paystack reference */
export function generatePaystackRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ANH-${ts}-${rand}`;
}

/** Convert NGN to kobo for Paystack */
export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** Convert kobo back to NGN */
export function fromKobo(kobo: number): number {
  return kobo / 100;
}

/** Calculate shipping fee based on state */
export function calculateShippingFee(state: string): number {
  const freeStates = ["Lagos"];
  const nearbyStates = ["Ogun", "Oyo", "Osun", "Ekiti", "Ondo"];

  const normalised = state.trim();

  if (freeStates.includes(normalised)) return 0;
  if (nearbyStates.includes(normalised)) return 1500;
  return 2500; // nationwide flat rate
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate text */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}
