import { CatalogPageClient } from "@/components/catalog-page-client";
import { SectionHeading } from "@/components/section-heading";
import { Space } from "@/components/space";
import { products } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог - Планета Упаковки",
  description: "Полный каталог упаковочной продукции и одноразовой посуды",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <section className="containerize py-12 md:py-16">
        <SectionHeading>Каталог Продукции</SectionHeading>

        <Space size="lg" />

        <CatalogPageClient products={products} />
      </section>
    </div>
  );
}
