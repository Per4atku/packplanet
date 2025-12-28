"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function deletePartners(ids: string[]) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  await prisma.partner.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  revalidatePath("/admin/partners");
}
