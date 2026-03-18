"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { adminCreateProduct, adminUpdateProduct } from "@/lib/actions/products";
import { uploadProductImageAction } from "@/lib/actions/upload";
import { toast } from "sonner";
import type { Category, Product } from "@/db/schema";

// ── Schema ─────────────────────────────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid price"),
  comparePrice: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) > 0),
      "Enter a valid compare price"
    ),
  categoryId: z.string().optional(),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative")
    .int("Stock must be a whole number"),
  sku: z.string().optional(),
  weight: z.string().optional(),
  usage: z.string().optional(),
  isNafdacApproved: z.boolean().default(false),
  nafdacNumber: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  categories: Category[];
  product?: Product;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function DynamicList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function update(idx: number, val: string) {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, ""]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-stone-900">{label}</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-[#0f7a3a] text-xs font-medium hover:underline"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-stone-400 italic">
            No {label.toLowerCase()} yet. Click Add above.
          </p>
        )}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <GripVertical className="w-4 h-4 text-stone-300 shrink-0" />
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder ?? `${label} ${i + 1}…`}
              className="flex-1 px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors shrink-0"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function AdminProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic lists
  const [images, setImages] = useState<string[]>(
    (product?.images as string[]) ?? []
  );
  const [benefits, setBenefits] = useState<string[]>(
    (product?.benefits as string[])?.length
      ? (product?.benefits as string[])
      : []
  );
  const [ingredients, setIngredients] = useState<string[]>(
    (product?.ingredients as string[])?.length
      ? (product?.ingredients as string[])
      : []
  );

  // Image paste URL state
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          price: product.price,
          comparePrice: product.comparePrice ?? "",
          categoryId: product.categoryId ?? "",
          stock: product.stock,
          sku: product.sku ?? "",
          weight: product.weight ?? "",
          usage: product.usage ?? "",
          isNafdacApproved: product.isNafdacApproved,
          nafdacNumber: product.nafdacNumber ?? "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
        }
      : {
          isActive: true,
          isFeatured: false,
          isNafdacApproved: false,
          stock: 0,
        },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const isNafdac = watch("isNafdacApproved");

  // Auto-fill slug from name (new products only)
  function handleNameBlur() {
    if (!product && nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }

  // ── Image handlers ──────────────────────────────────────────────────────────
  function addImageByUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    if (images.includes(url)) {
      toast.error("This image URL is already added.");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageUrl("");
    toast.success("Image added.");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentSlug = slugValue || slugify(nameValue ?? "untitled");
    if (!currentSlug) {
      toast.error("Please enter a product name or slug before uploading images.");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", currentSlug);
      const { url } = await uploadProductImageAction(formData);
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded successfully.");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveImageFirst(idx: number) {
    if (idx === 0) return;
    const next = [...images];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setImages(next);
  }

  // ── Form submit ─────────────────────────────────────────────────────────────
  function onSubmit(data: ProductFormValues) {
    const cleanBenefits = benefits.filter((b) => b.trim());
    const cleanIngredients = ingredients.filter((i) => i.trim());

    // Validation
    if (images.length === 0) {
      toast.error("Please add at least one product image.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...data,
          images,
          benefits: cleanBenefits,
          ingredients: cleanIngredients,
          comparePrice: data.comparePrice || undefined,
          categoryId: data.categoryId || undefined,
          nafdacNumber: data.nafdacNumber || undefined,
          sku: data.sku || undefined,
          weight: data.weight || undefined,
        };

        if (product) {
          await adminUpdateProduct(product.id, payload);
          toast.success("Product updated successfully!");
        } else {
          await adminCreateProduct(payload);
          toast.success("Product created successfully!");
        }

        router.push("/admin/products");
        router.refresh();
      } catch (err: any) {
        toast.error(err.message ?? "Failed to save product. Please try again.");
      }
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl pb-12">

      {/* ── Section 1: Basic Information ──────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-900 text-base mb-5 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#0f7a3a] text-white rounded-full text-xs font-bold flex items-center justify-center">1</span>
          Basic Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              onBlur={handleNameBlur}
              placeholder="e.g. Gorontula Syrup 500ml"
              className={`w-full px-4 py-3 border rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors ${
                errors.name ? "border-red-300 bg-red-50" : "border-stone-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              URL Slug <span className="text-red-500">*</span>
              <span className="text-stone-400 font-normal ml-1 text-xs">(auto-filled)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs select-none">/product/</span>
              <input
                {...register("slug")}
                placeholder="gorontula-syrup-500ml"
                className={`w-full pl-[70px] pr-4 py-3 border rounded-xl text-sm bg-stone-50 font-mono focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors ${
                  errors.slug ? "border-red-300 bg-red-50" : "border-stone-200"
                }`}
              />
            </div>
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.slug.message}
              </p>
            )}
            {slugValue && !errors.slug && (
              <a
                href={`/product/${slugValue}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0f7a3a] text-xs mt-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Preview page
              </a>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Short description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Short Description
              <span className="text-stone-400 font-normal ml-1 text-xs">(shown on product cards, max 500 chars)</span>
            </label>
            <input
              {...register("shortDescription")}
              placeholder="e.g. Natural energy booster from premium Gorontula seeds"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
            />
          </div>

          {/* Full description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Full Description
              <span className="text-stone-400 font-normal ml-1 text-xs">(shown on product detail page)</span>
            </label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Detailed product description — tell customers what makes this product special, its origin, and why they should choose it…"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Section 2: Pricing & Inventory ────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-900 text-base mb-5 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#0f7a3a] text-white rounded-full text-xs font-bold flex items-center justify-center">2</span>
          Pricing & Inventory
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Price (₦) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">₦</span>
              <input
                {...register("price")}
                type="number"
                min="0"
                step="0.01"
                placeholder="5500"
                className={`w-full pl-8 pr-4 py-3 border rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors ${
                  errors.price ? "border-red-300 bg-red-50" : "border-stone-200"
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Compare price */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Compare Price (₦)
              <span className="text-stone-400 font-normal ml-1 text-xs">(struck-through)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">₦</span>
              <input
                {...register("comparePrice")}
                type="number"
                min="0"
                step="0.01"
                placeholder="7000"
                className="w-full pl-8 pr-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
              />
            </div>
            {errors.comparePrice && (
              <p className="text-red-500 text-xs mt-1">{errors.comparePrice.message}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Stock Qty <span className="text-red-500">*</span>
            </label>
            <input
              {...register("stock")}
              type="number"
              min="0"
              placeholder="100"
              className={`w-full px-4 py-3 border rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors ${
                errors.stock ? "border-red-300 bg-red-50" : "border-stone-200"
              }`}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">SKU</label>
            <input
              {...register("sku")}
              placeholder="ANH-001"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Weight
              <span className="text-stone-400 font-normal ml-1 text-xs">(grams)</span>
            </label>
            <input
              {...register("weight")}
              type="number"
              min="0"
              placeholder="250"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Product Images ──────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-900 text-base mb-1 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#0f7a3a] text-white rounded-full text-xs font-bold flex items-center justify-center">3</span>
          Product Images
        </h2>
        <p className="text-stone-400 text-xs mb-5">
          The first image is used as the main product photo. Click "Set as main" on any image to reorder.
        </p>

        {/* Upload methods */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {/* File upload */}
          <div
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              uploadingImage
                ? "border-[#0f7a3a]/40 bg-[#0f7a3a]/5 cursor-wait"
                : "border-stone-200 hover:border-[#0f7a3a] hover:bg-[#0f7a3a]/5"
            }`}
          >
            {uploadingImage ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-[#0f7a3a] animate-spin" />
                <p className="text-sm text-[#0f7a3a] font-medium">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-7 h-7 text-stone-400" />
                <p className="text-sm font-medium text-stone-700">Upload from device</p>
                <p className="text-xs text-stone-400">JPEG, PNG, WebP — max 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* URL paste */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-stone-700">Or paste image URL</label>
            <div className="flex gap-2 flex-1">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageByUrl();
                  }
                }}
                placeholder="https://…"
                className="flex-1 min-w-0 px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] transition-colors"
              />
              <button
                type="button"
                onClick={addImageByUrl}
                disabled={!imageUrl.trim()}
                className="px-4 py-3 bg-[#0f7a3a] text-white rounded-xl hover:bg-[#0a5c2c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-400">Paste a Supabase, Cloudinary, or any CDN URL</p>
          </div>
        </div>

        {/* Image grid */}
        {images.length === 0 ? (
          <div className="border-2 border-dashed border-stone-100 rounded-xl p-10 text-center">
            <ImageIcon className="w-10 h-10 text-stone-200 mx-auto mb-2" />
            <p className="text-sm text-stone-400">No images yet — upload a file or paste a URL above</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((src, i) => (
              <div
                key={src + i}
                className="relative group aspect-square bg-stone-100 rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: i === 0 ? "#0f7a3a" : "transparent" }}
              >
                <img
                  src={src}
                  alt={`Product image ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f5f5f0' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23999' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => moveImageFirst(i)}
                      className="w-full bg-white text-stone-800 text-[10px] font-semibold py-1 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      Set as main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-full bg-red-500 text-white text-[10px] font-semibold py-1 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Main badge */}
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-[#0f7a3a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    MAIN
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Section 4: Benefits & Ingredients ─────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-900 text-base mb-5 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#0f7a3a] text-white rounded-full text-xs font-bold flex items-center justify-center">4</span>
          Benefits & Ingredients
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <DynamicList
            label="Key Benefits"
            items={benefits}
            onChange={setBenefits}
            placeholder="e.g. Boosts natural energy levels"
          />
          <DynamicList
            label="Ingredients"
            items={ingredients}
            onChange={setIngredients}
            placeholder="e.g. Gorontula extract"
          />
        </div>

        {/* Usage */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <label className="block text-sm font-semibold text-stone-900 mb-1.5">
            How to Use
            <span className="text-stone-400 font-normal ml-1 text-xs">(dosage & application instructions)</span>
          </label>
          <textarea
            {...register("usage")}
            rows={4}
            placeholder="e.g. Take 2 tablespoons twice daily — morning and night. Can be mixed with warm water or taken directly."
            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none transition-colors"
          />
        </div>
      </section>

      {/* ── Section 5: Certifications & Visibility ────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <h2 className="font-semibold text-stone-900 text-base mb-5 flex items-center gap-2">
          <span className="w-6 h-6 bg-[#0f7a3a] text-white rounded-full text-xs font-bold flex items-center justify-center">5</span>
          Certifications & Visibility
        </h2>

        <div className="space-y-4">
          {/* NAFDAC toggle */}
          <div className="flex items-start gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
            <input
              {...register("isNafdacApproved")}
              id="isNafdacApproved"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f7a3a] focus:ring-[#0f7a3a] cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="isNafdacApproved" className="block text-sm font-medium text-stone-900 cursor-pointer">
                NAFDAC Approved
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                Displays a NAFDAC certification badge on the product page and shop cards
              </p>
              {isNafdac && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">NAFDAC Registration Number</label>
                  <input
                    {...register("nafdacNumber")}
                    placeholder="e.g. NAFDAC/FS/L3/01234"
                    className="w-full max-w-xs px-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-start gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
            <input
              {...register("isFeatured")}
              id="isFeatured"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f7a3a] focus:ring-[#0f7a3a] cursor-pointer"
            />
            <div>
              <label htmlFor="isFeatured" className="block text-sm font-medium text-stone-900 cursor-pointer">
                Featured Product
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                Appears in the "Best Sellers" section on the homepage
              </p>
            </div>
          </div>

          {/* Active */}
          <div className="flex items-start gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50">
            <input
              {...register("isActive")}
              id="isActive"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f7a3a] focus:ring-[#0f7a3a] cursor-pointer"
            />
            <div>
              <label htmlFor="isActive" className="block text-sm font-medium text-stone-900 cursor-pointer">
                Active / Visible in Store
              </label>
              <p className="text-xs text-stone-500 mt-0.5">
                Uncheck to hide this product from customers without deleting it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Submit bar ─────────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-stone-100 -mx-6 px-6 py-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending || uploadingImage}
          className="flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold px-10 py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm min-w-[160px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {product ? "Save Changes" : "Create Product"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
          className="px-8 py-3.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Cancel
        </button>

        {product && (
          <a
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-stone-500 hover:text-[#0f7a3a] text-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View live page
          </a>
        )}
      </div>
    </form>
  );
}