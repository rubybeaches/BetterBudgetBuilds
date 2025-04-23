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
      <section className="orange-bg planning text-white">
        <h2 className="text-7xl">Planning.</h2>
        <p className="text-lg font-bold">
          Have a trip coming up? Prefer to pay for car insurance in yearly
          increments? Need to save up an emergency fund? Welcome to planning
          accounts, where you can make a monthly payment plan to save up, or
          cash out, on non-monthly expenses. These will automatically add to
          your monthly expense tracker.
        </p>
      </section>

      <section className="categorySection planningSection"></section>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/budget/savings" className="text-white text-lg">
          &#8592; Back
        </Link>
        <Link href="/budget/loans" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
