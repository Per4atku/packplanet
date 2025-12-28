-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_heatProduct_idx" ON "products"("heatProduct");

-- CreateIndex
CREATE INDEX "products_categoryId_heatProduct_idx" ON "products"("categoryId", "heatProduct");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt" DESC);
