import { convertToFloat } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";
import { useState } from "react";

const AddExpenseRow = ({
  expense,
  updateExpense,
}: {
  expense: Expense;
  updateExpense: (expense: Expense) => void;
}) => {
  const [recurringActive, setRecurringActive] = useState(expense.recurring);
  const [recurringEdit, setRecurringEdit] = useState(false);

  const displayDate = (date: string) => {
    let [month, day, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  if (recurringEdit) {
    return (
      <tr>
        <td
          className={`expenseAmount recurringEdit ${
            recurringActive ? "recurringActive" : ""
          }`}
        >
          <span onClick={() => setRecurringEdit(false)}>
            <RecurringIcon />
          </span>

          <div>
            ${" "}
            <input
              type="text"
              name="amount"
              defaultValue={convertToFloat(expense.amount)}
            />
          </div>
        </td>
        <td>
          <input
            type="text"
            name="description"
            placeholder="Description of the expense you've accrued"
            defaultValue={expense.description}
          />
        </td>
        <td>{expense.category}</td>
        <td>
          <input
            type="date"
            name="date"
            defaultValue={displayDate(expense.entryDate)}
          />
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td
          className={`expenseAmount ${
            recurringActive ? "recurringActive" : ""
          }`}
        >
          <span
            onClick={() => {
              setRecurringEdit(true);
              setRecurringActive(true);
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
