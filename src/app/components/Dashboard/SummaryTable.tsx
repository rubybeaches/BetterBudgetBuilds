import { convertToFloat, multiplyPercentToFloat } from "@/app/lib/helpers";
import { category, expense } from "@/app/lib/types";

const SummaryTable = ({ categories, expenses, monthlyIncome }: { categories: category[], expenses: expense[], monthlyIncome: number }) => {

    const getExpenses = (category: string) => {
        return expenses.reduce((sum, expense) => expense.category == category ? sum + expense.amount : sum, 0);
    }

    const getBudgetExpenseRatio = (category: category) => {
        const percent = getExpenses(category.category) / (category.curr / 100 * monthlyIncome);
        return percent > 1 ? 1 : percent;
    }

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
                    <tr key={index}>
                        <td>{category.category}</td>
                        <td>$0.00</td>
                        <td>$0.00</td>
                        <td>$0.00</td>
                        <td>$0.00</td>
                        <td id="empty"></td>
                        <td className="summaryProgressBar" colSpan={2}><span>
                            <div id="progressMonthly" style={{ width: `${getBudgetExpenseRatio(category) * 350}px`, zIndex: `${(category.curr + 30 < 60 ? 1 : 0)}` }}><p>$ {convertToFloat(getExpenses(category.category))}</p></div>
                            <div id="progressBudget" style={{ width: `${(1 - getBudgetExpenseRatio(category)) * 350}px`, zIndex: `${(category.curr + 30 > 60 ? 1 : 0)}` }}><p>$ {multiplyPercentToFloat(category.curr, monthlyIncome)}</p></div></span></td>
                    </tr>
                ))}
                <tr id="summaryTotals">
                    <td><em>Totals</em></td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td id="empty"></td>
                    <td>$10.00</td>
                    <td>$0.00</td>
                </tr>
            </tbody>
        </table>
    )
}

export default SummaryTable;