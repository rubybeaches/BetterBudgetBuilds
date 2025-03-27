import Image from "next/image";
import "../page.css";

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
          <li className="text-green border-green">Income</li>
          <li className="text-blue border-blue">Essentials</li>
          <li className="text-purple border-purple">Non-Essentials</li>
          <li className="text-orange border-orange">Savings</li>
          <li className="text-orange border-orange">Planning</li>
          <li className="text-red border-red">Loans</li>
          <div
            className="border-rainbow"
            style={{ marginLeft: "auto", borderRadius: "50px" }}
          >
            <li style={{ background: "white", border: "none" }}>
              <span className="text-rainbow">Review</span>
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
    </main>
  );
}
