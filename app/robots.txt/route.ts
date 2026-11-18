export function GET() {
  const body = `User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /api/\n\nSitemap: https://virtualassistantdirectories.com/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
