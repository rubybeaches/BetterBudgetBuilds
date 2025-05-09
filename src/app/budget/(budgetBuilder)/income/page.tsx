import { defaultIncomeCategories } from "@/app/lib/helpers";
import { UserAuth } from "../../../lib/UserAuth";
import { getOrCreateDraftBudget } from "../../../lib/data";
import IncomeCategoryBuilder from "./incomeCategoryBuilder";
import Link from "next/link";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  let budget = await getOrCreateDraftBudget(user.id);

  return (
    <>
      <section className="green-bg text-white">
        <h2 className="text-7xl">Income.</h2>
        <p className="text-lg font-bold">
          The first step to create a budget that will best fit your needs will
          depend on the amount of, and type of, income that you bring in. For
          the purposes of this budget, we base all budget calculations off of
          your income after taxes and deductions. If you<span>&lsquo;</span>d
          like a little extra guidance, try our{" "}
          <Link
            href={""}
            className="text-blue"
            style={{ textDecoration: "underline" }}
          >
            baseline tool
          </Link>{" "}
          to generate a budget template.
        </p>
      </section>
      <IncomeCategoryBuilder
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span></span>
        <Link href="/budget/essentials" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
