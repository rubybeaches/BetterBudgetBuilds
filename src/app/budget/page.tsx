import { UserAuth } from "../lib/UserAuth";
import { getActiveBudget } from "../lib/data";
import { defaultIncomeCategories } from "../lib/helpers";
import categories from "../lib/seed.json";
import Budget from "./budgetPage";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getActiveBudget(
    new Date().getMonth(),
    new Date().getFullYear(),
    user.id
  );

  return (
    <Budget
      expenseCategories={budget?.expenseCategories || categories}
      incomeCategories={budget?.incomeCategories || defaultIncomeCategories}
      baseIncome={budget?.income || 0}
      activeBudgetMonthStart={
        budget && budget?.start.getFullYear() == new Date().getFullYear()
          ? budget?.start.getMonth()
          : 0
      }
      budgetID={budget?.id || -1}
      userID={user.id}
    />
  );
};
export default Page;
