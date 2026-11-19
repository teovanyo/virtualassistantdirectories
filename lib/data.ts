import fs from "node:fs";
import path from "node:path";

export type Firm = {
  slug: string;
  name: string;
  address: string | null;
  city: string;
  citySlug: string;
  state: string;
  zip: string | null;
  lat: number | null;
  lon: number | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
  categories: string[];
  placeId: string;
};

type City = { city: string; slug: string; count: number };

type Index = {
  firms: Firm[];
  bySlug: Map<string, Firm>;
  byState: Map<string, Firm[]>;
  byCity: Map<string, Firm[]>;
  states: { code: string; name: string; count: number; cities: number }[];
  citiesByState: Map<string, City[]>;
  topCities: CityRow[];
  allCities: CityRow[];
};

export type CityRow = {
  city: string;
  slug: string;
  state: string;
  stateName: string;
  count: number;
};

let index: Index | null = null;

const STATE_NAMES: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "states.json"), "utf8")
);

export function stateName(code: string) {
  return STATE_NAMES[code] || code;
}

function build(): Index {
  const firms: Firm[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "firms.json"), "utf8")
  );
  const bySlug = new Map<string, Firm>();
  const byState = new Map<string, Firm[]>();
  const byCity = new Map<string, Firm[]>();
  const cityCounts = new Map<string, Map<string, { city: string; count: number }>>();

  for (const f of firms) {
    bySlug.set(f.slug, f);
    let st = byState.get(f.state);
    if (!st) byState.set(f.state, (st = []));
    st.push(f);

    const cityKey = `${f.state}/${f.citySlug}`;
    let ci = byCity.get(cityKey);
    if (!ci) byCity.set(cityKey, (ci = []));
    ci.push(f);

    let sc = cityCounts.get(f.state);
    if (!sc) cityCounts.set(f.state, (sc = new Map()));
    const prev = sc.get(f.citySlug);
    if (prev) prev.count++;
    else sc.set(f.citySlug, { city: f.city, count: 1 });
  }

  const states = [...byState.entries()]
    .map(([code, list]) => ({
      code,
      name: stateName(code),
      count: list.length,
      cities: cityCounts.get(code)?.size || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const citiesByState = new Map<string, City[]>();
  for (const [code, map] of cityCounts) {
    citiesByState.set(
      code,
      [...map.entries()]
        .map(([slug, v]) => ({ city: v.city, slug, count: v.count }))
        .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    );
  }

  const topCities = [...byCity.entries()]
    .map(([, list]) => ({
      city: list[0].city,
      slug: list[0].citySlug,
      state: list[0].state,
      stateName: stateName(list[0].state),
      count: list.length,
    }))
    .sort((a, b) => b.count - a.count);

  const allCities = [...byCity.entries()].map(([, list]) => ({
    city: list[0].city,
    slug: list[0].citySlug,
    state: list[0].state,
    stateName: stateName(list[0].state),
    count: list.length,
  }));

  return { firms, bySlug, byState, byCity, states, citiesByState, topCities, allCities };
}

export function getIndex(): Index {
  if (!index) index = build();
  return index;
}

export function getFirm(slug: string) {
  return getIndex().bySlug.get(slug) || null;
}

export function getCity(state: string, city: string) {
  const idx = getIndex();
  const key = city.toLowerCase();
  const hit = idx.byCity.get(`${state}/${key}`);
  if (hit) return hit;
  const slug = key
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return idx.byCity.get(`${state}/${slug}`) || [];
}

export function searchFirms(params: {
  q?: string;
  state?: string;
  city?: string;
  page?: number;
  perPage?: number;
  sort?: string;
}) {
  const { firms } = getIndex();
  const q = (params.q || "").trim().toLowerCase();
  const state = (params.state || "").toUpperCase();
  const city = (params.city || "").toLowerCase();
  const page = Math.max(1, params.page || 1);
  const perPage = params.perPage || 20;
  const sort = params.sort;

  let results = firms;
  if (state) results = results.filter((f) => f.state === state);
  if (city) results = results.filter((f) => f.citySlug === city || f.city.toLowerCase() === city);
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    results = results.filter((f) => {
      const hay =
        `${f.name} ${f.city} ${f.state} ${stateName(f.state)} ${f.zip || ""} ${f.address || ""} ${f.categories.join(" ")}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }

  if (sort === "rating") {
    results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
  } else if (sort === "name") {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    results = [...results].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  const total = results.length;
  const start = (page - 1) * perPage;
  return {
    total,
    page,
    perPage,
    pages: Math.ceil(total / perPage),
    firms: results.slice(start, start + perPage),
  };
}

export type FirmType = "agency" | "staffing" | "offshore" | "executive" | "specialist";

export function firmTypes(f: Firm): FirmType[] {
  const text = `${f.name} ${f.categories.join(" ")}`;
  const types: FirmType[] = [];
  if (/real estate|medical|dental|legal|paralegal|bookkeep|social media|marketing|e-?commerce|amazon|insurance|mortgage|title |\bhr\b|recruit|transcription|data entry|customer service|sales|podcast|travel|airbnb|property manage/i.test(text)) types.push("specialist");
  if (/offshore|outsourc|bpo|nearshore|philippines|india|pakistan|global team|shared service/i.test(text)) types.push("offshore");
  if (/staffing|recruit|placement|talent|headhunt|hire /i.test(text)) types.push("staffing");
  if (/executive assistant|executive support|chief of staff|administrative|\bea\b/i.test(text)) types.push("executive");
  if (/virtual assistant|\bva\b|assistant|remote team|remote staff|delegation/i.test(text)) types.push("agency");
  const unique = [...new Set(types)];
  return unique.length ? unique : ["agency"];
}

export const FIRM_TYPE_LABELS: Record<FirmType, string> = {
  agency: "VA agency",
  staffing: "Staffing & placement",
  offshore: "Offshore outsourcing",
  executive: "Executive support",
  specialist: "Specialist VAs",
};

export function filterCityFirms(
  firms: Firm[],
  opts: { type?: string; site?: string; rating?: string; sort?: string }
) {
  let list = firms;
  if (opts.type && opts.type !== "all") list = list.filter((f) => firmTypes(f).includes(opts.type as FirmType));
  if (opts.site === "1") list = list.filter((f) => !!f.website);
  if (opts.rating) {
    const min = Number(opts.rating);
    if (min > 0) list = list.filter((f) => (f.rating || 0) >= min);
  }
  const sorted = [...list];
  switch (opts.sort) {
    case "rating":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0) || a.name.localeCompare(b.name));
  }
  return sorted;
}

export function suggestCities(q: string, limit = 8) {
  const query = q.trim().toLowerCase();
  if (!query) return getIndex().topCities.slice(0, limit);
  const { allCities } = getIndex();
  const scored = allCities
    .map((c) => {
      const name = c.city.toLowerCase();
      const label = `${name}, ${c.state.toLowerCase()}`;
      let score = 0;
      if (name === query || label === query) score = 100;
      else if (name.startsWith(query)) score = 80;
      else if (label.startsWith(query)) score = 70;
      else if (name.includes(query)) score = 40;
      else if (`${name} ${c.stateName.toLowerCase()}`.includes(query)) score = 20;
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.c.count - a.c.count)
    .slice(0, limit);
  return scored.map((x) => x.c);
}

let highlightsCache: {
  typeCounts: Record<string, number>;
  topRated: Firm[];
  avgRating: number;
  ratedCount: number;
  reviewTotal: number;
} | null = null;

export const FIRM_TYPES: FirmType[] = ["agency", "staffing", "offshore", "executive", "specialist"];

let typeIndexCache: Map<FirmType, Firm[]> | null = null;

export function firmsByType(type: FirmType) {
  if (!typeIndexCache) {
    const map = new Map<FirmType, Firm[]>();
    for (const t of FIRM_TYPES) map.set(t, []);
    for (const f of getIndex().firms) {
      for (const t of firmTypes(f)) map.get(t)!.push(f);
    }
    typeIndexCache = map;
  }
  return typeIndexCache.get(type) || [];
}

export function typeStateCounts(type: FirmType) {
  const counts = new Map<string, number>();
  for (const f of firmsByType(type)) counts.set(f.state, (counts.get(f.state) || 0) + 1);
  return [...counts.entries()]
    .map(([state, count]) => ({ state, name: stateName(state), count }))
    .sort((a, b) => b.count - a.count);
}

export function getHighlights() {
  if (highlightsCache) return highlightsCache;
  const { firms } = getIndex();
  const typeCounts: Record<string, number> = {
    agency: 0,
    staffing: 0,
    offshore: 0,
    executive: 0,
    specialist: 0,
  };
  let ratingSum = 0;
  let ratedCount = 0;
  let reviewTotal = 0;
  for (const f of firms) {
    for (const t of firmTypes(f)) typeCounts[t] = (typeCounts[t] || 0) + 1;
    if (f.rating && f.reviews) {
      ratingSum += f.rating;
      ratedCount++;
      reviewTotal += f.reviews;
    }
  }
  const eligible = firms
    .filter(
      (f) =>
        (f.rating || 0) >= 4.6 &&
        (f.reviews || 0) >= 20 &&
        !/restaurant|hotel|medical clinic|dental clinic|physician|home care|child care|law firm|insurance agency|mortgage|loan agency|real estate agency/i.test(f.categories.join(" "))
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));

  const topRated: Firm[] = [];
  const picked = new Set<string>();
  for (const t of FIRM_TYPES) {
    const pick = eligible.find((f) => !picked.has(f.slug) && firmTypes(f).includes(t));
    if (pick) {
      picked.add(pick.slug);
      topRated.push(pick);
    }
  }
  for (const f of eligible) {
    if (topRated.length >= 6) break;
    if (picked.has(f.slug)) continue;
    picked.add(f.slug);
    topRated.push(f);
  }

  highlightsCache = {
    typeCounts,
    topRated,
    avgRating: ratedCount ? ratingSum / ratedCount : 0,
    ratedCount,
    reviewTotal,
  };
  return highlightsCache;
}

export function allFirmSlugs() {
  return getIndex().firms.map((f) => f.slug);
}
