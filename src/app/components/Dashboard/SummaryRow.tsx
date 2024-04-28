import { isDateInWeek, multiplyPercentToFloat } from "@/app/lib/helpers";
import { category, expense } from "@/app/lib/types";
import ProgressBar from "../ProgressBar";

const SummaryRow = ({
  category,
  expenses,
  monthlyIncome,
  weeks,
}: {
  category: category;
  expenses: expense[];
  monthlyIncome: number;
  weeks: Date[][];
}) => {
  const weekOne: Date[] = weeks[0];
  const weekTwo: Date[] = weeks[1];
  const weekThree: Date[] = weeks[2];
  const weekFour: Date[] = weeks[3];
  const fullMonth: Date[] = [weekOne[0], weekFour[1]];

  const getCategoryExpenses = (weekBounds: Date[]) => {
    return expenses.reduce(
      (sum, expense) =>
        expense.category == category.category &&
        isDateInWeek(weekBounds[0], weekBounds[1], new Date(expense.entryDate))
          ? sum + expense.amount
          : sum,
      0
    );
  };

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
          categoryExpenseTotal={getCategoryExpenses(fullMonth)}
          budgetTotal={multiplyPercentToFloat(category.curr, monthlyIncome)}
        />
      </td>
    </tr>
  );
};

export default SummaryRow;
