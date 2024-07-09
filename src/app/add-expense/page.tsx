import { UserAuth } from "../lib/UserAuth";
import {
  getUserBudget,
  getUserExpenses,
  getUserRecurringExpenses,
} from "../lib/data";
import { allMonths, defaultIncomeCategories } from "../lib/helpers";
import categories from "../lib/seed.json";
import AddExpense from "./expensePage";
import { ExpenseRecurrence } from "../lib/types";

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
    year?: string;
  };
}) => {
  const user = await UserAuth();
  if (!user) return null;

  let month =
    searchParams?.month && allMonths.includes(searchParams?.month)
      ? searchParams?.month
      : new Date().toLocaleString("en-US", { month: "long" });
  const year = Number(searchParams?.year) || new Date().getFullYear();

  const budget = await getUserBudget(
    allMonths.indexOf(month) + 1,
    year,
    user.id
  );

  let expenses = await getUserExpenses(
    allMonths.indexOf(month) + 1,
    year,
    user.id
  );

  const recurringExpenses = await getUserRecurringExpenses(user.id);

  let expensesWithRecurrence: ExpenseRecurrence[] = expenses.map((expense) => {
    return { ...expense, recurrence: null };
  });

  if (expenses && recurringExpenses) {
    expensesWithRecurrence = expensesWithRecurrence.map((expense) => {
      if (
        expense.recurring &&
        recurringExpenses.some((r) => r.id == expense.recurringExpenseId)
      ) {
        let recurrenceData = recurringExpenses.filter(
          (r) => r.id == expense.recurringExpenseId
        );
        return { ...expense, recurrence: recurrenceData[0] };
      } else {
        return expense;
      }
    });
  }

  return (
    <AddExpense
      expenseCategories={budget?.expenseCategories || categories}
      incomeCategories={budget?.incomeCategories || defaultIncomeCategories}
      expenses={expensesWithRecurrence}
      baseIncome={budget?.income || 0}
      month={month}
      year={year}
      userID={user.id}
    />
  );
};
export default Page;
