import { FIRM_TYPES, getIndex } from "@/lib/data";
import { BASE_URL, SITE_LASTMOD } from "@/lib/sitemap";

export async function GET() {
  const { states } = getIndex();
  const urls = [
    `${BASE_URL}/`, `${BASE_URL}/directory`, `${BASE_URL}/top-rated`, `${BASE_URL}/about`, `${BASE_URL}/privacy`, `${BASE_URL}/terms`, `${BASE_URL}/site-map`,
    ...FIRM_TYPES.map((t) => `${BASE_URL}/type/${t}`),
    ...states.map((s) => `${BASE_URL}/state/${s.code.toLowerCase()}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${SITE_LASTMOD}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
