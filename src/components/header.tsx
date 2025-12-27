import Link from "next/link";
import { Phone } from "lucide-react";

export function Header() {
  return (
    <header className="sticky rounded-full top-4 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="containerize flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-white">П</span>
          </div>
          <span className="hidden font-bold text-foreground sm:inline-block">
            Планета Упаковки
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Каталог
          </Link>
          <Link
            href="#price-list"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Прайс-Лист
          </Link>
          <Link
            href="#delivery"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Условия Доставки
          </Link>
          <Link
            href="#contacts"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Контакты
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+78002347876"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">8 (800) 234-78-76</span>
          </a>
        </div>
      </div>
    </header>
  );
}
