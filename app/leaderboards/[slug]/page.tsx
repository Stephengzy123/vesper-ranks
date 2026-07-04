import Link from "next/link";
import { Settings } from "lucide-react";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getLeaderboard } from "@/lib/db";
import { getSession } from "@/lib/session";
import { EntryList } from "@/components/entry-list";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const board = await getLeaderboard(slug);
  if (!board) notFound();
  const session = await getSession().catch(() => null);
  const canManage = session?.role === "admin" || (session?.role === "manager" && session.slug === slug);
  const boardStyle = {
    "--board-primary": board.primaryColor,
    "--board-accent": board.accentColor,
    "--board-text": board.textColor
  } as CSSProperties;

  return (
    <main className="page-shell custom-board" style={boardStyle}>
      <section className="board-hero">
        <Link className="back-link" href="/home">Home</Link>
        {board.headerImageUrl ? (
          <img className="board-header-image" src={board.headerImageUrl} alt="" />
        ) : null}
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Live leaderboard</p>
            <h1>{board.name}</h1>
          </div>
          {canManage ? (
            <Link className="icon-button" href={`/manage/${slug}`} aria-label={`Manage ${board.name}`}>
              <Settings size={20} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        <p>{board.description || "A live leaderboard managed on VesperRanks."}</p>
      </section>
      <EntryList board={board} />
    </main>
  );
}
