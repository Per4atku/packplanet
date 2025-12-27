"use client";

import { deletePartner } from "./actions";
import { Trash2 } from "lucide-react";

export function DeletePartnerButton({ partnerId }: { partnerId: string }) {
  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить этого партнера?")) {
      await deletePartner(partnerId);
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
