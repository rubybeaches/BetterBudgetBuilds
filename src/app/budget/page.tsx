'use client'
import "./page.css";
import categories from '../lib/seed.json'
import { useState } from "react";
import BudgetEssentials from "../components/BudgetEssentials";
import { convertToFloat } from "../lib/helpers";

const Budget = () => {
    const [income, setIncome] = useState(0);
    const monthlyIncome = income / 12;
    // load user profile or template profile
    // if using template profile, aka no user, then values should be all percent based so they can be dynamic

    // need a reset button so users can start from scratch if needed, and update with new salary

    return (
        <main className="main">
            <h2>Budget Calculator</h2>
            <p>Let's generate a basic bucketing system based on national averages. Don't worry about getting it perfect the first time, you can revisit this at anytime and update your budget moving forward. We've provided percentages based on what is most recommended as a guidepost,  and you can adjust the categories and buckets to your needs. If you're unsure of what you should put in any given bucket, use your best guess or put $0 until you have a better idea.</p>

            <label id="income">What is your annual income after taxes and deductions?
                <div><span>$</span> <input type="number" value={income} onChange={(e) => setIncome(e.target.valueAsNumber || 0)} /></div>
                {income > 0 && (
                    <em>your monthly allowance is <strong>${convertToFloat(monthlyIncome)}</strong></em>
                )}
            </label>

            <BudgetEssentials categories={categories} income={monthlyIncome || 0} />

        </main>);
}

export default Budget;