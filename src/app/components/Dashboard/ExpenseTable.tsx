import { convertToFloat } from "@/app/lib/helpers";
import { expense } from "@/app/lib/types";

const ExpenseTable = ({ expense }: { expense: expense[] }) => {
    return (
        <table id="expenseTable">
            {expense.map((exp, index) => (
                <tr key={index}>
                    <td className="expenseAmount">$ {convertToFloat(exp.amount)}</td>
                    <td>{exp.description}</td>
                    <td>{exp.category}</td>
                    <td>{new Date(exp.entryDate).toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</td>
                </tr>
            ))}
        </table>
    )
}

export default ExpenseTable;