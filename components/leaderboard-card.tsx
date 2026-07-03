import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import type { LeaderboardWithEntries } from "@/lib/types";

export function LeaderboardCard({ board }: { board: LeaderboardWithEntries }) {
  const top = board.entries[0];
  const progress =
    top && board.maxValue ? Math.max(0, Math.min(100, Math.round((top.value / board.maxValue) * 100))) : null;

  return (
    <Link className="leaderboard-card" href={`/leaderboards/${board.slug}`}>
      <div className="card-topline">
        <span className="rank-chip"><Trophy size={14} /> {board.measurement}</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      <h2>{board.name}</h2>
      <p>{board.description || "Live rankings managed on VesperRanks."}</p>
      <div className="card-stat">
        <span>{top ? top.name : "No entries yet"}</span>
        <strong>{top ? top.value.toLocaleString() : "-"}</strong>
      </div>
      {progress !== null ? (
        <div className="progress" aria-label={`${progress}% of maximum`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <span className="subtle">{board.entries.length} entries</span>
    </Link>
  );
}
