import fs from "node:fs";
import path from "node:path";

export type Company = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  niche: string;
  review: string;
  title: string;
};

export const NICHE_ORDER = [
  "executive-support",
  "medical",
  "legal",
  "real-estate",
  "offshore",
  "staffing",
  "finance",
  "general",
] as const;

export const NICHE_LABELS: Record<string, string> = {
  "executive-support": "Executive & administrative support",
  medical: "Medical & healthcare",
  legal: "Legal",
  "real-estate": "Real estate & property",
  offshore: "Offshore & outsourcing",
  staffing: "Staffing & recruiting",
  finance: "Finance & accounting",
  general: "General virtual assistant",
};

let cache: Company[] | null = null;

export function getCompanies(): Company[] {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "companies.json"), "utf8");
  cache = (JSON.parse(raw) as Company[]).filter((c) => c && c.slug && c.name && c.url);
  return cache;
}

export function getCompany(slug: string): Company | null {
  return getCompanies().find((c) => c.slug === slug) || null;
}

export function companiesByNiche(): { niche: string; label: string; companies: Company[] }[] {
  const all = getCompanies();
  return NICHE_ORDER.map((niche) => ({
    niche,
    label: NICHE_LABELS[niche],
    companies: all.filter((c) => c.niche === niche).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.companies.length > 0);
}

export function relatedCompanies(company: Company, limit = 6): Company[] {
  const all = getCompanies();
  const same = all.filter((c) => c.niche === company.niche && c.slug !== company.slug);
  const rest = all.filter((c) => c.niche !== company.niche && c.slug !== company.slug);
  return [...same, ...rest].slice(0, limit);
}
