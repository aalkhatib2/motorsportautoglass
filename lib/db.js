/**
 * Postgres access for bookings.
 *
 * Provider-agnostic: anything that speaks Postgres works (Neon, Supabase, RDS,
 * a self-hosted box). Point DATABASE_URL (or POSTGRES_URL, which the Vercel
 * Marketplace integrations set) at it. The table is created on first use, so
 * there is no manual migration step — `npm run db:migrate` runs the same SQL
 * if you'd rather apply it explicitly.
 *
 * Lives outside /api so Vercel doesn't expose it as a route.
 */

const { Pool, types } = require("pg");

// Return DATE columns as plain "YYYY-MM-DD" strings. The default parser builds a
// JS Date at local midnight, which shifts the day when the server isn't in the
// customer's timezone.
types.setTypeParser(1082, (value) => value);

// Kept as app-level validation (not a DB CHECK) so the agentic OS can add its
// own pipeline stages later without a schema migration.
const STATUSES = ["new", "contacted", "scheduled", "completed", "cancelled"];

const SCHEMA_SQL = `
BEGIN;
SELECT pg_advisory_xact_lock(727001);
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  status           TEXT NOT NULL DEFAULT 'new',
  source           TEXT NOT NULL DEFAULT 'website',
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  address          TEXT NOT NULL,
  suite            TEXT,
  city             TEXT NOT NULL,
  state            TEXT NOT NULL,
  zip              TEXT NOT NULL,
  vehicle_year     TEXT NOT NULL,
  vehicle_make     TEXT NOT NULL,
  vehicle_model    TEXT NOT NULL,
  vehicle_style    TEXT,
  service          TEXT NOT NULL,
  coverage         TEXT,
  policy_number    TEXT,
  appointment      TEXT NOT NULL,
  appointment_date DATE,
  appointment_time TEXT,
  sms_status       TEXT,
  sms_error        TEXT,
  notes            TEXT
);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
COMMIT;
`;

let pool = null;
let schemaReady = null;

function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function isConfigured() {
  return Boolean(connectionString());
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: connectionString(),
      // One connection per warm function instance; the provider's pooler fans
      // many instances into few real connections.
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    });
    // An idle client dropping must not crash the function process.
    pool.on("error", (err) => console.error("db: idle client error:", errorText(err)));
  }
  return pool;
}

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(SCHEMA_SQL)
      .catch((err) => {
        schemaReady = null; // let the next request retry
        throw err;
      });
  }
  return schemaReady;
}

// Node wraps refused connections in an AggregateError whose own message is empty
// (it tries IPv4 and IPv6), which makes for useless log lines. Never includes
// the connection string.
function errorText(err) {
  if (!err) return "unknown error";
  const inner = Array.isArray(err.errors) && err.errors[0];
  return err.message || (inner && (inner.message || inner.code)) || err.code || String(err);
}

const orNull = (value) => (value === "" || value == null ? null : value);

async function saveBooking(lead) {
  await ensureSchema();
  const { rows } = await getPool().query(
    `INSERT INTO bookings (
       name, phone, email, address, suite, city, state, zip,
       vehicle_year, vehicle_make, vehicle_model, vehicle_style,
       service, coverage, policy_number,
       appointment, appointment_date, appointment_time
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     RETURNING id`,
    [
      lead.name,
      lead.phone,
      orNull(lead.email),
      lead.address,
      orNull(lead.suite),
      lead.city,
      lead.state,
      lead.zip,
      lead.vehicleYear,
      lead.vehicleMake,
      lead.vehicleModel,
      orNull(lead.vehicleStyle),
      lead.service,
      orNull(lead.coverage),
      orNull(lead.policyNumber),
      lead.appointment,
      orNull(lead.appointmentDate),
      orNull(lead.appointmentTime),
    ]
  );
  return rows[0].id;
}

async function recordSmsResult(id, status, error) {
  await getPool().query(
    "UPDATE bookings SET sms_status = $2, sms_error = $3 WHERE id = $1",
    [id, status, error ? String(error).slice(0, 300) : null]
  );
}

function toApi(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    source: row.source,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    suite: row.suite,
    city: row.city,
    state: row.state,
    zip: row.zip,
    vehicleYear: row.vehicle_year,
    vehicleMake: row.vehicle_make,
    vehicleModel: row.vehicle_model,
    vehicleStyle: row.vehicle_style,
    service: row.service,
    coverage: row.coverage,
    policyNumber: row.policy_number,
    appointment: row.appointment,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    smsStatus: row.sms_status,
    smsError: row.sms_error,
    notes: row.notes,
  };
}

// Escape LIKE wildcards so a search for "50%" matches literally.
const escapeLike = (value) => value.replace(/[\\%_]/g, "\\$&");

async function listBookings({ status, q, limit } = {}) {
  await ensureSchema();

  const where = [];
  const params = [];

  if (status && STATUSES.includes(status)) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  const term = (q || "").trim().slice(0, 100);
  if (term) {
    params.push(`%${escapeLike(term)}%`);
    const like = `$${params.length}`;
    const clauses = [
      "name", "phone", "email", "city", "zip", "service", "address",
      "vehicle_make", "vehicle_model", "vehicle_year", "coverage", "policy_number",
    ].map((col) => `${col} ILIKE ${like}`);

    // Phones are stored as typed, e.g. "(813) 555-0142"; let "8135550142" match.
    const digits = term.replace(/\D/g, "");
    if (digits.length >= 4) {
      params.push(`%${digits}%`);
      clauses.push(`regexp_replace(phone, '\\D', '', 'g') LIKE $${params.length}`);
    }
    where.push(`(${clauses.join(" OR ")})`);
  }

  const capped = Math.min(Math.max(parseInt(limit, 10) || 200, 1), 500);
  params.push(capped);

  const [list, counts] = await Promise.all([
    getPool().query(
      `SELECT * FROM bookings
       ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY created_at DESC
       LIMIT $${params.length}`,
      params
    ),
    getPool().query("SELECT status, count(*)::int AS n FROM bookings GROUP BY status"),
  ]);

  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  let total = 0;
  for (const row of counts.rows) {
    byStatus[row.status] = row.n;
    total += row.n;
  }
  byStatus.total = total;

  return { bookings: list.rows.map(toApi), counts: byStatus };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Returns the updated booking, or null if the id doesn't exist.
async function updateBooking(id, { status, notes }) {
  await ensureSchema();

  const sets = [];
  const params = [id];
  if (status !== undefined) {
    params.push(status);
    sets.push(`status = $${params.length}`);
  }
  if (notes !== undefined) {
    params.push(notes === "" ? null : notes);
    sets.push(`notes = $${params.length}`);
  }
  sets.push("updated_at = now()");

  const { rows } = await getPool().query(
    `UPDATE bookings SET ${sets.join(", ")} WHERE id = $1 RETURNING *`,
    params
  );
  return rows[0] ? toApi(rows[0]) : null;
}

async function close() {
  if (pool) await pool.end();
  pool = null;
  schemaReady = null;
}

module.exports = {
  STATUSES,
  SCHEMA_SQL,
  UUID_RE,
  errorText,
  isConfigured,
  ensureSchema,
  saveBooking,
  recordSmsResult,
  listBookings,
  updateBooking,
  close,
};
