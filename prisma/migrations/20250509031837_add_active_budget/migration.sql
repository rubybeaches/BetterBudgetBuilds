/*
  Warnings:

  - You are about to drop the column `newBudgetId` on the `ExpenseCategory` table. All the data in the column will be lost.
  - You are about to drop the column `newBudgetId` on the `IncomeCategory` table. All the data in the column will be lost.
  - You are about to drop the `CreateBudget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreateBudget" DROP CONSTRAINT "CreateBudget_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExpenseCategory" DROP CONSTRAINT "ExpenseCategory_newBudgetId_fkey";

-- DropForeignKey
ALTER TABLE "IncomeCategory" DROP CONSTRAINT "IncomeCategory_newBudgetId_fkey";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ExpenseCategory" DROP COLUMN "newBudgetId";

-- AlterTable
ALTER TABLE "IncomeCategory" DROP COLUMN "newBudgetId";

-- DropTable
DROP TABLE "CreateBudget";
