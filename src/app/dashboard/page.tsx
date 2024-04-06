'use client'
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import { setActiveCategories } from "../lib/helpers";
import SummaryTable from "../components/Dashboard/SummaryTable";
import { category } from "../lib/types";
import { defaultIncomeCategories } from "../lib/helpers";
import { seedExpenses } from "../lib/helpers";
import ExpenseTable from "../components/Dashboard/ExpenseTable";
import categories from '../lib/seed.json'

const Dashboard = () => {
    let newDate = new Date()
    let date = newDate.getDate();
    //let month = newDate.getMonth() + 1;
    let month = newDate.toLocaleString("en-US", { month: "long" });
    // let year = newDate.getFullYear();

    const [userCategories, setUserCategories] = useState<category[]>(categories);

    useEffect(() => {
        const items: any = localStorage.getItem('userCategories');
        if (items) {
            setUserCategories(JSON.parse(items));
            setEssentialCategories(setActiveCategories(JSON.parse(items), "essential"));
            setNonEssentialCategories(setActiveCategories(JSON.parse(items), "non-essential"));
            setSavingCategories(setActiveCategories(JSON.parse(items), "savings"));
        }

    }, []);

    const [essentialCategories, setEssentialCategories] = useState(setActiveCategories(userCategories, "essential"));
    const [nonEssentialCategories, setNonEssentialCategories] = useState(setActiveCategories(userCategories, "non-essential"));
    const [savingCategories, setSavingCategories] = useState(setActiveCategories(userCategories, "savings"));

    const essentialExpenses = useMemo(() => {
        return seedExpenses.filter(expense => expense.type == "essential");
    }, []);
    const nonEssentialExpenses = useMemo(() => {
        return seedExpenses.filter(expense => expense.type == "non-essential");
    }, []);
    const savingExpenses = useMemo(() => {
        return seedExpenses.filter(expense => expense.type == "savings");
    }, []);

    const incomeMod: category[] = [...defaultIncomeCategories, { ...defaultIncomeCategories[0], category: 'Paycheck', min: 1, max: 35, curr: 5 }];

    return (
        <main className="main">
            <h2 className="monthTitle">
                {month} Budget Dashboard
            </h2>

            <div id="Income" className="section">
                <h1>Income</h1>
                <SummaryTable categories={incomeMod} />
            </div>

            <div id="Essential" className="section">
                <h1>Essential <em>(60%)</em></h1>
                <SummaryTable categories={essentialCategories} />
                <ExpenseTable expense={essentialExpenses} />
            </div>

            <div id="Non-Essential" className="section">
                <h1>Non-Essential <em>(30%)</em></h1>
                <SummaryTable categories={nonEssentialCategories} />
                <ExpenseTable expense={nonEssentialExpenses} />
            </div>

            <div id="Savings" className="section">
                <h1>Savings <em>(10%)</em></h1>
                <SummaryTable categories={savingCategories} />
                <ExpenseTable expense={savingExpenses} />
            </div>
        </main>
    )
}

export default Dashboard;