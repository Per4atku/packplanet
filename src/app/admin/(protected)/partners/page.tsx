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
          <h1 className="text-3xl font-bold text-neutral-900">Partners</h1>
          <p className="text-neutral-600 mt-1">Manage your business partners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/admin/partners/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Partner
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Partners"
          value={totalPartners}
          description="Active partnerships"
          icon={Handshake}
        />
        <StatsCard
          title="With Logos"
          value={partnersWithLogos}
          description="Partners with logos"
          icon={Building2}
        />
        <StatsCard
          title="With Description"
          value={partnersWithDescription}
          description="Complete profiles"
          icon={Handshake}
        />
        <StatsCard
          title="Completion Rate"
          value={`${totalPartners > 0 ? Math.round((partnersWithDescription / totalPartners) * 100) : 0}%`}
          description="Profile completeness"
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
                All filters
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-neutral-200">
                <TableHead className="font-semibold text-neutral-900">
                  Partner
                </TableHead>
                <TableHead className="font-semibold text-neutral-900">
                  Description
                </TableHead>
                <TableHead className="text-right font-semibold text-neutral-900">
                  Actions
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
                      <p>No partners found</p>
                      <p className="text-sm">
                        Add your first partner to get started
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
                            No description
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
                              Edit
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
