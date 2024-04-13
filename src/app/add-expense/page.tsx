'use client'
import { useEffect, useMemo, useState } from "react";
import "./page.css";
import { setActiveCategories } from "../lib/helpers";
import { category } from "../lib/types";
import { defaultIncomeCategories } from "../lib/helpers";
import { seedExpenses } from "../lib/helpers";
import categories from '../lib/seed.json'
import ExpenseTable from "../components/Dashboard/ExpenseTable";

const AddExpense = () => {
    let newDate = new Date()
    let month = newDate.toLocaleString("en-US", { month: "long" });
    const [userCategories, setUserCategories] = useState<category[]>(categories);
    const [userExpenses, setUserExpenses] = useState(seedExpenses);
    const incomeCategories: category[] = [...defaultIncomeCategories, { ...defaultIncomeCategories[0], category: 'Paycheck', min: 1, max: 35, curr: 5 }];

    useEffect(() => {
        const items: any = localStorage.getItem('userCategories');
        if (items) {
            setUserCategories(JSON.parse(items));
        }
    }, []);

    const essentialCategories = useMemo(() => {
        setActiveCategories(userCategories, "essential");
    }, [userCategories]);
    const nonEssentialCategories = useMemo(() => {
        setActiveCategories(userCategories, "non-essential");
    }, [userCategories]);
    const savingCategories = useMemo(() => {
        setActiveCategories(userCategories, "savings");
    }, [userCategories]);

    const [debtExpenses, setDebtExpenses] = useState(userExpenses.filter(expense => expense.type == "essential" || expense.type == "non-essential"));
    const [savingExpenses, setSavingExpenses] = useState(userExpenses.filter(expense => expense.type == "savings"));
    const [incomeExpenses, setIncomeExpenses] = useState(userExpenses.filter(expense => expense.type == "income"));


    return <main className="main">
        <h2 className="monthTitle">
            {month} Expenses
        </h2>

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

        <div id="AddExpenseBar" className="Expense">
            <div className="expenseInput">$<input type="text" value={36.36} /></div>
        </div>
    </main>
}

export default AddExpense;