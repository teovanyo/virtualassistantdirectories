import fs from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "data");
const firms = JSON.parse(fs.readFileSync(path.join(DATA, "firms-unverified.json"), "utf8"));
const recs = new Map();
for (const line of fs.readFileSync(path.join(DATA, "verify.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  try { const r = JSON.parse(line); recs.set(r.slug, r); } catch {}
}

const CLOSED = /^\s*closed\b|permanently closed/i;
const EXPLICIT = /virtual assistant|virtual staff|virtual professional|remote assistant|virtual team|va services|virtual business support|virtual office assistant/i;
const NONPROVIDER = /\b(network|institute|association|academy|foundation|directory|marketplace|software|platform|app)\b/i;
const SERVICE_WORD = /agency|agencies|services?|staffing|consult|placement|outsourc|assistant|support|solutions/i;
const HARD_CAT = /personal concierge|delivery service|event management|non-?profit|software company|media company|education center|training center|college|university|publisher|e-learning|online course|school|government office|library|military recruiting|nursing agency|home health|hospital|medical center|veterans|clinic/i;
const GENERAL_STAFFING = /robert half|randstad|adecco|manpower|kelly services|elwood staffing|surge staffing|labormax|onin staffing|opti staffing|personnel staffing|employpro|enterprise staffing|firstfour staffing|express employment|spherion|aerotek|teksystems|insight global|kforce|aspen technical|volunteer|army|air force|navy|marines/i;

const kept = [];
const drop = { noRecord: 0, notVerified: 0, closed: 0, nonprovider: 0, generalStaffing: 0, hardCategory: 0 };
for (const f of firms) {
  const r = recs.get(f.slug);
  if (!r) { drop.noRecord++; continue; }
  const strong = r.strong || r.secondStrong;
  const explicit = EXPLICIT.test(f.name);
  const verified = explicit || strong;
  if (!verified) { drop.notVerified++; continue; }
  if (CLOSED.test(f.name)) { drop.closed++; continue; }
  if (GENERAL_STAFFING.test(f.name) && !strong) { drop.generalStaffing++; continue; }
  const cats = f.categories.join(" ");
  if (HARD_CAT.test(cats)) {
    const providerName = SERVICE_WORD.test(f.name) && !NONPROVIDER.test(f.name);
    if (!(strong && providerName)) { drop.hardCategory++; continue; }
  }
  if (NONPROVIDER.test(f.name) && !SERVICE_WORD.test(f.name)) { drop.nonprovider++; continue; }
  kept.push(f);
}
fs.writeFileSync(path.join(DATA, "firms.json"), JSON.stringify(kept));
console.log(`kept=${kept.length} of ${firms.length}`, drop);
console.log(`explicit=${kept.filter((f) => EXPLICIT.test(f.name)).length}`);
