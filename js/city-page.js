(function () {
  "use strict";

  function isRootPath() {
    var path = window.location.pathname.replace(/\/$/, "");
    return path === "" || path === "/index.html";
  }

  function detectCitySlug() {
    var params = new URLSearchParams(window.location.search);
    var forced = params.get("city");
    if (forced && window.CITY_PAGES[forced]) return forced;

    var parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    var last = parts[parts.length - 1];
    if (last === "index.html") last = parts[parts.length - 2];
    if (last && window.CITY_PAGES[last]) return last;

    var stored = sessionStorage.getItem("mag_city");
    if (stored && window.CITY_PAGES[stored]) return stored;

    return window.CITY_DEFAULT || "tampa";
  }

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el && text != null) el.textContent = text;
  }

  function setHTML(sel, html) {
    var el = document.querySelector(sel);
    if (el && html != null) el.innerHTML = html;
  }

  // Distinct city skyline photos, derived from CITY_PAGES so the pool stays in
  // sync automatically if an image is added or changed. Brandon/Wesley Chapel
  // reuse Tampa's photo, so those collapse to one entry.
  function randomHomeSkyline() {
    var seen = {};
    var pool = [];
    (window.CITY_SLUGS || []).forEach(function (slug) {
      var c = window.CITY_PAGES[slug];
      if (c && c.heroImage && !seen[c.heroImage]) {
        seen[c.heroImage] = 1;
        pool.push(c.heroImage);
      }
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function applyCityPage() {
    // The bare homepage ("/") renders neutral dual-state content instead of
    // being forced to a single city. An explicit ?city= override still wins.
    var params = new URLSearchParams(window.location.search);
    var forced = params.get("city");
    var forcedValid = forced && window.CITY_PAGES[forced];
    var isHome = isRootPath() && !forcedValid;

    var slug = null;
    var cfg;
    if (isHome) {
      cfg = window.HOME_CONTENT;
    } else {
      slug = detectCitySlug();
      cfg = window.CITY_PAGES[slug];
    }
    if (!cfg) return;

    if (isHome) {
      document.documentElement.dataset.city = "home";
    } else {
      sessionStorage.setItem("mag_city", slug);
      document.documentElement.dataset.city = slug;
    }

    document.title = cfg.metaTitle;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", cfg.metaDescription);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", cfg.metaTitle);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", cfg.metaDescription);
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", cfg.metaTitle);
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", cfg.metaDescription);

    // Canonical + og:url: each city self-canonicalizes to its own path so the
    // near-duplicate city pages don't compete as duplicate content.
    var ORIGIN = "https://motorsportautoglass.com";
    var canonicalPath = isHome ? "/" : "/" + slug + "/";
    var canonical = document.getElementById("canonicalLink");
    if (canonical) canonical.setAttribute("href", ORIGIN + canonicalPath);
    var ogUrl = document.getElementById("ogUrl");
    if (ogUrl) ogUrl.setAttribute("content", ORIGIN + canonicalPath);

    // JSON-LD: on a city page, localize the description to that city/state.
    // On the homepage we leave the static generic dual-state schema in place.
    var ld = document.getElementById("cityLdJson");
    if (ld && !isHome) {
      try {
        var data = JSON.parse(ld.textContent);
        data.description =
          "Mobile windshield replacement and auto glass repair serving " +
          cfg.name +
          ", " +
          cfg.state +
          " and the surrounding " +
          cfg.region +
          " area.";
        ld.textContent = JSON.stringify(data);
      } catch (e) {}
    }

    setText("[data-city='status']", cfg.statusLabel);
    setHTML("[data-city='headline']",
      cfg.headlineBefore + ' <span class="accent">' + cfg.headlineAccent + "</span> " + cfg.headlineAfter);
    setHTML("[data-city='subhead']", cfg.subhead);
    setText("[data-city='services-lead']", cfg.servicesLead);
    setText("[data-city='why-title']", cfg.whyTitle);
    setText("[data-city='trust-title']", cfg.trustTitle);
    setText("[data-city='reviews-title']", cfg.reviewsTitle);
    setText("[data-city='area-title']", cfg.areaTitle);
    setText("[data-city='area-lead']", cfg.areaLead);
    var footTag = document.querySelector("[data-city='footer-tag']");
    if (footTag) footTag.innerHTML = cfg.footerTag + " <em>Crystal Clear. Every Time.</em>";
    setText("[data-city='footer-badge']", cfg.footerBadge);

    var skyline = document.getElementById("heroSkyline");
    if (skyline) {
      // On the neutral homepage, cycle through the city photos — one random pick
      // per page load. City pages keep their own fixed skyline for local SEO.
      var heroImage = cfg.heroImage;
      var heroImageAlt = cfg.heroImageAlt;
      if (isHome) {
        var pick = randomHomeSkyline();
        if (pick) {
          heroImage = pick;
          heroImageAlt = "City skyline at night";
        }
      }
      if (heroImage) {
        skyline.style.backgroundImage = 'url("' + heroImage + '")';
        skyline.setAttribute("aria-label", heroImageAlt || (cfg.name ? cfg.name + " skyline" : "City skyline"));
      }
    }

    var grid = document.getElementById("servicesGrid");
    if (grid && cfg.featuredService) {
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".service-card"));
      var order = ["windshield", "back-glass", "adas"];
      var byKey = {};
      cards.forEach(function (card) {
        byKey[card.getAttribute("data-service-key")] = card;
      });
      var sortedKeys = [cfg.featuredService].concat(
        order.filter(function (k) { return k !== cfg.featuredService; })
      );
      sortedKeys.forEach(function (key, i) {
        var card = byKey[key];
        if (!card) return;
        card.setAttribute("data-num", String(i + 1).padStart(2, "0"));
        card.classList.toggle("service-card--featured", i === 0);
        grid.appendChild(card);
      });
    }

    document.querySelectorAll("[data-city-link]").forEach(function (chip) {
      var chipSlug = chip.getAttribute("data-city-link");
      chip.href = "/" + chipSlug + "/";
      chip.classList.toggle("chip--active", chipSlug === slug);
      if (chip.tagName === "A" && chipSlug === slug) {
        chip.setAttribute("aria-current", "location");
      } else {
        chip.removeAttribute("aria-current");
      }
    });

    // Legacy on-page quote form was replaced by the /book/ flow; this stays
    // guarded in case a city field is reintroduced.
    var formCity = document.getElementById("formCity");
    if (formCity && cfg.name) formCity.value = cfg.name;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCityPage);
  } else {
    applyCityPage();
  }
})();
