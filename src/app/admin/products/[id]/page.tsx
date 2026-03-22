import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { getCategories } from "@/lib/actions/products";
import { ProductForm } from "../product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    id === "new"
      ? null
      : db.query.products.findFirst({
          where: and(eq(products.id, id), isNull(products.deletedAt)),
        }),
    getCategories(),
  ]);

  if (id !== "new" && !product) notFound();

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold mb-8">
        {product ? "Edit Product" : "New Product"}
      </h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
