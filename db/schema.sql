create extension if not exists pgcrypto;

create table if not exists leaderboards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  measurement text not null default 'Score',
  max_value integer,
  manager_username text not null unique,
  manager_password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  leaderboard_id uuid not null references leaderboards(id) on delete cascade,
  name text not null,
  value integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leaderboard_entries_board_value_idx
  on leaderboard_entries (leaderboard_id, value desc);
