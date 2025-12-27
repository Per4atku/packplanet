"use client";

import { deleteCategory } from "./actions";
import { Trash2 } from "lucide-react";

export function DeleteCategoryButton({
  categoryId,
  hasProducts,
}: {
  categoryId: string;
  hasProducts: boolean;
}) {
  const handleDelete = async () => {
    if (hasProducts) {
      alert(
        "Cannot delete category with products. Please move or delete all products first."
      );
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(categoryId);
    }
  };

  return (
    <div
      onClick={handleDelete}
      className={`flex items-center gap-2 ${
        hasProducts
          ? "text-neutral-400 cursor-not-allowed"
          : "text-red-600 cursor-pointer"
      }`}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </div>
  );
}
