"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
}

export function SearchInput({ value, onChange, isPending }: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const isFirstRender = useRef(true);

  // Sync internal value when URL value changes (e.g., from browser back/forward)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce the search input - only trigger onChange, don't call it on mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [internalValue, value, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      <Input
        type="text"
        placeholder="Поиск по названию или артикулу..."
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className="pl-10 pr-10"
      />
    </div>
  );
}
