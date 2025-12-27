import { ProductCard } from "@/components/product-card";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sku: string;
  unit: string;
  wholesalePrice: number | null;
  wholesaleAmount: number | null;
  heatProduct: boolean;
}

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
            wholesalePrice={product.wholesalePrice}
            wholesaleAmount={product.wholesaleAmount}
            isHot={product.heatProduct}
          />
        </Link>
      ))}
    </div>
  );
}
