"use client";

import { useMemo } from "react";

interface ProductPriceProps {
  price: number;
  unit: string;
  wholesalePrice?: number | null;
  wholesaleAmount?: number | null;
  quantity?: number;
}

export function ProductPrice({
  price,
  unit,
  wholesalePrice,
  wholesaleAmount,
  quantity = 1,
}: ProductPriceProps) {
  const displayPrice = useMemo(() => {
    if (wholesalePrice && wholesaleAmount && quantity >= wholesaleAmount) {
      return wholesalePrice;
    }
    return price;
  }, [price, wholesalePrice, wholesaleAmount, quantity]);

  const discountPercent = useMemo(() => {
    if (wholesalePrice && price > wholesalePrice) {
      return Math.round(((price - wholesalePrice) / price) * 100);
    }
    return 0;
  }, [price, wholesalePrice]);

  return (
    <div className="space-y-2">
      <p className="text-3xl font-bold text-foreground">
        {displayPrice} ₽{" "}
        <span className="text-lg text-muted-foreground">/ {unit}</span>
      </p>
      {wholesalePrice && wholesaleAmount && (
        <p className="text-sm text-muted-foreground">
          Опт: {wholesalePrice} ₽ при заказе от {wholesaleAmount} {unit}{" "}
          {discountPercent > 0 && (
            <span className="text-primary font-medium">
              (–{discountPercent}%)
            </span>
          )}
        </p>
      )}
    </div>
  );
}
