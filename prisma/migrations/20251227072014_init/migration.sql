-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wholesalePrice" DOUBLE PRECISION,
    "wholesaleAmount" INTEGER,
    "heatProduct" BOOLEAN NOT NULL DEFAULT false,
    "linkedProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_lists" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "products"("sku");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
