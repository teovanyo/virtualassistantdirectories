import fs from "node:fs";
import path from "node:path";

const firms = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "firms.json"), "utf8"));
const W = 1000, H = 620;
const lonMin = -125, lonMax = -66, latMin = 24, latMax = 50;
const project = (lat, lon) => {
  const x = ((lon - lonMin) / (lonMax - lonMin)) * (W - 80) + 40;
  const y = (1 - (lat - latMin) / (latMax - latMin)) * (H - 140) + 70;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};
const bins = new Map();
for (const f of firms) {
  if (f.lat == null || f.lon == null) continue;
  if (f.lon < lonMin || f.lon > lonMax || f.lat < latMin || f.lat > latMax) continue;
  const [x, y] = project(f.lat, f.lon);
  const key = `${Math.round(x / 4) * 4},${Math.round(y / 4) * 4}`;
  bins.set(key, (bins.get(key) || 0) + 1);
}
const max = Math.max(...bins.values(), 1);
const dots = [...bins.entries()].map(([k, n]) => {
  const [x, y] = k.split(",").map(Number);
  const r = 0.7 + Math.sqrt(n / max) * 2.2;
  const o = 0.35 + Math.min(0.6, n / max);
  return `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="#c9ff3d" fill-opacity="${o.toFixed(2)}"/>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Map of virtual assistant providers across the United States">
<title>Virtual assistant provider density across the United States</title>
<g>${dots}</g>
</svg>`;
fs.writeFileSync(path.join(process.cwd(), "public", "us-firms-map.svg"), svg);
console.log(`points=${[...bins.values()].reduce((a, b) => a + b, 0)} bins=${bins.size} bytes=${svg.length}`);
