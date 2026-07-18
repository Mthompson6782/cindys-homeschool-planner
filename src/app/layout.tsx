import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

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
        <div className={styles.appContainer}>
          <nav className={styles.sidebar}>
            <div className={styles.logo}>
              <h2>Home School</h2>
            </div>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/" className={styles.navLink}>
                  <span className={styles.icon}>📅</span> Calendar
                </Link>
              </li>
              <li>
                <Link href="/admin" className={styles.navLink}>
                  <span className={styles.icon}>⚙️</span> Admin & Setup
                </Link>
              </li>
            </ul>
          </nav>
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
