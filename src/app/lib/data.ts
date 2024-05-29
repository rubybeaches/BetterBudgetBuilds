"use server";
import { prisma } from "./prisma-client";

export const getUserBudget = async (
  month: number,
  year: number,
  userId: number
) => {
  // https://github.com/prisma/prisma/discussions/11443
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
      incomeCategories: {
        select: {
          category: true,
          help: true,
          min: true,
          max: true,
          curr: true,
          type: true,
          active: true,
        },
      },
      expenseCategories: {
        select: {
          category: true,
          help: true,
          min: true,
          max: true,
          curr: true,
          type: true,
          active: true,
        },
      },
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
