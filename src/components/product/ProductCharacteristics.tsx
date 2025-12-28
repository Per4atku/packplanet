import { Separator } from "@/components/ui/separator";

interface ProductCharacteristicsProps {
  sku: string;
  categoryName: string;
  unit: string;
  description?: string;
}

export function ProductCharacteristics({
  sku,
  categoryName,
  unit,
  description,
}: ProductCharacteristicsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground">Артикул</span>
          <span className="font-medium">{sku}</span>
        </div>
        <Separator />
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground">Категория</span>
          <span className="font-medium">{categoryName}</span>
        </div>
        <Separator />
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground">Единица измерения</span>
          <span className="font-medium">{unit}</span>
        </div>
      </div>
      {description && (
        <>
          <h2 className="text-xl font-semibold mt-8">Описание</h2>
          <p className="leading-relaxed text-muted-foreground">{description}</p>
        </>
      )}
    </div>
  );
}
