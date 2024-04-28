import {
  convertToFloat,
  isDateInWeek,
  multiplyPercentToFloat,
  parsetoNum,
} from "@/app/lib/helpers";
import { category, expense } from "@/app/lib/types";
import SummaryRow from "./SummaryRow";
import { useState } from "react";

const SummaryTable = ({
  categories,
  expenses,
  monthlyIncome,
}: {
  categories: category[];
  expenses: expense[];
  monthlyIncome: number;
}) => {
  const newDate = new Date();
  const fullYear = newDate.getFullYear();
  const month = newDate.getMonth();

  const weeksInMonth = (year: number, month: number, weekCount: number) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    const beginArray = [1, 8, 15, 22];
    const endArray = [7, 14, 21, lastDay];

    const weekBoundBegin = new Date(year, month, beginArray[weekCount - 1]);
    const weekBoundEnd = new Date(year, month, endArray[weekCount - 1]);

    return [weekBoundBegin, weekBoundEnd];
  };

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

  const totalExpenses = sumExpenses([weekOne[0], weekFour[1]]);

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
              parsetoNum(totalExpenses) > parsetoNum(sumBudget())
                ? "overBudgetExpenses"
                : ""
            }
          >
            ${totalExpenses}
          </td>
          <td>${sumBudget()}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SummaryTable;
