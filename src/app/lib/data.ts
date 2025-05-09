"use server";
import { prisma } from "../../prisma-client";
import { category } from "./types";
import { defaultIncomeCategories } from "../lib/helpers";
import categories from "../lib/seed.json";

export const getActiveBudget = async (userId: number) => {
  // https://github.com/prisma/prisma/discussions/11443
  const budget = await prisma.budget.findFirst({
    where: {
      userId: userId,
      end: null,
      active: true,
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

export const getDraftBudget = async (userId: number) => {
  let draft = await prisma.budget.findFirst({
    where: {
      userId: userId,
      active: false,
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

  return draft;
};

export const getOrCreateDraftBudget = async (userId: number) => {
  let draft = await getDraftBudget(userId);
  if (draft) return draft;

  let budget = await getActiveBudget(userId);
  await createBudgetFromTemplate(
    budget?.expenseCategories || categories,
    budget?.incomeCategories || defaultIncomeCategories,
    budget?.income || 35000,
    userId
  );

  draft = await getDraftBudget(userId);
  return draft;
};

export const createBudgetFromTemplate = async (
  expenseCategories: category[],
  incomeCategories: category[],
  income: number,
  userId: number
) => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  return await prisma.budget.create({
    data: {
      userId: userId,
      income: income,
      start: new Date(`${year}-${month + 1}`).toISOString(),
      incomeCategories: {
        create: incomeCategories,
      },
      expenseCategories: {
        create: expenseCategories,
      },
    },
  });
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
      active: true,
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

export const getUserLoans = async (userId: number) => {
  const loans = await prisma.loan.findMany({
    orderBy: [
      {
        id: "asc",
      },
    ],
    where: {
      userId: userId,
    },
  });

  return loans;
};
