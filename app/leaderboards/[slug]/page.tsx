import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/db";
import { EntryList } from "@/components/entry-list";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const board = await getLeaderboard(slug);
  if (!board) notFound();

  return (
    <main className="page-shell">
      <section className="board-hero">
        <Link className="back-link" href="/home">Home</Link>
        <p className="eyebrow">{board.measurement}{board.maxValue ? ` out of ${board.maxValue}` : ""}</p>
        <h1>{board.name}</h1>
        <p>{board.description || "A live leaderboard managed on VesperRanks."}</p>
      </section>
      <EntryList board={board} />
    </main>
  );
}
