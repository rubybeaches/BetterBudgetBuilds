"use client";
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import { setActiveCategories } from "../lib/helpers";
import SummaryTable from "../components/Dashboard/SummaryTable";
import { category, expense } from "../lib/types";
import { defaultIncomeCategories } from "../lib/helpers";
import { seedExpenses } from "../lib/helpers";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import categories from "../lib/seed.json";

const Dashboard = () => {
  let newDate = new Date();
  let month = newDate.toLocaleString("en-US", { month: "long" });
  const [userCategories, setUserCategories] = useState<category[]>(categories);
  const [userExpenses, setUserExpenses] = useState<expense[]>(seedExpenses);
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    if (expenses) {
      setUserExpenses(JSON.parse(expenses));
    }
    if (items) {
      setUserCategories(JSON.parse(items));
      setEssentialCategories(
        setActiveCategories(JSON.parse(items), "essential")
      );
      setNonEssentialCategories(
        setActiveCategories(JSON.parse(items), "non-essential")
      );
      setSavingCategories(setActiveCategories(JSON.parse(items), "savings"));
    }
    const income: any = localStorage.getItem("income");
    if (income) {
      setIncome(Number(JSON.parse(income)));
    }
  }, []);

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
    return userExpenses.filter((expense) => expense.type == "essential");
  }, [userExpenses]);
  const nonEssentialExpenses = useMemo(() => {
    return userExpenses.filter((expense) => expense.type == "non-essential");
  }, [userExpenses]);
  const savingExpenses = useMemo(() => {
    return userExpenses.filter((expense) => expense.type == "savings");
  }, [userExpenses]);
  const incomeExpenses = useMemo(() => {
    return userExpenses.filter((expense) => expense.type == "income");
  }, [userExpenses]);

  const incomeMod: category[] = [
    ...defaultIncomeCategories,
    {
      ...defaultIncomeCategories[0],
      category: "Paycheck",
      min: 1,
      max: 35,
      curr: 5,
    },
  ];

  return (
    <main className="main">
      <h2 className="monthTitle">{month} Budget Dashboard</h2>

      <div id="Income" className="section">
        <h1>Income</h1>
        <SummaryTable
          categories={incomeMod}
          expenses={incomeExpenses}
          monthlyIncome={monthlyIncome}
        />
        <ExpenseTable expense={incomeExpenses} />
      </div>

      <div id="Essential" className="section">
        <h1>
          Essential <em>(60%)</em>
        </h1>
        <SummaryTable
          categories={essentialCategories}
          expenses={essentialExpenses}
          monthlyIncome={monthlyIncome}
        />
        <ExpenseTable expense={essentialExpenses} />
      </div>

      <div id="Non-Essential" className="section">
        <h1>
          Non-Essential <em>(30%)</em>
        </h1>
        <SummaryTable
          categories={nonEssentialCategories}
          expenses={nonEssentialExpenses}
          monthlyIncome={monthlyIncome}
        />
        <ExpenseTable expense={nonEssentialExpenses} />
      </div>

      <div id="Savings" className="section">
        <h1>
          Savings <em>(10%)</em>
        </h1>
        <SummaryTable
          categories={savingCategories}
          expenses={savingExpenses}
          monthlyIncome={monthlyIncome}
        />
        <ExpenseTable expense={savingExpenses} />
      </div>
    </main>
  );
};

export default Dashboard;