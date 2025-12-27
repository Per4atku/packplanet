import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";

const prisma_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: prisma_adapter,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const excludeId = searchParams.get("excludeId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const products = await prisma.product.findMany({
      where: {
        ...(excludeId && { id: { not: excludeId } }),
        OR: query
          ? [
              { name: { contains: query, mode: "insensitive" } },
              { sku: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        images: true,
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
