"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/db/schema";

// Server actions for categories
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories";

type Props = { initialCategories: Category[] };

export function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setName(cat.name);
  }

  function handleCreate() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createCategory(name.trim());
      if (result.success) {
        toast.success("Category created");
        setName("");
        router.refresh();
      } else {
        toast.error("Create failed. " + result.error);
      }
    });
  }

  function handleUpdate() {
    if (!editId || !name.trim()) return;
    startTransition(async () => {
      const result = await updateCategory(editId, name.trim());
      if (result.success) {
        toast.success("Category updated");
        setEditId(null);
        setName("");
        router.refresh();
      } else {
        toast.error("Update failed. " + result.error);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted");
        router.refresh();
      } else {
        toast.error("Delete failed. " + result.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Create / Edit Form */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <h2 className="font-semibold text-sm mb-4">
          {editId ? "Edit Category" : "New Category"}
        </h2>
        <div className="flex gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="rounded-xl"
            onKeyDown={(e) =>
              e.key === "Enter" && (editId ? handleUpdate() : handleCreate())
            }
          />
          <Button
            onClick={editId ? handleUpdate : handleCreate}
            disabled={isPending || !name.trim()}
            className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl shrink-0"
            size="sm"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editId ? (
              "Save"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
          {editId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditId(null);
                setName("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {initialCategories.length === 0 ? (
          <p className="text-center text-muted-foreground py-10 text-sm">
            No categories yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {initialCategories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEdit(cat)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(cat.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
