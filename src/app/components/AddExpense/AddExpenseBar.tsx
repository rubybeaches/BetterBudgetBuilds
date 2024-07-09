import { category, ExpenseRecurrence } from "@/app/lib/types";
import {
  allMonths,
  parsetoNum,
  setActiveCategories,
  sortCategories,
} from "../../lib/helpers";
import { useMemo, useRef, useState } from "react";
import { Expense } from "@prisma/client";

const AddExpenseBar = ({
  userID,
  month,
  year,
  categorySelections,
  incomeCategorySelections,
  addExpenseCallback,
}: {
  userID: number;
  month: string;
  year: number;
  categorySelections: category[];
  incomeCategorySelections: category[];
  addExpenseCallback: (expense: ExpenseRecurrence) => void;
}) => {
  const amountRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const selectRef = useRef<any>();
  const dateRef = useRef<any>();
  const [expenseType, setExpenseType] = useState("expense");

  const handleTypeSelector = (type: string) => {
    selectRef.current.value = ["Select a Category", "none"];
    setExpenseType(() => type);
  };

  const formatDate = (dateString: string) => {
    const [year, day, month] = dateString.split("-");

    return `${day}-${month}-${year}`;
  };

  const handleAdd = () => {
    if (
      Number(amountRef.current.value) == 0 ||
      dateRef.current.value == "" ||
      selectRef.current.value.split(",")[1] == "none"
    ) {
      return alert("please fill out each field");
    }

    const newExpense: ExpenseRecurrence = {
      id: Date.now(),
      amount: parsetoNum(amountRef.current.value),
      category: selectRef.current.value.split(",")[0],
      description: descriptionRef.current.value,
      entryDate: formatDate(dateRef.current.value),
      entryMonth: allMonths.indexOf(month) + 1,
      entryYear: year,
      type: selectRef.current.value.split(",")[1],
      recurring: false,
      linkedAccount: "",
      userId: userID,
      recurringExpenseId: null,
      recurrence: null,
    };

    amountRef.current.value = "0.00";
    descriptionRef.current.value = "";
    dateRef.current.value = "";
    handleTypeSelector("expense");

    addExpenseCallback(newExpense);
  };

  const incomeCategories: category[] = useMemo(() => {
    return sortCategories(incomeCategorySelections, "category");
  }, [incomeCategorySelections]);

  const expenseCategories = useMemo(() => {
    const expenses = categorySelections.filter(
      (cat) =>
        (cat.type == "essential" || cat.type == "non-essential") && cat.active
    );

    return sortCategories(expenses, "category");
  }, [categorySelections]);

  const savingCategories = useMemo(() => {
    const savings = setActiveCategories(categorySelections, "savings");
    return sortCategories(savings, "category");
  }, [categorySelections]);

  const activeCategorySelection = useMemo(() => {
    const selectCategory: category = {
      category: "Select a Category",
      help: "",
      min: 0,
      max: 0,
      curr: 0,
      type: "none",
      active: 0,
    };

    if (expenseType == "expense") {
      return [selectCategory, ...expenseCategories];
    } else if (expenseType == "saving") {
      return [selectCategory, ...savingCategories];
    } else {
      return [selectCategory, ...incomeCategories];
    }
  }, [expenseType, categorySelections]);

  return (
    <div id="AddExpenseBar" className="Expense">
      <div id="AddExpenseBarInner">
        <div className={`expenseInput ${expenseType}`}>
          $
          <input
            ref={amountRef}
            type="text"
            name="amount"
            defaultValue={"0.00"}
          />
        </div>
        <div className="typeSelector">
          <span
            id="expense"
            className={expenseType == "expense" ? "active" : "inactive"}
            onClick={() => handleTypeSelector("expense")}
          >
            &minus;
          </span>
          <span
            id="income"
            className={expenseType == "income" ? "active" : "inactive"}
            onClick={() => handleTypeSelector("income")}
          >
            &#x2B;
          </span>
          <span
            id="saving"
            className={expenseType == "saving" ? "active" : "inactive"}
            onClick={() => handleTypeSelector("saving")}
          >
            &#x2B;
          </span>
        </div>
        <input
          ref={descriptionRef}
          type="text"
          placeholder="Description of the expense you've accrued"
          name="description"
        />
        <select ref={selectRef} defaultValue="Select a Category" required>
          {activeCategorySelection.map((cat, index) => (
            <option
              key={index}
              value={[cat.category, cat.type]}
              label={cat.category}
            />
          ))}
        </select>
        <input ref={dateRef} type="date" name="date" required />
        <button id="addExpenseButton" onClick={() => handleAdd()}>
          + Add
        </button>
      </div>
    </div>
  );
};

export default AddExpenseBar;
