import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";
import { ProductsTable } from "./products-table";
import { Plus, Package, TrendingUp, Layers, Download } from "lucide-react";
import Link from "next/link";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function ProductsPage() {
  const content = getAdminContent();

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany();

  const totalProducts = products.length;
  const hotProducts = products.filter((p) => p.heatProduct).length;
  const totalCategories = categories.length;
  const avgPrice =
    products.length > 0
      ? products.reduce((acc, p) => acc + Number(p.price), 0) / products.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {content.products.title}
          </h1>
          <p className="mt-1 text-neutral-600">
            {content.products.description}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {content.products.addButton}
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} content={content} />
    </div>
  );
}
