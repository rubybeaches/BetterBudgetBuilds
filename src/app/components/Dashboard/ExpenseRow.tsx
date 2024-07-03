import { convertToFloat } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";

const ExpenseRow = ({ expense }: { expense: Expense }) => {
  return (
    <tr>
      <td className="expenseAmount">$ {convertToFloat(expense.amount)}</td>
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

export default ExpenseRow;
