import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PartnerForm } from "../../partner-form";
import { notFound } from "next/navigation";
import { getAdminContent } from "@/lib/content";

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
  const content = getAdminContent();
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
        <h1 className="text-3xl font-bold">{content.partnerForm.editTitle}</h1>
        <p className="text-neutral-600">{content.partnerForm.editDescription}</p>
      </div>
      <PartnerForm partner={partner} content={content} />
    </div>
  );
}
