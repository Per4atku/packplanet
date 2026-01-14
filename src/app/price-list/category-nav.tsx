"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, X, ChevronUp } from "lucide-react";

interface CategoryNavProps {
  categories: { id: string; name: string }[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (categories.length === 0) return null;

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant={isOpen ? "secondary" : "default"}
        className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all hover:shadow-xl"
        aria-label="Навигация по категориям"
      >
        {isOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </Button>

      {/* Desktop: Floating Panel */}
      <div
        className={`fixed bottom-20 left-6 z-40 hidden w-72 max-w-[calc(100vw-3rem)] transform rounded-xl border bg-card shadow-xl transition-all duration-300 md:block ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="border-b px-4 py-3">
          <h3 className="font-semibold">Категории</h3>
          <p className="text-xs text-muted-foreground">
            {categories.length} категорий
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => scrollToCategory(category.id)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile: Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] rounded-t-2xl border-t bg-card shadow-xl animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 pb-3">
              <div>
                <h3 className="font-semibold">Категории</h3>
                <p className="text-xs text-muted-foreground">
                  {categories.length} категорий
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </div>

            {/* List */}
            <div className="max-h-[calc(70vh-5rem)] overflow-y-auto p-2 pb-safe">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => scrollToCategory(category.id)}
                      className="w-full rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-muted active:bg-muted"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
