// src/components/shop/shop-content.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Sprout,
  X,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "Herbs", value: "herbs" },
  { label: "Food Spices", value: "food-spices" },
  { label: "Beauty Products", value: "beauty-products" },
  { label: "Natural Aphrodisiacs", value: "natural-aphrodisiacs" },
  { label: "Gorontula Products", value: "gorontula-products" },
  { label: "Wellness Remedies", value: "wellness-remedies" },
];

// Placeholder product data (replace with real DB call in production)
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Gorontula Syrup",
    slug: "gorontula-syrup",
    shortDescription: "Natural energy booster",
    price: 5500,
    comparePrice: 7000,
    images: [],
    stock: 50,
    isNafdacApproved: false,
    category: "gorontula-products",
    rating: 4.8,
  },
  {
    id: "2",
    name: "NAFDAC Suya Spice Blend",
    slug: "nafdac-suya-spice-blend",
    shortDescription: "Authentic Nigerian spice",
    price: 1800,
    comparePrice: null,
    images: [],
    stock: 120,
    isNafdacApproved: true,
    category: "food-spices",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Herbal Detox Tea",
    slug: "herbal-detox-tea",
    shortDescription: "Cleanse & rejuvenate",
    price: 3500,
    comparePrice: 4500,
    images: [],
    stock: 80,
    isNafdacApproved: false,
    category: "herbs",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Natural Shea Butter Cream",
    slug: "natural-shea-butter-cream",
    shortDescription: "Deep moisturizing",
    price: 4200,
    comparePrice: null,
    images: [],
    stock: 65,
    isNafdacApproved: false,
    category: "beauty-products",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Gorontula Seeds (250g)",
    slug: "gorontula-seeds-250g",
    shortDescription: "Premium dried seeds",
    price: 2500,
    comparePrice: 3000,
    images: [],
    stock: 200,
    isNafdacApproved: false,
    category: "gorontula-products",
    rating: 4.9,
  },
  {
    id: "6",
    name: "Immune Boost Herbal Blend",
    slug: "immune-boost-herbal-blend",
    shortDescription: "Strengthen immunity naturally",
    price: 6800,
    comparePrice: 8500,
    images: [],
    stock: 45,
    isNafdacApproved: false,
    category: "wellness-remedies",
    rating: 4.8,
  },
  {
    id: "7",
    name: "Egusi Spice Mix",
    slug: "egusi-spice-mix",
    shortDescription: "Traditional Nigerian blend",
    price: 1500,
    comparePrice: null,
    images: [],
    stock: 150,
    isNafdacApproved: true,
    category: "food-spices",
    rating: 4.7,
  },
  {
    id: "8",
    name: "Natural Hair Growth Oil",
    slug: "natural-hair-growth-oil",
    shortDescription: "Herbal scalp treatment",
    price: 5000,
    comparePrice: 6500,
    images: [],
    stock: 55,
    isNafdacApproved: false,
    category: "beauty-products",
    rating: 4.5,
  },
];

export function ShopContent({
  initialCategory,
  initialSearch,
}: {
  initialCategory?: string;
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchCategory = !activeCategory || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  function handleAddToCart(product: (typeof MOCK_PRODUCTS)[0]) {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      stock: product.stock,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors md:hidden ${
            showFilters
              ? "bg-[#0f7a3a] text-white border-[#0f7a3a]"
              : "bg-white border-stone-200 text-stone-700"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar categories - desktop */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-stone-100 p-4 sticky top-24">
            <h3 className="font-semibold text-stone-900 text-sm mb-3">
              Categories
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <button
                    onClick={() => setActiveCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat.value
                        ? "bg-[#0f7a3a] text-white font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile categories */}
        {showFilters && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-stone-900 mb-4">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setActiveCategory(cat.value);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      activeCategory === cat.value
                        ? "bg-[#0f7a3a] text-white border-[#0f7a3a]"
                        : "bg-white text-stone-700 border-stone-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">
                No products found. Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="aspect-square bg-stone-50 relative overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sprout className="w-10 h-10 text-stone-300" />
                        </div>
                      )}
                      {product.isNafdacApproved && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold bg-[#0f7a3a] text-white px-2 py-0.5 rounded-full">
                          NAFDAC
                        </span>
                      )}
                      {product.comparePrice && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-[11px] text-stone-400 mb-1 truncate">
                      {product.shortDescription}
                    </p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-stone-900 text-sm mb-2 line-clamp-2 leading-snug hover:text-[#0f7a3a] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0f7a3a] text-sm">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.comparePrice && (
                          <span className="ml-1.5 text-[11px] text-stone-400 line-through">
                            ₦{product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-8 h-8 bg-[#0f7a3a] text-white rounded-full flex items-center justify-center hover:bg-[#0a5c2c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
