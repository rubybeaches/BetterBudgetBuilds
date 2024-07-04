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

  return (
    <tr>
      <td
        className={`expenseAmount ${recurringActive ? "recurringActive" : ""}`}
      >
        <span onClick={() => setRecurringActive(true)}>
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
};

export default AddExpenseRow;
