import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CatalogCTACard() {
  return (
    <Link href="/catalog">
      <Card className="group flex h-full cursor-pointer items-center justify-center bg-primary transition-all hover:bg-primary/90 hover:shadow-xl">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <ArrowRight className="h-8 w-8 text-white transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Перейти в Каталог</h3>
          <p className="text-sm text-white/90">
            Откройте полный каталог продукции
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
