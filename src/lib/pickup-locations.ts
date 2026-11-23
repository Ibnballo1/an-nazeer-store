export const PICKUP_LOCATIONS = ["ALAGBADO", "OGBA"] as const;

export type PickupLocation = (typeof PICKUP_LOCATIONS)[number];

export const DEFAULT_PICKUP_LOCATION: PickupLocation = "ALAGBADO";

export const PICKUP_LOCATION_DETAILS: Record<
  PickupLocation,
  { label: string; address: string }
> = {
  ALAGBADO: {
    label: "Alagbado",
    address:
      "Shop 664, Adura Bustop, Abeokuta Express Way, Beside Heyden Filling Station, Lagos.",
  },
  OGBA: {
    label: "Ogba",
    address: "No. 1, Dada Street off Moyo agoro off Ifakojaiye Ogba, Lagos",
  },
};

export function isPickupLocation(value: unknown): value is PickupLocation {
  return PICKUP_LOCATIONS.includes(value as PickupLocation);
}

export function getProductPriceForLocation(
  product: {
    price: string | number;
    alagbadoPrice?: string | number | null;
    ogbaPrice?: string | number | null;
  },
  location: PickupLocation,
): number {
  const locationPrice =
    location === "OGBA" ? product.ogbaPrice : product.alagbadoPrice;
  return Number(locationPrice ?? product.price);
}
