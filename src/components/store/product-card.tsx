import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./add-to-cart-button";
import { formatNaira } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import type { Product } from "@/db/schema";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const discount = product.comparePrice
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100,
      )
    : null;

  const isOutOfStock =
    product.trackInventory && !product.allowBackorder && product.stock === 0;

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-200 flex flex-col">
      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square bg-brand-cream overflow-hidden"
      >
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            🌿
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
              -{discount}%
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-brand-green text-white text-[10px] px-1.5 py-0.5 rounded-md">
              Bestseller
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded-md">
              Out of Stock
            </Badge>
          )}
        </div>

        {product.isCertified && (
          <div className="absolute top-2 right-2">
            <div
              className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm"
              title="NAFDAC Certified"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
            </div>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-brand-green transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {product.unit && (
          <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-brand-green text-sm">
            {formatNaira(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatNaira(product.comparePrice)}
            </span>
          )}
        </div>

        <div className="mt-3">
          <AddToCartButton productId={product.id} disabled={isOutOfStock} />
        </div>
      </div>
    </div>
  );
}
