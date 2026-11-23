import { getIndex } from "@/lib/data";
import { BASE_URL, SITE_LASTMOD, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap";

export async function GET() {
  const { firms } = getIndex();
  const chunks = Math.max(1, Math.ceil(firms.length / SITEMAP_CHUNK_SIZE));
  const urls = [
    { loc: `${BASE_URL}/sitemap-states.xml`, lastmod: SITE_LASTMOD },
    { loc: `${BASE_URL}/sitemap-cities.xml`, lastmod: SITE_LASTMOD },
    { loc: `${BASE_URL}/sitemap-companies.xml`, lastmod: SITE_LASTMOD },
    ...Array.from({ length: chunks }, (_, i) => ({ loc: `${BASE_URL}/sitemap-firms/${i + 1}`, lastmod: SITE_LASTMOD })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <sitemap><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>`;
  return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
