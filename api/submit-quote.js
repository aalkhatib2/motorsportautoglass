/**
 * POST /api/submit-quote
 *
 * Receives a completed booking from the /book/ wizard, saves it to Postgres,
 * and texts Zaid the lead. The wizard's confirmation screen is gated on this
 * endpoint returning ok, and ok means the lead reached the business by at
 * least one route: saved to the database, texted, or both. The row is written
 * BEFORE the text is attempted so a Twilio outage never loses a lead, and the
 * outcome of the text is recorded on the row for the admin page to surface.
 *
 * Env vars (set in the Vercel dashboard, never committed):
 *   DATABASE_URL (or POSTGRES_URL)  — Postgres; optional, see lib/db.js
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ZAID_PHONE_NUMBER
 */

const twilio = require("twilio");
const db = require("../lib/db");

// Fields that must be present and non-empty for a lead to be actionable.
// `email` is intentionally optional — the wizard marks it optional too.
const REQUIRED_FIELDS = [
  "name",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "vehicleYear",
  "vehicleMake",
  "vehicleModel",
  "service",
  "appointment",
];

// Caps every inbound string. Without this, a scripted POST could push a
// multi-thousand-character field into the SMS body and burn Twilio segments.
const MAX_FIELD_LEN = 200;

// Best-effort duplicate suppression. Vercel reuses warm instances, so this
// catches the common double-submit / impatient-retry case. It is NOT real rate
// limiting — a cold start or a second instance starts with an empty Map. Add
// Upstash/Redis if genuine abuse shows up.
const DEDUPE_WINDOW_MS = 60 * 1000;
const recentSubmissions = new Map();

function pruneDedupeCache(now) {
  for (const [key, ts] of recentSubmissions) {
    if (now - ts > DEDUPE_WINDOW_MS) recentSubmissions.delete(key);
  }
}

