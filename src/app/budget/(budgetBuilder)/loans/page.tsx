import { UserAuth } from "../../../lib/UserAuth";
import { getActiveBudget } from "../../../lib/data";
// import categories from "../../../lib/seed.json";
import Link from "next/link";
import LoanBuiler from "./loanBuilder";

const Page = async () => {
  const user = await UserAuth();
  if (!user) return null;

  // const budget = await getActiveBudget(user.id);

  return (
    <>
      <section className="red-bg text-white">
        <h2 className="text-7xl">Loans.</h2>
        <p className="text-lg font-bold">
          School loans? Loan for a car? Mortgage on a home? Add your outstanding
          loans in this section and recieve an auto calculated pay off tracker
          you can use to track payments. Loan minimum payments will
          automatically get added to your monthly expense tracker.
        </p>
      </section>

      <LoanBuiler userID={user.id} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/budget/planning" className="text-white text-lg">
          &#8592; Back
        </Link>
        <Link href="/budget/review" className="text-white text-lg">
          Next &#8594;
        </Link>
      </div>
    </>
  );
};
export default Page;
