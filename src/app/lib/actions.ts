"use server";
import { Expense } from "@prisma/client";
import { prisma } from "../../prisma-client";
import { category } from "./types";
import exp from "constants";

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
      end: new Date(`${year}-${month}`).toISOString(),
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

export const createExpenses = async (expenses: Expense[]) => {
  const addArray = expenses.map((expense) => {
    return {
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      entryDate: expense.entryDate,
      entryMonth: expense.entryMonth,
      entryYear: expense.entryYear,
      type: expense.type,
      linkedAccount: expense.linkedAccount,
      recurring: expense.recurring,
      userId: expense.userId,
    };
  });

  await prisma.expense.createMany({
    data: addArray,
  });
};

export const updateAndCreateExpenses = async (
  expenses: Expense[],
  month: number,
  year: number,
  userId: number
) => {
  await prisma.expense.deleteMany({
    where: {
      userId: userId,
      entryMonth: month,
      entryYear: year,
    },
  });

  createExpenses(expenses);
};
