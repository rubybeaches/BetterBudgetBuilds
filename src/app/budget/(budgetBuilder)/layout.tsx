import Image from "next/image";
import "../page.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <nav></nav>
      <Image
        src="/BBBLogo.png"
        width={265}
        height={108}
        alt="Better Budget Builds Logo"
      />
      {children}
    </main>
  );
}
