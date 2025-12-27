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
        "Невозможно удалить категорию с товарами. Пожалуйста, сначала переместите или удалите все товары."
      );
      return;
    }

    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
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
      Удалить
    </div>
  );
}
