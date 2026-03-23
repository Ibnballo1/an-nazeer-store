"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions/testimonials";
import { uploadTestimonialImageAction } from "@/lib/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  X,
  Check,
  Upload,
  UserCircle2,
} from "lucide-react";
import type { Testimonial } from "@/db/schema";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  city: z.string().optional(),
  image: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Please enter the testimonial text"),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

type FormValues = z.infer<typeof schema>;

type Props = { initialTestimonials: Testimonial[] };

export function TestimonialsManager({ initialTestimonials }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      city: "",
      image: null,
      rating: 5,
      text: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  const { isSubmitting } = form.formState;
  const watchedImage = form.watch("image");
  const watchedRating = form.watch("rating");

  // ── Handlers ──────────────────────────────────────────────────────────────

  function openCreate() {
    form.reset({
      name: "",
      city: "",
      image: null,
      rating: 5,
      text: "",
      isActive: true,
      sortOrder: initialTestimonials.length,
    });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    form.reset({
      name: t.name,
      city: t.city ?? "",
      image: t.image ?? null,
      rating: t.rating,
      text: t.text,
      isActive: t.isActive,
      sortOrder: t.sortOrder,
    });
    setEditId(t.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditId(null);
    form.reset();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadTestimonialImageAction(formData);

    if (result.success) {
      form.setValue("image", result.data.url);
      toast("Image uploaded ✓");
    } else {
      toast("Upload failed" + result.error);
    }

    setImageUploading(false);
    e.target.value = "";
  }

  function removeImage() {
    form.setValue("image", null);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = editId
        ? await updateTestimonial(editId, values)
        : await createTestimonial(values);

      if (result.success) {
        toast(editId ? "Testimonial updated" : "Testimonial created");
        setShowForm(false);
        setEditId(null);
        router.refresh();
      } else {
        toast("Save failed" + result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast("Testimonial deleted");
        router.refresh();
      } else {
        toast("Delete failed" + result.error);
      }
    });
  }

  function handleToggleActive(t: Testimonial) {
    startTransition(async () => {
      await updateTestimonial(t.id, { isActive: !t.isActive });
      router.refresh();
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Add button */}
      {!showForm && (
        <Button
          onClick={openCreate}
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Testimonial
        </Button>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">
              {editId ? "Edit Testimonial" : "New Testimonial"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Profile image */}
            <div className="space-y-2">
              <Label>
                Profile photo{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>

              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-brand-cream border-2 border-border shrink-0 flex items-center justify-center">
                  {watchedImage ? (
                    <>
                      <Image
                        src={watchedImage}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <UserCircle2 className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                {/* Upload button */}
                <div>
                  <label
                    className={`
                      inline-flex items-center gap-2 px-3 py-2 rounded-xl
                      border border-dashed border-border text-sm text-muted-foreground
                      hover:border-brand-green hover:text-brand-green
                      cursor-pointer transition-colors
                      ${imageUploading ? "opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        {watchedImage ? "Change photo" : "Upload photo"}
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
                  <p className="text-xs text-muted-foreground mt-1.5">
                    JPEG, PNG or WebP · Max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Customer name *</Label>
                <Input placeholder="Fatimah A." {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>City</Label>
                <Input placeholder="Lagos" {...form.register("city")} />
              </div>
            </div>

            {/* Star rating */}
            <div className="space-y-1.5">
              <Label>Rating *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => form.setValue("rating", star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= watchedRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {watchedRating} / 5
                </span>
              </div>
            </div>

            {/* Testimonial text */}
            <div className="space-y-1.5">
              <Label>Testimonial text *</Label>
              <Textarea
                placeholder="What did the customer say about our products or service?"
                rows={3}
                className="rounded-xl resize-none"
                {...form.register("text")}
              />
              {form.formState.errors.text && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.text.message}
                </p>
              )}
            </div>

            {/* Sort order + Visibility */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...form.register("sortOrder", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Lower = appears first
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Visibility</Label>
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-2.5">
                  <input
                    type="checkbox"
                    className="rounded"
                    {...form.register("isActive")}
                  />
                  Show on homepage
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={isSubmitting || isPending || imageUploading}
                className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
                size="sm"
              >
                {isSubmitting || isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    {editId ? "Save Changes" : "Create Testimonial"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials list */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {initialTestimonials.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <Star className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
            <p>No testimonials yet.</p>
            <p className="text-xs mt-1">
              Add your first customer testimonial above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {initialTestimonials.map((t) => (
              <div key={t.id} className="p-5">
                <div className="flex items-start gap-4">
                  {/* Profile image or initial */}
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-brand-cream border border-border shrink-0 flex items-center justify-center">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-brand-green font-bold text-sm">
                        {t.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{t.name}</p>
                      {t.city && (
                        <span className="text-xs text-muted-foreground">
                          · {t.city}
                        </span>
                      )}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= t.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          t.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {t.isActive ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Sort order: {t.sortOrder}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(t)}
                      disabled={isPending}
                      title={
                        t.isActive ? "Hide from homepage" : "Show on homepage"
                      }
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors text-xs font-bold ${
                        t.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {t.isActive ? "✓" : "○"}
                    </button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete testimonial?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove {t.name}&apos;s
                            testimonial from the homepage.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(t.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
