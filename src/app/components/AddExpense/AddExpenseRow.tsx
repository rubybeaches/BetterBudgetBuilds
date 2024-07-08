import { convertToFloat, parsetoNum } from "@/app/lib/helpers";
import { Expense } from "@prisma/client";
import RecurringIcon from "./RecurringSVG";
import { useRef, useState } from "react";
import { createRecurrence } from "@/app/lib/actions";

const AddExpenseRow = ({
  expense,
  updateExpense,
}: {
  expense: Expense;
  updateExpense: (expense: Expense) => void;
}) => {
  const [recurringEdit, setRecurringEdit] = useState(false);
  const amountRef = useRef<any>();
  const descriptionRef = useRef<any>();
  const dateRef = useRef<any>();

  const saveTemplate = async () => {
    let newAmount = amountRef.current;
    let newDescription = descriptionRef.current;
    let newDate = dateRef.current;

    if (newAmount && newDescription && newDate) {
      let recurrenceEntryDate = saveDate(newDate.value);
      let allMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      const recurrenceId = await createRecurrence(
        parsetoNum(amountRef.current.value),
        expense.category,
        newDescription.value,
        Number(recurrenceEntryDate.split("-")[1]),
        allMonths
      );

      let newExpense: Expense = {
        ...expense,
        amount: parsetoNum(amountRef.current.value),
        description: newDescription.value,
        entryDate: recurrenceEntryDate,
        recurring: true,
        recurringExpenseId: recurrenceId,
      };
      setRecurringEdit(() => false);
      updateExpense(newExpense);
    }
  };

  const saveDate = (date: string) => {
    let [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
  };

  const displayDate = (date: string) => {
    let [month, day, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  if (recurringEdit) {
    return (
      <tr>
        <td className={`expenseAmount recurringEdit recurringActive`}>
          <span onClick={() => setRecurringEdit(false)}>
            <RecurringIcon />
          </span>

          <div className={`recurringInput active`}>
            ${" "}
            <input
              type="text"
              name="amount"
              defaultValue={convertToFloat(expense.amount)}
              ref={amountRef}
            />
            <RecurringIcon />
          </div>
        </td>
        <td>
          <div className={`recurringInput active`}>
            <input
              type="text"
              name="description"
              placeholder="Description of the expense you've accrued"
              defaultValue={expense.description}
              ref={descriptionRef}
            />
            <RecurringIcon />
          </div>
        </td>
        <td>
          <div className={`recurringInput inactive`}>
            <input
              type="text"
              name="category"
              defaultValue={expense.category}
            />
            <RecurringIcon />
          </div>
        </td>
        <td>
          <div className={`recurringInput active`}>
            <input
              type="date"
              name="date"
              defaultValue={displayDate(expense.entryDate)}
              ref={dateRef}
            />
            <RecurringIcon />
          </div>
          <div
            className="saveRecurrenceContainer close"
            onClick={() => setRecurringEdit(() => false)}
          >
            <div className="saveRecurrence close">
              <p className="saveRecurrenceButton">X</p>
            </div>
          </div>
          <div
            className="saveRecurrenceContainer save"
            onClick={() => saveTemplate()}
          >
            <div className="saveRecurrence save">
              <p className="saveRecurrenceButton">Make Template</p>
            </div>
          </div>
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td
          className={`expenseAmount ${
            expense.recurring ? "recurringActive" : ""
          }`}
        >
          <span
            onClick={() => {
              setRecurringEdit(true);
            }}
          >
            <RecurringIcon />
          </span>
          <div>
            ${" "}
            <input
              type="text"
              name="amount"
              value={convertToFloat(expense.amount)}
              readOnly
            />
          </div>
        </td>
        <td>
          <input
            type="text"
            name="description"
            value={expense.description}
            readOnly
          />
        </td>
        <td>{expense.category}</td>
        <td>
          <input
            type="date"
            name="date"
            value={displayDate(expense.entryDate)}
            readOnly
          />
        </td>
      </tr>
    );
  }
};

export default AddExpenseRow;
