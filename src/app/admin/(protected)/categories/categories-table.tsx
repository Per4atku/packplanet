"use client";

import { Category } from "@/generated/prisma/client";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderTree, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCategories } from "./bulk-actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { AdminContent } from "@/lib/content";

type CategoryWithCount = Category & {
  _count: {
    products: number;
  };
};

interface CategoriesTableProps {
  categories: CategoryWithCount[];
  content: AdminContent;
}

export function CategoriesTable({
  categories,
  content,
}: CategoriesTableProps) {
  const router = useRouter();

  const columns: ColumnDef<CategoryWithCount>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: content.categories.table.category,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100">
              <FolderTree className="h-5 w-5 text-neutral-600" />
            </div>
            <p className="font-medium text-neutral-900">{category.name}</p>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "_count.products",
      header: content.categories.table.products,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original._count.products}{" "}
          {content.categories.table.productsCount}
        </Badge>
      ),
    },
  ];

  const [isDeleting, setIsDeleting] = useState(false);

  const handleRowClick = (category: CategoryWithCount) => {
    router.push(`/admin/categories/${category.id}/edit`);
  };

  const handleBulkDelete = async (selectedCategories: CategoryWithCount[]) => {
    const categoriesWithProducts = selectedCategories.filter(
      (c) => c._count.products > 0
    );

    if (categoriesWithProducts.length > 0) {
      const categoryNames = categoriesWithProducts
        .map((c) => `"${c.name}"`)
        .join(", ");
      alert(
        `Cannot delete: The following categories contain products: ${categoryNames}.\n\nPlease move or delete all products from these categories first.`
      );
      return;
    }

    const selectedIds = selectedCategories.map((c) => c.id);

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} categor${selectedIds.length > 1 ? "ies" : "y"}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteCategories(selectedIds);
      toast.success(
        `Successfully deleted ${selectedIds.length} categor${selectedIds.length > 1 ? "ies" : "y"}`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete categories");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminDataTable
      columns={columns}
      data={categories}
      searchKey="name"
      searchPlaceholder="Search categories..."
      getRowId={(row) => row.id}
      enableDragDrop={false}
      onRowClick={handleRowClick}
      bulkActions={(selectedCategories) => {
        const hasProductsInAny = selectedCategories.some(
          (c) => c._count.products > 0
        );

        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkDelete(selectedCategories)}
            disabled={isDeleting}
            className="gap-2"
          >
            {hasProductsInAny && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
        );
      }}
    />
  );
}
