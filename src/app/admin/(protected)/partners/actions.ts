"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function createPartner(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string || "";

  let image = "";
  const imageFile = formData.get("image") as File;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use the uploads directory that's mounted as a volume
    const uploadDir = join(process.cwd(), "uploads/partners");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${imageFile.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    image = `/uploads/partners/${filename}`;
  }

  await prisma.partner.create({
    data: {
      name,
      description,
      image,
    },
  });

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string || "";

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  let image = partner?.image || "";
  const imageFile = formData.get("image") as File;

  if (imageFile && imageFile.size > 0) {
    // Delete old image if exists
    if (partner?.image) {
      try {
        // Remove leading slash and use uploads directory
        const relativePath = partner.image.startsWith('/') ? partner.image.substring(1) : partner.image;
        const filepath = join(process.cwd(), relativePath);
        await unlink(filepath);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }

    // Upload new image
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use the uploads directory that's mounted as a volume
    const uploadDir = join(process.cwd(), "uploads/partners");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${imageFile.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    image = `/uploads/partners/${filename}`;
  }

  await prisma.partner.update({
    where: { id },
    data: {
      name,
      description,
      image,
    },
  });

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}

export async function deletePartner(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  if (partner) {
    // Delete image from filesystem
    if (partner.image) {
      try {
        // Remove leading slash and use uploads directory
        const relativePath = partner.image.startsWith('/') ? partner.image.substring(1) : partner.image;
        const filepath = join(process.cwd(), relativePath);
        await unlink(filepath);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    await prisma.partner.delete({
      where: { id },
    });
  }

  revalidatePath("/admin/partners");
}
