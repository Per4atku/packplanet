"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/search-input";
import { CategorySelector } from "@/components/category-selector";
import { ProductsGrid } from "@/components/products-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTransition } from "react";
import type { CatalogContent } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  images: string[];
  wholesalePrice: number | null;
  wholesaleAmount: number | null;
  heatProduct: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface CatalogPageClientProps {
  products: Product[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  content: CatalogContent;
}

export function CatalogPageClient({
  products,
  categories,
  totalPages,
  currentPage,
  totalCount,
  content,
}: CatalogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategoryId = searchParams.get("category") || "all";

  // Build category map for O(1) lookups
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  // Create category options with IDs as values
  const categoryOptions = [
    { id: "all", name: content.filters.allCategories },
    ...categories,
  ];

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Use replace to avoid polluting browser history
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value, page: null });
  };

  const handleCategoryChange = (categoryId: string) => {
    // "all" means no category filter
    updateSearchParams({ category: categoryId === "all" ? null : categoryId, page: null });
  };

  const goToPage = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex-1 sm:max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            isPending={isPending}
          />
        </div>
        <CategorySelector
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          categories={categoryOptions}
        />
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-sm text-muted-foreground"
      >
        {content.results.found} <span className="font-semibold">{totalCount}</span>
        {isPending && <span className="ml-2 text-xs">{content.results.updating}</span>}
      </motion.div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${searchTerm}-${selectedCategoryId}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isPending ? 0.6 : 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ProductsGrid products={products} />
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-2 pt-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {content.pagination.previous}
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      {content.pagination.ellipsis}
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="min-w-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {content.pagination.next}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
