import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";
import categories from "../../../lib/seed.json";
import Link from "next/link";
import EssentialCategoryBuilder from "./essentialCategoryBuilder";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getActiveBudget(user.id);

  return (
    <>
      <section className="blue-bg text-white">
        <h2 className="text-7xl">Essentials.</h2>
        <p className="text-lg font-bold">
          These expenses represent non-negotiable monthly needs like housing,
          food, and utilities. Typically, this should make up about 60% of your
          monthly income, but between 50% - 75% may be more likely.
        </p>
      </section>
      {/* EssentialCategoryBuilder */}
      <section className="categorySection essentialSection">
        <EssentialCategoryBuilder
          expenseCategories={budget?.expenseCategories || categories}
          baseIncome={budget?.income || 0}
          activeBudgetMonthStart={
            budget && budget?.start.getFullYear() == new Date().getFullYear()
              ? budget?.start.getMonth()
              : -1
          }
          budgetID={budget?.id || -1}
          userID={user.id}
        />
      </section>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/budget/income" className="text-white text-lg">
          &#8592; Back
        </Link>
        <Link href="/budget/non-essential" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
