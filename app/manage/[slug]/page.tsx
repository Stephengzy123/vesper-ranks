import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adjustEntryAction,
  changeManagerPasswordAction,
  deleteEntryAction,
  managerLoginAction,
  saveEntryAction,
  updateSettingsAction
} from "@/app/actions";
import { getLeaderboard } from "@/lib/db";
import { getSession } from "@/lib/session";

type ManagePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string; ok?: string }>;
};

export default async function ManagePage({ params, searchParams }: ManagePageProps) {
  const { slug } = await params;
  const board = await getLeaderboard(slug);
  if (!board) notFound();

  const session = await getSession().catch(() => null);
  const paramsValue = await searchParams;
  const error = paramsValue?.error ? decodeURIComponent(paramsValue.error) : "";
  const ok = paramsValue?.ok ? decodeURIComponent(paramsValue.ok) : "";
  const isManager = session?.role === "manager" && session.slug === slug;

  if (!isManager) {
    const login = managerLoginAction.bind(null, slug);
    return (
      <main className="page-shell narrow">
        <section className="tool-panel">
          <Link className="back-link" href={`/leaderboards/${slug}`}>View board</Link>
          <p className="eyebrow">Manager</p>
          <h1>{board.name}</h1>
          {error ? <p className="form-message error">{error}</p> : null}
          <form className="form-stack" action={login}>
            <label>
              Username
              <input name="username" defaultValue={board.managerUsername} autoComplete="username" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button type="submit">Manage leaderboard</button>
          </form>
        </section>
      </main>
    );
  }

  const saveEntry = saveEntryAction.bind(null, slug);
  const removeEntry = deleteEntryAction.bind(null, slug);
  const adjustEntry = adjustEntryAction.bind(null, slug);
  const changePassword = changeManagerPasswordAction.bind(null, slug);
  const updateSettings = updateSettingsAction.bind(null, slug);

  return (
    <main className="page-shell">
      <section className="board-hero">
        <Link className="back-link" href={`/leaderboards/${slug}`}>View public board</Link>
        <p className="eyebrow">Manager workspace</p>
        <h1>{board.name}</h1>
        <p>{board.entries.length}/100 entries</p>
        {error ? <p className="form-message error">{error}</p> : null}
        {ok ? <p className="form-message ok">{ok}</p> : null}
      </section>

      <section className="manager-grid">
        <div className="tool-panel">
          <h2>Add entry</h2>
          <form className="form-stack" action={saveEntry}>
            <label>
              Person or group
              <input name="name" required maxLength={80} />
            </label>
            <label>
              {board.measurement}
              <input name="value" type="number" required defaultValue={0} />
            </label>
            <label>
              Note
              <input name="note" maxLength={120} placeholder="Optional context" />
            </label>
            <button type="submit">Save entry</button>
          </form>
        </div>

        <div className="tool-panel">
          <h2>Board settings</h2>
          <form className="form-stack" action={updateSettings}>
            <label>
              Description
              <textarea name="description" defaultValue={board.description} maxLength={240} />
            </label>
            <label>
              Measurement
              <input name="measurement" required defaultValue={board.measurement} maxLength={40} />
            </label>
            <label>
              Optional max
              <input name="maxValue" type="number" min={1} defaultValue={board.maxValue ?? ""} />
            </label>
            <button type="submit">Save settings</button>
          </form>
        </div>

        <div className="tool-panel">
          <h2>Change password</h2>
          <form className="form-stack" action={changePassword}>
            <label>
              Old password
              <input name="oldPassword" type="password" required />
            </label>
            <label>
              New password
              <input name="newPassword" type="password" required minLength={8} />
            </label>
            <label>
              Confirm password
              <input name="confirmPassword" type="password" required minLength={8} />
            </label>
            <button type="submit">Update password</button>
          </form>
        </div>
      </section>

      <section className="tool-panel">
        <h2>Entries</h2>
        <div className="manager-list">
          {board.entries.map((entry) => (
            <div className="manager-entry" key={entry.id}>
              <form className="manager-edit-form" action={saveEntry}>
                <input type="hidden" name="id" value={entry.id} />
                <label>
                  Name
                  <input name="name" defaultValue={entry.name} required maxLength={80} />
                </label>
                <label>
                  Value
                  <input name="value" type="number" defaultValue={entry.value} required />
                </label>
                <label>
                  Note
                  <input name="note" defaultValue={entry.note} maxLength={120} />
                </label>
                <button type="submit">Save</button>
              </form>
              <div className="row-actions">
                <form action={adjustEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <input type="hidden" name="delta" value={10} />
                  <button className="ghost-button" type="submit">+10</button>
                </form>
                <form action={adjustEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <input type="hidden" name="delta" value={-10} />
                  <button className="ghost-button" type="submit">-10</button>
                </form>
                <form action={removeEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <button className="ghost-button danger" type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
