import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://packplanet.ru'),
  title: {
    default: "Планета Упаковки | Ваш надежный поставщик упаковки",
    template: "%s | Планета Упаковки"
  },
  description: "Одноразовая посуда и упаковка. Быстрая доставка по всей России. Качественные материалы по конкурентным ценам. Скачайте наш прайс-лист и ознакомьтесь с каталогом продукции.",
  keywords: ["одноразовая посуда", "упаковка", "пищевая упаковка", "доставка упаковки", "прайс-лист упаковки", "оптом упаковка", "одноразовые стаканы", "контейнеры для еды"],
  authors: [{ name: "Планета Упаковки" }],
  creator: "Планета Упаковки",
  publisher: "Планета Упаковки",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Планета Упаковки",
    title: "Планета Упаковки | Ваш надежный поставщик упаковки",
    description: "Одноразовая посуда и упаковка. Быстрая доставка по всей России. Качественные материалы по конкурентным ценам.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Планета Упаковки - Одноразовая посуда и упаковка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Планета Упаковки | Ваш надежный поставщик упаковки",
    description: "Одноразовая посуда и упаковка. Быстрая доставка по всей России.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased`}>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        {children}
      </body>
    </html>
  );
}
