import { category } from "@/app/lib/types";
import { setActiveCategories } from "../../lib/helpers";
import { defaultIncomeCategories } from "../../lib/helpers";
import { useMemo, useRef, useState } from "react";

const AddExpenseBar = ({ categorySelections }: { categorySelections: category[] }) => {
    const selectRef = useRef<any>();
    const [expenseType, setExpenseType] = useState('expense');

    const handleTypeSelector = (type: string) => {
        selectRef.current.value = 'Select a Category';
        setExpenseType(() => type);
    }

    const incomeCategories: category[] = [...defaultIncomeCategories, { ...defaultIncomeCategories[0], category: 'Paycheck', min: 1, max: 35, curr: 5 }];
    const expenseCategories = useMemo(() => {
        return categorySelections.filter(cat => (cat.type == "essential" || cat.type == "non-essential") && cat.active);
    }, [categorySelections]);
    const savingCategories = useMemo(() => {
        return setActiveCategories(categorySelections, "savings");
    }, [categorySelections]);

    const activeCategorySelection = useMemo(() => {
        if (expenseType == "expense") {
            return [{ category: 'Select a Category' }, ...expenseCategories];
        } else if (expenseType == "saving") {
            return [{ category: 'Select a Category' }, ...savingCategories];
        } else {
            return [{ category: 'Select a Category' }, ...incomeCategories];
        }
    }, [expenseType])

    return (
        <div id="AddExpenseBar" className="Expense">
            <div className={`expenseInput ${expenseType}`}>$<input type="text" name="amount" defaultValue={'0.00'} /></div>
            <div className="typeSelector">
                <span id="expense"
                    className={expenseType == 'expense' ? 'active' : 'inactive'}
                    onClick={() => handleTypeSelector('expense')}>
                    &minus;
                </span>
                <span id="income"
                    className={expenseType == 'income' ? 'active' : 'inactive'}
                    onClick={() => handleTypeSelector('income')}>
                    &#x2B;</span>
                <span id="saving"
                    className={expenseType == 'saving' ? 'active' : 'inactive'}

                    onClick={() => handleTypeSelector('saving')}>
                    &#x2B;</span>
            </div>
            <input type="text" placeholder="Enter a description of this expense" name="description" />
            <select defaultValue="Select a Category" ref={selectRef} required>
                {activeCategorySelection.map((cat, index) => (
                    <option key={index} value={cat.category} label={cat.category} />
                ))}
            </select>
            <input type="date" name="date" required />
            <button id="addExpenseButton" type="submit">+ Add</button>
        </div>
    )
}

export default AddExpenseBar;