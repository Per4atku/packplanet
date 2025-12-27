"use client";

import { deleteProduct } from "./actions";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      await deleteProduct(productId);
    }
  };

  return (
    <div
      onClick={handleDelete}
      className="flex items-center gap-2 text-red-600 cursor-pointer"
    >
      <Trash2 className="h-4 w-4" />
      Удалить
    </div>
  );
}
