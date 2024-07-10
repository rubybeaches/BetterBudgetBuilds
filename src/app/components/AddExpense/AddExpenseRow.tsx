import { convertToFloat, parsetoNum } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";
import { useRef, useState } from "react";
import { createRecurrence } from "@/app/lib/actions";
import { ExpenseRecurrence } from "@/app/lib/types";

const AddExpenseRow = ({
  expense,
  updateExpense,
}: {
  expense: ExpenseRecurrence;
  updateExpense: (expense: ExpenseRecurrence) => void;
}) => {
  const [recurringEdit, setRecurringEdit] = useState(false);
  const amountRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const dateRef = useRef<any>();

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

      let newExpense: ExpenseRecurrence = {
        ...expense,
        amount: parsetoNum(amountRef.current.value),
        description: newDescription.value,
        entryDate: recurrenceEntryDate,
        recurring: true,
        recurringExpenseId: recurrence.id,
        recurrence: recurrence,
      };
      setRecurringEdit(() => false);
      updateExpense(newExpense);
    }
  };

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
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td
          className={`expenseAmount ${
            expense.recurring ? "recurringActive" : ""
          }`}
        >
          <span
            onClick={() => {
              setRecurringEdit(true);
            }}
          >
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
        </td>
      </tr>
    );
  }
};

export default AddExpenseRow;
