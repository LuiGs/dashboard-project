/*
  Warnings:

  - You are about to drop the `CategoryPromotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductPromotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DiscountCodeType" AS ENUM ('PERCENTAGE', 'FIXED');

-- DropForeignKey
ALTER TABLE "CategoryPromotion" DROP CONSTRAINT "CategoryPromotion_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryPromotion" DROP CONSTRAINT "CategoryPromotion_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPromotion" DROP CONSTRAINT "ProductPromotion_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPromotion" DROP CONSTRAINT "ProductPromotion_promotionId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountCodeId" TEXT;

-- DropTable
DROP TABLE "CategoryPromotion";

-- DropTable
DROP TABLE "ProductPromotion";

-- DropTable
DROP TABLE "Promotion";

-- DropEnum
DROP TYPE "ApplyTo";

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountAmount" INTEGER NOT NULL,
    "discountType" "DiscountCodeType" NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "allProducts" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "limit" INTEGER,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiscountCodeToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscountCodeToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "_DiscountCodeToProduct_B_index" ON "_DiscountCodeToProduct"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCodeToProduct" ADD CONSTRAINT "_DiscountCodeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "DiscountCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCodeToProduct" ADD CONSTRAINT "_DiscountCodeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
