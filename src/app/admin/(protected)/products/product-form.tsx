"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { createProduct, updateProduct, removeProductImage } from "./actions";
import { Category, Product } from "@/generated/prisma/client";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(
    product?.categoryId || categories[0]?.id || ""
  );
  const [heatProduct, setHeatProduct] = useState(
    product?.heatProduct || false
  );

  const handleSubmit = async (formData: FormData) => {
    formData.set("categoryId", categoryId);
    formData.set("heatProduct", heatProduct.toString());

    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  const handleRemoveImage = async (imagePath: string) => {
    if (product && confirm("Вы уверены, что хотите удалить это изображение?")) {
      await removeProductImage(product.id, imagePath);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">Артикул *</Label>
              <Input
                id="sku"
                name="sku"
                required
                defaultValue={product?.sku}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Цена *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Единица измерения *</Label>
              <Input
                id="unit"
                name="unit"
                required
                defaultValue={product?.unit}
                placeholder="напр., шт, кг, упак"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Категория *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wholesalePrice">Оптовая цена</Label>
              <Input
                id="wholesalePrice"
                name="wholesalePrice"
                type="number"
                step="0.01"
                defaultValue={product?.wholesalePrice || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wholesaleAmount">Минимальное количество для опта</Label>
              <Input
                id="wholesaleAmount"
                name="wholesaleAmount"
                type="number"
                defaultValue={product?.wholesaleAmount || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="heatProduct"
                checked={heatProduct}
                onChange={(e) => setHeatProduct(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="heatProduct" className="cursor-pointer">
                Отметить как горячий товар
              </Label>
            </div>
          </div>

          {product && product.images.length > 0 && (
            <div className="space-y-2">
              <Label>Текущие изображения</Label>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((imagePath) => (
                  <div key={imagePath} className="relative aspect-square">
                    <Image
                      src={imagePath}
                      alt="Товар"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imagePath)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="images">
              {product ? "Добавить еще изображения" : "Изображения"}
            </Label>
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
            />
            <p className="text-sm text-neutral-500">
              Загрузите изображения товара (можно несколько файлов)
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {product ? "Обновить товар" : "Создать товар"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
