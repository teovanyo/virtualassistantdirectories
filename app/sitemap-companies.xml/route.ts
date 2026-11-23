import { getCompanies } from "@/lib/companies";
import { BASE_URL, SITE_LASTMOD } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET() {
  const companies = getCompanies();
  const locs = [`${BASE_URL}/companies`, ...companies.map((c) => `${BASE_URL}/companies/${c.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs
    .map((loc) => `  <url><loc>${loc}</loc><lastmod>${SITE_LASTMOD}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
    .join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
