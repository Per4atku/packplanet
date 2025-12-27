"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";
import { join } from "path";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function uploadPriceList(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "Please select a file to upload" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads/pricelist");
    await mkdir(uploadDir, { recursive: true });

    // Delete all existing files in the pricelist directory
    const existingFiles = await readdir(uploadDir);
    for (const existingFile of existingFiles) {
      try {
        await unlink(join(uploadDir, existingFile));
      } catch (error) {
        console.error(`Failed to delete file: ${existingFile}`, error);
      }
    }

    // Delete all existing price list records from database
    await prisma.priceList.deleteMany({});

    // Save new file
    const filename = `pricelist-${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Create new price list record
    await prisma.priceList.create({
      data: {
        filename: file.name,
        path: `/uploads/pricelist/${filename}`,
      },
    });

    revalidatePath("/admin/price-list");
    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload price list" };
  }
}

export async function deletePriceList(id: string) {
  const priceList = await prisma.priceList.findUnique({
    where: { id },
  });

  if (priceList) {
    // Delete file from filesystem
    try {
      const filepath = join(process.cwd(), "public", priceList.path);
      await unlink(filepath);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }

    // Delete database record
    await prisma.priceList.delete({
      where: { id },
    });

    revalidatePath("/admin/price-list");
  }
}
