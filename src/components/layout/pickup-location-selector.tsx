"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPickupLocation } from "@/lib/actions/pickup-location";
import {
  PICKUP_LOCATIONS,
  PICKUP_LOCATION_DETAILS,
  type PickupLocation,
} from "@/lib/pickup-locations";
import { MapPin } from "lucide-react";

export function PickupLocationSelector({
  initialLocation,
  onLocationChange,
  compact = false,
}: {
  initialLocation: PickupLocation;
  onLocationChange?: (location: PickupLocation) => void;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: PickupLocation) {
    if (onLocationChange) {
      onLocationChange(value);
    } else {
      startTransition(async () => {
        await setPickupLocation(value);
        router.refresh();
      });
    }
  }

  return (
    <label className="flex items-center gap-2 min-w-0">
      <MapPin className="h-4 w-4 shrink-0 text-brand-green" />
      {!compact && (
        <span className="hidden lg:inline text-xs text-muted-foreground whitespace-nowrap">
          Pickup:
        </span>
      )}
      <select
        aria-label="Choose pickup location"
        value={initialLocation}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as PickupLocation)}
        title={PICKUP_LOCATION_DETAILS[initialLocation].address}
        className="h-9 max-w-28 sm:max-w-32 rounded-lg border border-border bg-white px-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-60"
      >
        {PICKUP_LOCATIONS.map((option) => (
          <option key={option} value={option}>
            {PICKUP_LOCATION_DETAILS[option].label}
          </option>
        ))}
      </select>
    </label>
  );
}
