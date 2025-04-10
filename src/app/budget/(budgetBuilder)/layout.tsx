import Image from "next/image";
import "../page.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="max-w-5xl mx-auto">
      <nav
        style={{
          background: "white",
          borderRadius: "50px",
          margin: "20px auto",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "6px",
            listStyleType: "none",
            padding: "12px",
          }}
        >
          <li className="text-green border-green">
            <Link href="/budget/income">Income</Link>
          </li>
          <li className="text-blue border-blue">
            <Link href="/budget/essentials">Essentials</Link>
          </li>
          <li className="text-purple border-purple">
            <Link href="/budget/non-essentials">Non-Essentials</Link>
          </li>
          <li className="text-orange border-orange">
            <Link href="/budget/savings">Savings</Link>
          </li>
          <li className="text-orange border-orange">
            <Link href="/budget/planning">Planning</Link>
          </li>
          <li className="text-red border-red">
            <Link href="/budget/loans">Loans</Link>
          </li>
          <div
            className="border-rainbow"
            style={{ marginLeft: "auto", borderRadius: "50px" }}
          >
            <li style={{ background: "white", border: "none" }}>
              <span className="text-rainbow">
                <Link href="/budget/review">Review</Link>
              </span>
            </li>
          </div>
        </ul>
      </nav>
      <Image
        src="/BBBLogo.png"
        width={265}
        height={108}
        style={{ width: "200px", height: "auto" }}
        alt="Better Budget Builds Logo"
      />
      {children}
      <footer
        style={{ margin: "20px auto", textAlign: "center" }}
        className="text-white"
      >
        ©2025 Better Budget Builds LLC. All rights reserved
      </footer>
    </main>
  );
}
