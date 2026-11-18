import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const RAW_DIR = path.join(DATA, "raw");
const STATE_FILE = path.join(DATA, "collect-state.json");
const PLACES_FILE = path.join(RAW_DIR, "places.jsonl");
const TOKEN = JSON.parse(fs.readFileSync(path.join(process.env.HOME, ".treg/config.json"), "utf8")).token;
const ENDPOINT = "https://treg.to/call/crawl4ai.google.serp.maps";
const CONCURRENCY = Number(process.env.CONCURRENCY || 64);
const LIMIT = Number(process.env.LIMIT || 100);
const TOP_VARIANTS = Number(process.env.TOP_VARIANTS || 600);
const MIN_POP = Number(process.env.MIN_POP || 25000);

fs.mkdirSync(RAW_DIR, { recursive: true });

const cities = JSON.parse(fs.readFileSync(path.join(DATA, "cities.json"), "utf8"))
  .filter((c) => c.population >= MIN_POP);

const topThreshold = cities[Math.min(TOP_VARIANTS, cities.length - 1)]?.population ?? 0;
const jobs = [];
for (const c of cities) {
  const loc = `${c.name}, ${c.state}`;
  jobs.push({ q: "virtual assistant services", location: loc, city: c.name, state: c.state });
  jobs.push({ q: "virtual assistant agency", location: loc, city: c.name, state: c.state });
  jobs.push({ q: "administrative assistant services", location: loc, city: c.name, state: c.state });
  if (c.population >= topThreshold) {
    jobs.push({ q: "virtual assistant company", location: loc, city: c.name, state: c.state });
    jobs.push({ q: "executive assistant services", location: loc, city: c.name, state: c.state });
  }
}

let state = { done: [] };
if (fs.existsSync(STATE_FILE)) state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
const done = new Set(state.done);
const pending = jobs.filter((j) => !done.has(`${j.q}|${j.location}`));
console.log(`jobs total=${jobs.length} pending=${pending.length} concurrency=${CONCURRENCY}`);

const out = fs.createWriteStream(PLACES_FILE, { flags: "a" });
let idx = 0, inserted = 0, failed = 0;

async function callOnce(job, attempt = 0) {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "X-Treg-Token": TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify({ query: job.q, location: job.location, limit: LIMIT }),
      signal: AbortSignal.timeout(120000),
    });
    if (res.status === 429 || res.status >= 500) throw new Error(`http ${res.status}`);
    const json = await res.json();
    const rows = json?.body?.rows || json?.rows || [];
    if (!Array.isArray(rows)) throw new Error("bad response");
    out.write(JSON.stringify({ job, rows }) + "\n");
    inserted += rows.length;
    done.add(`${job.q}|${job.location}`);
    return true;
  } catch (err) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt)));
      return callOnce(job, attempt + 1);
    }
    failed++;
    console.error(`FAIL ${job.q} @ ${job.location}: ${err.message}`);
    return false;
  }
}

function saveState() { fs.writeFileSync(STATE_FILE, JSON.stringify({ done: [...done] })); }

const started = Date.now();
async function worker() {
  while (idx < pending.length) {
    const job = pending[idx++];
    const ok = await callOnce(job);
    if (ok && done.size % 50 === 0) {
      const mins = ((Date.now() - started) / 60000).toFixed(1);
      console.log(`[${mins}m] ${done.size - (jobs.length - pending.length)}/${pending.length} this run, ${inserted} rows, ${failed} failed`);
      saveState();
    }
  }
}

process.on("SIGINT", () => { saveState(); out.end(); console.log(`\nstopped: ${done.size}/${jobs.length}`); process.exit(0); });
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
saveState(); out.end();
console.log(`DONE ${done.size}/${jobs.length} queries, ${inserted} rows this run, ${failed} failed`);
