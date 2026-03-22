import type { Product } from "@/db/schema";

type Props = { product: Product };

export function ProductSchema({ product }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.shortDescription,
    image: product.images ?? [product.thumbnailUrl],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "An-Nazeer Holistic Home",
    },
    offers: {
      "@type": "Offer",
      price: Number(product.price).toFixed(2),
      priceCurrency: "NGN",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "An-Nazeer Holistic Home Ltd",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
