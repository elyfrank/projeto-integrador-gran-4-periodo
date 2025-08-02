/*
  Warnings:

  - You are about to alter the column `barcode` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "barcode" INTEGER,
    "description" TEXT NOT NULL,
    "quantityInStock" INTEGER,
    "validityDate" DATETIME,
    "imageUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("barcode", "categoryId", "createdAt", "description", "id", "imageUrl", "name", "quantityInStock", "updatedAt", "validityDate") SELECT "barcode", "categoryId", "createdAt", "description", "id", "imageUrl", "name", "quantityInStock", "updatedAt", "validityDate" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
