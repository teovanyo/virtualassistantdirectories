import { getIndex } from "@/lib/data";
import { BASE_URL, SITE_LASTMOD, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap";

type Props = { params: Promise<{ page: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { page: pageParam } = await params;
  const page = Math.max(1, Number(pageParam) || 1);
  const { firms } = getIndex();
  const totalPages = Math.max(1, Math.ceil(firms.length / SITEMAP_CHUNK_SIZE));
  if (page > totalPages) return new Response("Sitemap page not found", { status: 404 });
  const slice = firms.slice((page - 1) * SITEMAP_CHUNK_SIZE, page * SITEMAP_CHUNK_SIZE);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${slice.map((f) => `  <url><loc>${BASE_URL}/provider/${f.slug}</loc><lastmod>${SITE_LASTMOD}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
}