function clean(value) {
  if (value == null) return "";
  return String(value).trim().slice(0, MAX_FIELD_LEN);
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function isPlausiblePhone(value) {
  const digits = digitsOnly(value);
  // US/CA: 10 digits, or 11 when the leading country code is included.
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

// Structured appointment date from the wizard ("2026-10-07"). Optional: an
// absent or malformed value is dropped rather than rejecting the booking,
// because the human-readable `appointment` label is what the business acts on.
function cleanIsoDate(value) {
  const v = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "";
  const d = new Date(v + "T00:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === v ? v : "";
}

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// 5-digit US ZIP (also accepts ZIP+4, which some browsers autofill).
function isPlausibleZip(value) {
  return /^\d{5}(-\d{4})?$/.test(String(value || "").trim());
}

// SMS bodies must stay within the GSM-7 (ASCII) character set. A single
// non-ASCII character (em/en dash, curly quote, middle dot, accented letter)
// forces UCS-2 encoding, which drops the per-segment limit from 160 to 70 and
// can split one lead alert into extra billed texts. The booking wizard supplies
// non-ASCII in the appointment field (en-dash time ranges, a middle-dot
// separator), and a customer's name/address could carry accents, so we fold the
// whole finished body to ASCII rather than trusting the inputs.
function toAscii(value) {
  return String(value == null ? "" : value)
    .normalize("NFKD").replace(/[̀-ͯ]/g, "") // strip combining accent marks (e.g. Jose)
    .replace(/[‐-―]/g, "-")            // hyphen / en dash / em dash -> -
    .replace(/[‘’‚‛]/g, "'") // curly single quotes -> '
    .replace(/[“”„‟]/g, '"') // curly double quotes -> "
    .replace(/…/g, "...")                   // ellipsis -> ...
    .replace(/[·•]/g, "-")             // middle dot / bullet -> -
    .replace(/ /g, " ")                     // non-breaking space -> space
    .replace(/[^\x00-\x7F]/g, "?");              // any remaining non-ASCII -> ?
}

function buildSmsBody(lead) {
  const vehicle = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
    .filter(Boolean)
    .join(" ");

  const lines = [
    "Motorsport Autoglass: New booking",
    "",
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
  ];

  if (lead.email) lines.push(`Email:   ${lead.email}`);

  lines.push(
    `Vehicle: ${vehicle}${lead.vehicleStyle ? ` (${lead.vehicleStyle})` : ""}`,
    `Service: ${lead.service}`,
    `Cover:   ${lead.coverage || "Not specified"}`
  );

  if (lead.policyNumber) lines.push(`Policy:  ${lead.policyNumber}`);

  lines.push(
    `When:    ${lead.appointment}`,
    `Where:   ${lead.address}${lead.suite ? " " + lead.suite : ""}, ${lead.city}, ${lead.state} ${lead.zip}`,
    "",
    "Reply STOP to unsubscribe"
  );

  return toAscii(lines.join("\n"));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  // Vercel parses JSON bodies automatically; guard anyway for form posts / empty bodies.
  const body = typeof req.body === "object" && req.body !== null ? req.body : {};

  // --- Honeypot -----------------------------------------------------------
  // `website` is visually hidden in the wizard, so a human never fills it.
  // We return a normal success shape rather than an error: telling a bot which
  // check it tripped just teaches it to avoid the trap next time. The lead is
  // silently dropped and no SMS is sent.
  if (clean(body.website)) {
    return res.status(200).json({ ok: true });
  }

  // --- Validation ---------------------------------------------------------
  const lead = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    address: clean(body.address),
    suite: clean(body.suite),
    city: clean(body.city),
    state: clean(body.state),
    zip: clean(body.zip),
    vehicleYear: clean(body.vehicleYear),
    vehicleMake: clean(body.vehicleMake),
    vehicleModel: clean(body.vehicleModel),
    vehicleStyle: clean(body.vehicleStyle),
    service: clean(body.service),
    coverage: clean(body.coverage),
    policyNumber: clean(body.policyNumber),
    appointment: clean(body.appointment),
    appointmentDate: cleanIsoDate(body.appointmentDate),
    appointmentTime: clean(body.appointmentTime),
  };

  const missing = REQUIRED_FIELDS.filter((field) => !lead[field]);
  if (missing.length) {
    return res.status(400).json({
      ok: false,
      error: "Some required details are missing.",
      fields: missing,
    });
  }

  if (!isPlausiblePhone(lead.phone)) {
    return res.status(400).json({
      ok: false,
      error: "That phone number doesn't look right. Please check it and try again.",
      fields: ["phone"],
    });
  }

  if (!isPlausibleZip(lead.zip)) {
    return res.status(400).json({
      ok: false,
      error: "That ZIP code doesn't look right. Please check it and try again.",
      fields: ["zip"],
    });
  }

  if (lead.email && !isPlausibleEmail(lead.email)) {
    return res.status(400).json({
      ok: false,
      error: "That email address doesn't look right.",
      fields: ["email"],
    });
  }

  // --- Duplicate suppression ---------------------------------------------
  const now = Date.now();
  pruneDedupeCache(now);
  const dedupeKey = `${digitsOnly(lead.phone)}|${lead.appointment}`;
  if (recentSubmissions.has(dedupeKey)) {
    // Treat as success: the first submission already reached Zaid, and showing
    // the customer an error for our own double-fire would be misleading.
    return res.status(200).json({ ok: true, duplicate: true });
  }

  // --- Config check -------------------------------------------------------
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ZAID_PHONE_NUMBER } =
    process.env;

  const smsConfigured = Boolean(
    TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER && ZAID_PHONE_NUMBER
  );
  const dbConfigured = db.isConfigured();
  const FAILURE_MESSAGE = "Booking couldn't be sent right now. Please call (813) 838-5104.";

  if (!smsConfigured && !dbConfigured) {
    // Log for the Vercel function logs; never echo env values back to the client.
    console.error(
      "submit-quote: no delivery route configured. Set DATABASE_URL and/or the Twilio " +
        "vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ZAID_PHONE_NUMBER) " +
        "in the Vercel dashboard."
    );
    return res.status(500).json({ ok: false, error: FAILURE_MESSAGE });
  }

  // --- Save ---------------------------------------------------------------
  // First, so the lead is durable before anything else can go wrong. A DB
  // failure is logged but isn't fatal on its own — the text can still deliver.
  let bookingId = null;
  if (dbConfigured) {
    try {
      bookingId = await db.saveBooking(lead);
    } catch (err) {
      console.error("submit-quote: database save failed:", db.errorText(err));
    }
  }

  // --- Notify -------------------------------------------------------------
  let smsStatus = "skipped";
  let smsError = null;
  if (smsConfigured) {
    try {
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      await client.messages.create({
        to: ZAID_PHONE_NUMBER,
        from: TWILIO_FROM_NUMBER,
        body: buildSmsBody(lead),
      });
      smsStatus = "sent";
    } catch (err) {
      smsStatus = "failed";
      smsError = err && err.message ? err.message : "unknown error";
      console.error("submit-quote: Twilio send failed:", smsError);
    }
  }

  // Awaited (not fire-and-forget): the function can be frozen the moment the
  // response goes out. Best-effort — the booking itself is already saved.
  if (bookingId) {
    try {
      await db.recordSmsResult(bookingId, smsStatus, smsError);
    } catch (err) {
      console.error("submit-quote: could not record text status:", db.errorText(err));
    }
    if (smsStatus === "failed") {
      console.error(
        `submit-quote: booking ${bookingId} saved but the text failed — it will show a ` +
          "'text failed' badge on the admin page."
      );
    }
  }

  if (bookingId || smsStatus === "sent") {
    recentSubmissions.set(dedupeKey, now);
    return res.status(200).json({ ok: true });
  }

  return res.status(smsStatus === "failed" ? 502 : 500).json({ ok: false, error: FAILURE_MESSAGE });
};
