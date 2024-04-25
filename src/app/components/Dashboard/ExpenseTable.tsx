import { convertToFloat } from "@/app/lib/helpers";
import { expense } from "@/app/lib/types";
import { useMemo } from "react";

const ExpenseTable = ({ expense }: { expense: expense[] }) => {
  const sortedExpenses = useMemo(() => {
    return expense.sort((a, b) => {
      if (a.entryDate < b.entryDate) {
        return -1;
      }
      if (a.entryDate > b.entryDate) {
        return 1;
      }
      return 0;
    });
  }, [expense]);

  return (
    <table id="expenseTable">
      <tbody>
        {sortedExpenses.map((exp, index) => (
          <tr key={index}>
            <td className="expenseAmount">$ {convertToFloat(exp.amount)}</td>
            <td>{exp.description}</td>
            <td>{exp.category}</td>
            <td>
              {new Date(exp.entryDate).toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseTable;
