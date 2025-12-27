import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CatalogCTACard } from "@/components/catalog-cta-card";
import { PartnerCard } from "@/components/partner-card";
import { SectionHeading } from "@/components/section-heading";
import { Space } from "@/components/space";
import { Download, Mail, MapPin, Phone, Clock, Package } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="containerize py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Ваш надежный поставщик{" "}
            <span className="text-primary">упаковки</span>
          </h1>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Одноразовая посуда и упаковка.
            <br />
            Быстрая доставка
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="#price-list">
                <Download className="mr-2 h-5 w-5" />
                Прайс-лист
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="#contacts">
                <Phone className="mr-2 h-5 w-5" />
                Связаться с нами
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Space size="2xl" />

      {/* Popular Products Section */}
      <section className="containerize py-12 md:py-16">
        <SectionHeading>Популярные Товары</SectionHeading>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            name="Стакан белый"
            description="Стандартный белый"
            price="255 рублей"
            priceNote="(Наша цена/шт)"
            isNew
            isHot
          />
          <ProductCard
            name="Пленка 15300х200м Паллет (Тульи)"
            description="Качество гарантировано"
            price="100 рублей"
            priceNote="(Наша цена/шт)"
          />
          <ProductCard
            name="Пакет белый"
            description="Пленка ПНД 1000х600х20"
            price="2000 рублей"
            priceNote="(Пачка упаковочная)"
            isNew
            isHot
          />
          <CatalogCTACard />
        </div>
      </section>

      <Space size="2xl" />

      {/* Price List Section */}
      <section id="price-list" className="containerize py-12 md:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Прайс-Лист
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Скачайте актуальный прайс-лист со всей продукцией и ценами
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" />
              Скачать прайс-лист
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              {/* Illustration placeholder - you can replace with actual 3D illustration */}
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-12">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-48 w-40 flex-col items-center justify-center rounded-2xl bg-primary/20 shadow-2xl">
                      <Package className="mb-4 h-16 w-16 text-primary" />
                      <div className="space-y-2">
                        <div className="h-2 w-24 rounded-full bg-primary/30"></div>
                        <div className="h-2 w-20 rounded-full bg-primary/30"></div>
                        <div className="h-2 w-16 rounded-full bg-primary/30"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl">
                    <Download className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Space size="2xl" />

      {/* Partners Section */}
      <section className="containerize py-12 md:py-16">
        <SectionHeading>Наши Партнеры</SectionHeading>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PartnerCard
            name="AlphaCoffee"
            description="Поддержка сетевых столовых и точек кофеен партнера упаковки"
            image="/partners/alphacoffee.jpg"
          />
          <PartnerCard
            name="Дальневбуз"
            description="Что-то Тулы-е, се Таро (Талье) про что-то писания старые"
            image="/partners/dalnevbuz.jpg"
          />
          <PartnerCard
            name="Черная Каракатица"
            description="Советую посетить-повседневный снабжении Далле"
            image="/partners/karakatica.jpg"
          />
        </div>
      </section>

      <Space size="2xl" />

      {/* Delivery Section */}
      <section id="delivery" className="containerize py-12 md:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative flex items-center justify-center lg:order-2">
            {/* Delivery truck illustration placeholder */}
            <div className="relative aspect-square w-full max-w-md">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-12">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Package className="h-32 w-32 text-primary" />
                      <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <span className="text-2xl">🚚</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:order-1">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Доставка <span className="text-primary">БЕСПЛАТНАЯ*</span>
            </h2>
            <div className="mb-8 space-y-4 text-muted-foreground">
              <p className="text-lg">
                <strong className="text-foreground">
                  * от 2000₽ (Центр, 1-ая Речка, Некрасовская, Третья рабочая)
                </strong>
              </p>
              <p className="text-lg">
                <strong className="text-foreground">
                  * от 3000₽ (Отдаленные районы города)
                </strong>
              </p>
              <p className="mt-6 text-base">
                На заказ менее 2000₽ — доставка{" "}
                <strong className="text-foreground">450₽</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Space size="2xl" />

      {/* Contact Section */}
      <section id="contacts" className="containerize py-12 md:py-16">
        <SectionHeading>Свяжитесь с нами</SectionHeading>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Заходите к нам, звоните или пишите — мы всегда готовы помочь вам!
        </p>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-12">
            <h3 className="mb-8 text-2xl font-semibold">
              Контактная информация
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Адрес</h4>
                  <p className="text-muted-foreground">
                    Владивосток, Океанский проспект 54, 2 этаж
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Время работы</h4>
                  <p className="text-muted-foreground">
                    Пн—Пт: 10:00—18:00
                    <br />
                    Сб—Вс: 10:00—17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Телефоны</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      <a
                        href="tel:+78002347876"
                        className="hover:text-primary"
                      >
                        8 (800) 234-78-76
                      </a>
                    </p>
                    <p>
                      <a
                        href="tel:+74212444855"
                        className="hover:text-primary"
                      >
                        +7 (421) 244-48-55
                      </a>
                    </p>
                    <p>
                      <a
                        href="tel:+74232462476"
                        className="hover:text-primary"
                      >
                        +7 (423) 246-24-76
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Почта</h4>
                  <p className="text-muted-foreground">
                    <a
                      href="mailto:sinfo@wsk.ru"
                      className="hover:text-primary"
                    >
                      sinfo@wsk.ru
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="mt-8 w-full" asChild>
              <a
                href="https://yandex.ru/maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Перейти в Яндекс-Карты
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Space size="2xl" />
    </div>
  );
}
