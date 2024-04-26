"use client";
import { useEffect, useState } from "react";
import "./page.css";
import { category, expense } from "../lib/types";
import { multiplyPercentToFloat, seedExpenses } from "../lib/helpers";
import categories from "../lib/seed.json";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import AddExpenseBar from "../components/AddExpense/AddExpenseBar";
import ProgressBar from "../components/Dashboard/ProgressBar";

const AddExpense = () => {
  let newDate = new Date();
  let month = newDate.toLocaleString("en-US", { month: "long" });
  const [userCategories, setUserCategories] = useState<category[]>(categories);
  const [userExpenses, setUserExpenses] = useState<expense[]>(seedExpenses);
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    const income: any = localStorage.getItem("income");
    if (income) {
      setIncome(Number(JSON.parse(income)));
    }
    if (items) {
      setUserCategories(JSON.parse(items));
    }
    if (expenses) {
      setDebtExpenses(
        JSON.parse(expenses).filter(
          (expense: expense) =>
            expense.type == "essential" || expense.type == "non-essential"
        )
      );
      setSavingExpenses(
        JSON.parse(expenses).filter(
          (expense: expense) => expense.type == "savings"
        )
      );
      setIncomeExpenses(
        JSON.parse(expenses).filter(
          (expense: expense) => expense.type == "income"
        )
      );
    }
  }, []);

  const [debtExpenses, setDebtExpenses] = useState(
    userExpenses.filter(
      (expense) =>
        expense.type == "essential" || expense.type == "non-essential"
    )
  );
  const [savingExpenses, setSavingExpenses] = useState(
    userExpenses.filter((expense) => expense.type == "savings")
  );
  const [incomeExpenses, setIncomeExpenses] = useState(
    userExpenses.filter((expense) => expense.type == "income")
  );

  const handleAddExpense = (expense: expense) => {
    const callback: any = {
      savings: () => setSavingExpenses([...savingExpenses, expense]),
      essential: () => setDebtExpenses([...debtExpenses, expense]),
      "non-essential": () => setDebtExpenses([...debtExpenses, expense]),
      income: () => setIncomeExpenses([...incomeExpenses, expense]),
    };

    callback[expense.type]();
  };

  const saveExpenses = () => {
    let mergeBudgetArrays: expense[] = [];
    mergeBudgetArrays = mergeBudgetArrays.concat(
      mergeBudgetArrays,
      debtExpenses,
      savingExpenses,
      incomeExpenses
    );
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
        <div>
          {userCategories.map((category, index) => (
            <span key={index} className="summaryProgressBar">
              <p>{category.category}</p>
              {/* getCategoryExpenses(fullMonth) */}
              <ProgressBar
                categoryExpenseTotal={150}
                budgetTotal={multiplyPercentToFloat(
                  category.curr,
                  monthlyIncome
                )}
              />
            </span>
          ))}
        </div>

        <div className="expenseTablesWrapper">
          <div id="Income" className="section">
            <h2>Generated Income</h2>
            <ExpenseTable expense={incomeExpenses} />
          </div>

          <div id="Savings" className="section">
            <h2>Saving and Planning Accounts</h2>
            <ExpenseTable expense={savingExpenses} />
          </div>

          <div id="Expenses" className="section">
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
