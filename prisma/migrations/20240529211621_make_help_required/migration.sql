/*
  Warnings:

  - Made the column `help` on table `ExpenseCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExpenseCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "help" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "curr" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "active" INTEGER NOT NULL,
    "budgetId" INTEGER NOT NULL,
    CONSTRAINT "ExpenseCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseCategory" ("active", "budgetId", "category", "curr", "help", "id", "max", "min", "type") SELECT "active", "budgetId", "category", "curr", "help", "id", "max", "min", "type" FROM "ExpenseCategory";
DROP TABLE "ExpenseCategory";
ALTER TABLE "new_ExpenseCategory" RENAME TO "ExpenseCategory";
PRAGMA foreign_key_check("ExpenseCategory");
PRAGMA foreign_keys=ON;
