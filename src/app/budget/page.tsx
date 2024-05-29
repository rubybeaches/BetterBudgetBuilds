import { UserAuth } from "../lib/UserAuth";
import { getUserBudget } from "../lib/data";
import Budget from "./budgetPage";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getUserBudget(
    new Date().getMonth(),
    new Date().getFullYear(),
    user.id
  );

  return <Budget />;
};
export default Page;
