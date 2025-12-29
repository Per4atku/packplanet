import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { cache } from "react";
import { scoreProduct } from "@/lib/fuzzy-search";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export interface PaginatedProducts {
  products: Awaited<ReturnType<typeof getProducts>>["products"];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch products with pagination, filtering, and fuzzy search
 * Cached per unique parameter combination for performance
 */
export const getProducts = cache(async (params: GetProductsParams = {}) => {
  const { page = 1, limit = 12, categoryId, search } = params;
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: Prisma.ProductWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  // If search is provided, use fuzzy matching
  if (search && search.trim()) {
    // Fetch all products matching the category filter (without pagination)
    // We need to score all products before pagination
    const allProducts = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Score each product using fuzzy matching
    const scoredProducts = allProducts
      .map((product) => ({
        product,
        score: scoreProduct(
          { name: product.name, sku: product.sku || "" },
          search
        ),
      }))
      .filter((item) => item.score > 0.3) // Only keep matches above threshold
      .sort((a, b) => b.score - a.score); // Sort by score (best matches first)

    // Apply pagination to scored results
    const paginatedProducts = scoredProducts.slice(skip, skip + limit);
    const totalCount = scoredProducts.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: paginatedProducts.map((item) => item.product),
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  // No search - use standard database query
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    totalCount,
    totalPages,
    currentPage: page,
  };
});

/**
 * Fetch a single product by ID with category information
 * Cached per product ID
 */
export const getProductById = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return product;
});

/**
 * Fetch linked products by IDs
 * Cached per product IDs combination
 */
export const getLinkedProducts = cache(async (productIds: string[]) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
});

/**
 * Fetch all categories
 * Cached - categories change infrequently
 */
export const getCategories = cache(async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
});

/**
 * Fetch featured products (where heatProduct === true)
 * Cached per limit value
 */
export const getFeaturedProducts = cache(async (limit = 3) => {
  const products = await prisma.product.findMany({
    where: {
      heatProduct: true,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return products;
});

/**
 * Fetch the latest price list file
 * Cached - price lists change infrequently
 */
export const getLatestPriceList = cache(async () => {
  const priceList = await prisma.priceList.findFirst({
    orderBy: {
      uploadedAt: "desc",
    },
  });

  return priceList;
});

/**
 * Fetch all partners
 * Cached - partners change infrequently
 */
export const getPartners = cache(async () => {
  const partners = await prisma.partner.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return partners;
});
