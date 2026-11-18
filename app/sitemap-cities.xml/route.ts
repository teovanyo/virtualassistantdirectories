import { getIndex } from "@/lib/data";
import { BASE_URL, SITE_LASTMOD } from "@/lib/sitemap";

export async function GET() {
  const { citiesByState } = getIndex();
  const rows: string[] = [];
  for (const [code, cities] of citiesByState) for (const c of cities) rows.push(`  <url><loc>${BASE_URL}/state/${code.toLowerCase()}/${c.slug}</loc><lastmod>${SITE_LASTMOD}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>`, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
