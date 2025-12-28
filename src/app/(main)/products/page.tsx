import { CatalogPageClient } from "@/components/catalog-page-client";
import { SectionHeading } from "@/components/section-heading";
import { Space } from "@/components/space";
import { getProducts, getCategories } from "@/lib/queries/products";
import { getCatalogContent } from "@/lib/content";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animations/fade-in";

const content = getCatalogContent();

export const metadata: Metadata = {
  title: content.page.title,
  description: content.page.description,
  keywords: ["каталог упаковки", "одноразовая посуда", "пищевая упаковка", "купить упаковку", "каталог товаров"],
  openGraph: {
    type: "website",
    title: content.page.title,
    description: content.page.description,
    siteName: "Планета Упаковки",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Каталог товаров - Планета Упаковки",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.page.title,
    description: content.page.description,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/products",
  },
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

function CatalogSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-md" />
        <Skeleton className="h-10 w-full sm:w-[240px]" />
      </div>
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  );
}

async function CatalogContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const categoryId = params.category || undefined;
  const search = params.search || undefined;

  // Fetch products and categories from database - both are cached
  const [productsData, categories] = await Promise.all([
    getProducts({ page, categoryId, search, limit: 12 }),
    getCategories(),
  ]);

  return (
    <CatalogPageClient
      products={productsData.products}
      categories={categories}
      totalPages={productsData.totalPages}
      currentPage={productsData.currentPage}
      totalCount={productsData.totalCount}
      content={content}
    />
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <main className="min-h-screen">
      <section className="containerize py-12 md:py-16">
        <FadeIn>
          <SectionHeading>{content.header.heading}</SectionHeading>
        </FadeIn>

        <Space size="lg" />

        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent searchParams={props.searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
