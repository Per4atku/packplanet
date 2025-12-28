interface ProductMetadataProps {
  sku: string;
  categoryName: string;
  unit: string;
}

export function ProductMetadata({
  sku,
  categoryName,
  unit,
}: ProductMetadataProps) {
  return (
    <p className="text-xs uppercase text-muted-foreground">
      {sku} · {categoryName} · {unit}
    </p>
  );
}
