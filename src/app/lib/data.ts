"use server";
import { prisma } from "./prisma-client";

export const getUserBudget = async (
  month: number,
  year: number,
  userId: number
) => {
  const budget = await prisma.budget.findFirst({
    orderBy: [
      {
        start: "desc",
      },
    ],
    where: {
      userId: userId,
      start: {
        gte: new Date(`${year}-${month}`).toISOString(),
      },
    },
    include: {
      incomeCategories: true,
      expenseCategories: true,
    },
  });

  return budget;
};

export const getUserExpenses = async (
  month: number,
  year: number,
  userId: number
) => {
  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
      entryMonth: month,
      entryYear: year,
    },
  });

  return expenses;
};
