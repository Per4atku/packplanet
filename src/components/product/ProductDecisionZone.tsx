"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Flame, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
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
    <Card className="lg:sticky lg:top-24 lg:self-start p-6 space-y-4 relative overflow-hidden">
      {product.isHot && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-orange-500 p-2 shadow-lg cursor-help"
            >
              <Flame className="h-5 w-5 text-white" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Популярный Товар</p>
          </TooltipContent>
        </Tooltip>
      )}
      {product.wholesalePrice && product.wholesaleAmount && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="absolute left-4 top-4 z-10 rounded-full bg-primary p-2 shadow-lg cursor-help"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Оптовая Цена</p>
            <p className="text-xs mt-1">
              {product.wholesalePrice} руб при заказе от{" "}
              {product.wholesaleAmount} {product.unit}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
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
    </Card>
  );
}
