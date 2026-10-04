/* Conversion tracking.
 *
 * Page views come free from Vercel Web Analytics (each city is its own URL).
 * This adds the events that actually indicate a lead, since 99% of this
 * business's value is a phone call or a completed booking:
 *   - phone_click  (nav, footer, and the mobile floating call button)
 *   - booking_cta  (Get a Quote / Schedule Online -> /book/)
 *
 * window.va is the Vercel Analytics queue, stubbed inline before the script
 * loads. If custom events aren't available on the current plan they're simply
 * dropped — nothing here throws, and no other analytics provider is assumed.
 */
(function () {
  "use strict";

  function track(name, data) {
    try {
      if (typeof window.va === "function") {
        window.va("event", data ? { name: name, data: data } : { name: name });
      }
    } catch (e) {
      /* analytics must never break the page */
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";

      if (href.indexOf("tel:") === 0) {
        // Distinguish the mobile floating button from the inline links, since
        // they convert very differently.
        track("phone_click", { source: link.id === "fab" ? "floating_button" : "link" });
        return;
      }

      if (href.indexOf("/book") === 0) {
        track("booking_cta", { source: link.textContent.trim().slice(0, 40) });
      }
    },
    true
  );

  window.magTrack = track; // used by the booking wizard to report completions
})();
