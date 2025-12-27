import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "pricelist"
    );

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    const publicPath = `/uploads/pricelist/${filename}`;

    await writeFile(filepath, buffer);

    const existingPriceList = await prisma.priceList.findFirst({
      orderBy: { uploadedAt: "desc" },
    });

    if (existingPriceList) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        existingPriceList.path
      );
      if (existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }
      await prisma.priceList.delete({
        where: { id: existingPriceList.id },
      });
    }

    const priceList = await prisma.priceList.create({
      data: {
        filename: file.name,
        path: publicPath,
      },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      priceList,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const priceList = await prisma.priceList.findFirst({
      orderBy: { uploadedAt: "desc" },
    });

    if (!priceList) {
      return NextResponse.json(
        { error: "No price list found" },
        { status: 404 }
      );
    }

    return NextResponse.json(priceList);
  } catch (error) {
    console.error("Error fetching price list:", error);
    return NextResponse.json(
      { error: "Failed to fetch price list" },
      { status: 500 }
    );
  }
}
