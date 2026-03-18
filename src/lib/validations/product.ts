import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name required"),
  categoryId: z.string().uuid().optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  images: z.array(z.string().url()).default([]),
  thumbnailUrl: z.string().url().optional(),
  benefits: z.array(z.string()).default([]),
  ingredients: z.string().optional(),
  usage: z.string().optional(),
  weight: z.number().positive().optional(),
  unit: z.string().optional(),
  nafdacNumber: z.string().optional(),
  isCertified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(["active", "draft", "archived"]).default("draft"),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
