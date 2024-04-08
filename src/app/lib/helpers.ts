import { category } from "./types";

export const convertToFloat = (number: number) => {
    return (number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const multiplyPercentToFloat = (percent: number, number: number) => {
    return (number * percent / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const parsetoNum = (stringNumber: string) => {
    return parseFloat(stringNumber.replace(/,/g, '')) || 0;
}

export function pascalCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        }
    );
}

export const isDateInWeek = (boundBegin: Date, boundEnd: Date, checkDate: Date) => {
    checkDate.setHours(0, 0, 0, 0);
    return boundBegin <= checkDate && checkDate <= boundEnd;
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
        "max": 100,
        "curr": 100,
        "active": 1,
        "type": "income"
    }
]

export const seedExpenses = [
    {
        "amount": 34.53,
        "category": "Eating Out",
        "description": "A lovely trip to El charro",
        "entryDate": "2024-04-04T17:48:00.000Z",
        "type": "non-essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 64.00,
        "category": "Subscriptions",
        "description": "planta app",
        "entryDate": "2024-04-14T17:48:00.000Z",
        "type": "non-essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 407.60,
        "category": "Housing",
        "description": "mortgage for house",
        "entryDate": "2024-04-14T17:48:00.000Z",
        "type": "essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 208.25,
        "category": "Groceries",
        "description": "meatbals, french fires, and shrimp",
        "entryDate": "2024-04-12T17:48:00.000Z",
        "type": "essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 104.60,
        "category": "Health and Wellness",
        "description": "milan laser loan",
        "entryDate": "2024-04-29T17:48:00.000Z",
        "type": "essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 101.00,
        "category": "Utilities",
        "description": "alliant electric",
        "entryDate": "2024-04-15T17:48:00.000Z",
        "type": "essential",
        "recurring": true,
        "linkedAccount": ""
    },
    {
        "amount": 41.00,
        "category": "Utilities",
        "description": "Natural Gas",
        "entryDate": "2024-04-20T17:48:00.000Z",
        "type": "essential",
        "recurring": true,
        "linkedAccount": ""
    },
    {
        "amount": 21.93,
        "category": "Subscriptions",
        "description": "Netflix",
        "entryDate": "2024-04-19T17:48:00.000Z",
        "type": "non-essential",
        "recurring": true,
        "linkedAccount": ""
    },
    {
        "amount": 26.36,
        "category": "Subscriptions",
        "description": "Hulu/disney",
        "entryDate": "2024-04-22T17:48:00.000Z",
        "type": "non-essential",
        "recurring": true,
        "linkedAccount": ""
    },
    {
        "amount": 89.81,
        "category": "Self-Care",
        "description": "new dress and bra",
        "entryDate": "2024-04-22T17:48:00.000Z",
        "type": "non-essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 89.81,
        "category": "Eating Out",
        "description": "jimmy johns",
        "entryDate": "2024-04-02T17:48:00.000Z",
        "type": "non-essential",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 152.65,
        "category": "Savings",
        "description": "ally interest",
        "entryDate": "2024-04-25T17:48:00.000Z",
        "type": "savings",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 58.45,
        "category": "Stocks",
        "description": "purchasing some stocks",
        "entryDate": "2024-04-15T17:48:00.000Z",
        "type": "savings",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 1451.35,
        "category": "Income",
        "description": "first paycheck",
        "entryDate": "2024-04-01T17:48:00.000Z",
        "type": "income",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 1451.35,
        "category": "Income",
        "description": "second paycheck",
        "entryDate": "2024-04-16T17:48:00.000Z",
        "type": "income",
        "recurring": false,
        "linkedAccount": ""
    },
    {
        "amount": 1451.35,
        "category": "Travel",
        "description": "ireland tripsecond paycheck",
        "entryDate": "2024-04-16T17:48:00.000Z",
        "type": "non-essential",
        "recurring": false,
        "linkedAccount": ""
    }
]