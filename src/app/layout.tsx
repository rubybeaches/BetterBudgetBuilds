import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const Mont = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Better Budget Builds",
  description:
    "The all in one budget application, from saving, to planning, to thriving.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={Mont.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
