import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";
import { CategoriesTable } from "./categories-table";
import { Plus, FolderTree, Package, Download, Layers } from "lucide-react";
import Link from "next/link";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function CategoriesPage() {
  const content = getAdminContent();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalCategories = categories.length;
  const totalProducts = categories.reduce(
    (acc, cat) => acc + cat._count.products,
    0
  );
  const avgProductsPerCategory =
    categories.length > 0 ? totalProducts / categories.length : 0;
  const largestCategory = categories.reduce(
    (max, cat) => (cat._count.products > max ? cat._count.products : max),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {content.categories.title}
          </h1>
          <p className="mt-1 text-neutral-600">
            {content.categories.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/categories/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {content.categories.addButton}
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      <CategoriesTable categories={categories} content={content} />
    </div>
  );
}
