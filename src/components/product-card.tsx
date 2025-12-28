"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  description?: string;
  price: string;
  priceNote?: string;
  image?: string;
  isNew?: boolean;
  isHot?: boolean;
  imageSize?: string;
  sku?: string;
  unit?: string;
  wholesalePrice?: number | null;
  wholesaleAmount?: number | null;
}

export function ProductCard({
  name,
  description,
  price,
  priceNote,
  image = "/placeholder-product.png",
  isNew = false,
  isHot = false,
  imageSize = "h-32",
  sku,
  unit,
  wholesalePrice,
  wholesaleAmount,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden transition-shadow hover:shadow-xl h-full">
        {isHot && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="absolute right-3 top-3 z-10 rounded-full bg-orange-500 p-2 shadow-lg"
          >
            <Flame className="h-5 w-5 text-white" />
          </motion.div>
        )}

        <CardContent className="flex flex-col items-center p-6">
          <motion.div
            className={`relative mb-4 flex ${imageSize} w-full items-center justify-center`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                <span className="text-4xl text-muted-foreground">📦</span>
              </div>
            )}
          </motion.div>

        {sku && (
          <Badge variant="outline" className="mb-2 text-xs text-muted-foreground">
            Арт: {sku}
          </Badge>
        )}

        {isNew && (
          <Badge variant="default" className="mb-3 bg-primary">
            Новая упаковка
          </Badge>
        )}

        <h3 className="mb-2 text-center text-lg font-semibold">{name}</h3>

        {description && (
          <p className="mb-3 text-center text-sm text-muted-foreground">{description}</p>
        )}

        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {price}
            {unit && <span className="text-sm text-muted-foreground">/{unit}</span>}
          </p>
          {priceNote && (
            <p className="text-xs text-muted-foreground">{priceNote}</p>
          )}
          {wholesalePrice && wholesaleAmount && (
            <p className="mt-2 text-xs text-muted-foreground">
              Опт: {wholesaleAmount}+ шт - {wholesalePrice} руб
            </p>
          )}
        </div>
      </CardContent>
      </Card>
    </motion.div>
  );
}
