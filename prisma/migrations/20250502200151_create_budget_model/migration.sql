/*
  Warnings:

  - Added the required column `newBudgetId` to the `ExpenseCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newBudgetId` to the `IncomeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseCategory" ADD COLUMN     "newBudgetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IncomeCategory" ADD COLUMN     "newBudgetId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CreateBudget" (
    "id" SERIAL NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CreateBudget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreateBudget_userId_key" ON "CreateBudget"("userId");

-- AddForeignKey
ALTER TABLE "CreateBudget" ADD CONSTRAINT "CreateBudget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_newBudgetId_fkey" FOREIGN KEY ("newBudgetId") REFERENCES "CreateBudget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeCategory" ADD CONSTRAINT "IncomeCategory_newBudgetId_fkey" FOREIGN KEY ("newBudgetId") REFERENCES "CreateBudget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
