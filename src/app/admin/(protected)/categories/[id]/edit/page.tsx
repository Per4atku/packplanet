import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CategoryForm } from "../../category-form";
import { notFound } from "next/navigation";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const content = getAdminContent();
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {content.categoryForm.editTitle}
        </h1>
        <p className="text-neutral-600">
          {content.categoryForm.editDescription}
        </p>
      </div>
      <CategoryForm category={category} content={content} />
    </div>
  );
}
