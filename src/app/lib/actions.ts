"use server";
import { prisma } from "../../prisma-client";
import { category } from "./types";

export const createBudget = async (
  expenseCategories: category[],
  incomeCategories: category[],
  income: number,
  month: number,
  year: number,
  userId: number
) => {
  await prisma.budget.create({
    data: {
      userId: userId,
      income: income,
      start: new Date(`${year}-${month}`).toISOString(),
      incomeCategories: {
        create: incomeCategories,
      },
      expenseCategories: {
        create: expenseCategories,
      },
    },
  });
};

export const updateActiveBudget = async (
  expenseCategories: category[],
  incomeCategories: category[],
  income: number,
  month: number,
  year: number,
  userId: number,
  budgetId: number
) => {
  await prisma.budget.delete({
    where: {
      id: budgetId,
    },
  });

  createBudget(
    expenseCategories,
    incomeCategories,
    income,
    month,
    year,
    userId
  );
};

export const updateAndCreateBudget = async (
  expenseCategories: category[],
  incomeCategories: category[],
  income: number,
  month: number,
  year: number,
  userId: number,
  budgetId: number
) => {
  await prisma.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      end: new Date(`${year}-${month - 1}`).toISOString(),
    },
  });

  createBudget(
    expenseCategories,
    incomeCategories,
    income,
    month,
    year,
    userId
  );
};
