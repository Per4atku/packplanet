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
import { FileUpload } from "@/components/ui/file-upload";
import { ProductMultiSelect } from "@/components/ui/product-multi-select";
import { createProduct, updateProduct, removeProductImage } from "./actions";
import { Category, Product } from "@/generated/prisma/client";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminContent } from "@/lib/content";
import Image from "next/image";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  content: AdminContent;
}

export function ProductForm({ product, categories, content }: ProductFormProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(
    product?.categoryId || categories[0]?.id || ""
  );
  const [heatProduct, setHeatProduct] = useState(
    product?.heatProduct || false
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [linkedProductIds, setLinkedProductIds] = useState<string[]>(
    product?.linkedProductIds || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", categoryId);
    formData.set("heatProduct", heatProduct.toString());
    formData.set("linkedProductIds", JSON.stringify(linkedProductIds));

    // Clear existing images field and add selected images
    formData.delete("images");
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  const handleRemoveImage = async (imagePath: string) => {
    if (product && confirm(content.productForm.confirmDelete)) {
      await removeProductImage(product.id, imagePath);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">{content.productForm.fields.sku} *</Label>
              <Input
                id="sku"
                name="sku"
                required
                defaultValue={product?.sku}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{content.productForm.fields.name} *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{content.productForm.fields.description}</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">{content.productForm.fields.price} *</Label>
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
              <Label htmlFor="unit">{content.productForm.fields.unit} *</Label>
              <Input
                id="unit"
                name="unit"
                required
                defaultValue={product?.unit}
                placeholder={content.productForm.fields.unitPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">{content.productForm.fields.category} *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={content.productForm.fields.categoryPlaceholder} />
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
              <Label htmlFor="wholesalePrice">{content.productForm.fields.wholesalePrice}</Label>
              <Input
                id="wholesalePrice"
                name="wholesalePrice"
                type="number"
                step="0.01"
                defaultValue={product?.wholesalePrice || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wholesaleAmount">{content.productForm.fields.wholesaleAmount}</Label>
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
                {content.productForm.fields.heatProduct}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedProducts">
              {content.productForm.fields.linkedProducts}
            </Label>
            <p className="text-sm text-neutral-500">
              {content.productForm.fields.linkedProductsHelp}
            </p>
            <ProductMultiSelect
              selectedIds={linkedProductIds}
              onSelectionChange={setLinkedProductIds}
              excludeId={product?.id}
              placeholder={content.productForm.fields.linkedProductsPlaceholder}
              emptyText={content.productForm.fields.linkedProductsEmpty}
              selectedText={content.productForm.fields.linkedProductsSelected}
            />
          </div>

          {product && product.images.length > 0 && (
            <div className="space-y-2">
              <Label>{content.productForm.fields.currentImages}</Label>
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
            <Label>
              {product ? content.productForm.fields.addMoreImages : content.productForm.fields.images}
            </Label>
            <FileUpload
              onFilesChange={setSelectedImages}
              accept="image/*"
              multiple={true}
              disabled={false}
              maxSize={5 * 1024 * 1024}
              label={product ? "Add more images" : "Upload product images"}
              description={content.productForm.fields.imagesHelp}
              preview="image"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {product
                ? content.productForm.buttons.update
                : content.productForm.buttons.create}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {content.productForm.buttons.cancel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
