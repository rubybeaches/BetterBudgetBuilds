import {
  convertToFloat,
  isDateInWeek,
  multiplyPercentToFloat,
  parsetoNum,
} from "@/app/lib/helpers";
import { category } from "@/app/lib/types";
import ProgressBar from "../ProgressBar";
import { Expense } from "@prisma/client";

const SummaryRow = ({
  category,
  expenses,
  monthlyIncome,
  weeks,
}: {
  category: category;
  expenses: Expense[];
  monthlyIncome: number;
  weeks: Date[][];
}) => {
  const weekOne: Date[] = weeks[0];
  const weekTwo: Date[] = weeks[1];
  const weekThree: Date[] = weeks[2];
  const weekFour: Date[] = weeks[3];

  const getCategoryExpenses = (weekBounds: Date[]) => {
    return convertToFloat(
      expenses.reduce(
        (sum, expense) =>
          expense.category == category.category &&
          isDateInWeek(
            weekBounds[0],
            weekBounds[1],
            new Date(expense.entryDate)
          )
            ? sum + expense.amount
            : sum,
        0
      )
    );
  };

  const monthExpenseTotal = getCategoryExpenses([weekOne[0], weekFour[1]]);

  return (
    <tr>
      <td>{category.category}</td>
      <td>${getCategoryExpenses(weekOne)}</td>
      <td>${getCategoryExpenses(weekTwo)}</td>
      <td>${getCategoryExpenses(weekThree)}</td>
      <td>${getCategoryExpenses(weekFour)}</td>
      <td id="empty"></td>
      <td className="summaryProgressBar" colSpan={2}>
        <ProgressBar
          categoryExpenseTotal={parsetoNum(monthExpenseTotal)}
          budgetTotal={multiplyPercentToFloat(category.curr, monthlyIncome)}
        />
      </td>
    </tr>
  );
};

export default SummaryRow;
