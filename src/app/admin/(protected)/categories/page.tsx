import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Plus,
  FolderTree,
  Package,
  Download,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { DeleteCategoryButton } from "./delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function CategoriesPage() {
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
          <h1 className="text-3xl font-bold text-neutral-900">Категории</h1>
          <p className="text-neutral-600 mt-1">
            Управление категориями товаров и организацией
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Link href="/admin/categories/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить категорию
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Всего категорий"
          value={totalCategories}
          description="Групп товаров"
          icon={FolderTree}
        />
        <StatsCard
          title="Всего товаров"
          value={totalProducts}
          description="Во всех категориях"
          icon={Package}
        />
        <StatsCard
          title="В среднем на категорию"
          value={avgProductsPerCategory.toFixed(1)}
          description="Товаров на категорию"
          icon={FolderTree}
        />
        <StatsCard
          title="Крупнейшая категория"
          value={largestCategory}
          description="Больше всего товаров"
          icon={Package}
        />
      </div>

      {/* Categories Table */}
      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardContent className="p-0">
          {/* Table Header Actions */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Все фильтры
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-neutral-200">
                <TableHead className="font-semibold text-neutral-900">
                  Категория
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Товары
                </TableHead>
                <TableHead className="text-right font-semibold text-neutral-900">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-neutral-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FolderTree className="h-8 w-8 text-neutral-400" />
                      <p>Категории не найдены</p>
                      <p className="text-sm">
                        Создайте свою первую категорию, чтобы начать
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-neutral-200 hover:bg-neutral-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-neutral-100 flex items-center justify-center">
                          <FolderTree className="h-5 w-5 text-neutral-600" />
                        </div>
                        <p className="font-medium text-neutral-900">
                          {category.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {category._count.products} товаров
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/categories/${category.id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteCategoryButton
                              categoryId={category.id}
                              hasProducts={category._count.products > 0}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
