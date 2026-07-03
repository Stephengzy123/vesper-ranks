import Link from "next/link";
import { Settings } from "lucide-react";
import { createLeaderboardAction, staffLoginAction } from "@/app/actions";
import { listLeaderboards } from "@/lib/db";
import { getSession } from "@/lib/session";

type AdminPageProps = {
  searchParams?: Promise<{ error?: string; ok?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const session = await getSession().catch(() => null);
  const error = params?.error ? decodeURIComponent(params.error) : "";
  const ok = params?.ok ? decodeURIComponent(params.ok) : "";
  const boards = session?.role === "admin" ? await listLeaderboards() : [];

  return (
    <main className={session?.role === "admin" ? "page-shell" : "page-shell narrow"}>
      <section className="tool-panel">
        <p className="eyebrow">Staff</p>
        <h1>{session?.role === "admin" ? "Control room" : "Staff sign-in"}</h1>
        {error ? <p className="form-message error">{error}</p> : null}
        {ok ? <p className="form-message ok">{ok}</p> : null}

        {session?.role === "admin" ? (
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
            <p className="quiet-copy">
              The manager username will match the generated leaderboard slug.
            </p>
            <button type="submit">Create leaderboard</button>
          </form>
        ) : (
          <form className="form-stack" action={staffLoginAction}>
            <label>
              Username
              <input name="username" autoComplete="username" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">Sign in</button>
            <p className="quiet-copy">
              Admins use the global staff account. Managers use their leaderboard username and password.
            </p>
          </form>
        )}
      </section>

      {session?.role === "admin" ? (
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
      ) : null}
    </main>
  );
}
