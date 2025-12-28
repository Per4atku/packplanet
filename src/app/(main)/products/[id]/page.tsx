import { getProductById, getLinkedProducts } from "@/lib/queries/products";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flame, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { ProductStructuredData } from "@/components/structured-data";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductDecisionZone } from "@/components/product/ProductDecisionZone";
import { ProductCharacteristics } from "@/components/product/ProductCharacteristics";

// Force dynamic rendering - this page needs fresh data from database
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Товар не найден",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://packplanet.ru";
  const productUrl = `${baseUrl}/products/${id}`;
  const productImage = product.images[0] || `${baseUrl}/og-image.jpg`;

  return {
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      product.sku,
      product.category.name,
      "одноразовая посуда",
      "упаковка",
    ],
    openGraph: {
      type: "website",
      url: productUrl,
      title: product.name,
      description: product.description,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      siteName: "Планета Упаковки",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts =
    product.linkedProductIds.length > 0
      ? await getLinkedProducts(product.linkedProductIds)
      : [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://packplanet.ru";

  return (
    <main className="min-h-screen">
      <ProductStructuredData
        name={product.name}
        description={product.description}
        price={product.price}
        sku={product.sku}
        images={product.images}
        url={`${baseUrl}/products/${id}`}
      />
      <section className="containerize py-12 md:py-16">
        {/* Back to Catalog Link */}
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/products" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к каталогу
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Product Media */}
          <div className="relative">
            {/* Product Badges */}
            <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
              {product.heatProduct && (
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 shadow-lg">
                  <Flame className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Популярный Товар
                  </span>
                </div>
              )}
              {product.wholesalePrice && product.wholesaleAmount && (
                <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 shadow-lg">
                  <ShoppingCart className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Оптовая Цена: {product.wholesalePrice} руб от{" "}
                    {product.wholesaleAmount} {product.unit}
                  </span>
                </div>
              )}
            </div>
            <ProductMedia images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Decision Zone, Characteristics & Description */}
          <div className="space-y-8">
            <ProductDecisionZone
              product={{
                sku: product.sku,
                name: product.name,
                categoryName: product.category.name,
                unit: product.unit,
                price: product.price,
                wholesalePrice: product.wholesalePrice,
                wholesaleAmount: product.wholesaleAmount,
                isHot: product.heatProduct,
              }}
            />

            <ProductCharacteristics
              sku={product.sku}
              categoryName={product.category.name}
              unit={product.unit}
              description={product.description}
            />
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <SectionHeading>Сопутствующие товары</SectionHeading>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                >
                  <ProductCard
                    name={relatedProduct.name}
                    description={relatedProduct.description}
                    price={`${relatedProduct.price} руб`}
                    image={relatedProduct.images[0]}
                    sku={relatedProduct.sku}
                    unit={relatedProduct.unit}
                    wholesalePrice={relatedProduct.wholesalePrice}
                    wholesaleAmount={relatedProduct.wholesaleAmount}
                    isHot={relatedProduct.heatProduct}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
