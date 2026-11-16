"use server";

import { cookies } from "next/headers";
import {
  DEFAULT_PICKUP_LOCATION,
  isPickupLocation,
  type PickupLocation,
} from "@/lib/pickup-locations";

const PICKUP_LOCATION_COOKIE = "an-nazeer-pickup-location";

export async function getPickupLocation(): Promise<PickupLocation> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PICKUP_LOCATION_COOKIE)?.value;
  return isPickupLocation(value) ? value : DEFAULT_PICKUP_LOCATION;
}

export async function setPickupLocation(
  location: PickupLocation,
): Promise<void> {
  if (!isPickupLocation(location)) {
    throw new Error("Invalid pickup location.");
  }

  const cookieStore = await cookies();
  cookieStore.set(PICKUP_LOCATION_COOKIE, location, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
