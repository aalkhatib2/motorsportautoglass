const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
const slugs = ["tampa", "st-petersburg", "clearwater", "brandon", "wesley-chapel"];

slugs.forEach((slug) => {
  const dir = path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), template, "utf8");
  console.log("Wrote " + slug + "/index.html");
});
