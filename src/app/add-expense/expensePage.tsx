"use client";
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import { category } from "../lib/types";
import {
  allMonths,
  multiplyPercentToFloat,
  sortCategories,
  sortExpenses,
} from "../lib/helpers";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import AddExpenseBar from "../components/AddExpense/AddExpenseBar";
import ProgressBar from "../components/ProgressBar";
import { redirect, useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
import { Expense } from "@prisma/client";
import { updateAndCreateExpenses } from "../lib/actions";

const AddExpense = ({
  expenseCategories,
  incomeCategories,
  expenses,
  baseIncome,
  month,
  year,
  userID,
}: {
  expenseCategories: category[];
  incomeCategories: category[];
  expenses: Expense[];
  baseIncome: number;
  month: string;
  year: number;
  userID: number;
}) => {
  /*
  const { isSignedIn, user } = useUser();
  setTimeout(() => {
    if (!isSignedIn || !user) {
      redirect("/sign-in");
    }
  }, 1000);

  if (!isSignedIn || !user) return null;
  */

  const router = useRouter();

  const userIncomeCategories = useMemo(() => {
    return sortCategories(incomeCategories, "category");
  }, [incomeCategories]);
  const userCategories = useMemo(() => {
    return sortCategories(expenseCategories, "category");
  }, [expenseCategories]);
  const [userExpenses, setUserExpenses] = useState(expenses);
  const [userExpensesFlag, setUserExpensesFlag] = useState(false);
  const monthlyIncome = baseIncome / 12;

  const monthExpenses = useMemo(() => {
    return sortExpenses(userExpenses, "category");
  }, [userExpenses, month]);

  const debtExpenses = useMemo(
    () =>
      monthExpenses.filter(
        (expense) =>
          expense.type == "essential" || expense.type == "non-essential"
      ),
    [monthExpenses]
  );
  const savingExpenses = useMemo(
    () => monthExpenses.filter((expense) => expense.type == "savings"),
    [monthExpenses]
  );
  const incomeExpenses = useMemo(
    () => monthExpenses.filter((expense) => expense.type == "income"),
    [monthExpenses]
  );

  const handleAddExpense = (expense: Expense) => {
    setUserExpenses([...userExpenses, expense]);
    setUserExpensesFlag(() => true);
  };

  const getCategoryExpenses = (expenseGroup: Expense[], category: string) => {
    return expenseGroup.reduce(
      (sum, exp) => (exp.category == category ? sum + exp.amount : sum),
      0
    );
  };

  const saveExpenses = async () => {
    if (userExpensesFlag) {
      await updateAndCreateExpenses(
        userExpenses,
        allMonths.indexOf(month) + 1,
        year,
        userID
      );
    }

    router.push(`/dashboard?month=${month}`);
    router.refresh();
  };

  return (
    <main className="main" id="expensePage">
      <span className="headerWrapper">
        <h2 className="monthTitle">{month} Expenses</h2>
        <div className="saveBudgetContainer" onClick={() => saveExpenses()}>
          <div className="saveBudget" style={{ display: "flex", gap: "4px" }}>
            <p className="saveBudgetButton">Save</p>
            <p>and return to dashboard</p>
          </div>
        </div>
      </span>

      <div className="expenseColumns">
        <div className="summaryWrapper">
          <div id="summaryIncome">
            <h2>INCOME</h2>
            {userIncomeCategories.map(
              (category, index) =>
                category.type == "income" &&
                category.active == 1 && (
                  <span key={index} className="summaryProgressBar">
                    <p className="categoryName">{category.category}</p>
                    <ProgressBar
                      categoryExpenseTotal={getCategoryExpenses(
                        incomeExpenses,
                        category.category
                      )}
                      budgetTotal={multiplyPercentToFloat(
                        category.curr,
                        monthlyIncome
                      )}
                    />
                  </span>
                )
            )}
          </div>
          <div id="summarySavings">
            <h2>Saving and Planning</h2>
            {userCategories.map(
              (category, index) =>
                category.type == "savings" &&
                category.active == 1 && (
                  <span key={index} className="summaryProgressBar">
                    <p className="categoryName">{category.category}</p>
                    <ProgressBar
                      categoryExpenseTotal={getCategoryExpenses(
                        savingExpenses,
                        category.category
                      )}
                      budgetTotal={multiplyPercentToFloat(
                        category.curr,
                        monthlyIncome
                      )}
                    />
                  </span>
                )
            )}
          </div>
          <div id="summaryExpense">
            <h2>Expenses</h2>
            {userCategories.map(
              (category, index) =>
                (category.type == "non-essential" ||
                  category.type == "essential") &&
                category.active == 1 && (
                  <span key={index} className="summaryProgressBar">
                    <p className="categoryName">{category.category}</p>
                    <ProgressBar
                      categoryExpenseTotal={getCategoryExpenses(
                        debtExpenses,
                        category.category
                      )}
                      budgetTotal={multiplyPercentToFloat(
                        category.curr,
                        monthlyIncome
                      )}
                    />
                  </span>
                )
            )}
          </div>
        </div>

        <div className="expenseTablesWrapper">
          <AddExpenseBar
            userID={userID}
            month={month}
            year={year}
            categorySelections={userCategories}
            incomeCategorySelections={userIncomeCategories}
            addExpenseCallback={handleAddExpense}
          />
          <div
            id="Income"
            className={`section ${
              incomeExpenses.length > 0 ? "show" : "hidden"
            }`}
          >
            <h2>Generated Income</h2>
            <ExpenseTable expense={incomeExpenses} />
          </div>

          <div
            id="Savings"
            className={`section ${
              savingExpenses.length > 0 ? "show" : "hidden"
            }`}
          >
            <h2>Saving and Planning Accounts</h2>
            <ExpenseTable expense={savingExpenses} />
          </div>

          <div
            id="Expenses"
            className={`section ${debtExpenses.length > 0 ? "show" : "hidden"}`}
          >
            <h2>Recurring and Variable Expenses</h2>
            <ExpenseTable expense={debtExpenses} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddExpense;
