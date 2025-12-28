import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCarousel } from "@/components/product-carousel";
import { getProductById, getLinkedProducts } from "@/lib/queries/products";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { ProductStructuredData } from "@/components/structured-data";

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
    keywords: [product.name, product.sku, product.category.name, "одноразовая посуда", "упаковка"],
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
  const relatedProducts = product.linkedProductIds.length > 0
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
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Image Carousel */}
          <div>
            <ProductCarousel
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right Column: Product Information */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                Арт: {product.sku}
              </Badge>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Цена и условия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Розничная цена
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {product.price} руб
                    <span className="text-lg text-muted-foreground">
                      /{product.unit}
                    </span>
                  </p>
                </div>

                {product.wholesalePrice && product.wholesaleAmount && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-1 text-sm font-semibold">Оптовая цена</p>
                    <p className="text-xl font-bold">
                      {product.wholesalePrice} руб
                      <span className="text-sm text-muted-foreground">
                        /{product.unit}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      При заказе от {product.wholesaleAmount} {product.unit}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Характеристики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Артикул</span>
                  <span className="font-semibold">{product.sku}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Категория</span>
                  <span className="font-semibold">{product.category.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    Единица измерения
                  </span>
                  <span className="font-semibold">{product.unit}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <p className="mb-4 text-sm text-muted-foreground">
                  Для оформления заказа свяжитесь с нами по телефону или
                  электронной почте
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Телефон:</span>{" "}
                    <a
                      href="tel:+78002347876"
                      className="text-primary hover:underline"
                    >
                      8 (800) 234-78-76
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a
                      href="mailto:sinfo@wsk.ru"
                      className="text-primary hover:underline"
                    >
                      sinfo@wsk.ru
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <SectionHeading>Похожие товары</SectionHeading>
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
