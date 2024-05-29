import { UserAuth } from "../lib/UserAuth";
import Budget from "./budgetComponents";

const Page = () => {
  const user = UserAuth();
  return <Budget />;
};
export default Page;
