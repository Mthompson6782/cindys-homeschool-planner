import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { UserProvider } from "@/components/UserProvider";

export const metadata: Metadata = {
  title: "Cindy's Home School App",
  description: "A digital planner for Leo, Alex, and Cindy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
