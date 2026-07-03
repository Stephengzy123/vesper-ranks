import { createLeaderboardAction, adminLoginAction } from "@/app/actions";
import { getSession } from "@/lib/session";

type AdminPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const session = await getSession().catch(() => null);
  const error = params?.error ? decodeURIComponent(params.error) : "";

  return (
    <main className="page-shell narrow">
      <section className="tool-panel">
        <p className="eyebrow">Admin</p>
        <h1>Control room</h1>
        {error ? <p className="form-message error">{error}</p> : null}

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
          <form className="form-stack" action={adminLoginAction}>
            <label>
              Username
              <input name="username" autoComplete="username" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">Enter admin</button>
          </form>
        )}
      </section>
    </main>
  );
}
