import { Expense, RecurringExpense } from "@prisma/client";

export type category = {
  category: string;
  help: string;
  min: number;
  max: number;
  curr: number;
  type: string;
  active: number;
};

export type expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  entryDate: string;
  type: string;
  recurring: boolean;
  linkedAccount: string;
};

export type ExpenseRecurrence = Expense & {
  recurrence: RecurringExpense | null;
};

export type loan = {
  id: number;
  name: string;
  amount: number;
  startDate: Date;
  minPayment: number;
  term: number;
  apr: number;
};
