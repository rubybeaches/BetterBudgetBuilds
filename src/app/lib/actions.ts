"use server";
import { Expense } from "@prisma/client";
import { prisma } from "../../prisma-client";
import { category } from "./types";
import { revalidatePath } from "next/cache";

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

// TO-DO: Instead of deleting whole budget on update, just update the income/expense categories
// either delete all associated with the budget and recreate or, since they should all ideally exist...
// isolate changes programteically then update them in a script here one by one
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

export const updateBudgetIncome = async (
  income: number,
  userId: number,
  budgetId: number
) => {
  await prisma.budget.update({
    where: {
      id: budgetId,
      userId: userId,
    },
    data: {
      income: income,
    },
  });
};

export const updateBudgetIncomeCategories = async (
  incomeCategories: category[],
  budgetId: number
) => {
  await prisma.incomeCategory.deleteMany({
    where: {
      budgetId: budgetId,
    },
  });

  const addArray = incomeCategories.map((category) => {
    return {
      budgetId: budgetId,
      ...category,
    };
  });

  await prisma.incomeCategory.createMany({
    data: addArray,
  });
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
      recurringExpenseId: expense.recurringExpenseId || null,
    };
  });

  return await prisma.expense.createMany({
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

  return createExpenses(expenses);
};

export const createRecurrence = async (
  amount: number | undefined,
  category: string | undefined,
  type: string | undefined,
  description: string | undefined,
  day: number,
  months: number[],
  userId: number
) => {
  let recurrence = await prisma.recurringExpense.create({
    data: {
      amount: amount,
      category: category,
      type: type,
      description: description,
      day: day,
      months: months,
      userId: userId,
    },
  });

  return recurrence;
};

export const clearUnusedRecurrences = async (userId: number) => {
  await prisma.recurringExpense.deleteMany({
    where: {
      userId: userId,
      expense: {
        none: {},
      },
    },
  });
};

export const createLoan = async (
  name: string,
  amount: number,
  startDate: string,
  minPayment: number,
  term: number,
  apr: number,
  userId: number
) => {
  await prisma.loan.create({
    data: {
      userId: userId,
      name: name,
      amount: amount,
      startDate: new Date(startDate).toISOString(),
      minPayment: minPayment,
      term: term,
      apr: apr,
    },
  });
};

export const updateLoan = async (
  name: string,
  amount: number,
  startDate: string,
  minPayment: number,
  term: number,
  apr: number,
  loanId: number,
  userId: number
) => {
  await prisma.loan.update({
    where: {
      id: loanId,
    },
    data: {
      userId: userId,
      name: name,
      amount: amount,
      startDate: new Date(startDate).toISOString(),
      minPayment: minPayment,
      term: term,
      apr: apr,
    },
  });
};

export const removeLoan = async (id: number, userId: number) => {
  await prisma.loan.delete({
    where: {
      userId: userId,
      id: id,
    },
  });
};
