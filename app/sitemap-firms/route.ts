import { getIndex } from "@/lib/data";
import { BASE_URL, SITE_LASTMOD, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap";

export async function GET(request: Request) {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get("page")) || 1);
  const { firms } = getIndex();
  const slice = firms.slice((page - 1) * SITEMAP_CHUNK_SIZE, page * SITEMAP_CHUNK_SIZE);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${slice.map((f) => `  <url><loc>${BASE_URL}/provider/${f.slug}</loc><lastmod>${SITE_LASTMOD}</lastmod></url>`).join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
