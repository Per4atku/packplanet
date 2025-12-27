import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PartnerForm } from "../../partner-form";
import { notFound } from "next/navigation";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  if (!partner) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редактировать партнера</h1>
        <p className="text-neutral-600">Обновить информацию о партнере</p>
      </div>
      <PartnerForm partner={partner} />
    </div>
  );
}
