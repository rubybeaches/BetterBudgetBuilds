import { UserAuth } from "../lib/UserAuth";
import Budget from "./budgetPage";

const Page = () => {
  const user = UserAuth();
  return <Budget />;
};
export default Page;
