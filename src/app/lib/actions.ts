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
