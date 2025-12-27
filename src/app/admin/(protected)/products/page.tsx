import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";
import { ProductsTable } from "./products-table";
import {
  Plus,
  Package,
  TrendingUp,
  Layers,
  Download,
} from "lucide-react";
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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {content.actions.export}
          </Button>
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {content.products.addButton}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={content.products.stats.totalProducts}
          value={totalProducts}
          description={content.products.stats.totalProductsDesc}
          icon={Package}
          trend={{ value: "12%", isPositive: true }}
        />
        <StatsCard
          title={content.products.stats.hotProducts}
          value={hotProducts}
          description={content.products.stats.hotProductsDesc}
          icon={TrendingUp}
        />
        <StatsCard
          title={content.products.stats.categories}
          value={totalCategories}
          description={content.products.stats.categoriesDesc}
          icon={Layers}
        />
        <StatsCard
          title={content.products.stats.avgPrice}
          value={`$${avgPrice.toFixed(2)}`}
          description={content.products.stats.avgPriceDesc}
          icon={Package}
        />
      </div>

      {/* Products Table */}
      <ProductsTable products={products} content={content} />
    </div>
  );
}
