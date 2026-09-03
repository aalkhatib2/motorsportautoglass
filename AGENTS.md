# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static marketing site** for Motorsport Autoglass plus **one Vercel
serverless function** (`api/submit-quote.js`) that texts new bookings to the
business via Twilio. There is no framework, bundler, lint config, or test suite.

### Services & how to run them

- **Static site** — the documented dev command is `python3 -m http.server 8080`
  (see `.claude/launch.json`). This serves `index.html`, the per-city pages, and
  `/book/`, but it does **not** serve `/api/*`, so the booking wizard's final
  submit will 404 against it.
- **Full site incl. the API** — a human would use `vercel dev` (the project is a
  Vercel deployment). The Vercel CLI is **not** preinstalled and `vercel dev`
  needs Vercel login + project linking, so it does not work headless out of the
  box. To exercise the booking flow end-to-end locally without Vercel, run a
  tiny throwaway Node server that serves the static files and forwards
  `POST /api/submit-quote` to the exported handler in `api/submit-quote.js`
  (Vercel-style `(req, res)` with `req.body` parsed and `res.status().json()`
  shimmed).

### The booking API (`api/submit-quote.js`)

- Exports `module.exports = async function handler(req, res)` in Vercel's Node
  signature. It expects `req.body` already parsed as an object and uses
  `res.status(code).json(obj)`.
- Requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`,
  `ZAID_PHONE_NUMBER` (see `.env.example`). **Without them the handler returns a
  500 config error by design** — this is expected, not a bug. To test the happy
  path without a real Twilio account, stub the `twilio` module (e.g. via the
  `require` cache) so `client.messages.create()` resolves.
- Has an in-memory 60s dedupe keyed on `phone|appointment`: re-submitting the
  same lead within a minute returns `{ ok: true, duplicate: true }` and sends no
  SMS. Change the phone or appointment to force a fresh send while testing.

### City pages

- `npm run build:cities` regenerates each `<slug>/index.html` as a **verbatim
  copy of `index.html`** (`js/city-page.js` localizes it at runtime from the URL
  slug). The city dirs are committed, so running the script normally produces no
  git diff. Keep the slug list in `scripts/build-city-pages.js` in sync with
  `window.CITY_PAGES` in `js/cities.js`.

### Other notes

- The booking wizard fetches vehicle Year/Make/Model from the public NHTSA VPIC
  API (`vpic.nhtsa.dot.gov`), so the vehicle step needs outbound internet.
- Geo-routing (`js/location-router.js`) redirects root visitors to their nearest
  city page and calls `ipapi.co`; append `?noredirect=1` to stay on `/`.
