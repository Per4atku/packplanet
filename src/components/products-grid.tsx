import { ProductCard } from "@/components/product-card";
import { Product } from "@/data/products";
import Link from "next/link";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-lg text-muted-foreground">Товары не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <ProductCard
            name={product.name}
            description={product.description}
            price={`${product.price} руб`}
            image={product.images[0]}
            sku={product.sku}
            unit={product.unit}
            wholesalePrice={product.wholesale_price}
            wholesaleAmount={product.wholesale_amount}
            isHot={product.heat_product}
          />
        </Link>
      ))}
    </div>
  );
}
