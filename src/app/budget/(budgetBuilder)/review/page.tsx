import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";
// import categories from "../../../lib/seed.json";
import Link from "next/link";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  const budget = await getActiveBudget(user.id);

  return (
    <>
      <section className="rainbow-bg text-white">
        <h2 className="text-7xl">Review.</h2>
        <p className="text-lg font-bold">
          Let's make sure all the numbers look correct, and that you
          <span>&lsquo;</span>ve covered all your assets. Aim to create a budget
          balance of $0, where every dollar has a home. Revisit your budget
          anytime to update categories or totals, update loans, or add new
          planning goals. To use your new budget, you must apply it to a
          starting month from this page.
        </p>
      </section>

      <section className="categorySection planningSection"></section>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/budget/loans" className="text-white text-lg">
          &#8592; Back
        </Link>
      </div>
    </>
  );
};
export default Page;
