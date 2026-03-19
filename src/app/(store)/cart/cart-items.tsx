"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Cart } from "@/types";

export function CartItems({ initialCart }: { initialCart: Cart }) {
  const { cart, update, remove, isPending } = useCart(initialCart);

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={item.productId}
          className="bg-white rounded-2xl border border-border p-4 flex gap-4"
        >
          {/* Image */}
          <Link
            href={`/shop/${item.slug}`}
            className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-brand-cream"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                🌿
              </div>
            )}
          </Link>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/shop/${item.slug}`}>
              <p className="font-semibold text-sm line-clamp-2 hover:text-brand-green transition-colors">
                {item.name}
              </p>
            </Link>
            {item.unit && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.unit}
              </p>
            )}
            <p className="text-brand-green font-bold text-sm mt-1">
              {formatNaira(item.price)}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(item.productId)}
              disabled={isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => update(item.productId, item.quantity - 1)}
                disabled={isPending}
                className="h-7 w-7 flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => update(item.productId, item.quantity + 1)}
                disabled={
                  isPending || (item.quantity >= item.stock && item.stock > 0)
                }
                className="h-7 w-7 flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <p className="text-xs font-semibold text-foreground">
              {formatNaira(item.price * item.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
