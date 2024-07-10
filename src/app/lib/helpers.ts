import { Expense } from "@prisma/client";
import { category, expense, ExpenseRecurrence } from "./types";

export const convertToFloat = (number: number) => {
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  //.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const multiplyPercentToFloat = (percent: number, number: number) => {
  return ((number * percent) / 100)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parsetoNum = (stringNumber: string) => {
  return parseFloat(stringNumber.replace(/,/g, "")) || 0;
};

export function pascalCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const isDateInWeek = (
  boundBegin: Date,
  boundEnd: Date,
  checkDate: Date
) => {
  checkDate.setHours(0, 0, 0, 0);
  return boundBegin <= checkDate && checkDate <= boundEnd;
};

export const isDateInMonth = (
  monthIndex: number,
  year: number,
  checkDate: Date
) => {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const boundBegin = new Date(year, monthIndex, 1);
  const boundEnd = new Date(year, monthIndex, lastDay);

  checkDate.setHours(0, 0, 0, 0);
  return boundBegin <= checkDate && checkDate <= boundEnd;
};

export const weeksInMonth = (
  year: number,
  month: number,
  weekCount: number
) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const beginArray = [1, 8, 15, 22];
  const endArray = [7, 14, 21, lastDay];

  const weekBoundBegin = new Date(year, month, beginArray[weekCount - 1]);
  const weekBoundEnd = new Date(year, month, endArray[weekCount - 1]);

  return [weekBoundBegin, weekBoundEnd];
};

export const sortCategories = (array: category[], filter: keyof category) => {
  return array.sort((a, b) => {
    if (a[filter] < b[filter]) {
      return -1;
    }
    if (a[filter] > b[filter]) {
      return 1;
    }
    return 0;
  });
};

export const sortExpensesWithRecurrence = (
  array: ExpenseRecurrence[],
  filter: keyof ExpenseRecurrence
) => {
  if (
    filter == "linkedAccount" ||
    filter == "recurringExpenseId" ||
    filter == "recurrence"
  )
    return array;
  return array.sort((a, b) => {
    if (a[filter] < b[filter]) {
      return -1;
    }
    if (a[filter] > b[filter]) {
      return 1;
    }
    return 0;
  });
};

export const sortExpenses = (array: Expense[], filter: keyof Expense) => {
  if (filter == "linkedAccount" || filter == "recurringExpenseId") return array;
  return array.sort((a, b) => {
    if (a[filter] < b[filter]) {
      return -1;
    }
    if (a[filter] > b[filter]) {
      return 1;
    }
    return 0;
  });
};

// load user info

export const filterExpensesByMonth = (
  expense: Expense[],
  year: number,
  month: number
) => {
  return expense.filter((exp) =>
    isDateInMonth(month, year, new Date(exp.entryDate))
  );
};

export const setActiveCategories = (categories: category[], type: string) => {
  return categories.filter((cat) => cat.type == type && cat.active);
};

export const setInactiveCategoryList = (categories: category[]) => {
  return categories.filter((cat) => !cat.active);
};

// Add/Remove Category Functions

export const buildInitialAddList = (categories: category[]) => {
  const addList: category[] = [];
  categories.map((cat) => {
    if (cat.help) {
      cat.help.split(",").map((item) => {
        addList.push({ ...cat, category: item, help: "" });
      });
    }
    if (!cat.active) {
      addList.push({ ...cat });
    }
  });
  return addList;
};

export const defaultIncomeCategories = [
  {
    category: "Income",
    help: "Paycheck, Dividends, Interest Accrual, Self-Income, Repayment, Rebate",
    min: 5,
    max: 100,
    curr: 100,
    active: 1,
    type: "income",
  },
];

export const seedExpenses = [
  {
    id: "1",
    amount: 34.53,
    category: "Eating Out",
    description: "A lovely trip to El charro",
    entryDate: "2024-04-04T17:48:00.000Z",
    type: "non-essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "2",
    amount: 64.0,
    category: "Subscriptions",
    description: "planta app",
    entryDate: "2024-04-14T17:48:00.000Z",
    type: "non-essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "3",
    amount: 407.6,
    category: "Housing",
    description: "mortgage for house",
    entryDate: "2024-04-14T17:48:00.000Z",
    type: "essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "4",
    amount: 208.25,
    category: "Groceries",
    description: "meatbals, french fires, and shrimp",
    entryDate: "2024-04-12T17:48:00.000Z",
    type: "essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "5",
    amount: 104.6,
    category: "Health and Wellness",
    description: "milan laser loan",
    entryDate: "2024-04-29T17:48:00.000Z",
    type: "essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "6",
    amount: 101.0,
    category: "Utilities",
    description: "alliant electric",
    entryDate: "2024-04-15T17:48:00.000Z",
    type: "essential",
    recurring: true,
    linkedAccount: "",
  },
  {
    id: "7",
    amount: 41.0,
    category: "Utilities",
    description: "Natural Gas",
    entryDate: "2024-04-20T17:48:00.000Z",
    type: "essential",
    recurring: true,
    linkedAccount: "",
  },
  {
    id: "8",
    amount: 21.93,
    category: "Subscriptions",
    description: "Netflix",
    entryDate: "2024-04-19T17:48:00.000Z",
    type: "non-essential",
    recurring: true,
    linkedAccount: "",
  },
  {
    id: "9",
    amount: 26.36,
    category: "Subscriptions",
    description: "Hulu/disney",
    entryDate: "2024-04-22T17:48:00.000Z",
    type: "non-essential",
    recurring: true,
    linkedAccount: "",
  },
  {
    id: "10",
    amount: 89.81,
    category: "Self-Care",
    description: "new dress and bra",
    entryDate: "2024-04-22T17:48:00.000Z",
    type: "non-essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "11",
    amount: 89.81,
    category: "Eating Out",
    description: "jimmy johns",
    entryDate: "2024-04-02T17:48:00.000Z",
    type: "non-essential",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "12",
    amount: 152.65,
    category: "Savings",
    description: "ally interest",
    entryDate: "2024-04-25T17:48:00.000Z",
    type: "savings",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "13",
    amount: 58.45,
    category: "Stocks",
    description: "purchasing some stocks",
    entryDate: "2024-04-15T17:48:00.000Z",
    type: "savings",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "14",
    amount: 1451.35,
    category: "Income",
    description: "first paycheck",
    entryDate: "2024-04-01T17:48:00.000Z",
    type: "income",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "15",
    amount: 1451.35,
    category: "Income",
    description: "second paycheck",
    entryDate: "2024-04-16T17:48:00.000Z",
    type: "income",
    recurring: false,
    linkedAccount: "",
  },
  {
    id: "16",
    amount: 1451.35,
    category: "Travel",
    description: "ireland trip",
    entryDate: "2024-04-16T17:48:00.000Z",
    type: "non-essential",
    recurring: false,
    linkedAccount: "",
  },
];
