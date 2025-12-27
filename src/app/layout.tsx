import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Планета Упаковки | Ваш надежный поставщик упаковки",
  description: "Одноразовая посуда и упаковка. Быстрая доставка по всей России. Качественные материалы по конкурентным ценам.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
