"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    slug: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const outOfStock = product.stock === 0;

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        slug: product.slug,
      });
    }
    toast.success(`${qty} × ${product.name} added to cart!`);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-stone-600">Quantity</span>
        <div className="flex items-center gap-0 bg-stone-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || outOfStock}
            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-semibold text-stone-900 text-sm">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock || outOfStock}
            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="text-xs text-amber-600 font-medium">
            Only {product.stock} left!
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      {outOfStock && (
        <p className="text-center text-sm text-red-600 font-medium">
          This product is currently out of stock.
        </p>
      )}
    </div>
  );
}
