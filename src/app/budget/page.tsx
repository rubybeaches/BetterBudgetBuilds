'use client'
import "./page.css";
import categories from '../lib/seed.json'
import { useEffect, useRef, useState } from "react";
import CategorySection from "../components/Budget/CategorySection";
import { buildInitialAddList, convertToFloat, parsetoNum, setActiveCategories, setInactiveCategoryList } from "../lib/helpers";
import { category } from "../lib/types";

const Budget = () => {
    const [userCategories, setUserCategories] = useState(categories);
    const [income, setIncome] = useState(0);

    useEffect(() => {
        const items: any = localStorage.getItem('userCategories');
        if (items) {
            setUserCategories(JSON.parse(items));
            setEssentialCategories(setActiveCategories(JSON.parse(items), "essential"));
            setNonEssentialCategories(setActiveCategories(JSON.parse(items), "non-essential"));
            setSavingCategories(setActiveCategories(JSON.parse(items), "savings"));
            setInactiveCategories(setInactiveCategoryList(JSON.parse(items)));
            setAddCategoryList(buildInitialAddList(JSON.parse(items)));
        }
        const income: any = localStorage.getItem('income');
        if (income) {
            updateIncome(String(JSON.parse(income)));
        }

    }, []);

    const intervalID = useRef<any>();
    const incomeRef = useRef<any>();
    const monthlyIncome = income / 12;

    const updateIncome = (input: string) => {
        const newValue = input || "";
        const inputValue = incomeRef.current;
        if (inputValue) {
            inputValue.value = newValue;
        }

        if (intervalID.current) {
            clearTimeout(intervalID.current);
        }

        intervalID.current = setTimeout(() => {
            setIncome(() => parsetoNum(newValue));
            inputValue.value = convertToFloat(parsetoNum(newValue));
        }, 1000);
    }

    // handle the ongoing category list states of each of the three budget sections
    const [essentialCategories, setEssentialCategories] = useState(setActiveCategories(userCategories, "essential"));
    const [nonEssentialCategories, setNonEssentialCategories] = useState(setActiveCategories(userCategories, "non-essential"));
    const [savingCategories, setSavingCategories] = useState(setActiveCategories(userCategories, "savings"));
    const [inactiveCategories, setInactiveCategories] = useState(setInactiveCategoryList(userCategories));

    // handle ongoing state of categories removed by user 
    const [addCategoryList, setAddCategoryList] = useState(buildInitialAddList(userCategories));

    const handleAddCategoryList = (removedValue: category) => {
        if (removedValue.active) {
            const filterArray = addCategoryList.filter(cat => cat.category != removedValue.category);
            setAddCategoryList(() => filterArray);
            setInactiveCategories(() => {
                const inactive = inactiveCategories.filter(cat => cat.category != removedValue.category);
                return inactive
            })
        } else {
            const addArray = [...addCategoryList];
            addArray.push(removedValue);
            setAddCategoryList(() => addArray);
            setInactiveCategories(() => {
                const inactive = [...inactiveCategories];
                inactive.push({ ...removedValue, active: 0 });
                return inactive
            })
        }
    }

    const saveBudget = () => {
        let mergeBudgetArrays: category[] = []
        mergeBudgetArrays = mergeBudgetArrays.concat(mergeBudgetArrays, essentialCategories, nonEssentialCategories, savingCategories, inactiveCategories);
        localStorage.setItem('userCategories', JSON.stringify(mergeBudgetArrays));
        localStorage.setItem('income', JSON.stringify(income));
    }
    // load user profile or template profile
    // if using template profile, aka no user, then values should be all percent based so they can be dynamic

    // need a reset button so users can start from scratch if needed, and update with new salary

    return (
        <main className="main">
            <h2>Budget Calculator</h2>
            <p>Let's generate a basic bucketing system based on national averages. Don't worry about getting it perfect the first time, you can revisit this at anytime and update your budget moving forward. We've provided percentages based on what is most recommended as a guidepost,  and you can adjust the categories and buckets to your needs. If you're unsure of what you should put in any given bucket, use your best guess until you have a better idea.</p>

            <label id="income">What is your annual income after taxes and deductions?
                <div><span>$</span> <input type="text" defaultValue={0} ref={incomeRef} onChange={(e) => updateIncome(e.target.value)} onKeyDown={(e) => {
                    if (e.key == 'Backspace') {
                        e.preventDefault();
                        updateIncome("");
                    }
                    if (e.key == "Enter") {
                        e.preventDefault();
                        const inputValue = incomeRef.current;
                        if (inputValue) {
                            setIncome(() => inputValue.value);
                            inputValue.value = convertToFloat(parsetoNum(inputValue.value));
                        }
                    }
                }} /></div>
                {income > 0 && (
                    <em>your monthly allowance is <strong>${convertToFloat(monthlyIncome)}</strong></em>
                )}
            </label>

            <CategorySection categories={essentialCategories} setCategories={setEssentialCategories} type="Essentials" monthlyIncome={monthlyIncome || 0} percentTemplate={.6} startingBalance={monthlyIncome} removedCategories={handleAddCategoryList} addCategoryList={addCategoryList} />

            <CategorySection categories={nonEssentialCategories} setCategories={setNonEssentialCategories} type="Non-Essentials" monthlyIncome={monthlyIncome || 0} percentTemplate={.3} startingBalance={monthlyIncome - essentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0)} removedCategories={handleAddCategoryList} addCategoryList={addCategoryList} />

            <CategorySection categories={savingCategories} setCategories={setSavingCategories} type="Savings" monthlyIncome={monthlyIncome || 0} percentTemplate={.1} startingBalance={monthlyIncome - essentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0) - nonEssentialCategories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0)} removedCategories={handleAddCategoryList} addCategoryList={addCategoryList} />

            <div className="baseBar"><div className="saveBudgetContainer" onClick={() => saveBudget()}><div className="saveBudget"><p className="saveBudgetButton">Apply Budget</p></div></div></div>

        </main>);
}

export default Budget;