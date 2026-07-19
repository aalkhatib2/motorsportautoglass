const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
// Every city page is a verbatim copy of index.html; js/city-page.js localizes it
// at runtime from the URL slug. Keep this list in sync with window.CITY_PAGES
// (js/cities.js) — both Florida and Arizona metros.
const slugs = [
  // Florida
  "tampa", "st-petersburg", "clearwater", "brandon", "wesley-chapel",
  // Arizona
  "phoenix", "scottsdale", "mesa", "tempe", "chandler",
];

slugs.forEach((slug) => {
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), template, "utf8");
  console.log("Wrote " + slug + "/index.html");
});
