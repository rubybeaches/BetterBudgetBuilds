import { category } from "@/app/lib/types";

const SummaryTable = ({ categories }: { categories: category[] }) => {

    return (
        <table>
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
                        <div id="progressMonthly" style={{ width: `${(category.curr + 30) / 100 * 350}px` }}><p>$ 10.00</p></div>
                        <div id="progressBudget" style={{ width: `${(1 - ((category.curr + 30) / 100)) * 350}px` }}><p>$ 20.00</p></div></span></td>
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
        </table>
    )
}

export default SummaryTable;