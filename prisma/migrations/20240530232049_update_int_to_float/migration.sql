/*
  Warnings:

  - You are about to alter the column `curr` on the `ExpenseCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `max` on the `ExpenseCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `min` on the `ExpenseCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `curr` on the `IncomeCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `max` on the `IncomeCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `min` on the `IncomeCategory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExpenseCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "help" TEXT NOT NULL,
    "min" REAL NOT NULL,
    "max" REAL NOT NULL,
    "curr" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "active" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "ExpenseCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseCategory" ("active", "budgetId", "category", "curr", "help", "id", "max", "min", "type") SELECT "active", "budgetId", "category", "curr", "help", "id", "max", "min", "type" FROM "ExpenseCategory";
DROP TABLE "ExpenseCategory";
ALTER TABLE "new_ExpenseCategory" RENAME TO "ExpenseCategory";
CREATE TABLE "new_IncomeCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "help" TEXT NOT NULL,
    "min" REAL NOT NULL,
    "max" REAL NOT NULL,
    "curr" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "active" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "IncomeCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_IncomeCategory" ("active", "budgetId", "category", "curr", "help", "id", "max", "min", "type") SELECT "active", "budgetId", "category", "curr", "help", "id", "max", "min", "type" FROM "IncomeCategory";
DROP TABLE "IncomeCategory";
ALTER TABLE "new_IncomeCategory" RENAME TO "IncomeCategory";
PRAGMA foreign_key_check("ExpenseCategory");
PRAGMA foreign_key_check("IncomeCategory");
PRAGMA foreign_keys=ON;
