"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
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
          <SelectItem
            key={category}
            value={category === "Все категории" ? "all" : category}
          >
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
