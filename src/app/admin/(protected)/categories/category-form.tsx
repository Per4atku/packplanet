"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createCategory, updateCategory } from "./actions";
import { Category } from "@/generated/prisma/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (category) {
      await updateCategory(category.id, formData);
    } else {
      await createCategory(formData);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={category?.name}
              placeholder="e.g., Packaging Materials, Labels, Boxes"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">
              {category ? "Update Category" : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
