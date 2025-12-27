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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Plus,
  Package,
  TrendingUp,
  Layers,
  Download,
  Upload,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "./delete-button";
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

export default async function ProductsPage() {
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
          <h1 className="text-3xl font-bold text-neutral-900">Товары</h1>
          <p className="text-neutral-600 mt-1">
            Управление каталогом товаров и инвентаризацией
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить товар
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Всего товаров"
          value={totalProducts}
          description="Активных в каталоге"
          icon={Package}
          trend={{ value: "12%", isPositive: true }}
        />
        <StatsCard
          title="Горячие товары"
          value={hotProducts}
          description="Избранные позиции"
          icon={TrendingUp}
        />
        <StatsCard
          title="Категории"
          value={totalCategories}
          description="Групп товаров"
          icon={Layers}
        />
        <StatsCard
          title="Средняя цена"
          value={`$${avgPrice.toFixed(2)}`}
          description="Средняя цена товара"
          icon={Package}
        />
      </div>

      {/* Products Table */}
      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardContent className="p-0">
          {/* Table Header Actions */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Все фильтры
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Импорт
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-neutral-200">
                <TableHead className="font-semibold text-neutral-900">
                  Товар
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Артикул
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Категория
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Цена
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Единица
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Статус
                </TableHead>
                <TableHead className="text-right font-semibold text-neutral-900">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-neutral-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-neutral-400" />
                      <p>Товары не найдены</p>
                      <p className="text-sm">
                        Создайте свой первый товар, чтобы начать
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-neutral-200 hover:bg-neutral-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-neutral-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {product.name}
                          </p>
                          {product.images.length > 0 && (
                            <p className="text-xs text-neutral-500">
                              {product.images.length} изображений
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-neutral-600">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-900">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {product.unit}
                    </TableCell>
                    <TableCell>
                      {product.heatProduct ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                          Горячий
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-neutral-600">
                          Активный
                        </Badge>
                      )}
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
                              href={`/admin/products/${product.id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteProductButton productId={product.id} />
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
