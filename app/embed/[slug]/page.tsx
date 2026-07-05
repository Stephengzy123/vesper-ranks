// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { EntryList } from "@/components/entry-list";
import { EmbedResizeReporter } from "@/components/embed-resize-reporter";
import { getLeaderboard } from "@/lib/db";

type EmbedPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const board = await getLeaderboard(slug);
  if (!board) notFound();

  const boardStyle = {
    "--board-primary": board.primaryColor,
    "--board-accent": board.accentColor,
    "--board-text": board.textColor
  } as CSSProperties;

  return (
    <main className={`embed-shell custom-board ${board.gradientBackground ? "gradient-board" : ""}`} style={boardStyle}>
      <EmbedResizeReporter slug={slug} />
      <section className="embed-hero">
        {board.headerImageUrl ? (
          <img className={`board-header-image embed-header-image image-fit-${board.headerImageFit}`} src={board.headerImageUrl} alt="" />
        ) : null}
        <p className="eyebrow">Live leaderboard</p>
        <h1>{board.name}</h1>
        {board.description ? <p>{board.description}</p> : null}
        <Link className="preview-button embed-view-all" href={`/leaderboards/${slug}`} target="_blank" rel="noreferrer">
          View all
        </Link>
      </section>
      <EntryList board={board} compact />
    </main>
  );
}
