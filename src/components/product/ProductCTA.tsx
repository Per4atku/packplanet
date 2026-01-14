"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { getPrimaryPhone } from "@/lib/phones";

interface ProductCTAProps {
  productName: string;
  quantity?: number;
}

export function ProductCTA({ productName, quantity }: ProductCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const primaryPhone = getPrimaryPhone();

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setIsOpen(true)}>
        Оформить заказ
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Свяжитесь с нами удобным для вас способом, чтобы оформить заказ
              {quantity && quantity > 1 && ` (${quantity} шт.)`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Phone Contact */}
            <a
              href={`tel:${primaryPhone.href}`}
              className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Позвонить</p>
                <p className="text-lg font-medium">{primaryPhone.display}</p>
                {primaryPhone.label && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {primaryPhone.label}
                  </p>
                )}
              </div>
            </a>

            {/* Email Contact */}
            <a
              href="mailto:sinfo@wsk.ru"
              className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Написать email</p>
                <p className="text-base font-medium">sinfo@wsk.ru</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ответим в течение рабочего дня
                </p>
              </div>
            </a>

            {/* Product Info */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                Товар для заказа:
              </p>
              <p className="font-medium">{productName}</p>
              {quantity && quantity > 1 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Количество: {quantity}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
