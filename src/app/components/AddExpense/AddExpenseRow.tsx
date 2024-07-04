import { convertToFloat } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";

const AddExpenseRow = ({
  expense,
  updateExpense,
}: {
  expense: Expense;
  updateExpense: (expense: Expense) => void;
}) => {
  const displayDate = (date: string) => {
    let [month, day, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  return (
    <tr>
      <td className="expenseAmount">
        <RecurringIcon />${" "}
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
