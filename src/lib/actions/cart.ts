"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import type { Cart, CartItem, ActionResult } from "@/types";

const CART_COOKIE = "an-nazeer-cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─────────────────────────────────────────────────────────────────────────────
// Read cart from cookie
// ─────────────────────────────────────────────────────────────────────────────

export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;

  let items: CartItem[] = [];

  if (raw) {
    try {
      items = JSON.parse(raw) as CartItem[];
    } catch {
      items = [];
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, subtotal, itemCount };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persist cart to cookie
// ─────────────────────────────────────────────────────────────────────────────

async function saveCart(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: false, // needs to be readable by client for instant UI
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Add item to cart
// ─────────────────────────────────────────────────────────────────────────────

export async function addToCart(
  productId: string,
  quantity: number = 1,
): Promise<ActionResult<Cart>> {
  // Validate product exists and has stock
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.id, productId),
      eq(products.status, "active"),
      isNull(products.deletedAt),
    ),
  });

  if (!product) {
    return { success: false, error: "Product not found." };
  }

  const { items } = await getCart();

  const existingIndex = items.findIndex((i) => i.productId === productId);
  const currentQty = existingIndex >= 0 ? items[existingIndex].quantity : 0;
  const newQty = currentQty + quantity;

  // Stock check (if tracking inventory)
  if (product.trackInventory && !product.allowBackorder) {
    if (newQty > product.stock) {
      return {
        success: false,
        error:
          product.stock === 0
            ? "This product is out of stock."
            : `Only ${product.stock} unit(s) available.`,
      };
    }
  }

  const cartItem: CartItem = {
    productId,
    name: product.name,
    price: Number(product.price),
    quantity: newQty,
    image: product.thumbnailUrl,
    slug: product.slug,
    stock: product.stock,
    unit: product.unit,
  };

  let updatedItems: CartItem[];

  if (existingIndex >= 0) {
    updatedItems = items.map((item, idx) =>
      idx === existingIndex ? cartItem : item,
    );
  } else {
    updatedItems = [...items, cartItem];
  }

  await saveCart(updatedItems);

  const subtotal = updatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = updatedItems.reduce((s, i) => s + i.quantity, 0);

  return {
    success: true,
    data: { items: updatedItems, subtotal, itemCount },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Update item quantity
// ─────────────────────────────────────────────────────────────────────────────

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<ActionResult<Cart>> {
  if (quantity < 1) {
    return removeFromCart(productId);
  }

  // Validate stock
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (product?.trackInventory && !product.allowBackorder) {
    if (quantity > product.stock) {
      return {
        success: false,
        error: `Only ${product.stock} unit(s) available.`,
      };
    }
  }

  const { items } = await getCart();

  const updatedItems = items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );

  await saveCart(updatedItems);

  const subtotal = updatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = updatedItems.reduce((s, i) => s + i.quantity, 0);

  return {
    success: true,
    data: { items: updatedItems, subtotal, itemCount },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Remove item from cart
// ─────────────────────────────────────────────────────────────────────────────

export async function removeFromCart(
  productId: string,
): Promise<ActionResult<Cart>> {
  const { items } = await getCart();

  const updatedItems = items.filter((i) => i.productId !== productId);

  await saveCart(updatedItems);

  const subtotal = updatedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = updatedItems.reduce((s, i) => s + i.quantity, 0);

  return {
    success: true,
    data: { items: updatedItems, subtotal, itemCount },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Clear cart (called after successful order)
// ─────────────────────────────────────────────────────────────────────────────

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}
