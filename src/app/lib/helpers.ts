import { category } from "./types";

export const convertToFloat = (number: number) => {
    return (number).toFixed(2);
}

export const multiplyPercentToFloat = (percent: number, number: number) => {
    return (number * percent / 100).toFixed(2);
}

export function pascalCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        }
    );
}

// load user info

export const setActiveCategories = (categories: category[], type: string) => {
    return categories.filter(cat => cat.type == type && cat.active);
}

export const setInactiveCategoryList = (categories: category[]) => {
    return categories.filter(cat => !cat.active);
}

// Add/Remove Category Functions

export const buildInitialAddList = (categories: category[]) => {
    const addList: category[] = [];
    categories.map(cat => {
        if (cat.help.length > 0) {
            cat.help.map(item => { addList.push({ ...cat, category: item, help: [] }) });
        }
        if (!cat.active) {
            addList.push({ ...cat });
        }
    })
    return addList;
}


export const defaultIncomeCategories = [
    {
        "category": "Income",
        "help": [
            "Paycheck",
            "Dividends",
            "Interest Accrual",
            "Self-Income",
            "Repayment",
            "Rebate"
        ],
        "min": 5,
        "max": 65,
        "curr": 60,
        "active": 1,
        "type": "income"
    }
]