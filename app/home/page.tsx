// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import Link from "next/link";
import { Search } from "lucide-react";
import { listLeaderboards } from "@/lib/db";
import { getSession } from "@/lib/session";
import { LeaderboardCard } from "@/components/leaderboard-card";

type HomePageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const q = params?.q ?? "";
  const session = await getSession().catch(() => null);
  const boards = await listLeaderboards(q);

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>VesperRanks</h1>
        <form className="search-panel" action="/home">
          <Search size={20} aria-hidden="true" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search leaderboards"
            aria-label="Search leaderboards"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="board-grid" aria-label="Leaderboards">
        {boards.map((board) => (
          <LeaderboardCard
            key={board.id}
            board={board}
            canManage={session?.role === "admin" || (session?.role === "manager" && session.slug === board.slug)}
          />
        ))}
      </section>

      {boards.length === 0 ? (
        <section className="empty-state">
          <h2>No leaderboards found</h2>
          <p>Try a different search, or ask the admin to create a new board.</p>
          <Link className="pill-link" href="/home">Clear search</Link>
        </section>
      ) : null}
    </main>
  );
}
