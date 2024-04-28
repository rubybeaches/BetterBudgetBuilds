import { convertToFloat, parsetoNum } from "@/app/lib/helpers";
import { useMemo } from "react";

const ProgressBar = ({
  categoryExpenseTotal,
  budgetTotal,
}: {
  categoryExpenseTotal: number;
  budgetTotal: string;
}) => {
  const expenseRatio = useMemo(() => {
    const percent = categoryExpenseTotal / parsetoNum(budgetTotal);
    return percent >= 1 ? 1 : percent;
  }, [categoryExpenseTotal, budgetTotal]);

  return (
    <span>
      <div
        id="progressMonthly"
        className={`${
          expenseRatio > 0.8
            ? expenseRatio == 1
              ? "overBudgetMonthly"
              : "overBudgetWarning"
            : ""
        }`}
        style={{
          width: `${expenseRatio * 350}px`,
          zIndex: `${expenseRatio < 0.6 ? 1 : 0}`,
        }}
      >
        <p>$ {convertToFloat(categoryExpenseTotal)}</p>
      </div>
      <div
        id="progressBudget"
        className={`${expenseRatio == 1 ? "overBudgetProgress" : ""}`}
        style={{
          width: `${(1 - expenseRatio) * 350}px`,
          zIndex: `${expenseRatio > 0.6 ? 1 : 0}`,
        }}
      >
        <p>$ {budgetTotal}</p>
      </div>
      <div
        className={` ${
          expenseRatio == 1 ? "overBudgetBlock show" : "overBudgetBlock hidden"
        }`}
      />
    </span>
  );
};

export default ProgressBar;
