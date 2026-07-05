// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import { Medal } from "lucide-react";
import type { LeaderboardWithEntries } from "@/lib/types";

function rankLabel(index: number) {
  return index + 1;
}

export function EntryList({ board, compact = false }: { board: LeaderboardWithEntries; compact?: boolean }) {
  if (board.entries.length === 0) {
    return (
      <section className="empty-state">
        <h2>No entries yet</h2>
        <p>The manager can add up to 100 people or groups to this leaderboard.</p>
      </section>
    );
  }

  const highest = Math.max(...board.entries.map((entry) => entry.value), board.maxValue ?? 0, 1);

  return (
    <section className={`entry-stack ${compact ? "compact-entries" : ""}`} aria-label={`${board.name} rankings`}>
      {board.entries.map((entry, index) => {
        const width = Math.max(4, Math.round((entry.value / highest) * 100));
        return (
          <article className={`entry-row rank-${index + 1}`} key={entry.id}>
            <div className="rank-number">
              {index < 3 ? <Medal size={18} aria-hidden="true" /> : null}
              <span>{rankLabel(index)}</span>
            </div>
            <div className="entry-main">
              <div className="entry-heading">
                <h2>{entry.name}</h2>
                <strong>{entry.value.toLocaleString()}</strong>
              </div>
              <div className="progress">
                <span style={{ width: `${width}%` }} />
              </div>
              {entry.note ? <p>{entry.note}</p> : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
