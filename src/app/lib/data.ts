"use server";
import { prisma } from "../../prisma-client";

export const getActiveBudget = async (userId: number) => {
  // https://github.com/prisma/prisma/discussions/11443
  const budget = await prisma.budget.findFirst({
    where: {
      userId: userId,
      end: null,
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
        lte: new Date(`${year}-${month}`).toISOString(),
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

export const getUserRecurringExpenses = async (userId: number) => {
  const expenses = await prisma.recurringExpense.findMany({
    where: {
      userId: userId,
    },
  });

  return expenses;
};
