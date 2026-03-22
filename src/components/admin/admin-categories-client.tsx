"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/db/schema";

// These would be server actions in a real build
async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
}

interface Props {
  categories: Category[];
}

export function AdminCategoriesClient({ categories: initial }: Props) {
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [isPending, startTransition] = useTransition();

  function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    // Optimistic UI
    toast.success(editing ? "Category updated!" : "Category created!");
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", slug: "", description: "" });
  }

  function handleEdit(cat: Category) {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
    });
    setShowForm(true);
  }

  function handleDelete(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    toast.success(`"${cat.name}" deleted.`);
  }

  const EMOJI_MAP: Record<string, string> = {
    herbs: "🌿",
    "food-spices": "🌶️",
    "beauty-products": "✨",
    "natural-aphrodisiacs": "❤️",
    "gorontula-products": "🌱",
    "wellness-remedies": "💚",
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm({ name: "", slug: "", description: "" });
          }}
          className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a5c2c] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h3 className="font-semibold text-stone-900 mb-4">
            {editing ? "Edit Category" : "New Category"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Wellness Remedies"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Slug
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="wellness-remedies"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] bg-stone-50 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Description
              </label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Short description of this category"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] bg-stone-50"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-[#0f7a3a] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0a5c2c] transition-colors text-sm"
            >
              {editing ? "Save Changes" : "Create Category"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="bg-stone-100 text-stone-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-stone-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              {["Category", "Slug", "Products", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-3"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {EMOJI_MAP[cat.slug] ?? "🌿"}
                    </span>
                    <span className="font-medium text-stone-900 text-sm">
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-lg">
                    {cat.slug}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">—</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      cat.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-[#0f7a3a] hover:bg-[#0f7a3a]/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
