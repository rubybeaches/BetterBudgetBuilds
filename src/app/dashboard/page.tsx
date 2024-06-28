import { UserAuth } from "../lib/UserAuth";
import { getUserBudget } from "../lib/data";
import { allMonths, defaultIncomeCategories } from "../lib/helpers";
import Dashboard from "./dashboardPage";
import categories from "../lib/seed.json";

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
    year?: string;
  };
}) => {
  const user = await UserAuth();
  if (!user) return null;

  let month =
    searchParams?.month && allMonths.includes(searchParams?.month)
      ? searchParams?.month
      : new Date().toLocaleString("en-US", { month: "long" });
  const year = Number(searchParams?.year) || new Date().getFullYear();

  const budget = await getUserBudget(allMonths.indexOf(month), year, user.id);

  return (
    <Dashboard
      expenseCategories={budget?.expenseCategories || categories}
      incomeCategories={budget?.incomeCategories || defaultIncomeCategories}
      baseIncome={budget?.income || 0}
      month={month}
      year={year}
    />
  );
};
export default Page;
