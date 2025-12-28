"use client";

import { useState } from "react";
import { ProductMetadata } from "./ProductMetadata";
import { ProductPrice } from "./ProductPrice";
import { QuantitySelector } from "./QuantitySelector";
import { ProductCTA } from "./ProductCTA";

interface ProductDecisionZoneProps {
  product: {
    sku: string;
    name: string;
    categoryName: string;
    unit: string;
    price: number;
    wholesalePrice?: number | null;
    wholesaleAmount?: number | null;
    isHot?: boolean;
  };
}

export function ProductDecisionZone({ product }: ProductDecisionZoneProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className=" lg:top-24 lg:self-start space-y-4">
      <ProductMetadata
        sku={product.sku}
        categoryName={product.categoryName}
        unit={product.unit}
      />
      <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
      <ProductPrice
        price={product.price}
        unit={product.unit}
        wholesalePrice={product.wholesalePrice}
        wholesaleAmount={product.wholesaleAmount}
        quantity={quantity}
      />
    </div>
  );
}
