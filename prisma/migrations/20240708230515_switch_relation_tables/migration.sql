/*
  Warnings:

  - You are about to drop the column `expenseId` on the `RecurringExpense` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecurringExpense" DROP CONSTRAINT "RecurringExpense_expenseId_fkey";

-- DropIndex
DROP INDEX "RecurringExpense_expenseId_key";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "recurringExpenseId" INTEGER;

-- AlterTable
ALTER TABLE "RecurringExpense" DROP COLUMN "expenseId";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_recurringExpenseId_fkey" FOREIGN KEY ("recurringExpenseId") REFERENCES "RecurringExpense"("id") ON DELETE SET NULL ON UPDATE CASCADE;
