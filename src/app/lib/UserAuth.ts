import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma-client";

export const UserAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  if (!primaryEmail) redirect("sign-up");

  // Query DB for user specific information or display assets only to signed in users
  let existingUser = await prisma.user.findUnique({
    where: {
      email: primaryEmail,
    },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        name: user?.firstName,
        email: primaryEmail,
      },
    });
  }

  return existingUser;
};
