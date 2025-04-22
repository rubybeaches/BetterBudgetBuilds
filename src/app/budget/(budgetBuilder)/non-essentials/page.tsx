import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";
import categories from "../../../lib/seed.json";
import Link from "next/link";
import NonEssentialCategoryBuilder from "./nonEssentialCategoryBuilder";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getActiveBudget(user.id);

  return (
    <>
      <section className="purple-bg text-white">
        <h2 className="text-7xl">Non Essentials.</h2>
        <p className="text-lg font-bold">
          These expenses represent nice to haves, not a neccesity but a luxury
          worth paying for. Subscriptions, games, and junk food might fall into
          this category. Typically, this should make up about 30% of your
          monthly income, but between 20% - 40% is fair game if you leave
          breathing room for savings.
        </p>
      </section>
      {/* EssentialCategoryBuilder */}
      <section className="categorySection nonEssentialSection">
        <NonEssentialCategoryBuilder
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
        <Link href="/budget/essentials" className="text-white text-lg">
          &#8592; Back
        </Link>
        <Link href="/budget/savings" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
