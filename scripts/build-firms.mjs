import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const RAW = path.join(DATA, "raw", "places.jsonl");
const OUT = path.join(DATA, "firms.json");

const VA_NAME =
  /virtual assistant|\bva\b|assistant|administrative (support|service|assistant)|executive (assistant|support)|staffing|recruit|outsourc|offshore|remote (team|staff|assistant|work)|delegation|bpo|business support|back office/i;
const VA_CAT =
  /virtual assistant|administrative (support|service)|executive (assistant|support)|staffing agency|employment agency|recruiter|outsourc|offshore|business to business service|answering service|secretarial|office (support|service)|consultant/i;
const EXCLUDE_CAT =
  /restaurant|hotel|motel|medical clinic|dental clinic|physician|nursing|home care|child care|real estate agency|insurance agency|law firm|attorney|auto repair|car dealer|salon|barber|church|school|bank\b|credit union|travel agency|mortgage broker|loan agency|non-?profit/i;

const byPlace = new Map();
let lines = 0;

const rl = readline.createInterface({ input: fs.createReadStream(RAW), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.trim()) continue;
  lines++;
  let rec;
  try { rec = JSON.parse(line); } catch { continue; }
  const job = rec.job || {};
  for (const row of rec.rows || []) {
    if (!row.place_id || !row.name) continue;
    const cats = [row.category, ...(row.categories || [])].filter(Boolean);
    const catText = cats.join(" | ");
    const strong = VA_NAME.test(row.name) || /virtual assistant|administrative (support|service)|executive (assistant|support)|staffing agency|outsourc|offshore/i.test(catText);
    if (!strong) continue;
    if (EXCLUDE_CAT.test(catText) && !/virtual assistant|assistant|administrative|staffing|outsourc/i.test(row.name)) continue;
    if (!VA_NAME.test(row.name) && !VA_CAT.test(catText)) continue;
    const prev = byPlace.get(row.place_id);
    const score = (row.phone ? 2 : 0) + (row.website ? 2 : 0) + (row.address ? 1 : 0) + (row.review_count || 0) / 1000;
    if (!prev || score > prev._score) byPlace.set(row.place_id, { ...row, _score: score, _job: job });
  }
}

const STATE_ABBR = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX",
  Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA",
  "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};
const STATE_SET = new Set(Object.values(STATE_ABBR));

const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const firms = [];
const slugSeen = new Map();

for (const r of byPlace.values()) {
  let city = null, stateAbbr = null, zip = null;
  if (r.address) {
    const m = r.address.match(/,\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?\s*$/);
    if (m) { city = m[1].trim(); stateAbbr = m[2]; zip = m[3]; }
  }
  if (!city) city = r._job.city || null;
  if (!stateAbbr) stateAbbr = r._job.state || null;
  if (!city || !stateAbbr || !STATE_SET.has(stateAbbr)) continue;

  const base = `${slugify(r.name)}-${slugify(city)}-${stateAbbr.toLowerCase()}`;
  const n = (slugSeen.get(base) || 0) + 1;
  slugSeen.set(base, n);
  const slug = n === 1 ? base : `${base}-${n}`;

  firms.push({
    slug,
    name: r.name.trim(),
    address: r.address || null,
    city,
    citySlug: slugify(city),
    state: stateAbbr,
    zip,
    lat: r.latitude ?? null,
    lon: r.longitude ?? null,
    phone: r.phone || null,
    website: r.website || null,
    rating: r.rating ?? null,
    reviews: r.review_count ?? null,
    categories: [...new Set([r.category, ...(r.categories || [])].filter(Boolean))],
    placeId: r.place_id,
  });
}

firms.sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
const stateName = Object.fromEntries(Object.entries(STATE_ABBR).map(([name, abbr]) => [abbr, name]));
fs.writeFileSync(path.join(DATA, "states.json"), JSON.stringify(stateName));
fs.writeFileSync(OUT, JSON.stringify(firms));

const cities = new Set(firms.map((f) => `${f.state}/${f.city}`));
console.log(`read ${lines} batches, ${byPlace.size} unique places, kept ${firms.length} firms across ${cities.size} cities / ${new Set(firms.map((f) => f.state)).size} states`);
console.log(`no phone & no website: ${firms.filter((f) => !f.phone && !f.website).length}`);
