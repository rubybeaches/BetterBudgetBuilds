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
            </tr>
            {categories.map((category, index) => (
                <tr key={index}>
                    <td>{category.category}</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                </tr>
            ))}
            <tr id="summaryTotals">
                <td><em>Totals</em></td>
                <td>$0.00</td>
                <td>$0.00</td>
                <td>$0.00</td>
                <td>$0.00</td>
            </tr>
        </table>
    )
}

export default SummaryTable;