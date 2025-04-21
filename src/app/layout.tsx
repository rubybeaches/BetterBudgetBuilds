import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const mont = Montserrat({
  variable: "--font-mont",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Better Budget Builds",
  description:
    "The all in one budget application, from saving, to planning, to thriving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`min-h-screen ${mont.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
