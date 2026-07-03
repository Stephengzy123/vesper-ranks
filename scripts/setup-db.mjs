import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;

    const contents = readFileSync(path, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;

      const [, key, rawValue] = match;
      if (process.env[key]) continue;

      process.env[key] = rawValue
        .trim()
        .replace(/^"(.*)"$/, "$1")
        .replace(/^'(.*)'$/, "$1");
    }
  }
}

function splitSqlStatements(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  if (process.env.SKIP_DB_SETUP === "1") {
    console.log("SKIP_DB_SETUP=1; skipping database setup.");
    return;
  }

  loadLocalEnv();

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.log("No DATABASE_URL found; skipping database setup.");
    return;
  }

  const schemaPath = resolve(process.cwd(), "db/schema.sql");
  const schema = readFileSync(schemaPath, "utf8");
  const statements = splitSqlStatements(schema);
  const sql = neon(databaseUrl);

  for (const statement of statements) {
    await sql(statement);
  }

  console.log(`Database setup complete. Ran ${statements.length} schema statements.`);
}

main().catch((error) => {
  console.error("Database setup failed.");
  console.error(error);
  process.exit(1);
});
