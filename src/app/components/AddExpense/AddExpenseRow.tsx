import { convertToFloat } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";
import { useRef, useState } from "react";

const AddExpenseRow = ({
  expense,
  updateExpense,
}: {
  expense: Expense;
  updateExpense: (expense: Expense) => void;
}) => {
  const [recurringEdit, setRecurringEdit] = useState(false);
  const amountRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const dateRef = useRef<any>();

  const saveTemplate = () => {
    let newAmount = amountRef.current;
    let newDescription = descriptionRef.current;
    let newDate = dateRef.current;

    if (newAmount && newDescription && newDate) {
      let newExpense: Expense = {
        ...expense,
        amount: Number(amountRef.current.value),
        description: newDescription.value,
        entryDate: saveDate(newDate.value),
        recurring: true,
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
          <span onClick={() => setRecurringEdit(false)}>
            <RecurringIcon />
          </span>

          <div>
            ${" "}
            <input
              type="text"
              name="amount"
              defaultValue={convertToFloat(expense.amount)}
              ref={amountRef}
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              name="description"
              placeholder="Description of the expense you've accrued"
              defaultValue={expense.description}
              ref={descriptionRef}
            />
          </div>
        </td>
        <td>
          <div>{expense.category}</div>
        </td>
        <td>
          <div>
            <input
              type="date"
              name="date"
              defaultValue={displayDate(expense.entryDate)}
              ref={dateRef}
            />
          </div>
          <div
            className="saveRecurrenceContainer"
            onClick={() => saveTemplate()}
          >
            <div
              className="saveRecurrence"
              style={{ display: "flex", gap: "4px" }}
            >
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
          ${" "}
          <input
            type="text"
            name="amount"
            value={convertToFloat(expense.amount)}
            readOnly
          />
        </td>
        <td>
          <input
            type="text"
            name="description"
            value={expense.description}
            readOnly
          />
        </td>
        <td>{expense.category}</td>
        <td>
          <input
            type="date"
            name="date"
            value={displayDate(expense.entryDate)}
            readOnly
          />
        </td>
      </tr>
    );
  }
};

export default AddExpenseRow;
