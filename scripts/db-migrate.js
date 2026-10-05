/**
 * Creates the bookings table (idempotent).
 *
 *   DATABASE_URL=postgres://... npm run db:migrate
 *
 * Reads .env if present. You normally don't need this: the API creates the
 * table on first use. Run it when you want to apply the schema explicitly.
 */

try {
  process.loadEnvFile(".env");
} catch {
  // no .env — rely on the real environment
}

const db = require("../lib/db");

if (!db.isConfigured()) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) first.");
  process.exit(1);
}

db.ensureSchema()
  .then(() => console.log("bookings table is ready."))
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => db.close());
