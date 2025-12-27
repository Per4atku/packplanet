import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ProductForm } from "../../product-form";
import { notFound } from "next/navigation";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const content = getAdminContent();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{content.productForm.editTitle}</h1>
        <p className="text-neutral-600">{content.productForm.editDescription}</p>
      </div>
      <ProductForm product={product} categories={categories} content={content} />
    </div>
  );
}
