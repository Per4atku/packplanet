"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Package, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductOption = {
  id: string;
  name: string;
  sku: string;
  images: string[];
};

interface ProductMultiSelectProps {
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  excludeId?: string;
  placeholder?: string;
  emptyText?: string;
  selectedText?: string;
}

export function ProductMultiSelect({
  selectedIds,
  onSelectionChange,
  excludeId,
  placeholder = "Поиск товаров...",
  emptyText = "Товары не найдены",
  selectedText = "выбрано",
}: ProductMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<ProductOption[]>([]);
  const [selectedProducts, setSelectedProducts] = React.useState<
    ProductOption[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Fetch selected products on mount to display badges
  React.useEffect(() => {
    if (selectedIds.length > 0) {
      fetch(
        `/api/products/search?q=&limit=1000${
          excludeId ? `&excludeId=${excludeId}` : ""
        }`
      )
        .then((res) => res.json())
        .then((allProducts: ProductOption[]) => {
          const selected = allProducts.filter((p) =>
            selectedIds.includes(p.id)
          );
          setSelectedProducts(selected);
        })
        .catch((error) => {
          console.error("Failed to fetch selected products:", error);
        });
    } else {
      setSelectedProducts([]);
    }
  }, [selectedIds, excludeId]);

  // Debounced search
  React.useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!open) {
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          limit: "50",
          ...(excludeId && { excludeId }),
        });

        const response = await fetch(`/api/products/search?${params}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, open, excludeId]);

  const toggleProduct = (product: ProductOption) => {
    const isSelected = selectedIds.includes(product.id);
    if (isSelected) {
      onSelectionChange(selectedIds.filter((id) => id !== product.id));
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      onSelectionChange([...selectedIds, product.id]);
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: string) => {
    onSelectionChange(selectedIds.filter((id) => id !== productId));
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedProducts.length > 0
                ? `${selectedProducts.length} ${selectedText}`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!isLoading && searchResults.length === 0 && (
                <CommandEmpty>{emptyText}</CommandEmpty>
              )}
              {!isLoading && searchResults.length > 0 && (
                <CommandGroup>
                  {searchResults.map((product) => {
                    const isSelected = selectedIds.includes(product.id);
                    return (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => toggleProduct(product)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50"
                            )}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-neutral-100 shrink-0">
                            {product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-neutral-600" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">
                              {product.name}
                            </span>
                            <span className="text-xs ">{product.sku}</span>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <Badge key={product.id} variant="secondary" className="gap-1 pr-1">
              <span className="max-w-[200px] truncate">{product.name}</span>
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="ml-1 rounded-sm hover:bg-neutral-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
