import { UserAuth } from "../lib/UserAuth";
import { getUserBudget } from "../lib/data";
import categories from "../lib/seed.json";
import Budget from "./budgetPage";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getUserBudget(
    new Date().getMonth(),
    new Date().getFullYear(),
    user.id
  );

  return (
    <Budget
      expenseCategories={budget?.expenseCategories || []}
      incomeCategories={budget?.incomeCategories || []}
      baseIncome={budget.income}
    />
  );
};
export default Page;
