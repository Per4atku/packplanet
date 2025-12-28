import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CatalogCTACard } from "@/components/catalog-cta-card";
import { PartnerCard } from "@/components/partner-card";
import { SectionHeading } from "@/components/section-heading";
import { Space } from "@/components/space";
import { Download, Mail, MapPin, Phone, Clock, Package } from "lucide-react";
import Link from "next/link";
import {
  getFeaturedProducts,
  getLatestPriceList,
} from "@/lib/queries/products";
import { getMainContent } from "@/lib/content";
import {
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
} from "@/components/animations/hero-section";
import { FadeIn } from "@/components/animations/fade-in";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/stagger-container";

export default async function Home() {
  const content = getMainContent();

  // Fetch featured products and latest price list
  const [featuredProducts, priceList] = await Promise.all([
    getFeaturedProducts(3),
    getLatestPriceList(),
  ]);
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection>
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          <HeroTitle>
            {content.hero.title}{" "}
            <span className="text-primary">{content.hero.titleHighlight}</span>
          </HeroTitle>
          <HeroSubtitle>
            {content.hero.subtitle.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </HeroSubtitle>
          <HeroButtons>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="#price-list">
                <Download className="mr-2 h-5 w-5" />
                {content.hero.buttons.priceList}
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
                {content.hero.buttons.contact}
              </Link>
            </Button>
          </HeroButtons>
        </div>
      </HeroSection>

      <Space size="lg" />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="containerize py-12 md:py-16">
          <FadeIn>
            <SectionHeading>{content.featuredProducts.heading}</SectionHeading>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <ProductCard
                    name={product.name}
                    description={product.description}
                    price={`${product.price} руб`}
                    image={product.images[0]}
                    sku={product.sku}
                    unit={product.unit}
                    wholesalePrice={product.wholesalePrice}
                    wholesaleAmount={product.wholesaleAmount}
                    isHot={product.heatProduct}
                  />
                </Link>
              </StaggerItem>
            ))}
            <StaggerItem>
              <CatalogCTACard />
            </StaggerItem>
          </StaggerContainer>
        </section>
      )}

      <Space size="2xl" />

      {/* Price List Section */}
      {priceList && (
        <section id="price-list" className="containerize py-12 md:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn direction="left">
              <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                {content.priceList.heading}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {content.priceList.description}
              </p>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href={priceList.path} download={priceList.filename}>
                  <Download className="mr-2 h-5 w-5" />
                  {content.priceList.downloadButton}
                </a>
              </Button>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
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
            </FadeIn>
          </div>
        </section>
      )}

      <Space size="2xl" />

      {/* Partners Section */}
      <section className="containerize py-12 md:py-16">
        <FadeIn>
          <SectionHeading>{content.partners.heading}</SectionHeading>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.15}
        >
          <StaggerItem>
            <PartnerCard
              name="AlphaCoffee"
              description="Поддержка сетевых столовых и точек кофеен партнера упаковки"
              image="/partners/alphacoffee.jpg"
            />
          </StaggerItem>
          <StaggerItem>
            <PartnerCard
              name="Дальневбуз"
              description="Что-то Тулы-е, се Таро (Талье) про что-то писания старые"
              image="/partners/dalnevbuz.jpg"
            />
          </StaggerItem>
          <StaggerItem>
            <PartnerCard
              name="Черная Каракатица"
              description="Советую посетить-повседневный снабжении Далле"
              image="/partners/karakatica.jpg"
            />
          </StaggerItem>
        </StaggerContainer>
      </section>

      <Space size="2xl" />

      {/* Delivery Section */}
      <section id="delivery" className="containerize py-12 md:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn
            direction="right"
            delay={0.2}
            className="relative flex items-center justify-center lg:order-2"
          >
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
          </FadeIn>

          <FadeIn direction="left" className="lg:order-1">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {content.delivery.heading}{" "}
              <span className="text-primary">
                {content.delivery.headingHighlight}
              </span>
            </h2>
            <div className="mb-8 space-y-4 text-muted-foreground">
              {content.delivery.conditions.map((condition, i) => (
                <p key={i} className="text-lg">
                  <strong className="text-foreground">{condition.text}</strong>
                </p>
              ))}
              <p className="mt-6 text-base">
                {content.delivery.minOrderDelivery}{" "}
                <strong className="text-foreground">
                  {content.delivery.minOrderDeliveryPrice}
                </strong>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Space size="2xl" />

      {/* Contact Section */}
      <section id="contacts" className="containerize py-12 md:py-16">
        <FadeIn>
          <SectionHeading>{content.contacts.heading}</SectionHeading>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            {content.contacts.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-12">
            <h3 className="mb-8 text-2xl font-semibold">
              {content.contacts.cardTitle}
            </h3>

            <StaggerContainer className="space-y-6" staggerDelay={0.1}>
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {content.contacts.address.label}
                    </h4>
                    <p className="text-muted-foreground">
                      {content.contacts.address.value}
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {content.contacts.workingHours.label}
                    </h4>
                    <p className="text-muted-foreground">
                      {content.contacts.workingHours.weekdays}
                      <br />
                      {content.contacts.workingHours.weekends}
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {content.contacts.phone.label}
                    </h4>
                    <div className="space-y-1 text-muted-foreground">
                      {content.contacts.phone.numbers.map((phone, i) => (
                        <p key={i}>
                          <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="hover:text-primary"
                          >
                            {phone}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {content.contacts.email.label}
                    </h4>
                    <p className="text-muted-foreground">
                      <a
                        href={`mailto:${content.contacts.email.value}`}
                        className="hover:text-primary"
                      >
                        {content.contacts.email.value}
                      </a>
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <Button size="lg" className="mt-8 w-full" asChild>
              <a
                href="https://yandex.ru/maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 h-5 w-5" />
                {content.contacts.mapButton}
              </a>
            </Button>
          </div>
        </FadeIn>
      </section>

      <Space size="2xl" />
    </main>
  );
}
