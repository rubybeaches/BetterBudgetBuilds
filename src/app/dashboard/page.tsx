"use client";
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import {
  allMonths,
  filterExpensesByMonth,
  setActiveCategories,
  sortCategories,
} from "../lib/helpers";
import SummaryTable from "../components/Dashboard/SummaryTable";
import { category, expense } from "../lib/types";
import { defaultIncomeCategories } from "../lib/helpers";
import { seedExpenses } from "../lib/helpers";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import categories from "../lib/seed.json";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Dashboard = ({
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
  const [income, setIncome] = useState(0);
  const monthlyIncome = income / 12;

  const monthExpenses = useMemo(() => {
    return filterExpensesByMonth(userExpenses, year, allMonths.indexOf(month));
  }, [userExpenses, month]);

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const expenses: any = localStorage.getItem("userExpenses");
    if (expenses) {
      setUserExpenses(JSON.parse(expenses));
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
  const nonEssentialExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "non-essential");
  }, [monthExpenses]);
  const savingExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "savings");
  }, [monthExpenses]);
  const incomeExpenses = useMemo(() => {
    return monthExpenses.filter((expense) => expense.type == "income");
  }, [monthExpenses]);

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
      <h2 className="monthTitle">
        <select
          defaultValue={month}
          onChange={(e) => changeMonth(e.target.value)}
        >
          {allMonths.map((m) => (
            <option key={m} value={m} label={m} />
          ))}
        </select>{" "}
        Budget Dashboard
      </h2>

      <div id="Income" className="section">
        <h1>Income</h1>
        <SummaryTable
          categories={incomeMod}
          expenses={incomeExpenses}
          monthlyIncome={monthlyIncome}
          monthIndex={allMonths.indexOf(month)}
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
          monthIndex={allMonths.indexOf(month)}
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
          monthIndex={allMonths.indexOf(month)}
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
          monthIndex={allMonths.indexOf(month)}
        />
        <ExpenseTable expense={savingExpenses} />
      </div>
    </main>
  );
};

export default Dashboard;
