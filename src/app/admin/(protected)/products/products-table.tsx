"use client";

import { Product, Category } from "@/generated/prisma/client";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteProducts } from "./bulk-actions";
import Image from "next/image";
import type { ColumnDef, Table } from "@tanstack/react-table";
import type { AdminContent } from "@/lib/content";

type ProductWithCategory = Product & {
  category: Category;
};

interface ProductsTableProps {
  products: ProductWithCategory[];
  content: AdminContent;
}

export function ProductsTable({ products, content }: ProductsTableProps) {
  const router = useRouter();

  const columns: ColumnDef<ProductWithCategory>[] = [
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
      header: content.products.table.product,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-5 w-5 text-neutral-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-neutral-900">{product.name}</p>
              {product.images.length > 0 && (
                <p className="text-xs text-neutral-500">
                  {product.images.length} {content.products.images}
                </p>
              )}
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "sku",
      header: content.products.table.sku,
      cell: ({ row }) => (
        <span className="font-mono text-sm text-neutral-600">
          {row.original.sku}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: content.products.table.category,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.category.name}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: content.products.table.price,
      cell: ({ row }) => (
        <span className="font-semibold text-neutral-900">
          ₽{Number(row.original.price).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "unit",
      header: content.products.table.unit,
      cell: ({ row }) => (
        <span className="text-neutral-600">{row.original.unit}</span>
      ),
    },
    {
      accessorKey: "heatProduct",
      header: content.products.table.status,
      cell: ({ row }) => {
        return row.original.heatProduct ? (
          <Badge className="border-amber-600 bg-amber-500 text-amber-900 hover:bg-red-100">
            {content.products.status.hot}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-neutral-600">
            {content.products.status.active}
          </Badge>
        );
      },
    },
  ];

  const [isDeleting, setIsDeleting] = useState(false);

  const handleRowClick = (product: ProductWithCategory) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleBulkDelete = async (selectedProducts: ProductWithCategory[]) => {
    const selectedIds = selectedProducts.map((p) => p.id);

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} product${
        selectedIds.length > 1 ? "s" : ""
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteProducts(selectedIds);
      toast.success(
        `Successfully deleted ${selectedIds.length} product${
          selectedIds.length > 1 ? "s" : ""
        }`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete products");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminDataTable
      columns={columns}
      data={products}
      searchKey="name"
      searchPlaceholder="Искать товары..."
      getRowId={(row) => row.id}
      enableDragDrop={false}
      onRowClick={handleRowClick}
      bulkActions={(selectedProducts) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleBulkDelete(selectedProducts)}
          disabled={isDeleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Удаляю..." : "Удалить выбранные"}
        </Button>
      )}
    />
  );
}
