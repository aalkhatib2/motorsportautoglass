/**
 * Lead notification email via Resend (https://resend.com), over plain HTTPS —
 * no SDK dependency.
 *
 * Env vars (set in the Vercel dashboard, never committed):
 *   RESEND_API_KEY   required to send; without it email is skipped
 *   LEAD_EMAIL_TO    optional, default sales@motorsportautoglass.com
 *                    (comma-separate to notify several addresses)
 *   LEAD_EMAIL_FROM  optional, default "Motorsport Autoglass <leads@motorsportautoglass.com>".
 *                    Its domain must be verified in Resend or every send fails.
 */

const SUBJECT = "Motorsport Autoglass - Web Lead";
const DEFAULT_TO = "sales@motorsportautoglass.com";
const DEFAULT_FROM = "Motorsport Autoglass <leads@motorsportautoglass.com>";
const ADMIN_URL = "https://motorsportautoglass.com/admin/";
const TIMEOUT_MS = 8000;

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

// Every value in the email is customer-supplied.
function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fullAddress(lead) {
  return `${lead.address}${lead.suite ? " " + lead.suite : ""}, ${lead.city}, ${lead.state} ${lead.zip}`;
}

// [label, value] pairs, in the order the business reads them; blanks dropped.
function leadRows(lead) {
  const vehicle =
    [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel].filter(Boolean).join(" ") +
    (lead.vehicleStyle ? ` (${lead.vehicleStyle})` : "");
  return [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Vehicle", vehicle],
    ["Service", lead.service],
    ["Coverage", lead.coverage || "Not specified"],
    ["Policy #", lead.policyNumber],
    ["When", lead.appointment],
    ["Where", fullAddress(lead)],
  ].filter(([, value]) => value);
}

function buildText(lead) {
  const width = 10;
  return [
    "New booking from the website.",
    "",
    ...leadRows(lead).map(([label, value]) => `${(label + ":").padEnd(width)}${value}`),
    "",
    `All bookings: ${ADMIN_URL}`,
  ].join("\n");
}

function buildHtml(lead) {
  const digits = String(lead.phone || "").replace(/\D/g, "");
  const tel = digits.length === 10 ? "+1" + digits : digits;
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress(lead));

  const rows = leadRows(lead)
    .map(([label, value]) => {
      let cell = escapeHtml(value);
      if (label === "Phone") cell = `<a href="tel:${tel}" style="color:#0077B6">${cell}</a>`;
      if (label === "Email") cell = `<a href="mailto:${escapeHtml(value)}" style="color:#0077B6">${cell}</a>`;
      if (label === "Where") cell = `<a href="${escapeHtml(mapsUrl)}" style="color:#0077B6">${cell}</a>`;
      return (
        `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td>` +
        `<td style="padding:6px 0;color:#111">${cell}</td></tr>`
      );
    })
    .join("");

  return (
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;max-width:560px">` +
    `<h2 style="margin:0 0 4px;font-size:18px;color:#111">New web lead</h2>` +
    `<p style="margin:0 0 16px;color:#666">Booked through motorsportautoglass.com</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>` +
    `<p style="margin:20px 0 0"><a href="${ADMIN_URL}" style="color:#0077B6">View all bookings</a></p>` +
    `</div>`
  );
}

async function sendLeadEmail(lead, { bookingId } = {}) {
  const to = (process.env.LEAD_EMAIL_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const headers = {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };
  // Guards against a retried request emailing the same booking twice.
  if (bookingId) headers["Idempotency-Key"] = `booking-${bookingId}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM || DEFAULT_FROM,
      to,
      // Hitting Reply goes straight to the customer when they gave an email.
      reply_to: lead.email || to[0],
      subject: SUBJECT,
      text: buildText(lead),
      html: buildHtml(lead),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    // Resend's error body says what's wrong (e.g. unverified domain); no PII in it.
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
}

module.exports = { SUBJECT, isConfigured, sendLeadEmail, buildText, buildHtml };
