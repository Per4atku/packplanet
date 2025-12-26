import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface PartnerCardProps {
  name: string;
  description: string;
  image: string;
}

export function PartnerCard({ name, description, image }: PartnerCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="mb-2 text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
