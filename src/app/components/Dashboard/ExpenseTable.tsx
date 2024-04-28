import { convertToFloat } from "@/app/lib/helpers";
import { expense } from "@/app/lib/types";
import { useMemo, useState } from "react";

const ExpenseTable = ({ expense }: { expense: expense[] }) => {
  const [filter, setFilter] = useState<keyof expense>("entryDate");

  const sortedExpenses = useMemo(() => {
    return expense.sort((a, b) => {
      if (a[filter] < b[filter]) {
        return -1;
      }
      if (a[filter] > b[filter]) {
        return 1;
      }
      return 0;
    });
  }, [expense, filter]);

  return (
    <>
      <div className="filter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width={12}
        >
          <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
        </svg>
        <select onChange={(e) => setFilter(e.target.value as keyof expense)}>
          <option value="entryDate" label="Date" />
          <option value="amount" label="Amount" />
          <option value="category" label="Category" />
        </select>
      </div>
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
    </>
  );
};

export default ExpenseTable;
