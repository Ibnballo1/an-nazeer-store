"use server";

import { requireAdmin } from "@/lib/server";
import { supabaseAdmin } from "../client";
import type { ActionResult } from "@/types";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// ─────────────────────────────────────────────────────────────────────────────
// Upload a single product image to Supabase Storage
// ─────────────────────────────────────────────────────────────────────────────

export async function uploadProductImageAction(
  formData: FormData,
): Promise<ActionResult<{ url: string; path: string }>> {
  await requireAdmin();

  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { success: false, error: "No file provided." };
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed.",
    };
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  try {
    // Build a unique file path: products/{timestamp}-{random}.{ext}
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `products/${fileName}`;

    // Convert File to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[uploadProductImage]", uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        url: urlData.publicUrl,
        path: filePath,
      },
    };
  } catch (err) {
    console.error("[uploadProductImageAction]", err);
    return { success: false, error: "Upload failed. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete a product image from Supabase Storage
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteProductImageAction(
  path: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (!path) {
    return { success: false, error: "No file path provided." };
  }

  try {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

    if (error) {
      console.error("[deleteProductImage]", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[deleteProductImageAction]", err);
    return { success: false, error: "Delete failed." };
  }
}
