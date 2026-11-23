import { z } from "zod";

export const shippingSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Valid email required",
    }),
  phone: z.string().trim().min(10, "Valid phone number is required"),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

export const guestCheckoutSchema = shippingSchema;

export type ShippingInput = z.input<typeof shippingSchema>;
export type ShippingOutput = z.output<typeof shippingSchema>;
