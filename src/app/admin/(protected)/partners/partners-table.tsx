"use client";

import { Partner } from "@/generated/prisma/client";
import { AdminDataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deletePartners } from "./bulk-actions";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import type { AdminContent } from "@/lib/content";

interface PartnersTableProps {
  partners: Partner[];
  content: AdminContent;
}

export function PartnersTable({ partners, content }: PartnersTableProps) {
  const router = useRouter();

  const columns: ColumnDef<Partner>[] = [
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
      header: content.partners.table.partner,
      cell: ({ row }) => {
        const partner = row.original;
        return (
          <div className="flex items-center gap-3">
            {partner.image ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100">
                <Building2 className="h-5 w-5 text-neutral-600" />
              </div>
            )}
            <p className="font-medium text-neutral-900">{partner.name}</p>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: content.partners.table.description,
      cell: ({ row }) => (
        <p className="max-w-lg truncate text-neutral-600">
          {row.original.description || (
            <span className="text-neutral-400">
              {content.partners.table.noDescription}
            </span>
          )}
        </p>
      ),
    },
  ];

  const [isDeleting, setIsDeleting] = useState(false);

  const handleRowClick = (partner: Partner) => {
    router.push(`/admin/partners/${partner.id}/edit`);
  };

  const handleBulkDelete = async (selectedPartners: Partner[]) => {
    const selectedIds = selectedPartners.map((p) => p.id);

    const confirmed = confirm(
      `Are you sure you want to delete ${selectedIds.length} partner${selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deletePartners(selectedIds);
      toast.success(
        `Successfully deleted ${selectedIds.length} partner${selectedIds.length > 1 ? "s" : ""}`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete partners");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminDataTable
      columns={columns}
      data={partners}
      searchKey="name"
      searchPlaceholder="Search partners..."
      getRowId={(row) => row.id}
      enableDragDrop={false}
      onRowClick={handleRowClick}
      bulkActions={(selectedPartners) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleBulkDelete(selectedPartners)}
          disabled={isDeleting}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Selected"}
        </Button>
      )}
    />
  );
}
