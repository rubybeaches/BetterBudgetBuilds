import { category, expense } from "@/app/lib/types";
import { setActiveCategories, sortCategories } from "../../lib/helpers";
import { defaultIncomeCategories } from "../../lib/helpers";
import { useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

const AddExpenseBar = ({
  categorySelections,
  addExpenseCallback,
}: {
  categorySelections: category[];
  addExpenseCallback: (expense: expense) => void;
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

  const handleAdd = () => {
    if (
      Number(amountRef.current.value) == 0 ||
      dateRef.current.value == "" ||
      selectRef.current.value.split(",")[1] == "none"
    ) {
      return alert("please fill out each field");
    }

    const newExpense: expense = {
      id: uuid(),
      amount: Number(amountRef.current.value),
      category: selectRef.current.value.split(",")[0],
      description: descriptionRef.current.value,
      entryDate: dateRef.current.value,
      type: selectRef.current.value.split(",")[1],
      recurring: false,
      linkedAccount: "",
    };

    amountRef.current.value = "0.00";
    descriptionRef.current.value = "";
    dateRef.current.value = "";
    handleTypeSelector("expense");

    addExpenseCallback(newExpense);
  };

  const incomeCategories: category[] = [
    ...defaultIncomeCategories,
    {
      ...defaultIncomeCategories[0],
      category: "Paycheck",
      min: 1,
      max: 35,
      curr: 5,
    },
  ];

  sortCategories(incomeCategories, "category");

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
        placeholder="Enter a description of this expense"
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
  );
};

export default AddExpenseBar;
