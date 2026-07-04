import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { logoutAction } from "@/app/actions";
import { getSession } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "VesperRanks",
  description: "Quiet, focused live leaderboards."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession().catch(() => null);
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isEmbed = pathname.startsWith("/embed/");

  return (
    <html lang="en">
      <body>
        {isEmbed ? null : (
          <header className="topbar">
            <Link className="brand" href="/home" aria-label="VesperRanks home">
              <span className="brand-mark">V</span>
              <span>VesperRanks</span>
            </Link>
            <nav className="nav">
              <Link href="/home">Home</Link>
              {session?.role === "admin" ? (
                <Link className="staff-shortcut" href="/admin/dashboard">Admin controls</Link>
              ) : null}
              {session?.role === "manager" && session.slug ? (
                <Link className="staff-shortcut" href={`/manage/${session.slug}`}>Managed event</Link>
              ) : null}
              {session ? null : <Link href="/admin">Admin</Link>}
              {session ? (
                <form action={logoutAction}>
                  <button className="ghost-button" type="submit">Log out</button>
                </form>
              ) : null}
            </nav>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
