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
import { StatsCard } from "@/components/admin/stats-card";
import {
  Plus,
  Handshake,
  Download,
  MoreHorizontal,
  Pencil,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { DeletePartnerButton } from "./delete-button";
import Image from "next/image";
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

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { name: "asc" },
  });

  const totalPartners = partners.length;
  const partnersWithLogos = partners.filter((p) => p.image).length;
  const partnersWithDescription = partners.filter((p) => p.description).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Партнеры</h1>
          <p className="text-neutral-600 mt-1">Управление бизнес-партнерами</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Link href="/admin/partners/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить партнера
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Всего партнеров"
          value={totalPartners}
          description="Активных партнерств"
          icon={Handshake}
        />
        <StatsCard
          title="С логотипами"
          value={partnersWithLogos}
          description="Партнеров с логотипами"
          icon={Building2}
        />
        <StatsCard
          title="С описанием"
          value={partnersWithDescription}
          description="Полные профили"
          icon={Handshake}
        />
        <StatsCard
          title="Процент заполнения"
          value={`${totalPartners > 0 ? Math.round((partnersWithDescription / totalPartners) * 100) : 0}%`}
          description="Заполненность профилей"
          icon={Building2}
        />
      </div>

      {/* Partners Table */}
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
                  Партнер
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Описание
                </TableHead>
                <TableHead className="text-right font-semibold text-neutral-900">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-32 text-center text-neutral-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Handshake className="h-8 w-8 text-neutral-400" />
                      <p>Партнеры не найдены</p>
                      <p className="text-sm">
                        Добавьте своего первого партнера, чтобы начать
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                partners.map((partner) => (
                  <TableRow
                    key={partner.id}
                    className="border-neutral-200 hover:bg-neutral-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {partner.image ? (
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-neutral-100">
                            <Image
                              src={partner.image}
                              alt={partner.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-neutral-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-neutral-600" />
                          </div>
                        )}
                        <p className="font-medium text-neutral-900">
                          {partner.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-neutral-600 truncate">
                        {partner.description || (
                          <span className="text-neutral-400">
                            Без описания
                          </span>
                        )}
                      </p>
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
                              href={`/admin/partners/${partner.id}/edit`}
                              className="flex items-center gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeletePartnerButton partnerId={partner.id} />
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
