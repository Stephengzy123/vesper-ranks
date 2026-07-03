import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "VesperRanks",
  description: "Quiet, focused live leaderboards."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/home" aria-label="VesperRanks home">
            <span className="brand-mark">V</span>
            <span>VesperRanks</span>
          </Link>
          <nav className="nav">
            <Link href="/home">Home</Link>
            <Link href="/admin">Admin</Link>
            <form action={logoutAction}>
              <button className="ghost-button" type="submit">Log out</button>
            </form>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
