import { convertToFloat } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";

const AddExpenseRow = ({ expense }: { expense: Expense }) => {
  // switch this to use input fields and form submit, use server action and expense id to update the expense values of recurring and associated recurring table
  // Also need a way to make sure the add expense page gets saved and doesn't wipe any in-progress expenses
  return (
    <tr>
      <td className="expenseAmount">
        <RecurringIcon />$ {convertToFloat(expense.amount)}
      </td>
      <td>{expense.description}</td>
      <td>{expense.category}</td>
      <td>
        {new Date(expense.entryDate).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}
      </td>
    </tr>
  );
};

export default AddExpenseRow;
