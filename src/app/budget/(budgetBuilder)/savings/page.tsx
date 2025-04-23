import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";
import categories from "../../../lib/seed.json";
import Link from "next/link";
import CategoryBuilder from "@/app/components/Budget/CategoryBuilder";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getActiveBudget(user.id);

  return (
    <>
      <section className="orange-bg text-white">
        <h2 className="text-7xl">Savings.</h2>
        <p className="text-lg font-bold">
          Every leftover dollar should have a plan, that<span>&lsquo;</span>s
          where savings come in. Whether you<span>&lsquo;</span>re setting aside
          money for a potential repair, saving for a rainy day, or simply want
          to compound money with a high interest savings account. Ideally, you
          will be able to set at least 10% of your monthly income aside, or more
          if you
          <span>&lsquo;</span>re able.
        </p>
      </section>

      <section className="categorySection savingsSection">
        <CategoryBuilder
          type="Savings"
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
        <Link href="/budget/non-essentials" className="text-white text-lg">
          &#8592; Back
        </Link>
        <Link href="/budget/planning" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
