import { z } from "zod";

export const shippingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("Nigeria").optional(),
});

export const guestCheckoutSchema = shippingSchema;

export type ShippingInput = z.infer<typeof shippingSchema>;
