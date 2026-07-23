(function () {
  "use strict";

  // Geo-routes a root visitor to their nearest served city page. The city set
  // is data-driven from window.CITY_PAGES (js/cities.js), so this now spans BOTH
  // states: a Florida visitor lands on a Tampa-area page, an Arizona visitor on
  // a Phoenix-metro page. Nearest-city math (haversine) picks correctly across
  // both metros with no state-specific branching here. Visitors whose nearest
  // city is the default (Tampa) — or when geolocation is unavailable/declined —
  // stay on "/", which now renders as the neutral dual-state homepage.

  var STORAGE_KEY = "mag_geo_redirected";
  // Cities are ~20-30mi apart within each metro; 60mi comfortably covers both
  // metros plus "surrounding areas" without ever winning against a genuinely
  // out-of-area visitor (nearest real case observed: Miami is 198mi from Brandon).
  var MAX_REDIRECT_MILES = 60;

  function isRootVisit() {
    var path = window.location.pathname.replace(/\/$/, "");
    return path === "" || path === "/index.html";
  }

  function hasExplicitCity() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("city") && window.CITY_PAGES[params.get("city")]) return true;
    if (params.get("noredirect") === "1") return true;
    return !!sessionStorage.getItem("mag_city");
  }

  function haversineMiles(lat1, lng1, lat2, lng2) {
    var toRad = function (d) { return (d * Math.PI) / 180; };
    var R = 3958.8;
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function nearestCity(lat, lng) {
    var best = null;
    var bestDist = Infinity;
    window.CITY_SLUGS.forEach(function (slug) {
      var c = window.CITY_PAGES[slug];
      var d = haversineMiles(lat, lng, c.lat, c.lng);
      if (d < bestDist) {
        bestDist = d;
        best = slug;
      }
    });
    if (best === null || bestDist > MAX_REDIRECT_MILES) return null;
    return best;
  }

  function matchCityByName(name) {
    if (!name) return null;
    var lower = name.toLowerCase();
    for (var i = 0; i < window.CITY_SLUGS.length; i++) {
      var slug = window.CITY_SLUGS[i];
      var city = window.CITY_PAGES[slug];
      for (var j = 0; j < city.geoNames.length; j++) {
        if (lower.indexOf(city.geoNames[j]) !== -1) return slug;
      }
      if (lower.indexOf(city.name.toLowerCase()) !== -1) return slug;
    }
    return null;
  }

  function redirectToCity(slug) {
    sessionStorage.setItem(STORAGE_KEY, "1");
    sessionStorage.setItem("mag_city", slug);
    window.location.replace("/" + slug + "/");
  }

  function tryBrowserGeolocation() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          resolve(nearestCity(pos.coords.latitude, pos.coords.longitude));
        },
        function () { resolve(null); },
        { timeout: 5000, maximumAge: 600000 }
      );
    });
  }

  function tryIpGeolocation() {
    return fetch("https://ipapi.co/json/", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (data) {
        if (!data) return null;
        if (data.latitude != null && data.longitude != null) {
          return nearestCity(data.latitude, data.longitude);
        }
        return matchCityByName(data.city) || matchCityByName(data.region);
      });
  }

  function runRouter() {
    if (!isRootVisit() || hasExplicitCity()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    Promise.resolve()
      .then(tryBrowserGeolocation)
      .then(function (slug) { return slug || tryIpGeolocation(); })
      .then(function (slug) {
        if (slug && slug !== window.CITY_DEFAULT) redirectToCity(slug);
        else sessionStorage.setItem(STORAGE_KEY, "1");
      });
  }

  runRouter();
})();
