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

  const expenses = await getUserExpenses(
    allMonths.indexOf(month) + 1,
    year,
    user.id
  );
  const recurringExpenses = await getUserRecurringExpenses(user.id);
  let expensesWithRecurrence: ExpenseRecurrence[] = expenses.map((expense) => {
    return { ...expense, recurrence: null };
  });

  if (expenses.length > 0 && recurringExpenses.length > 0) {
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

  let activeRecurrences = recurringExpenses.filter(
    (recurrence) =>
      recurrence.active && recurrence.months.includes(allMonths.indexOf(month))
  );
  let expenseAddedFlag = false;

  if (
    expenses.length == 0 &&
    recurringExpenses.length > 0 &&
    allMonths.indexOf(month) == new Date().getMonth() &&
    year == new Date().getFullYear()
  ) {
    expensesWithRecurrence = activeRecurrences.map((recurrence) => {
      let newExpense: ExpenseRecurrence = {
        id: Date.now(),
        amount: recurrence.amount ? recurrence.amount : 0,
        category: recurrence.category || "",
        description: recurrence.description || "",
        entryDate: recurrence.day
          ? `${allMonths.indexOf(month) < 9 ? "0" : ""}${
              allMonths.indexOf(month) + 1
            }-${recurrence.day < 10 ? "0" : ""}${recurrence.day}-${year}`
          : "",
        entryMonth: allMonths.indexOf(month) + 1,
        entryYear: year,
        type: recurrence.type || "",
        recurring: true,
        linkedAccount: "",
        userId: recurrence.userId,
        recurringExpenseId: recurrence.id,
        recurrence: recurrence,
      };

      return newExpense;
    });
    expenseAddedFlag = true;
  }

  return (
    <AddExpense
      expenseCategories={budget?.expenseCategories || categories}
      incomeCategories={budget?.incomeCategories || defaultIncomeCategories}
      expenses={expensesWithRecurrence}
      expenseAddedFlag={expenseAddedFlag}
      baseIncome={budget?.income || 0}
      month={month}
      year={year}
      userID={user.id}
    />
  );
};
export default Page;
