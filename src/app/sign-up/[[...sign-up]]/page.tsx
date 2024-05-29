import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="main">
      <SignUp
        signInForceRedirectUrl={"/dashboard"}
        forceRedirectUrl={"/budget"}
      />
    </div>
  );
}
