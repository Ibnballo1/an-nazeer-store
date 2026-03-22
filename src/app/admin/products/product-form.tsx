"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { uploadProductImageAction } from "@/lib/actions/upload";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import type { Product, Category } from "@/db/schema";

type Props = {
  product?: Product | null;
  categories: Category[];
};

export function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [imageUploading, setImageUploading] = useState(false);

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
          images: product.images ?? [],
          thumbnailUrl: product.thumbnailUrl ?? "",
          benefits: product.benefits ?? [],
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
          thumbnailUrl: "",
        },
  });

  const { isSubmitting, errors } = form.formState;

  // ── Image upload ───────────────────────────────────────────────────────────

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProductImageAction(formData);

    if (result.success) {
      const current = form.getValues("images") ?? [];
      form.setValue("images", [...current, result.data.url]);

      // First uploaded image automatically becomes the thumbnail
      if (!form.getValues("thumbnailUrl")) {
        form.setValue("thumbnailUrl", result.data.url);
      }

      toast.success("Image uploaded ✓");
    } else {
      toast.error("Upload failed" + result.error);
    }

    setImageUploading(false);
    e.target.value = ""; // allow re-selecting same file
  }

  function removeImage(urlToRemove: string) {
    const current = form.getValues("images") ?? [];
    const updated = current.filter((u) => u !== urlToRemove);
    const currentThumb = form.getValues("thumbnailUrl");

    form.setValue("images", updated);

    // If removed image was thumbnail, promote the next one
    if (currentThumb === urlToRemove) {
      form.setValue("thumbnailUrl", updated[0] ?? "");
    }
  }

  function setAsThumbnail(url: string) {
    form.setValue("thumbnailUrl", url);
    toast.success("Thumbnail updated ✓");
  }

  // ── Form submit ────────────────────────────────────────────────────────────

  async function onSubmit(values: ProductInput) {
    const result = product
      ? await updateProduct(product.id, values)
      : await createProduct(values);

    if (result.success) {
      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error("Save failed" + result.error);
    }
  }

  const watchedImages = form.watch("images") ?? [];
  const watchedThumb = form.watch("thumbnailUrl") ?? "";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Basic Info ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Basic Information</h2>

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
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      {/* ── Images ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Product Images</h2>

        {/* Image previews */}
        {watchedImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {watchedImages.map((url, i) => (
              <div
                key={i}
                className={`relative group rounded-xl overflow-hidden border-2 transition-colors ${
                  watchedThumb === url ? "border-brand-green" : "border-border"
                }`}
              >
                <div className="relative h-24 w-24">
                  <Image
                    src={url}
                    alt={`Product image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnail indicator */}
                {watchedThumb === url && (
                  <div className="absolute bottom-0 inset-x-0 bg-brand-green text-white text-[10px] text-center py-0.5 font-medium">
                    Thumbnail
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {watchedThumb !== url && (
                    <button
                      type="button"
                      onClick={() => setAsThumbnail(url)}
                      className="bg-white text-foreground text-[10px] font-medium px-2 py-1 rounded-lg hover:bg-brand-green hover:text-white transition-colors"
                    >
                      Set thumb
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="bg-white text-destructive h-6 w-6 rounded-lg flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label
          className={`
            flex items-center gap-2 w-fit px-4 py-2.5 rounded-xl
            border-2 border-dashed border-border
            hover:border-brand-green hover:text-brand-green
            cursor-pointer transition-colors text-sm text-muted-foreground
            ${imageUploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          {imageUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Image
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleImageUpload}
            disabled={imageUploading}
          />
        </label>

        <p className="text-xs text-muted-foreground">
          JPEG, PNG or WebP · Max 5MB · First image becomes the thumbnail ·
          Hover an image to set it as thumbnail or remove it
        </p>
      </div>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Pricing</h2>

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

      {/* ── Inventory ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Inventory</h2>

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

      {/* ── Product Details ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Product Details</h2>

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

      {/* ── Flags & Status ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-sm">Flags & Status</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { field: "isFeatured", label: "Featured on homepage" },
            { field: "isBestSeller", label: "Mark as bestseller" },
            { field: "isCertified", label: "NAFDAC certified" },
          ].map(({ field, label }) => (
            <label
              key={field}
              className="flex items-center gap-2 text-sm cursor-pointer p-3 rounded-xl border border-border hover:border-brand-green transition-colors"
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
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...form.register("status")}
          >
            <option value="draft">Draft (hidden from store)</option>
            <option value="active">Active (visible in store)</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <div className="flex gap-3 pb-10">
        <Button
          type="submit"
          disabled={isSubmitting || imageUploading}
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
