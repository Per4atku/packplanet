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

export async function createProduct(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const unit = formData.get("unit") as string;
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string || "";
  const wholesalePrice = formData.get("wholesalePrice") as string;
  const wholesaleAmount = formData.get("wholesaleAmount") as string;
  const heatProduct = formData.get("heatProduct") === "true";
  const linkedProductIdsJson = formData.get("linkedProductIds") as string;
  const linkedProductIds = linkedProductIdsJson ? JSON.parse(linkedProductIdsJson) : [];

  // Handle image upload
  const images: string[] = [];
  const imageFiles = formData.getAll("images") as File[];

  for (const file of imageFiles) {
    if (file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads/products");
      await mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      images.push(`/uploads/products/${filename}`);
    }
  }

  await prisma.product.create({
    data: {
      name,
      sku,
      price,
      unit,
      categoryId,
      description,
      images,
      wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      wholesaleAmount: wholesaleAmount ? parseInt(wholesaleAmount) : null,
      heatProduct,
      linkedProductIds,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const price = parseFloat(formData.get("price") as string);
  const unit = formData.get("unit") as string;
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string || "";
  const wholesalePrice = formData.get("wholesalePrice") as string;
  const wholesaleAmount = formData.get("wholesaleAmount") as string;
  const heatProduct = formData.get("heatProduct") === "true";
  const linkedProductIdsJson = formData.get("linkedProductIds") as string;
  const linkedProductIds = linkedProductIdsJson ? JSON.parse(linkedProductIdsJson) : [];

  // Get existing product
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  let images = existingProduct?.images || [];

  // Handle new image uploads
  const imageFiles = formData.getAll("images") as File[];

  for (const file of imageFiles) {
    if (file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads/products");
      await mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      images.push(`/uploads/products/${filename}`);
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      price,
      unit,
      categoryId,
      description,
      images,
      wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
      wholesaleAmount: wholesaleAmount ? parseInt(wholesaleAmount) : null,
      heatProduct,
      linkedProductIds,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/admin/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (product) {
    // Delete images from filesystem
    for (const imagePath of product.images) {
      try {
        const filepath = join(process.cwd(), "public", imagePath);
        await unlink(filepath);
      } catch (error) {
        console.error(`Failed to delete image: ${imagePath}`, error);
      }
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  revalidatePath("/admin/products");
}

export async function removeProductImage(productId: string, imagePath: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (product) {
    const updatedImages = product.images.filter((img) => img !== imagePath);

    await prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });

    // Delete image from filesystem
    try {
      const filepath = join(process.cwd(), "public", imagePath);
      await unlink(filepath);
    } catch (error) {
      console.error(`Failed to delete image: ${imagePath}`, error);
    }

    revalidatePath("/admin/products");
  }
}
