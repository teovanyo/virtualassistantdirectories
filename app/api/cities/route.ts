import { suggestCities } from "@/lib/data";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") || "";
  const cities = suggestCities(q, 8).map((c) => ({ city: c.city, slug: c.slug, state: c.state, stateName: c.stateName, count: c.count }));
  return Response.json(cities, { headers: { "Cache-Control": "public, max-age=300, s-maxage=86400" } });
}
