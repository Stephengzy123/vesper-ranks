// Copyright (C) 2026 Ziyu Gu
// Licensed under the GNU GPLv3. See LICENSE and NOTICE.

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { demoLeaderboards } from "@/lib/demo";
import { baseSlug, numberedSlug } from "@/lib/slug";
import type { Leaderboard, LeaderboardEntry, LeaderboardWithEntries } from "@/lib/types";

const connectionString = process.env.DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;

function rowToLeaderboard(row: Record<string, unknown>): Leaderboard {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    measurement: String(row.measurement ?? "Score"),
    maxValue: row.max_value === null ? null : Number(row.max_value),
    primaryColor: String(row.primary_color ?? "#1a2b4d"),
    accentColor: String(row.accent_color ?? "#355c9c"),
    textColor: String(row.text_color ?? "#f8fafc"),
    headerImageUrl: String(row.header_image_url ?? ""),
    headerImageFit: row.header_image_fit === "contain" ? "contain" : "cover",
    compactView: Boolean(row.compact_view ?? false),
    gradientBackground: Boolean(row.gradient_background ?? false),
    managerUsername: String(row.manager_username),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function rowToEntry(row: Record<string, unknown>): LeaderboardEntry {
  return {
    id: String(row.id),
    leaderboardId: String(row.leaderboard_id),
    name: String(row.name),
    value: Number(row.value),
    note: String(row.note ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function requireDb() {
  if (!sql) {
    throw new Error("DATABASE_URL is required for this action.");
  }
  return sql;
}

export async function listLeaderboards(query = ""): Promise<LeaderboardWithEntries[]> {
  if (!sql) {
    const needle = query.toLowerCase().trim();
    return demoLeaderboards.filter((board) =>
      !needle ||
      board.name.toLowerCase().includes(needle) ||
      board.description.toLowerCase().includes(needle)
    );
  }

  const rows = await sql`
    select l.*,
      coalesce(
        json_agg(e.* order by e.value desc) filter (where e.id is not null),
        '[]'
      ) as entries
    from leaderboards l
    left join leaderboard_entries e on e.leaderboard_id = l.id
    where ${query.trim()} = ''
      or l.name ilike ${`%${query.trim()}%`}
      or l.description ilike ${`%${query.trim()}%`}
    group by l.id
    order by l.updated_at desc
  `;

  return rows.map((row) => ({
    ...rowToLeaderboard(row),
    entries: (row.entries as Record<string, unknown>[]).map(rowToEntry)
  }));
}

export async function getLeaderboard(slug: string): Promise<LeaderboardWithEntries | null> {
  if (!sql) {
    return demoLeaderboards.find((board) => board.slug === slug) ?? null;
  }

  const boards = await sql`select * from leaderboards where slug = ${slug} limit 1`;
  if (!boards[0]) return null;

  const entries = await sql`
    select * from leaderboard_entries
    where leaderboard_id = ${boards[0].id}
    order by value desc, updated_at asc
  `;

  return {
    ...rowToLeaderboard(boards[0]),
    entries: entries.map(rowToEntry)
  };
}

export async function createLeaderboard(input: {
  name: string;
  description: string;
  measurement: string;
  maxValue: number | null;
  managerPassword: string;
}) {
  const db = requireDb();
  const root = baseSlug(input.name);
  let slug = root;

  for (let i = 0; i < 200; i += 1) {
    const candidate = numberedSlug(root, i);
    const existing = await db`select slug from leaderboards where slug = ${candidate} limit 1`;
    if (!existing[0]) {
      slug = candidate;
      break;
    }
  }

  const managerPasswordHash = await bcrypt.hash(input.managerPassword, 12);
  const rows = await db`
    insert into leaderboards (
      name, slug, description, measurement, max_value, manager_username, manager_password_hash
    )
    values (
      ${input.name}, ${slug}, ${input.description}, ${input.measurement},
      ${input.maxValue}, ${slug}, ${managerPasswordHash}
    )
    returning *
  `;

  return rowToLeaderboard(rows[0]);
}

export async function verifyManager(slug: string, username: string, password: string) {
  const db = requireDb();
  const rows = await db`
    select * from leaderboards
    where slug = ${slug} and manager_username = ${username}
    limit 1
  `;
  if (!rows[0]) return null;
  const ok = await bcrypt.compare(password, String(rows[0].manager_password_hash));
  return ok ? rowToLeaderboard(rows[0]) : null;
}

export async function verifyManagerByUsername(username: string, password: string) {
  const db = requireDb();
  const rows = await db`
    select * from leaderboards
    where manager_username = ${username}
    limit 1
  `;
  if (!rows[0]) return null;
  const ok = await bcrypt.compare(password, String(rows[0].manager_password_hash));
  return ok ? rowToLeaderboard(rows[0]) : null;
}

export async function updateManagerPassword(slug: string, oldPassword: string, newPassword: string) {
  const db = requireDb();
  const rows = await db`select * from leaderboards where slug = ${slug} limit 1`;
  if (!rows[0]) throw new Error("Leaderboard not found.");

  const ok = await bcrypt.compare(oldPassword, String(rows[0].manager_password_hash));
  if (!ok) throw new Error("Old password is incorrect.");

  const nextHash = await bcrypt.hash(newPassword, 12);
  await db`
    update leaderboards
    set manager_password_hash = ${nextHash}, updated_at = now()
    where slug = ${slug}
  `;
}

export async function upsertEntry(slug: string, input: { id?: string; name: string; value: number; note: string }) {
  const db = requireDb();
  const board = await getLeaderboard(slug);
  if (!board) throw new Error("Leaderboard not found.");

  if (input.id) {
    await db`
      update leaderboard_entries
      set name = ${input.name}, value = ${input.value}, note = ${input.note}, updated_at = now()
      where id = ${input.id} and leaderboard_id = ${board.id}
    `;
    return;
  }

  const count = await db`
    select count(*)::int as count from leaderboard_entries where leaderboard_id = ${board.id}
  `;
  if (Number(count[0].count) >= 100) {
    throw new Error("A leaderboard can have up to 100 entries.");
  }

  await db`
    insert into leaderboard_entries (leaderboard_id, name, value, note)
    values (${board.id}, ${input.name}, ${input.value}, ${input.note})
  `;
}

export async function adjustEntry(slug: string, id: string, delta: number) {
  const db = requireDb();
  const board = await getLeaderboard(slug);
  if (!board) throw new Error("Leaderboard not found.");
  await db`
    update leaderboard_entries
    set value = value + ${delta}, updated_at = now()
    where id = ${id} and leaderboard_id = ${board.id}
  `;
}

export async function deleteEntry(slug: string, id: string) {
  const db = requireDb();
  const board = await getLeaderboard(slug);
  if (!board) throw new Error("Leaderboard not found.");
  await db`delete from leaderboard_entries where id = ${id} and leaderboard_id = ${board.id}`;
}

export async function updateLeaderboardSettings(
  slug: string,
  input: {
    name: string;
    measurement: string;
    maxValue: number | null;
    description: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    headerImageUrl: string;
    headerImageFit: "cover" | "contain";
    compactView: boolean;
    gradientBackground: boolean;
  }
) {
  const db = requireDb();
  await db`
    update leaderboards
    set name = ${input.name},
        measurement = ${input.measurement},
        max_value = ${input.maxValue},
        description = ${input.description},
        primary_color = ${input.primaryColor},
        accent_color = ${input.accentColor},
        text_color = ${input.textColor},
        header_image_url = ${input.headerImageUrl},
        header_image_fit = ${input.headerImageFit},
        compact_view = ${input.compactView},
        gradient_background = ${input.gradientBackground},
        updated_at = now()
    where slug = ${slug}
  `;
}

export async function deleteLeaderboard(slug: string) {
  const db = requireDb();
  await db`delete from leaderboards where slug = ${slug}`;
}
