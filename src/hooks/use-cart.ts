"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart, removeFromCart, updateCartItem } from "@/lib/actions/cart";
import { toast } from "sonner";
import type { Cart } from "@/types";

export function useCart(initialCart: Cart) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const add = useCallback(
    (productId: string, quantity = 1) => {
      startTransition(async () => {
        const result = await addToCart(productId, quantity);
        if (result.success) {
          setCart(result.data);
          toast.success("Item added to cart 🌿 successfully!");
          router.refresh();
        } else {
          toast.error("Failed to add item to cart 🌿");
        }
      });
    },
    [router, toast],
  );

  const update = useCallback(
    (productId: string, quantity: number) => {
      startTransition(async () => {
        const result = await updateCartItem(productId, quantity);
        if (result.success) {
          setCart(result.data);
          router.refresh();
        } else {
          toast.error("Failed to update item in cart 🌿");
        }
      });
    },
    [router, toast],
  );

  const remove = useCallback(
    (productId: string) => {
      startTransition(async () => {
        const result = await removeFromCart(productId);
        if (result.success) {
          setCart(result.data);
          router.refresh();
        } else {
          toast.error("Failed to remove item from cart 🌿");
        }
      });
    },
    [router, toast],
  );

  return { cart, add, update, remove, isPending };
}
