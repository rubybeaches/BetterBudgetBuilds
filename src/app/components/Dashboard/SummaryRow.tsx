import { convertToFloat, isDateInWeek, multiplyPercentToFloat } from "@/app/lib/helpers";
import { category, expense } from "@/app/lib/types";
import { useMemo } from "react";

const SummaryRow = ({ category, expenses, monthlyIncome, weeks }: { category: category, expenses: expense[], monthlyIncome: number, weeks: Date[][] }) => {

    const weekOne: Date[] = weeks[0];
    const weekTwo: Date[] = weeks[1];
    const weekThree: Date[] = weeks[2];
    const weekFour: Date[] = weeks[3];
    const fullMonth: Date[] = [weekOne[0], weekFour[1]]

    const getExpenses = (weekBounds: Date[]) => {
        return expenses.reduce((sum, expense) => (
            expense.category == category.category && isDateInWeek(weekBounds[0], weekBounds[1], new Date(expense.entryDate)) ? sum + expense.amount : sum
        ), 0)
    };

    const getBudgetExpenseRatio = useMemo(() => {
        const percent = getExpenses(fullMonth) / (category.curr / 100 * monthlyIncome);
        return percent > 1 ? 1 : percent;
    }, [getExpenses, category, expenses, monthlyIncome])

    return (
        <tr>
            <td>{category.category}</td>
            <td>${getExpenses(weekOne)}</td>
            <td>${getExpenses(weekTwo)}</td>
            <td>${getExpenses(weekThree)}</td>
            <td>${getExpenses(weekFour)}</td>
            <td id="empty"></td>
            <td className="summaryProgressBar" colSpan={2}>
                <span>
                    <div id="progressMonthly"
                        style={{ width: `${getBudgetExpenseRatio * 350}px`, zIndex: `${(getBudgetExpenseRatio < .6 ? 1 : 0)}` }}>
                        <p>$ {convertToFloat(getExpenses(fullMonth))}</p>
                    </div>
                    <div id="progressBudget"
                        style={{ width: `${(1 - getBudgetExpenseRatio) * 350}px`, zIndex: `${(getBudgetExpenseRatio > .6 ? 1 : 0)}` }}>
                        <p>$ {multiplyPercentToFloat(category.curr, monthlyIncome)}</p>
                    </div>
                </span>
            </td>
        </tr>
    )
}

export default SummaryRow;