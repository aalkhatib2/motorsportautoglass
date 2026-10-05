/**
 * GET   /api/bookings?status=&q=&limit=   list bookings + counts by status
 * PATCH /api/bookings                     { id, status?, notes? }
 *
 * Password-protected with a bearer token: `Authorization: Bearer <ADMIN_PASSWORD>`.
 * This is the single read/write surface over the bookings table — the /admin/
 * page uses it, and so can the agentic OS later (send the same bearer token, or
 * read the database directly).
 *
 * Env vars: ADMIN_PASSWORD (12+ chars), DATABASE_URL (or POSTGRES_URL).
 */

const crypto = require("crypto");
const db = require("../lib/db");

const MIN_PASSWORD_LENGTH = 12;
const MAX_NOTES_LEN = 2000;

// Best-effort brute-force throttle. Same caveat as the dedupe cache in
// submit-quote.js: per warm instance only, so it slows guessing rather than
// stopping it — which is why a long ADMIN_PASSWORD is enforced above.
const MAX_FAILURES = 5;
const LOCKOUT_MS = 10 * 60 * 1000;
const failures = new Map(); // ip -> { count, since }

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (typeof fwd === "string" && fwd.split(",")[0].trim()) || req.socket?.remoteAddress || "unknown";
}

function isLockedOut(ip, now) {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (now - entry.since > LOCKOUT_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(ip, now) {
  const entry = failures.get(ip);
  if (!entry || now - entry.since > LOCKOUT_MS) failures.set(ip, { count: 1, since: now });
  else entry.count += 1;
}

// Hash both sides so timingSafeEqual always compares equal-length buffers and
// the comparison time doesn't depend on how much of the password was right.
function passwordMatches(supplied, expected) {
  const a = crypto.createHash("sha256").update(String(supplied)).digest();
  const b = crypto.createHash("sha256").update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  // Customer PII: never cache, never index.
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (req.method !== "GET" && req.method !== "PATCH") {
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const expected = process.env.ADMIN_PASSWORD || "";
  if (expected.length < MIN_PASSWORD_LENGTH) {
    console.error(
      `bookings: ADMIN_PASSWORD is missing or shorter than ${MIN_PASSWORD_LENGTH} characters; ` +
        "the admin API is disabled until it is set in the Vercel dashboard."
    );
    return res.status(503).json({ ok: false, error: "Admin access isn't configured." });
  }

  const now = Date.now();
  const ip = clientIp(req);
  if (isLockedOut(ip, now)) {
    return res.status(429).json({ ok: false, error: "Too many attempts. Try again in a few minutes." });
  }

  const header = req.headers.authorization || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!supplied || !passwordMatches(supplied, expected)) {
    recordFailure(ip, now);
    return res.status(401).json({ ok: false, error: "Wrong password." });
  }
  failures.delete(ip);

  if (!db.isConfigured()) {
    return res.status(503).json({ ok: false, error: "Database isn't configured (DATABASE_URL)." });
  }

  try {
    if (req.method === "GET") {
      const { status, q, limit } = req.query || {};
      const data = await db.listBookings({ status, q, limit });
      return res.status(200).json({ ok: true, ...data });
    }

    // PATCH
    const body = typeof req.body === "object" && req.body !== null ? req.body : {};
    const { id, status, notes } = body;

    if (typeof id !== "string" || !db.UUID_RE.test(id)) {
      return res.status(400).json({ ok: false, error: "A valid booking id is required." });
    }
    if (status === undefined && notes === undefined) {
      return res.status(400).json({ ok: false, error: "Nothing to update." });
    }
    if (status !== undefined && !db.STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, error: `Status must be one of: ${db.STATUSES.join(", ")}.` });
    }
    if (notes !== undefined && (typeof notes !== "string" || notes.length > MAX_NOTES_LEN)) {
      return res.status(400).json({ ok: false, error: `Notes must be text up to ${MAX_NOTES_LEN} characters.` });
    }

    const updated = await db.updateBooking(id, { status, notes });
    if (!updated) return res.status(404).json({ ok: false, error: "Booking not found." });
    return res.status(200).json({ ok: true, booking: updated });
  } catch (err) {
    console.error("bookings: database error:", db.errorText(err));
    return res.status(500).json({ ok: false, error: "Couldn't reach the database." });
  }
};
