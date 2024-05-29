import { UserAuth } from "../lib/UserAuth";
import Dashboard from "./dashboardPage";

const Page = ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  const user = UserAuth();
  return <Dashboard monthParam={searchParams?.month || ""} />;
};
export default Page;
