import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ProductForm } from "../product-form";
import { getAdminContent } from "@/lib/content";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export default async function NewProductPage() {
  const content = getAdminContent();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{content.productForm.newTitle}</h1>
        <p className="text-neutral-600">{content.productForm.newDescription}</p>
      </div>
      <ProductForm categories={categories} content={content} />
    </div>
  );
}
