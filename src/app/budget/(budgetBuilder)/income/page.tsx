import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";

const Page = async () => {
  /* 
    <Budget
      expenseCategories={budget?.expenseCategories || categories}
      incomeCategories={budget?.incomeCategories || defaultIncomeCategories}
      baseIncome={budget?.income || 0}
      activeBudgetMonthStart={
        budget && budget?.start.getFullYear() == new Date().getFullYear()
          ? budget?.start.getMonth()
          : -1
      }
      budgetID={budget?.id || -1}
      userID={user.id}
    />
    */

  return (
    <main className="main budgetTop green-bg">
      <h2>Budget Calculator</h2>
      <p style={{ fontWeight: 500 }}>
        Use this page to create a bucket system representing your average
        monthly expenditures. To start, we&lsquo;ve provided a default list of
        categories based on national averages and percentages. Don&lsquo;t worry
        about getting it perfect the first time, you can revisit this at anytime
        and update your budget moving forward. If you&lsquo;re unsure of what
        you should put in any given bucket, use your best guess and review again
        after a few months of tracking expenses.
      </p>
    </main>
  );
};
export default Page;
