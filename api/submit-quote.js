/**
 * POST /api/submit-quote
 *
 * Receives a completed booking from the /book/ wizard and texts Zaid the lead.
 * This is the only path by which a booking actually reaches the business — the
 * wizard's confirmation screen is now gated on this endpoint returning ok.
 *
 * Required env vars (set in the Vercel dashboard, never committed):
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ZAID_PHONE_NUMBER
 */

const twilio = require("twilio");

// Fields that must be present and non-empty for a lead to be actionable.
// `email` is intentionally optional — the wizard marks it optional too.
const REQUIRED_FIELDS = [
  "name",
  "phone",
  "address",
  "city",
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

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function buildSmsBody(lead) {
  const vehicle = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
    .filter(Boolean)
    .join(" ");

  const lines = [
    "NEW BOOKING — Motorsport Autoglass",
    "",
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
  ];

  if (lead.email) lines.push(`Email:   ${lead.email}`);

  lines.push(
    `Vehicle: ${vehicle}${lead.vehicleStyle ? ` (${lead.vehicleStyle})` : ""}`,
    `Service: ${lead.service}`,
    `Cover:   ${lead.coverage || "Not specified"}`,
    `When:    ${lead.appointment}`,
    `Where:   ${lead.address}, ${lead.city}`
  );

  return lines.join("\n");
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
    city: clean(body.city),
    vehicleYear: clean(body.vehicleYear),
    vehicleMake: clean(body.vehicleMake),
    vehicleModel: clean(body.vehicleModel),
    vehicleStyle: clean(body.vehicleStyle),
    service: clean(body.service),
    coverage: clean(body.coverage),
    appointment: clean(body.appointment),
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

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !ZAID_PHONE_NUMBER) {
    // Log for the Vercel function logs; never echo env values back to the client.
    console.error(
      "submit-quote: missing Twilio configuration. Check TWILIO_ACCOUNT_SID, " +
        "TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ZAID_PHONE_NUMBER in the Vercel dashboard."
    );
    return res.status(500).json({
      ok: false,
      error: "Booking couldn't be sent right now. Please call (813) 838-5104.",
    });
  }

  // --- Send ---------------------------------------------------------------
  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    await client.messages.create({
      to: ZAID_PHONE_NUMBER,
      from: TWILIO_FROM_NUMBER,
      body: buildSmsBody(lead),
    });

    recentSubmissions.set(dedupeKey, now);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("submit-quote: Twilio send failed", err);
    return res.status(502).json({
      ok: false,
      error: "Booking couldn't be sent right now. Please call (813) 838-5104.",
    });
  }
};
