import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.priceList.deleteMany();

  // Create Categories
  console.log("Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Картонная упаковка",
      },
    }),
    prisma.category.create({
      data: {
        name: "Пластиковая упаковка",
      },
    }),
    prisma.category.create({
      data: {
        name: "Бумажная упаковка",
      },
    }),
    prisma.category.create({
      data: {
        name: "Термоусадочная пленка",
      },
    }),
    prisma.category.create({
      data: {
        name: "Стрейч-пленка",
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create Products
  console.log("Creating products...");
  const products = await Promise.all([
    // Картонная упаковка
    prisma.product.create({
      data: {
        sku: "BOX-001",
        name: "Гофрокороб 300x200x200 мм",
        price: 45.5,
        unit: "шт",
        categoryId: categories[0].id,
        description: "Трехслойный гофрокороб из бурого картона марки Т-22",
        images: ["/products/box-001.jpg"],
        wholesalePrice: 42.0,
        wholesaleAmount: 100,
      },
    }),
    prisma.product.create({
      data: {
        sku: "BOX-002",
        name: "Гофрокороб 400x300x300 мм",
        price: 68.0,
        unit: "шт",
        categoryId: categories[0].id,
        description: "Трехслойный гофрокороб из бурого картона марки Т-23",
        images: ["/products/box-002.jpg"],
        wholesalePrice: 63.0,
        wholesaleAmount: 100,
      },
    }),
    prisma.product.create({
      data: {
        sku: "BOX-003",
        name: "Гофрокороб 600x400x400 мм",
        price: 125.0,
        unit: "шт",
        categoryId: categories[0].id,
        description: "Пятислойный гофрокороб усиленный марки П-33",
        images: ["/products/box-003.jpg"],
        wholesalePrice: 115.0,
        wholesaleAmount: 50,
      },
    }),

    // Пластиковая упаковка
    prisma.product.create({
      data: {
        sku: "CONT-001",
        name: "Пластиковый контейнер 500 мл",
        price: 12.5,
        unit: "шт",
        categoryId: categories[1].id,
        description: "Прозрачный пищевой контейнер с крышкой",
        images: ["/products/cont-001.jpg"],
        wholesalePrice: 11.0,
        wholesaleAmount: 500,
      },
    }),
    prisma.product.create({
      data: {
        sku: "CONT-002",
        name: "Пластиковый контейнер 1000 мл",
        price: 18.0,
        unit: "шт",
        categoryId: categories[1].id,
        description: "Прозрачный пищевой контейнер с крышкой",
        images: ["/products/cont-002.jpg"],
        wholesalePrice: 16.5,
        wholesaleAmount: 500,
      },
    }),
    prisma.product.create({
      data: {
        sku: "BAG-001",
        name: "Пакет ПВД 30x40 см",
        price: 2.5,
        unit: "шт",
        categoryId: categories[1].id,
        description: "Полиэтиленовый пакет высокого давления",
        images: ["/products/bag-001.jpg"],
        wholesalePrice: 2.2,
        wholesaleAmount: 1000,
      },
    }),

    // Бумажная упаковка
    prisma.product.create({
      data: {
        sku: "PAPER-001",
        name: "Крафт-пакет 260x140x350 мм",
        price: 8.5,
        unit: "шт",
        categoryId: categories[2].id,
        description: "Бумажный пакет с плоским дном и ручками",
        images: ["/products/paper-001.jpg"],
        wholesalePrice: 7.8,
        wholesaleAmount: 500,
      },
    }),
    prisma.product.create({
      data: {
        sku: "PAPER-002",
        name: "Упаковочная бумага 840 мм",
        price: 580.0,
        unit: "рулон",
        categoryId: categories[2].id,
        description: "Крафт-бумага в рулоне, длина 300 м",
        images: ["/products/paper-002.jpg"],
        wholesalePrice: 550.0,
        wholesaleAmount: 10,
      },
    }),

    // Термоусадочная пленка
    prisma.product.create({
      data: {
        sku: "SHRINK-001",
        name: "Термоусадочная пленка 450 мм",
        price: 1250.0,
        unit: "рулон",
        categoryId: categories[3].id,
        description: "ПВХ термоусадочная пленка, толщина 15 мкм, длина 600 м",
        images: ["/products/shrink-001.jpg"],
        wholesalePrice: 1180.0,
        wholesaleAmount: 5,
        heatProduct: true,
      },
    }),
    prisma.product.create({
      data: {
        sku: "SHRINK-002",
        name: "Термоусадочная пленка 600 мм",
        price: 1680.0,
        unit: "рулон",
        categoryId: categories[3].id,
        description: "ПВХ термоусадочная пленка, толщина 15 мкм, длина 600 м",
        images: ["/products/shrink-002.jpg"],
        wholesalePrice: 1580.0,
        wholesaleAmount: 5,
        heatProduct: true,
      },
    }),

    // Стрейч-пленка
    prisma.product.create({
      data: {
        sku: "STRETCH-001",
        name: "Стрейч-пленка 500 мм x 300 м",
        price: 890.0,
        unit: "рулон",
        categoryId: categories[4].id,
        description: "Машинная стрейч-пленка, толщина 20 мкм",
        images: ["/products/stretch-001.jpg"],
        wholesalePrice: 850.0,
        wholesaleAmount: 10,
      },
    }),
    prisma.product.create({
      data: {
        sku: "STRETCH-002",
        name: "Стрейч-пленка 500 мм x 150 м",
        price: 450.0,
        unit: "рулон",
        categoryId: categories[4].id,
        description: "Ручная стрейч-пленка, толщина 17 мкм",
        images: ["/products/stretch-002.jpg"],
        wholesalePrice: 420.0,
        wholesaleAmount: 20,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // Create Partners
  console.log("Creating partners...");
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: "ООО 'Упаковочные Технологии'",
        description: "Ведущий производитель гофрокартона и гофротары в России",
        image: "/partners/partner-01.jpg",
      },
    }),
    prisma.partner.create({
      data: {
        name: "ЗАО 'Пластик-Групп'",
        description: "Производитель пластиковой упаковки и контейнеров",
        image: "/partners/partner-02.jpg",
      },
    }),
    prisma.partner.create({
      data: {
        name: "ООО 'Крафт-Индустрия'",
        description: "Производитель бумажной и картонной упаковки",
        image: "/partners/partner-03.jpg",
      },
    }),
    prisma.partner.create({
      data: {
        name: "АО 'Термопласт'",
        description: "Производитель термоусадочной и стрейч-пленки",
        image: "/partners/partner-04.jpg",
      },
    }),
  ]);

  console.log(`Created ${partners.length} partners`);

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
