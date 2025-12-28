"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function createCategory(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;

  await prisma.category.create({
    data: { name },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;

  await prisma.category.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
}
