"use client";
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import { category, expense } from "../lib/types";
import {
  allMonths,
  filterExpensesByMonth,
  multiplyPercentToFloat,
  seedExpenses,
  sortCategories,
  sortExpenses,
} from "../lib/helpers";
import categories from "../lib/seed.json";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import AddExpenseBar from "../components/AddExpense/AddExpenseBar";
import ProgressBar from "../components/ProgressBar";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const AddExpense = ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn || !user) redirect("/sign-in");

  const monthParam = searchParams?.month || "";
  let today = new Date();
  let month = allMonths.includes(monthParam)
    ? monthParam
    : today.toLocaleString("en-US", { month: "long" });
  const year = today.getFullYear();
  const router = useRouter();
  const [userIncomeCategories, setUserIncomeCategories] = useState<category[]>(
    []
  );
  const [userCategories, setUserCategories] = useState<category[]>(categories);
  const [userExpenses, setUserExpenses] = useState<expense[]>([]);
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    const income: any = localStorage.getItem("income");
    const incomeCats: any = localStorage.getItem("userIncomeCategories");
    if (income) {
      setIncome(Number(JSON.parse(income)));
    }
    if (incomeCats) {
      setUserIncomeCategories(() => {
        return sortCategories(JSON.parse(incomeCats), "category");
      });
    }
    if (items) {
      setUserCategories(() => {
        return sortCategories(JSON.parse(items), "category");
      });
    }
    if (expenses) {
      setUserExpenses(JSON.parse(expenses));
    }
  }, []);

  const monthExpenses = useMemo(() => {
    const sortedExpenses = sortExpenses(userExpenses, "category");
    return filterExpensesByMonth(
      sortedExpenses,
      year,
      allMonths.indexOf(month)
    );
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

  const handleAddExpense = (expense: expense) => {
    setUserExpenses([...userExpenses, expense]);
  };

  const getCategoryExpenses = (expenseGroup: expense[], category: string) => {
    return expenseGroup.reduce(
      (sum, exp) => (exp.category == category ? sum + exp.amount : sum),
      0
    );
  };

  const saveExpenses = () => {
    localStorage.setItem("userExpenses", JSON.stringify(userExpenses));
    router.push(`/dashboard?month=${month}`);
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

      <AddExpenseBar
        categorySelections={userCategories}
        addExpenseCallback={handleAddExpense}
      />
    </main>
  );
};

export default AddExpense;
