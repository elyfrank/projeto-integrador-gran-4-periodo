/*
  Warnings:

  - Added the required column `address` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainContact` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Supplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mainContact" TEXT NOT NULL
);
INSERT INTO "new_Supplier" ("id", "name") SELECT "id", "name" FROM "Supplier";
DROP TABLE "Supplier";
ALTER TABLE "new_Supplier" RENAME TO "Supplier";
CREATE UNIQUE INDEX "Supplier_cnpj_key" ON "Supplier"("cnpj");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
