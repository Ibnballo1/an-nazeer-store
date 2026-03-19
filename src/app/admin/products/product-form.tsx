"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Product, Category } from "@/db/schema";

type Props = {
  product?: Product | null;
  categories: Category[];
};

export function ProductForm({ product, categories }: Props) {
  const router = useRouter();

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          categoryId: product.categoryId ?? undefined,
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          price: Number(product.price),
          comparePrice: product.comparePrice
            ? Number(product.comparePrice)
            : undefined,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          trackInventory: product.trackInventory,
          allowBackorder: product.allowBackorder,
          unit: product.unit ?? "",
          nafdacNumber: product.nafdacNumber ?? "",
          isCertified: product.isCertified,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          status: product.status,
          ingredients: product.ingredients ?? "",
          usage: product.usage ?? "",
        }
      : {
          name: "",
          price: 0,
          stock: 0,
          status: "draft",
          isCertified: false,
          isFeatured: false,
          isBestSeller: false,
          trackInventory: true,
          allowBackorder: false,
          lowStockThreshold: 5,
          images: [],
          benefits: [],
        },
  });

  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: ProductInput) {
    const result = product
      ? await updateProduct(product.id, values)
      : await createProduct(values);

    if (result.success) {
      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error("Save failed. " + result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm mb-2">Basic Information</h2>

        <div className="space-y-1.5">
          <Label>Product name *</Label>
          <Input
            placeholder="Gorontula Premium Syrup"
            {...form.register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            {...form.register("categoryId")}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Short description</Label>
          <Input
            placeholder="Brief product summary (max 500 chars)"
            {...form.register("shortDescription")}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Full description</Label>
          <Textarea
            rows={5}
            className="rounded-xl resize-none"
            {...form.register("description")}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm mb-2">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Price (₦) *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="5500"
              {...form.register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Compare price (₦)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="7000"
              {...form.register("comparePrice", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Unit / Size</Label>
          <Input
            placeholder="e.g. 250ml, 60 capsules, 500g"
            {...form.register("unit")}
          />
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm mb-2">Inventory</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Stock quantity *</Label>
            <Input
              type="number"
              {...form.register("stock", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Low stock alert at</Label>
            <Input
              type="number"
              {...form.register("lowStockThreshold", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              {...form.register("trackInventory")}
            />
            Track inventory
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              {...form.register("allowBackorder")}
            />
            Allow backorders
          </label>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm mb-2">Product Details</h2>
        <div className="space-y-1.5">
          <Label>Ingredients</Label>
          <Textarea
            rows={3}
            className="rounded-xl resize-none"
            {...form.register("ingredients")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>How to use</Label>
          <Textarea
            rows={3}
            className="rounded-xl resize-none"
            {...form.register("usage")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>NAFDAC Number</Label>
          <Input
            placeholder="NAFDAC/2024/001"
            {...form.register("nafdacNumber")}
          />
        </div>
      </div>

      {/* Flags */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-sm mb-4">Flags & Status</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { field: "isFeatured", label: "Featured on homepage" },
            { field: "isBestSeller", label: "Mark as bestseller" },
            { field: "isCertified", label: "NAFDAC certified" },
          ].map(({ field, label }) => (
            <label
              key={field}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded"
                {...form.register(field as keyof ProductInput)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            {...form.register("status")}
          >
            <option value="draft">Draft</option>
            <option value="active">Active (visible in store)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : product ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
