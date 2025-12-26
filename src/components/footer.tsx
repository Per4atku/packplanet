import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-50">
      <div className="containerize py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold">П</span>
              </div>
              <span className="font-bold">Планета Упаковки</span>
            </div>
            <p className="text-sm text-slate-400">
              Одноразовая посуда и упаковка.
              <br />
              Быстрая доставка по всей России.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Разделы сайта</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalog"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  Каталог
                </Link>
              </li>
              <li>
                <Link
                  href="#price-list"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  Прайс-Лист
                </Link>
              </li>
              <li>
                <Link
                  href="#delivery"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  Условия Доставки
                </Link>
              </li>
              <li>
                <Link
                  href="#contacts"
                  className="text-slate-400 transition-colors hover:text-primary"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold">Контакты</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <a href="tel:+78002347876" className="hover:text-primary">
                    8 (800) 234-78-76
                  </a>
                  <br />
                  <a href="tel:+74212444855" className="hover:text-primary">
                    +7 (421) 244-48-55
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:office@pack.ru" className="hover:text-primary">
                  office@pack.ru
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 font-semibold">График работы</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>Пн—Пт: 10:00—18:00</p>
                  <p>Сб—Вс: 10:00—17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>
                  Владивосток, Океанский проспект 54, 2 этаж,
                  <br />
                  Николаевск, Тихая, Миша
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>© 2025 Проект Планеты. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
