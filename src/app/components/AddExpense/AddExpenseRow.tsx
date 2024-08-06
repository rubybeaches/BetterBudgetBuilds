import { convertToFloat, parsetoNum, sortCategories } from "@/app/lib/helpers";
import { RecurringExpense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";
import EditIcon from "./EditSVG";
import { useMemo, useRef, useState } from "react";
import { createRecurrence } from "@/app/lib/actions";
import { category, ExpenseRecurrence } from "@/app/lib/types";

const AddExpenseRow = ({
  expense,
  updateExpense,
  categorySelections,
}: {
  expense: ExpenseRecurrence;
  updateExpense: (expense: ExpenseRecurrence) => void;
  categorySelections: category[];
}) => {
  // category list for making changes on edit
  const categoryList = useMemo(() => {
    let typeFilter = expense.type.includes("essential")
      ? "essential"
      : expense.type;
    const expenses = categorySelections.filter(
      (cat) => cat.type.includes(typeFilter) && cat.active
    );
    return sortCategories(expenses, "category");
  }, [categorySelections]);

  const [expenseEdit, setExpenseEdit] = useState(false);
  const [recurringEdit, setRecurringEdit] = useState(false);

  const amountRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const selectRef = useRef<any>();
  const dateRef = useRef<any>();

  // recurring expense toggles
  const [amountToggle, setAmountToggle] = useState(
    expense.recurringExpenseId && !expense.recurrence?.amount ? false : true
  );
  const [descriptionToggle, setDescriptionToggle] = useState(
    expense.recurringExpenseId && !expense.recurrence?.description
      ? false
      : true
  );
  const [categoryToggle, setCategoryToggle] = useState(
    expense.recurringExpenseId && !expense.recurrence?.category ? false : true
  );
  const [dateToggle, setDateToggle] = useState(
    expense.recurringExpenseId && !expense.recurrence?.day ? false : true
  );

  // recurring expense cancel
  const cancelEdit = () => {
    setAmountToggle(() =>
      expense.recurringExpenseId && !expense.recurrence?.amount ? false : true
    );
    setDescriptionToggle(() =>
      expense.recurringExpenseId && !expense.recurrence?.description
        ? false
        : true
    );
    setRecurringEdit(() => false);
  };

  // save and create recurring expense
  const saveTemplate = async () => {
    let newAmount = amountRef.current;
    let newDescription = descriptionRef.current;
    let newDate = dateRef.current;

    if (newAmount && newDescription && newDate) {
      let recurrenceEntryDate = saveDate(newDate.value);
      let allMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      const recurrence = await createRecurrence(
        amountToggle ? parsetoNum(amountRef.current.value) : undefined,
        categoryToggle ? expense.category : undefined,
        expense.type,
        descriptionToggle ? newDescription.value : undefined,
        Number(recurrenceEntryDate.split("-")[1]),
        allMonths,
        expense.userId
      );
      saveExpense(recurrence, newAmount, newDescription, newDate);
      setRecurringEdit(() => false);
    }
  };

  const saveExpense = (
    recurrence: RecurringExpense | null,
    newAmount = amountRef.current,
    newDescription = descriptionRef.current,
    newDate = dateRef.current
  ) => {
    let newExpense: ExpenseRecurrence = {
      ...expense,
      amount: parsetoNum(newAmount.value),
      description: newDescription.value,
      category: selectRef.current.value,
      entryDate: saveDate(newDate.value),
      recurring: recurrence ? true : false,
      recurringExpenseId: recurrence ? recurrence.id : null,
      recurrence: recurrence,
    };
    updateExpense(newExpense);
  };

  // date handling conversions with date input
  const saveDate = (date: string) => {
    let [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };

  const displayDate = (date: string) => {
    let [month, day, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  if (recurringEdit) {
    return (
      <tr>
        <td className={`expenseAmount recurringEdit recurringActive`}>
          <span onClick={() => cancelEdit()}>
            <RecurringIcon />
          </span>

          <div
            className={`recurringInput ${
              amountToggle ? "active" : "inactive"
            } `}
          >
            ${" "}
            <input
              type="text"
              name="amount"
              defaultValue={convertToFloat(expense.amount)}
              ref={amountRef}
            />
            <span onClick={() => setAmountToggle(() => !amountToggle)}>
              <RecurringIcon />
            </span>
          </div>
        </td>
        <td>
          <div
            className={`recurringInput ${
              descriptionToggle ? "active" : "inactive"
            } `}
          >
            <input
              type="text"
              name="description"
              placeholder="Description of the expense you've accrued"
              defaultValue={expense.description}
              ref={descriptionRef}
            />
            <span
              onClick={() => setDescriptionToggle(() => !descriptionToggle)}
            >
              <RecurringIcon />
            </span>
          </div>
        </td>
        <td>
          <div
            className={`recurringInput ${
              categoryToggle ? "active" : "inactive"
            } `}
          >
            <input
              type="text"
              name="category"
              defaultValue={expense.category}
            />
            <span className="hideIcon">
              <RecurringIcon />
            </span>
          </div>
        </td>
        <td>
          <div
            className={`recurringInput ${dateToggle ? "active" : "inactive"} `}
          >
            <input
              type="date"
              name="date"
              defaultValue={displayDate(expense.entryDate)}
              ref={dateRef}
            />
            <span className="hideIcon">
              <RecurringIcon />
            </span>
          </div>
          <div className="rightSideInputs">
            <div
              className="saveRecurrenceContainer close"
              onClick={() => cancelEdit()}
            >
              <div className="saveRecurrence close">
                <p className="saveRecurrenceButton">X</p>
              </div>
            </div>
            <div
              className="saveRecurrenceContainer save"
              onClick={() => saveTemplate()}
            >
              <div className="saveRecurrence save">
                <p className="saveRecurrenceButton">Make Template</p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  } else if (expenseEdit) {
    return (
      <tr>
        <td className={`expenseAmount expenseEdit`}>
          <div>
            ${" "}
            <input
              autoFocus
              type="text"
              name="amount"
              defaultValue={convertToFloat(expense.amount)}
              ref={amountRef}
            />
          </div>
        </td>
        <td>
          <input
            type="text"
            name="description"
            placeholder="Description of the expense you've accrued"
            defaultValue={expense.description}
            ref={descriptionRef}
          />
        </td>
        <td>
          <select
            ref={selectRef}
            name="category"
            defaultValue={expense.category}
          >
            {categoryList.map((cat, index) => (
              <option key={index} value={cat.category} label={cat.category} />
            ))}
          </select>
        </td>
        <td>
          <input
            type="date"
            name="date"
            defaultValue={displayDate(expense.entryDate)}
            ref={dateRef}
          />
          <div className="rightSideInputs">
            <div
              className="editContainer close"
              onClick={() => setExpenseEdit(false)}
            >
              <div className="saveExpense close">
                <p className="saveExpenseButton">X</p>
              </div>
            </div>
            <div
              className="editContainer save"
              onClick={() => {
                saveExpense(expense.recurrence);
                setExpenseEdit(false);
              }}
            >
              <div className="saveExpense save">
                <p className="saveExpenseButton">Save Expense</p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  } else {
    return (
      <tr onDoubleClick={() => setExpenseEdit(true)}>
        <td
          className={`expenseAmount ${
            expense.recurring ? "recurringActive" : ""
          }`}
        >
          <span onClick={() => setRecurringEdit(true)}>
            <RecurringIcon />
          </span>
          <div
            className={`${!expense.recurrence?.amount ? "recurringInput" : ""}`}
          >
            ${" "}
            <input
              type="text"
              name="amount"
              value={convertToFloat(expense.amount)}
              readOnly
            />
          </div>
        </td>
        <td>
          <div
            className={`${
              !expense.recurrence?.description ? "recurringInput" : ""
            }`}
          >
            <input
              type="text"
              name="description"
              value={expense.description}
              readOnly
            />
          </div>
        </td>
        <td>{expense.category}</td>
        <td>
          <div
            className={`${!expense.recurrence?.day ? "recurringInput" : ""}`}
          >
            <input
              type="date"
              name="date"
              value={displayDate(expense.entryDate)}
              readOnly
            />
          </div>
          <span className="editIcon" onClick={() => setExpenseEdit(true)}>
            <EditIcon />
          </span>
        </td>
      </tr>
    );
  }
};

export default AddExpenseRow;
