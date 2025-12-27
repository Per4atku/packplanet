"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}

export function CategorySelector({
  value,
  onChange,
  categories,
}: CategorySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[240px]">
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id || "all"} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
