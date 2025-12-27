"use client";

import { useState, useMemo } from "react";
import { Product, categories } from "@/data/products";
import { SearchInput } from "@/components/search-input";
import { CategorySelector } from "@/components/category-selector";
import { ProductsGrid } from "@/components/products-grid";

interface CatalogPageClientProps {
  products: Product[];
}

export function CatalogPageClient({ products }: CatalogPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by category
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-md">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <CategorySelector
          value={selectedCategory}
          onChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Найдено товаров: <span className="font-semibold">{filteredProducts.length}</span>
      </div>

      {/* Products Grid */}
      <ProductsGrid products={filteredProducts} />
    </div>
  );
}
