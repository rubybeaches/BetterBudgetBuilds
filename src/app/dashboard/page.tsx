"use client";
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import {
  allMonths,
  convertToFloat,
  filterExpensesByMonth,
  setActiveCategories,
  sortCategories,
} from "../lib/helpers";
import SummaryTable from "../components/Dashboard/SummaryTable";
import { category, expense } from "../lib/types";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import categories from "../lib/seed.json";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Dashboard = ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  const { isSignedIn, user } = useUser();
  setTimeout(() => {
    if (!isSignedIn || !user) {
      redirect("/sign-in");
    }
  }, 1000);

  if (!isSignedIn || !user) return null;

  const monthParam = searchParams?.month || "";
  let today = new Date();
  let month = allMonths.includes(monthParam)
    ? monthParam
    : today.toLocaleString("en-US", { month: "long" });
  const year = today.getFullYear();
  const [userCategories, setUserCategories] = useState<category[]>(categories);
  const [userIncomeCategories, setUserIncomeCategories] = useState<category[]>(
    []
  );
  const [userExpenses, setUserExpenses] = useState<expense[]>([]);
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  const monthExpenses = useMemo(() => {
    return filterExpensesByMonth(userExpenses, year, allMonths.indexOf(month));
  }, [userExpenses, month]);

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    const incomeCats: any = localStorage.getItem("userIncomeCategories");
    if (expenses) {
      setUserExpenses(JSON.parse(expenses));
    }
    if (incomeCats) {
      const sortedCategories = sortCategories(
        JSON.parse(incomeCats),
        "category"
      );
      setUserIncomeCategories(sortedCategories);
    }
    if (items) {
      const sortedCategories = sortCategories(JSON.parse(items), "category");
      setUserCategories(sortedCategories);
      setEssentialCategories(
        setActiveCategories(sortedCategories, "essential")
      );
      setNonEssentialCategories(
        setActiveCategories(sortedCategories, "non-essential")
      );
      setSavingCategories(setActiveCategories(sortedCategories, "savings"));
    }
    const income: any = localStorage.getItem("income");
    if (income) {
      setIncome(Number(JSON.parse(income)));
    }
  }, []);

  const sParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const changeMonth = (month: string) => {
    const params = new URLSearchParams(sParams);
    params.set("month", month);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [essentialCategories, setEssentialCategories] = useState(
    setActiveCategories(userCategories, "essential")
  );
  const [nonEssentialCategories, setNonEssentialCategories] = useState(
    setActiveCategories(userCategories, "non-essential")
  );
  const [savingCategories, setSavingCategories] = useState(
    setActiveCategories(userCategories, "savings")
  );

  const essentialExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "essential");
  }, [monthExpenses]);
  const essentialExpenseTotal = essentialExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const nonEssentialExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "non-essential");
  }, [monthExpenses]);
  const nonEssentialExpenseTotal = nonEssentialExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const savingExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "savings");
  }, [monthExpenses]);
  const savingExpenseTotal = savingExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const incomeExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "income");
  }, [monthExpenses]);
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
    <main className="main">
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
          <div className="incomeButton background">
            <a href={`/add-expense?month=${month}`}>
              <p className="incomeButton text">Add Income</p>
            </a>
          </div>
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
          <div className="expenseButton background">
            <a href={`/add-expense?month=${month}`}>
              <p className="expenseButton text">Add Expense</p>
            </a>
          </div>
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
          <div className="expenseButton background">
            <a href={`/add-expense?month=${month}`}>
              <p className="expenseButton text">Add Expense</p>
            </a>
          </div>
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
          <div className="savingsButton background">
            <a href={`/add-expense?month=${month}`}>
              <p className="savingsButton text">Add Savings</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
