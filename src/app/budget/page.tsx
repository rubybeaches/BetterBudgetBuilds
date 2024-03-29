'use client'
import "./page.css";
import categories from '../lib/seed.json'
import { useMemo, useState } from "react";
import CategorySection from "../components/Budget/CategorySection";
import { convertToFloat } from "../lib/helpers";
import { addCategoryList, category } from "../lib/types";

const Budget = () => {
    const [income, setIncome] = useState(0);
    const monthlyIncome = income / 12;

    // handle the ongoing category list states of each of the three budget sections
    const [essentialCategories, setEssentialCategories] = useState(categories.filter(cat => cat.type == "essential" && cat.active));
    const [nonEssentialCategories, setNonEssentialCategories] = useState(categories.filter(cat => cat.type == "non-essential" && cat.active));
    const [savingCategories, setSavingCategories] = useState(categories.filter(cat => cat.type == "savings" && cat.active));

    // handle ongoing state of categories removed by user 
    const [userRemovedCategories, setUserRemovedCategories] = useState<category[]>();
    const handleUserRemovedCategories = (removedValue: category) => {
        const removedArray: category[] = [];
        if (userRemovedCategories && userRemovedCategories.length > 0) {
            userRemovedCategories.map(item => removedArray.push({ ...item }));
        }
        removedArray.push(removedValue);
        setUserRemovedCategories(() => removedArray)
    }

    // Full list of currently inactive categories that could be added to the budget
    const buildCategoryAdditionList = useMemo(() => {
        const additionArray: addCategoryList[] = [];
        const parseRemovedArrays = (array: category[]) => {
            array.map(cat => {
                if (!cat.active) {
                    additionArray.push({ name: cat.category, type: cat.type });
                    if (cat.help.length > 0) {
                        cat.help.map(item => additionArray.push({ name: item, type: cat.type }));
                    }
                }
            });
        }

        if (userRemovedCategories && userRemovedCategories.length > 0) {
            parseRemovedArrays(userRemovedCategories);
            parseRemovedArrays(categories);
        } else {
            parseRemovedArrays(categories);
        }

        return additionArray;
    }, [userRemovedCategories])

    // load user profile or template profile
    // if using template profile, aka no user, then values should be all percent based so they can be dynamic

    // need a reset button so users can start from scratch if needed, and update with new salary

    return (
        <main className="main">
            <h2>Budget Calculator</h2>
            <p>Let's generate a basic bucketing system based on national averages. Don't worry about getting it perfect the first time, you can revisit this at anytime and update your budget moving forward. We've provided percentages based on what is most recommended as a guidepost,  and you can adjust the categories and buckets to your needs. If you're unsure of what you should put in any given bucket, use your best guess until you have a better idea.</p>

            <label id="income">What is your annual income after taxes and deductions?
                <div><span>$</span> <input type="number" value={income} onChange={(e) => setIncome(e.target.valueAsNumber || 0)} /></div>
                {income > 0 && (
                    <em>your monthly allowance is <strong>${convertToFloat(monthlyIncome)}</strong></em>
                )}
            </label>

            <CategorySection categories={essentialCategories} setCategories={setEssentialCategories} type="Essentials" monthlyIncome={monthlyIncome || 0} percentTemplate={.6} startingBalance={monthlyIncome} removedCategories={handleUserRemovedCategories} addCategoryList={buildCategoryAdditionList} />

            <CategorySection categories={nonEssentialCategories} setCategories={setNonEssentialCategories} type="Non-Essentials" monthlyIncome={monthlyIncome || 0} percentTemplate={.3} startingBalance={monthlyIncome - essentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0)} removedCategories={handleUserRemovedCategories} addCategoryList={buildCategoryAdditionList} />

            <CategorySection categories={savingCategories} setCategories={setSavingCategories} type="Savings" monthlyIncome={monthlyIncome || 0} percentTemplate={.1} startingBalance={monthlyIncome - essentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0) - nonEssentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0)} removedCategories={handleUserRemovedCategories} addCategoryList={buildCategoryAdditionList} />

        </main>);
}

export default Budget;