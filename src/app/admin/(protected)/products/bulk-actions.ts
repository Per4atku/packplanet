"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function deleteProducts(ids: string[]) {
  await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  revalidatePath("/admin/products");
}
