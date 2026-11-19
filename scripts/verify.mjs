import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const SRC = path.join(DATA, "firms-unverified.json");
const OUT = path.join(DATA, "firms.json");
const LOG = path.join(DATA, "verify.jsonl");
const TOKEN = JSON.parse(fs.readFileSync(path.join(process.env.HOME, ".treg/config.json"), "utf8")).token;
const ENDPOINT = "https://treg.to/call/crawl4ai.web.scrape";
const CONCURRENCY = Number(process.env.CONCURRENCY || 30);
const LIMIT = Number(process.env.LIMIT || 0);

const EXCLUDE_CAT = /government office|library|university|college|military recruiting|nursing agency|home health|hospice|child care|school|bank\b|credit union|real estate agency|insurance agency|auto repair|restaurant|hotel|church|department of|county government|state government|city government|post office|fire department|police department/i;
const EXPLICIT = /virtual assistant|virtual staff|virtual professional|remote assistant|virtual team|va services|virtual business support|virtual office assistant|\bvas?\b/i;
const STRONG = /virtual assistant|virtual assistants|virtual assistant services|va services|virtual staff|virtual professionals?|remote assistant|dedicated assistant|virtual team/i;
const MEDIUM = /administrative (support|assistant)|executive assistant|outsourced admin|offshore (staff|team)|remote team|back office|delegation|virtual receptionist/i;
const NEGATIVE = /nursing|home health|truck driver|warehouse|janitorial|security guard|healthcare staffing|construction staffing|restaurant staff|welder|machinist|caregiver|housekeeping/i;
const SOCIAL = /linkedin\.com|facebook\.com|instagram\.com|yelp\.com|twitter\.com|x\.com|youtube\.com|tiktok\.com|google\.com|business\.site|wixsite\.com\/.*\/blank/i;

const firms = JSON.parse(fs.readFileSync(SRC, "utf8"));
let candidates = firms.filter((f) => !EXCLUDE_CAT.test(f.categories.join(" ")));
candidates = candidates.filter((f) => f.website ? !SOCIAL.test(f.website) : EXPLICIT.test(f.name));
if (LIMIT) candidates = candidates.slice(0, LIMIT);

const done = new Map();
if (fs.existsSync(LOG)) {
  for (const line of fs.readFileSync(LOG, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try { const r = JSON.parse(line); done.set(r.slug, r); } catch {}
  }
}
const pending = candidates.filter((f) => !done.has(f.slug));
console.log(`candidates=${candidates.length} already=${done.size} pending=${pending.length} concurrency=${CONCURRENCY}`);

const out = fs.createWriteStream(LOG, { flags: "a" });
let idx = 0, calls = 0, ok = 0, strong = 0, failed = 0;
const started = Date.now();

function evaluate(md) {
  const text = String(md || "").replace(/\s+/g, " ").slice(0, 200000);
  const strong = STRONG.test(text);
  const medium = MEDIUM.test(text);
  const negative = NEGATIVE.test(text);
  const hits = [...new Set((text.match(/virtual assistant[s]?|virtual staff|remote assistant|dedicated assistant/gi) || []).map((s) => s.toLowerCase()))];
  return { strong, medium, negative, hits: hits.slice(0, 5) };
}

function pickServiceLink(md, base) {
  const links = [...String(md || "").matchAll(/\[[^\]]*\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g)].map((m) => m[1]);
  const scored = [];
  for (const raw of links) {
    let u;
    try { u = new URL(raw, base).toString(); } catch { continue; }
    if (!/^https?:/i.test(u)) continue;
    const p = u.toLowerCase();
    let s = 0;
    if (/virtual-assistant|virtual_assistant|virtualassistant/.test(p)) s += 5;
    if (/\/services?\b/.test(p)) s += 3;
    if (/\/about\b/.test(p)) s += 2;
    if (/\/solutions?\b|\/staffing\b|\/what-we-do\b/.test(p)) s += 2;
    if (s > 0 && !/\.(pdf|jpg|png|zip)$/i.test(p)) scored.push({ u, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return [...new Set(scored.map((x) => x.u))].slice(0, 2);
}

async function scrape(url, attempt = 0, proxy = "none") {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "X-Treg-Token": TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ url, format: "md", timeout: 25, ...(proxy !== "none" ? { proxy } : {}) }),
      signal: AbortSignal.timeout(45000),
    });
    if (res.status === 429 || res.status >= 500) throw new Error("http " + res.status);
    const j = await res.json();
    calls++;
    return { ok: res.status === 200 && j.ok !== false, markdown: j.markdown || "", status: res.status };
  } catch (e) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1500 * Math.pow(2, attempt)));
      return scrape(url, attempt + 1, proxy);
    }
    failed++;
    return { ok: false, markdown: "", status: 0, error: e.message };
  }
}

async function runOne(f) {
  if (!f.website) {
    const explicit = EXPLICIT.test(f.name);
    const rec = { slug: f.slug, name: f.name, city: f.city, state: f.state, website: null, status: "no-site", ok: false, explicit, strong: false, medium: false, negative: false, hits: [], second: null, secondStrong: false, keep: explicit, snippet: "" };
    out.write(JSON.stringify(rec) + "\n");
    if (explicit) ok++;
    return;
  }
  let primary = await scrape(f.website);
  if (!primary.ok) primary = await scrape(f.website, 0, "isp");
  const ev1 = evaluate(primary.markdown);
  let second = null;
  let ev2 = { strong: false, medium: false, hits: [] };
  if (primary.ok && !ev1.strong) {
    for (const link of pickServiceLink(primary.markdown, f.website)) {
      const p2 = await scrape(link);
      const e2 = evaluate(p2.markdown);
      if (e2.strong || e2.medium) { second = link; ev2 = e2; break; }
      second = second || link;
    }
  }
  const explicit = EXPLICIT.test(f.name);
  const remoteish = /virtual|remote|offshore|dedicated|on-?line assistant/i.test(primary.markdown);
  const keep = explicit || ev1.strong || ev2.strong || ((ev1.medium || ev2.medium) && remoteish && !(ev1.negative || ev2.negative));
  const rec = {
    slug: f.slug, name: f.name, city: f.city, state: f.state, website: f.website,
    status: primary.status, ok: primary.ok, explicit,
    strong: ev1.strong, medium: ev1.medium, negative: ev1.negative, hits: ev1.hits,
    second, secondStrong: ev2.strong, keep,
    snippet: primary.markdown.replace(/\s+/g, " ").slice(0, 260),
  };
  out.write(JSON.stringify(rec) + "\n");
  if (keep) ok++;
  if (ev1.strong || ev2.strong) strong++;
  if (done.size % 100 === 0) {
    const mins = ((Date.now() - started) / 60000).toFixed(1);
    console.log(`[${mins}m] ${done.size}/${candidates.length} kept=${ok} strong=${strong} calls=${calls} failed=${failed}`);
  }
}

async function worker() {
  while (idx < pending.length) {
    const f = pending[idx++];
    done.set(f.slug, true);
    await runOne(f);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
out.end();
console.log(`DONE calls=${calls} kept=${ok} strong=${strong} failed=${failed}`);

// Apply verification to build the final firms.json
const keepSet = new Set();
for (const line of fs.readFileSync(LOG, "utf8").split("\n")) {
  if (!line.trim()) continue;
  try { const r = JSON.parse(line); if (r.keep) keepSet.add(r.slug); } catch {}
}
const final = firms.filter((f) => keepSet.has(f.slug));
fs.writeFileSync(OUT, JSON.stringify(final));
console.log(`wrote ${final.length} verified firms from ${firms.length} (dropped ${firms.length - final.length})`);
