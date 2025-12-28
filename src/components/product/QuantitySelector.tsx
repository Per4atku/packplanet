"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  wholesaleThreshold?: number | null;
  onChange?: (quantity: number) => void;
}

export function QuantitySelector({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 9999,
  wholesaleThreshold,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    onChange?.(quantity);
  }, [quantity, onChange]);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(minQuantity);
    }
  };

  const isWholesale = wholesaleThreshold && quantity >= wholesaleThreshold;

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        aria-label="Уменьшить количество"
        className="h-11 w-11"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleChange}
        min={minQuantity}
        max={maxQuantity}
        className="h-11 w-20 text-center"
        aria-label="Количество"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        aria-label="Увеличить количество"
        className="h-11 w-11"
      >
        <Plus className="h-4 w-4" />
      </Button>
      {isWholesale && (
        <Badge variant="secondary" className="ml-2">
          Опт
        </Badge>
      )}
    </div>
  );
}
