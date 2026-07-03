import { staffLoginAction } from "@/app/actions";

type AdminPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const error = params?.error ? decodeURIComponent(params.error) : "";

  return (
    <main className="page-shell narrow">
      <section className="tool-panel">
        <p className="eyebrow">Staff</p>
        <h1>Staff sign-in</h1>
        {error ? <p className="form-message error">{error}</p> : null}

        <form className="form-stack" action={staffLoginAction}>
          <div className="form-title-row">
            <span className="quiet-copy">Credentials</span>
            <span className="tooltip-wrap">
              <button className="icon-button info-button" type="button" aria-label="Staff sign-in details">
                <span aria-hidden="true">i</span>
              </button>
              <span className="tooltip-bubble" role="tooltip">
                Admins use the global staff account. Managers use their leaderboard username and password.
              </span>
            </span>
          </div>
          <label>
            Username
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
