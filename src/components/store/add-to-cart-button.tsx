"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions/cart";
import { toast } from "sonner";
import { ShoppingBag, Loader2, Check } from "lucide-react";

type Props = {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  size = "sm",
  fullWidth = true,
}: Props) {
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    startTransition(async () => {
      const result = await addToCart(productId, quantity);

      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        toast.error("Failed to add item to cart 🌿");
      }
    });
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || isPending}
      size={size}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${
          added
            ? "bg-green-600 hover:bg-green-600"
            : "bg-brand-green hover:bg-brand-green-dark"
        }
        text-white rounded-xl transition-all duration-200
      `}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : added ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5 mr-1" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
