import {
  convertToFloat,
  isDateInWeek,
  parsetoNum,
  weeksInMonth,
} from "@/app/lib/helpers";
import { category } from "@/app/lib/types";
import SummaryRow from "./SummaryRow";
import { Expense } from "@prisma/client";

const SummaryTable = ({
  categories,
  expenses,
  monthlyIncome,
  monthIndex,
  totalExpenses,
}: {
  categories: category[];
  expenses: Expense[];
  monthlyIncome: number;
  monthIndex: number;
  totalExpenses: number;
}) => {
  const today = new Date();
  const fullYear = today.getFullYear();
  let month = new Date(fullYear, monthIndex).getMonth();

  const [weekOne, weekTwo, weekThree, weekFour] = [
    weeksInMonth(fullYear, month, 1),
    weeksInMonth(fullYear, month, 2),
    weeksInMonth(fullYear, month, 3),
    weeksInMonth(fullYear, month, 4),
  ];

  const sumExpenses = (weekBounds: Date[]) => {
    return convertToFloat(
      expenses.reduce(
        (sum, expense) =>
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

  const sumBudget = () => {
    let sum = 0;
    categories.map(
      (category) => (sum += (category.curr / 100) * monthlyIncome)
    );
    return convertToFloat(sum);
  };

  return (
    <table id="summaryTable">
      <tbody>
        <tr>
          <td></td>
          <td>Week One</td>
          <td>Week Two</td>
          <td>Week Three</td>
          <td>Week Four</td>
          <td id="empty"></td>
          <td id="summaryMonthly">Monthly Actual</td>
          <td id="summaryBudget">Budget</td>
        </tr>
        {categories.map((category, index) => (
          <SummaryRow
            key={index}
            category={category}
            expenses={expenses}
            monthlyIncome={monthlyIncome}
            weeks={[weekOne, weekTwo, weekThree, weekFour]}
          />
        ))}
        <tr id="summaryTotals">
          <td>
            <em>Totals</em>
          </td>
          <td>${sumExpenses(weekOne)}</td>
          <td>${sumExpenses(weekTwo)}</td>
          <td>${sumExpenses(weekThree)}</td>
          <td>${sumExpenses(weekFour)}</td>
          <td id="empty"></td>
          <td
            id={
              totalExpenses > parsetoNum(sumBudget())
                ? "overBudgetExpenses"
                : ""
            }
          >
            <span className="baseBarBubble">
              ${convertToFloat(totalExpenses)}
            </span>
          </td>
          <td>${sumBudget()}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SummaryTable;
