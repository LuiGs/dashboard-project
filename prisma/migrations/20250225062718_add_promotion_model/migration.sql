/*
  Warnings:

  - You are about to drop the `_CategoryPromotions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductPromotions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `applyTo` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplyTo" AS ENUM ('PRODUCT', 'CATEGORY', 'ALL');

-- DropForeignKey
ALTER TABLE "_CategoryPromotions" DROP CONSTRAINT "_CategoryPromotions_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryPromotions" DROP CONSTRAINT "_CategoryPromotions_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductPromotions" DROP CONSTRAINT "_ProductPromotions_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductPromotions" DROP CONSTRAINT "_ProductPromotions_B_fkey";

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "applyTo" "ApplyTo" NOT NULL;

-- DropTable
DROP TABLE "_CategoryPromotions";

-- DropTable
DROP TABLE "_ProductPromotions";

-- CreateTable
CREATE TABLE "ProductPromotion" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "ProductPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryPromotion" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "CategoryPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPromotion_productId_promotionId_key" ON "ProductPromotion"("productId", "promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPromotion_categoryId_promotionId_key" ON "CategoryPromotion"("categoryId", "promotionId");

-- AddForeignKey
ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPromotion" ADD CONSTRAINT "CategoryPromotion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPromotion" ADD CONSTRAINT "CategoryPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
