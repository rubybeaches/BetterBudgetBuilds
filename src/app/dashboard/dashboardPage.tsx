"use client";
import { useMemo } from "react";
import "./page.css";
import {
  allMonths,
  convertToFloat,
  setActiveCategories,
  sortCategories,
} from "../lib/helpers";
import SummaryTable from "../components/Dashboard/SummaryTable";
import { category } from "../lib/types";
import ExpenseTable from "../components/ExpenseTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Expense } from "@prisma/client";

const Dashboard = ({
  expenseCategories,
  incomeCategories,
  expenses,
  baseIncome,
  month,
}: {
  expenseCategories: category[];
  incomeCategories: category[];
  expenses: Expense[];
  baseIncome: number;
  month: string;
}) => {
  const userCategories = useMemo(() => {
    return sortCategories(expenseCategories, "category");
  }, [expenseCategories]);
  const userIncomeCategories = useMemo(() => {
    return sortCategories(incomeCategories, "category");
  }, [incomeCategories]);
  const monthlyIncome = useMemo(() => {
    return baseIncome / 12;
  }, [baseIncome]);

  const sParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const changeMonth = (month: string) => {
    const params = new URLSearchParams(sParams);
    params.set("month", month);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const essentialCategories = useMemo(() => {
    return setActiveCategories(userCategories, "essential");
  }, [userCategories]);
  const nonEssentialCategories = useMemo(() => {
    return setActiveCategories(userCategories, "non-essential");
  }, [userCategories]);
  const savingCategories = useMemo(() => {
    return setActiveCategories(userCategories, "savings");
  }, [userCategories]);

  const essentialExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.type == "essential");
  }, [expenses]);

  const essentialExpenseTotal = essentialExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const nonEssentialExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.type == "non-essential");
  }, [expenses]);

  const nonEssentialExpenseTotal = nonEssentialExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const savingExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.type == "savings");
  }, [expenses]);

  const savingExpenseTotal = savingExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const incomeExpenses = useMemo(() => {
    return expenses.filter((expense) => expense.type == "income");
  }, [expenses]);

  const incomeExpenseTotal = incomeExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const incomeMinusExpenseTotal =
    incomeExpenseTotal - essentialExpenseTotal - nonEssentialExpenseTotal;
  const incomeMinusExpenseBool = incomeMinusExpenseTotal < 0;
  const netBudgetTotal = incomeMinusExpenseTotal - savingExpenseTotal;
  const negativeBudgetBool = netBudgetTotal < 0;

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        padding: "3rem 5rem",
      }}
    >
      <h2 className="monthTitle">
        <span>
          <select
            defaultValue={month}
            onChange={(e) => changeMonth(e.target.value)}
          >
            {allMonths.map((m) => (
              <option key={m} value={m} label={m} />
            ))}
          </select>
        </span>{" "}
        Budget Dashboard
      </h2>

      <div className="baseBar">
        <a href="/budget">
          <div className="updateBudget">
            <div>Update Budget</div>
          </div>
        </a>
        <span>Summary:</span>{" "}
        <span id="Income">${convertToFloat(incomeExpenseTotal)}</span> -{" "}
        <span id="Essential">${convertToFloat(essentialExpenseTotal)}</span> -{" "}
        <span id="Non-Essential">
          ${convertToFloat(nonEssentialExpenseTotal)}
        </span>{" "}
        ={" "}
        <span
          className={
            incomeMinusExpenseBool
              ? "overBudgetText baseBarBubble"
              : "baseBarBubble"
          }
        >
          {incomeMinusExpenseBool && <>&ndash;</>}$
          {convertToFloat(Math.abs(incomeMinusExpenseTotal))}
        </span>{" "}
        <em>(after expenses)</em> -{" "}
        <span id="Savings">${convertToFloat(savingExpenseTotal)}</span> ={" "}
        <span
          className={
            negativeBudgetBool
              ? "overBudgetText baseBarBubble"
              : "baseBarBubble"
          }
        >
          {negativeBudgetBool && <>&ndash;</>}$
          {convertToFloat(Math.abs(netBudgetTotal))}
        </span>{" "}
        <em>(net remaining)</em>
      </div>

      <div id="Income" className="section">
        <h1>Income</h1>
        <SummaryTable
          categories={userIncomeCategories}
          expenses={incomeExpenses}
          monthlyIncome={monthlyIncome}
          monthIndex={allMonths.indexOf(month)}
          totalExpenses={incomeExpenseTotal}
        />
        <ExpenseTable expense={incomeExpenses} />
        <div className="incomeButton border left">
          <a href={`/add-expense?month=${month}`}>
            <div className="incomeButton background">
              <p className="incomeButton text">Add Income</p>
            </div>
          </a>
        </div>
      </div>

      <div id="Essential" className="section">
        <h1>
          Essential <em>(60%)</em>
        </h1>
        <SummaryTable
          categories={essentialCategories}
          expenses={essentialExpenses}
          monthlyIncome={monthlyIncome}
          monthIndex={allMonths.indexOf(month)}
          totalExpenses={essentialExpenseTotal}
        />
        <ExpenseTable expense={essentialExpenses} />
        <div className="expenseButton border left">
          <a href={`/add-expense?month=${month}`}>
            <div className="expenseButton background">
              <p className="expenseButton text">Add Expense</p>
            </div>
          </a>
        </div>
      </div>

      <div id="Non-Essential" className="section">
        <h1>
          Non-Essential <em>(30%)</em>
        </h1>
        <SummaryTable
          categories={nonEssentialCategories}
          expenses={nonEssentialExpenses}
          monthlyIncome={monthlyIncome}
          monthIndex={allMonths.indexOf(month)}
          totalExpenses={nonEssentialExpenseTotal}
        />
        <ExpenseTable expense={nonEssentialExpenses} />
        <div className="expenseButton border left">
          <a href={`/add-expense?month=${month}`}>
            <div className="expenseButton background">
              <p className="expenseButton text">Add Expense</p>
            </div>
          </a>
        </div>
      </div>

      <div id="Savings" className="section">
        <h1>
          Savings <em>(10%)</em>
        </h1>
        <SummaryTable
          categories={savingCategories}
          expenses={savingExpenses}
          monthlyIncome={monthlyIncome}
          monthIndex={allMonths.indexOf(month)}
          totalExpenses={savingExpenseTotal}
        />
        <ExpenseTable expense={savingExpenses} />
        <div className="savingsButton border left">
          <a href={`/add-expense?month=${month}`}>
            <div className="savingsButton background">
              <p className="savingsButton text">Add Savings</p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
