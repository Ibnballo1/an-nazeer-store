"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Eye, Sprout, Search } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { toast } from "sonner";
import type { Product } from "@/db/schema";

interface Props {
  products: Product[];
}

export function AdminProductsTable({ products }: Props) {
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success(`"${name}" deleted.`);
      } catch {
        toast.error("Failed to delete product.");
      } finally {
        setDeleting(null);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      {/* Search bar */}
      <div className="px-6 py-4 border-b border-stone-100">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] bg-stone-50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              {[
                "Product",
                "Price",
                "Stock",
                "Category",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-stone-400"
                >
                  <Sprout className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const images = product.images as string[];
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                          {images?.[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sprout className="w-5 h-5 text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 text-sm line-clamp-1">
                            {product.name}
                          </p>
                          {product.isCertified && (
                            <span className="text-[10px] text-[#0f7a3a] font-semibold">
                              NAFDAC
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                      ₦{Number(product.price).toLocaleString()}
                      {product.comparePrice && (
                        <span className="block text-xs text-stone-400 font-normal line-through">
                          ₦{Number(product.comparePrice).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock <= 10
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">—</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-[#0f7a3a] hover:bg-[#0f7a3a]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
