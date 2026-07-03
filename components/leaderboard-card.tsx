import Link from "next/link";
import { ArrowUpRight, Settings, Trophy } from "lucide-react";
import type { LeaderboardWithEntries } from "@/lib/types";

export function LeaderboardCard({ board, canManage = false }: { board: LeaderboardWithEntries; canManage?: boolean }) {
  const top = board.entries[0];
  const progress =
    top && board.maxValue ? Math.max(0, Math.min(100, Math.round((top.value / board.maxValue) * 100))) : null;

  return (
    <article className="leaderboard-card">
      <div className="card-topline">
        <span className="rank-chip"><Trophy size={14} /> {board.measurement}</span>
        <span className="card-actions">
          {canManage ? (
            <Link className="icon-button" href={`/manage/${board.slug}`} aria-label={`Manage ${board.name}`}>
              <Settings size={17} aria-hidden="true" />
            </Link>
          ) : null}
          <Link className="icon-button" href={`/leaderboards/${board.slug}`} aria-label={`Open ${board.name}`}>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </span>
      </div>
      <Link className="card-main-link" href={`/leaderboards/${board.slug}`}>
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
      </Link>
      <span className="subtle">{board.entries.length} entries</span>
    </article>
  );
}
