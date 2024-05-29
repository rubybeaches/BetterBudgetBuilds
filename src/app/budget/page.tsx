import { auth, currentUser } from "@clerk/nextjs/server";
import Budget from "./budgetComponents";
import { redirect } from "next/navigation";

const Page = async () => {
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
    return <Budget />;
  } else {
    redirect("/sign-in");
  }

  // Get the Backend API User object when you need access to the user's information
  //const user = await currentUser()
  // Use `user` to render user details or create UI elements
};
export default Page;
