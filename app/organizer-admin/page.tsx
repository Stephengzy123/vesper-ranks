// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import Link from "next/link";
import { Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { createLeaderboardAction } from "@/app/actions";
import { PendingSubmitNotice } from "@/components/pending-submit-notice";
import { listLeaderboards } from "@/lib/db";
import { getSession } from "@/lib/session";

type OrganizerAdminPageProps = {
  searchParams?: Promise<{ error?: string; ok?: string }>;
};

export default async function OrganizerAdminPage({ searchParams }: OrganizerAdminPageProps) {
  const session = await getSession().catch(() => null);
  if (session?.role !== "admin") {
    redirect("/organizer-admin-login");
  }

  const params = await searchParams;
  const error = params?.error ? decodeURIComponent(params.error) : "";
  const ok = params?.ok ? decodeURIComponent(params.ok) : "";
  const boards = await listLeaderboards();

  return (
    <main className="page-shell">
      <section className="tool-panel">
        <p className="eyebrow">Admin</p>
        <h1>Control room</h1>
        {error ? <p className="form-message error">{error}</p> : null}
        {ok ? <p className="form-message ok">{ok}</p> : null}

        <form className="form-stack" action={createLeaderboardAction}>
          <label>
            Leaderboard name
            <input name="name" required minLength={2} maxLength={80} placeholder="Chess Rankings" />
          </label>
          <label>
            Description
            <textarea name="description" maxLength={240} placeholder="What this board tracks" />
          </label>
          <div className="form-grid">
            <label>
              Measurement
              <input name="measurement" required defaultValue="Score" maxLength={40} />
            </label>
            <label>
              Optional max
              <input name="maxValue" type="number" min={1} placeholder="100" />
            </label>
          </div>
          <label>
            Manager password
            <input name="managerPassword" type="password" required minLength={8} />
          </label>
          <p className="quiet-copy">The manager username will match the generated leaderboard slug.</p>
          <PendingSubmitNotice messages={["Creating your event", "It's taking longer than usual", "Almost there"]} />
          <button type="submit">Create leaderboard</button>
        </form>
      </section>

      <section className="tool-panel admin-board-panel">
        <h2>Leaderboards</h2>
        <div className="manager-list">
          {boards.map((board) => (
            <div className="admin-board-row" key={board.id}>
              <div>
                <strong>{board.name}</strong>
                <p>{board.managerUsername}</p>
              </div>
              <Link className="icon-button" href={`/manage/${board.slug}`} aria-label={`Manage ${board.name}`}>
                <Settings size={18} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
