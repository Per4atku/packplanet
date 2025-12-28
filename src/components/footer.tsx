import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", name: "Главная" },
  { href: "/products", name: "Каталог" },
  { href: "/#price-list", name: "Прайс-Лист" },
  { href: "/#delivery", name: "Условия Доставки" },
  { href: "/#contacts", name: "Наши Контакты" },
];
const phones = [
  "8 (800) 234-78-75",
  "+7 (423) 245-78-75",
  "+7 (423) 244-65-55",
];

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                <Image
                  src={"/logo.png"}
                  width={500}
                  height={500}
                  alt=""
                  className="w-14 h-14"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Планета Упаковки</h3>
                <p className="text-xs text-gray-400">Planeta Upakovki</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Ваш надежный поставщик упаковочных материалов и одноразовой
              посуды.
            </p>
          </div>

          {/* Navigation (linked to navLinks) */}
          <div>
            <h4 className="font-semibold mb-4 text-eco-green">Навигация</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-eco-green">Контакты</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-eco-green" />
                <span className="text-gray-300">{phones[0]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-eco-green" />
                <span className="text-gray-300">pack-w@mail.ru</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-eco-green mt-0.5" />
                <span className="text-gray-300">
                  Океанский проспект, 54
                  <br />2 этаж, Владивосток
                </span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-semibold mb-4 text-eco-green">Режим работы</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Понедельник–Пятница</p>
              <p className="font-medium">10:00–18:00</p>
              <p>Суббота–Воскресенье</p>
              <p className="font-medium">10:00–17:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Планета Упаковки. Все права
              защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
