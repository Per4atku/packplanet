import Script from "next/script";
import { getPrimaryPhone } from "@/lib/phones";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  }[];
  sameAs?: string[];
}

export function OrganizationStructuredData() {
  const primaryPhone = getPrimaryPhone();
  const structuredData: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Планета Упаковки",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://packplanet.ru",
    logo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://packplanet.ru"
    }/logo.png`,
    description:
      "Одноразовая посуда и упаковка. Быстрая доставка по всей России. Качественные материалы по конкурентным ценам.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Океанский проспект, 54",
      addressLocality: "Владивосток",
      addressCountry: "RU",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: primaryPhone.href,
        contactType: "customer service",
        areaServed: "RU",
        availableLanguage: "Russian",
      },
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image?: string[];
  sku?: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
}

interface ProductStructuredDataProps {
  name: string;
  description: string;
  price: number;
  sku?: string;
  images?: string[];
  url: string;
}

export function ProductStructuredData({
  name,
  description,
  price,
  sku,
  images,
  url,
}: ProductStructuredDataProps) {
  const structuredData: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(images && images.length > 0 && { image: images }),
    ...(sku && { sku }),
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <Script
      id={`product-schema-${sku || name}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function WebsiteStructuredData() {
  const structuredData: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Планета Упаковки",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://pack-planet.ru",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://pack-planet.ru"
        }/catalog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
