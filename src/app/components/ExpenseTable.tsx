import { sortExpenses } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import { useMemo, useState } from "react";
import ExpenseRow from "./Dashboard/ExpenseRow";
import AddExpenseRow from "./AddExpense/AddExpenseRow";
import { category, ExpenseRecurrence } from "../lib/types";

const ExpenseTable = ({
  expense,
  addFlag = false,
  updateExpense,
  categorySelections,
}: {
  expense: Expense[] | ExpenseRecurrence[];
  addFlag?: boolean;
  updateExpense?: (expense: ExpenseRecurrence) => void | null;
  categorySelections?: category[] | null;
}) => {
  const [filter, setFilter] = useState<keyof Expense>("entryDate");

  const sortedExpenses = useMemo(() => {
    return sortExpenses(expense, filter);
  }, [expense, filter]);

  function isExpenseRecurrence(
    expense: Expense | ExpenseRecurrence
  ): expense is ExpenseRecurrence {
    return "recurrence" in expense;
  }

  const getExpenseRow = (expense: Expense | ExpenseRecurrence) => {
    return addFlag &&
      updateExpense &&
      isExpenseRecurrence(expense) &&
      categorySelections ? (
      <AddExpenseRow
        key={expense.id}
        expense={expense}
        updateExpense={updateExpense}
        categorySelections={categorySelections}
      />
    ) : (
      <ExpenseRow key={expense.id} expense={expense} />
    );
  };

  return (
    <>
      <div className="filter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width={12}
        >
          <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
        </svg>
        <select onChange={(e) => setFilter(e.target.value as keyof Expense)}>
          <option value="entryDate" label="Date" />
          <option value="amount" label="Amount" />
          <option value="category" label="Category" />
        </select>
      </div>
      <table id="expenseTable">
        <tbody>
          {sortedExpenses && sortedExpenses.map((exp) => getExpenseRow(exp))}
        </tbody>
      </table>
    </>
  );
};

export default ExpenseTable;
