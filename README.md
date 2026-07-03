# VesperRanks

Live leaderboard site for Vercel + Neon Postgres.

## Environment

```bash
DATABASE_URL="postgres://..."
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$12$..."
SESSION_SECRET="replace-with-a-long-random-string"
```

Generate password hashes with:

```bash
npm run hash-password -- "your-password"
```

## Database

Run the SQL in `db/schema.sql` against Neon before using admin or manager tools.

You can also run the idempotent setup script locally:

```bash
pnpm run db:setup
```

Deploys run the same setup automatically before `next build` through the `prebuild` script. The schema uses `if not exists`, so it creates missing tables without deleting leaderboard data.

## Routes

- `/home` searchable leaderboard homepage
- `/leaderboards` redirects to `/home`
- `/leaderboards/[slug]` public leaderboard view
- `/admin` admin login and leaderboard creation
- `/manage/[slug]` per-leaderboard manager login and editor

Public pages show demo data when `DATABASE_URL` is not configured. Mutating admin/manager features require Neon.
