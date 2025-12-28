"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";

interface PartnerCardProps {
  name: string;
  description: string;
  image: string;
}

export function PartnerCard({ name, description, image }: PartnerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="group overflow-hidden transition-shadow hover:shadow-xl h-full">
        <div className="relative aspect-16/10 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover p-2 rounded-xl"
            />
          </motion.div>
        </div>
        <CardContent className="p-5">
          <h3 className="mb-2 text-xl font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
