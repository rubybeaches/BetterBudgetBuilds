import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="main">
      <SignIn
        signUpForceRedirectUrl={"/budget"}
        forceRedirectUrl={"/dashboard"}
      />
    </div>
  );
}
