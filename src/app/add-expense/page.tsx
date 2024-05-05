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

const AddExpense = ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  const monthParam = searchParams?.month || "";
  let today = new Date();
  let month = allMonths.includes(monthParam)
    ? monthParam
    : today.toLocaleString("en-US", { month: "long" });
  const year = today.getFullYear();
  const [userCategories, setUserCategories] = useState<category[]>(categories);
  const [userExpenses, setUserExpenses] = useState<expense[]>(seedExpenses);
  const [addedExpenses, setAddedExpenses] = useState<expense[]>();
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  const monthExpenses = useMemo(() => {
    return filterExpensesByMonth(userExpenses, year, allMonths.indexOf(month));
  }, [userExpenses, month]);

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    const income: any = localStorage.getItem("income");
    if (income) {
      setIncome(Number(JSON.parse(income)));
    }
    if (items) {
      setUserCategories(() => {
        return sortCategories(JSON.parse(items), "category");
      });
    }
    if (expenses) {
      setUserExpenses(JSON.parse(expenses));

      const sortedExpenses = sortExpenses(JSON.parse(expenses), "category");
      const filteredExpenses = filterExpensesByMonth(
        sortedExpenses,
        year,
        allMonths.indexOf(month)
      );
      setDebtExpenses(
        filteredExpenses.filter(
          (expense: expense) =>
            expense.type == "essential" || expense.type == "non-essential"
        )
      );
      setSavingExpenses(
        filteredExpenses.filter((expense: expense) => expense.type == "savings")
      );
      setIncomeExpenses(
        filteredExpenses.filter((expense: expense) => expense.type == "income")
      );
    }
  }, []);

  const [debtExpenses, setDebtExpenses] = useState(
    monthExpenses.filter(
      (expense) =>
        expense.type == "essential" || expense.type == "non-essential"
    )
  );
  const [savingExpenses, setSavingExpenses] = useState(
    monthExpenses.filter((expense) => expense.type == "savings")
  );
  const [incomeExpenses, setIncomeExpenses] = useState(
    monthExpenses.filter((expense) => expense.type == "income")
  );

  const handleAddExpense = (expense: expense) => {
    if (addedExpenses && addedExpenses?.length > 0) {
      setAddedExpenses([...addedExpenses, expense]);
    } else {
      setAddedExpenses([expense]);
    }

    const callback: any = {
      savings: () => {
        const NewSort = sortExpenses([...savingExpenses, expense], "category");
        setSavingExpenses(NewSort);
      },
      essential: () => {
        const NewSort = sortExpenses([...debtExpenses, expense], "category");
        setDebtExpenses(NewSort);
      },
      "non-essential": () => {
        const NewSort = sortExpenses([...debtExpenses, expense], "category");
        setDebtExpenses(NewSort);
      },
      income: () => {
        const NewSort = sortExpenses([...incomeExpenses, expense], "category");
        setIncomeExpenses(NewSort);
      },
    };

    callback[expense.type]();
  };

  const getCategoryExpenses = (expenseGroup: expense[], category: string) => {
    return expenseGroup.reduce(
      (sum, exp) => (exp.category == category ? sum + exp.amount : sum),
      0
    );
  };

  const saveExpenses = () => {
    if (!addedExpenses) return;
    let mergeBudgetArrays: expense[] = [...userExpenses];
    mergeBudgetArrays = [...mergeBudgetArrays, ...addedExpenses];

    setUserExpenses(mergeBudgetArrays);
    localStorage.setItem("userExpenses", JSON.stringify(mergeBudgetArrays));
  };

  return (
    <main className="main" id="expensePage">
      <span className="headerWrapper">
        <h2 className="monthTitle">{month} Expenses</h2>
        <div className="saveBudgetContainer" onClick={() => saveExpenses()}>
          <div className="saveBudget">
            <p className="saveBudgetButton">Save</p>
          </div>
        </div>
      </span>

      <div className="expenseColumns">
        <div className="summaryWrapper">
          <div id="summaryIncome">
            <h2>INCOME</h2>
            <span className="summaryProgressBar">
              <p className="categoryName">{"Income"}</p>
              <ProgressBar
                categoryExpenseTotal={incomeExpenses.reduce(
                  (sum, exp) =>
                    exp.category == "Income" ? sum + exp.amount : sum,
                  0
                )}
                budgetTotal={"3500"}
              />
            </span>
            <span className="summaryProgressBar">
              <p className="categoryName">{"Paycheck"}</p>
              <ProgressBar
                categoryExpenseTotal={getCategoryExpenses(
                  incomeExpenses,
                  "Paycheck"
                )}
                budgetTotal={"350"}
              />
            </span>
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
