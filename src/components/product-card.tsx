import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import Image from "next/image";

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
  wholesalePrice?: number;
  wholesaleAmount?: number;
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
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {isHot && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-orange-500 p-2 shadow-lg">
          <Flame className="h-5 w-5 text-white" />
        </div>
      )}

      <CardContent className="flex flex-col items-center p-6">
        <div className={`relative mb-4 flex ${imageSize} w-full items-center justify-center`}>
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
              <span className="text-4xl text-muted-foreground">📦</span>
            </div>
          )}
        </div>

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
  );
}
