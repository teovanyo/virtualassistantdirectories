import fs from "node:fs";
import path from "node:path";

export const BASE_URL = "https://virtualassistantdirectories.com";

function latestDataMtime() {
  let latest = 0;
  for (const file of ["firms.json", "states.json"]) {
    try {
      const stat = fs.statSync(path.join(process.cwd(), "data", file));
      if (stat.mtimeMs > latest) latest = stat.mtimeMs;
    } catch {}
  }
  return latest;
}

export const SITE_LASTMOD = new Date(latestDataMtime() || Date.now()).toISOString();
export const SITEMAP_CHUNK_SIZE = 10000;
