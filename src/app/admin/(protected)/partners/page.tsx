import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";
import { PartnersTable } from "./partners-table";
import { Plus, Handshake, Download, Building2 } from "lucide-react";
import Link from "next/link";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function PartnersPage() {
  const content = getAdminContent();

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
          <h1 className="text-3xl font-bold text-neutral-900">
            {content.partners.title}
          </h1>
          <p className="mt-1 text-neutral-600">
            {content.partners.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/partners/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {content.partners.addButton}
            </Button>
          </Link>
        </div>
      </div>

      {/* Partners Table */}
      <PartnersTable partners={partners} content={content} />
    </div>
  );
}
