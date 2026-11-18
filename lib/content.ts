import fs from "node:fs";
import path from "node:path";
import { FIRM_TYPE_LABELS, firmTypes, getCity, getIndex, stateName, type Firm, type FirmType } from "@/lib/data";

export type FirmFaq = { q: string; a: string };

export type FirmContent = {
  slug: string;
  name: string;
  city: string;
  state: string;
  brief: string;
  review: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  faqs: FirmFaq[];
  briefWordCount?: number;
  reviewWordCount?: number;
  generatedAt: string;
  model?: string;
  isFallback?: boolean;
};

const CACHE_LIMIT = 800;
const FALLBACK_UPDATED = "2026-11-18T20:00:00.000Z";
const cache = new Map<string, FirmContent | null>();

function readContentFile(firm: Firm): FirmContent | null {
  const file = path.join(process.cwd(), "data", "content", firm.state.toLowerCase(), `${firm.slug}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as FirmContent;
    if (!parsed || !parsed.review || !parsed.brief) return null;
    return normalizeContent(parsed, firm);
  } catch {
    return null;
  }
}

export function getFirmContent(firm: Firm): FirmContent {
  const key = `${firm.state}/${firm.slug}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const fromDisk = readContentFile(firm);
  const value = fromDisk || normalizeContent(buildFallbackContent(firm), firm);
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, value);
  return value;
}

function avg(values: number[]) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function fmt(n: number | null, digits = 1) {
  if (n == null || !Number.isFinite(n)) return null;
  return Number(n.toFixed(digits));
}

function fitText(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(","), cut.lastIndexOf("-"));
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:-]+$/, "");
}

function fitDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.55) return cut.slice(0, sentence + 1);
  const at = cut.lastIndexOf(" ");
  return (at > max * 0.55 ? cut.slice(0, at) : cut).replace(/[\s,;:-]+$/, "") + ".";
}

function stripDashes(text: string) {
  return String(text || "").replace(/[\u2014\u2013]/g, "-").replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
}

function plainWords(value: string) {
  return String(value || "")
    .replace(/\blandscape\b/gi, "market")
    .replace(/\bshowcases?\b/gi, "shows")
    .replace(/\bunderscores?\b/gi, "shows")
    .replace(/\brobust\b/gi, "strong")
    .replace(/\bpivotal\b/gi, "important")
    .replace(/\bcrucial\b/gi, "important")
    .replace(/\bmeticulously\b/gi, "carefully")
    .replace(/\bseamless\b/gi, "smooth")
    .replace(/\bleverage\b/gi, "use")
    .replace(/\butilize\b/gi, "use")
    .replace(/\bAdditionally,\s*/g, "Also, ")
    .replace(/\bFurthermore,\s*/g, "Also, ");
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function trimReview(text: string, max = 700) {
  if (wordCount(text) <= max) return text;
  const parts = text.split(/\n{2,}/);
  while (wordCount(parts.join("\n\n")) > max && parts.length > 1) {
    let changed = false;
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i].trim().startsWith("## ")) continue;
      const sentences = parts[i].match(/[^.!?]+[.!?]+/g);
      if (!sentences || sentences.length < 2) continue;
      parts[i] = sentences.slice(0, -1).join(" ").trim();
      changed = true;
      break;
    }
    if (!changed) break;
  }
  if (wordCount(parts.join("\n\n")) > max) return parts.join("\n\n").split(/\s+/).slice(0, max).join(" ");
  return parts.join("\n\n");
}

function normalizeTitle(title: string, firm: Firm) {
  let out = fitText(String(title || ""), 65);
  if (!out) out = fitText(`${firm.name} - ${firm.city}, ${firm.state}`, 65);
  if (firm.state && !new RegExp(`\\b${firm.state}\\b`, "i").test(out)) {
    const withState = out.replace(firm.city, `${firm.city}, ${firm.state}`);
    out = withState.length <= 65 ? withState : fitText(`${firm.name} - ${firm.city}, ${firm.state}`, 65);
  }
  return fitText(out, 65);
}

function normalizeContent(content: FirmContent, firm: Firm): FirmContent {
  const brief = plainWords(stripDashes(content.brief));
  const review = trimReview(plainWords(stripDashes(content.review)), 700);
  const faqs = (content.faqs || []).map((faq) => ({ q: plainWords(stripDashes(faq.q)), a: plainWords(stripDashes(faq.a)) }));
  return {
    ...content,
    brief,
    review,
    metaTitle: normalizeTitle(stripDashes(content.metaTitle), firm),
    metaDescription: fitDescription(stripDashes(content.metaDescription), 158),
    keywords: (content.keywords || []).map(stripDashes),
    tags: (content.tags || []).map(stripDashes),
    faqs,
    briefWordCount: wordCount(brief),
    reviewWordCount: wordCount(review),
  };
}

function typePhrase(types: FirmType[]) {
  return FIRM_TYPE_LABELS[types[0]]
    .toLowerCase()
    .replace(/\bva\b/g, "VA")
    .replace(/\bbpo\b/g, "BPO");
}

const TYPE_DETAIL: Record<FirmType, { services: string; audience: string }> = {
  agency: {
    services:
      "A virtual assistant agency typically provides a dedicated assistant or a managed pool for inbox and calendar management, scheduling, travel, data entry, CRM updates, research, customer support, order processing and recurring admin. Many agencies handle recruiting, training, backup coverage and replacement, and some add project management or team leads as the engagement grows.",
    audience:
      "It suits founders, executives and small teams that need reliable day-to-day support without hiring locally. It is also common for businesses that want a managed relationship with backup coverage rather than managing an independent contractor directly.",
  },
  staffing: {
    services:
      "Staffing and placement firms recruit, screen and place virtual assistants with client teams. The client usually manages the assistant day to day, while the staffing firm handles sourcing, vetting, contracts, payroll and replacement guarantees. Some firms specialize in executive, administrative, sales or industry-specific roles.",
    audience:
      "It suits companies that know the role they need and want help finding and vetting candidates quickly. It is often a better fit than a managed agency when the client already has processes, tools and a manager in place.",
  },
  offshore: {
    services:
      "Offshore and nearshore outsourcing providers build remote teams in lower-cost markets for admin, customer support, data processing, bookkeeping, marketing and sales support. Engagements can be a single dedicated assistant or a managed team with a team lead, documented processes and shift coverage across time zones.",
    audience:
      "It suits businesses with repeatable work and enough volume to justify a dedicated role. Buyers should confirm English proficiency, overlap hours, equipment, supervision, data security and what happens when an assistant leaves.",
  },
  executive: {
    services:
      "Executive support providers focus on the principal's calendar, inbox, travel, meeting prep, board materials, personal admin and cross-team follow-ups. The best ones operate with discretion and anticipate needs rather than waiting for tasks, and many work across personal and business matters.",
    audience:
      "It suits founders, executives, partners and family offices that need high-trust support and fast response. Expect a more rigorous vetting and onboarding process than a general admin placement, and a higher monthly cost.",
  },
  specialist: {
    services:
      "Specialist virtual assistants bring domain context to a function such as real estate, medical admin, legal, ecommerce, bookkeeping, marketing, recruiting, customer support or sales development. The provider usually combines general assistant work with workflows and tools specific to that industry.",
    audience:
      "It suits businesses that need more than generic admin help and do not want to train a generalist from scratch. Ask for examples in your exact workflow, not just your industry, and confirm who covers the role during absence.",
  },
};

export function buildFallbackContent(firm: Firm): FirmContent {
  const idx = getIndex();
  const cityFirms = getCity(firm.state, firm.citySlug);
  const stateFirms = idx.byState.get(firm.state) || [];
  const types = firmTypes(firm);
  const primary = types[0];
  const detail = TYPE_DETAIL[primary];
  const cityRated = cityFirms.filter((f) => f.rating != null);
  const stateRated = stateFirms.filter((f) => f.rating != null);
  const cityAvg = fmt(avg(cityRated.map((f) => f.rating as number)));
  const stateAvg = fmt(avg(stateRated.map((f) => f.rating as number)));
  const cityTypeCount = cityFirms.filter((f) => firmTypes(f).includes(primary)).length;
  const rank = 1 + cityFirms.filter((f) => (f.reviews || 0) > (firm.reviews || 0)).length;
  const nearby = (idx.citiesByState.get(firm.state) || []).filter((c) => c.city !== firm.city).slice(0, 3).map((c) => c.city);
  const cityFirmWord = cityFirms.length === 1 ? "provider" : "providers";

  const name = firm.name;
  const cityState = `${firm.city}, ${stateName(firm.state)}`;
  const typeLabel = typePhrase(types);
  const ratingLine =
    firm.rating != null && firm.reviews != null
      ? `${name} has a public rating of ${firm.rating.toFixed(1)} out of 5 from ${firm.reviews.toLocaleString()} reviews. ${
          firm.reviews < 25
            ? "That is a small sample, so treat the score as a starting point rather than a definitive measure."
            : "The review volume is large enough to give the rating some weight, though ratings still reflect a mix of client types and engagements."
        }`
      : `${name} does not have a public rating yet. Buyers should ask for references, a sample task list and a written scope before making a decision.`;

  const comparisonLine =
    cityAvg != null
      ? `Across ${cityFirms.length.toLocaleString()} listed ${cityFirmWord} in ${firm.city}, the average rating among rated firms is ${cityAvg.toFixed(1)}. Statewide, the average is ${stateAvg != null ? stateAvg.toFixed(1) : "not available"}. ${rank <= 10 ? `${name} ranks #${rank} in ${firm.city} by public review volume.` : ""}`
      : `${firm.city} has ${cityFirms.length.toLocaleString()} listed ${cityFirmWord}. There is not yet enough rating data to calculate a reliable local average.`;

  const contactBits = [
    firm.address ? `It is at ${firm.address}.` : null,
    firm.phone ? `The phone number is ${firm.phone}.` : null,
    firm.website ? `Its website is ${firm.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}.` : null,
  ].filter(Boolean).join(" ");

  const brief = `${name} is listed as a ${typeLabel} provider in ${cityState}. ${contactBits} ${firm.city} has ${cityFirms.length.toLocaleString()} virtual assistant ${cityFirmWord}, and ${stateName(firm.state)} has ${stateFirms.length.toLocaleString()}. ${ratingLine}

Buyers comparing ${firm.city}-area providers should look beyond the headline rating. Confirm the engagement model, hours and time-zone overlap, tools, training, replacement policy, security controls and total monthly cost before signing. ${detail.audience}`;

  const review = `## Overview
${name} is a ${typeLabel} provider listed in ${cityState}. ${contactBits} The firm appears in ${firm.categories.length ? firm.categories.join(", ") : "virtual assistant service"} categories, which gives buyers an initial sense of where it focuses. ${comparisonLine}

## Services and specialties
${detail.services} ${cityTypeCount > 1 ? `In ${firm.city}, ${cityTypeCount} listed providers also serve the ${FIRM_TYPE_LABELS[primary].toLowerCase()} segment, so buyers have alternatives to compare.` : `Few other listed providers in ${firm.city} focus on the same specialty, so it is worth asking how the firm handles work outside its core offering.`} Ask for a written scope that lists tasks, hours, response times, tools and who covers the role during absence.

## What the public rating suggests
${ratingLine} A rating is most useful when read alongside the number of reviews and how recent the feedback is. Look for patterns around responsiveness, reliability, communication and turnover. A high score from a small sample, or an old score with little recent activity, is less informative than a steady stream of recent reviews.

## Who it may suit
${detail.audience} It may also appeal to buyers who value a local point of contact in ${firm.city}. ${nearby.length ? `Companies with operations in nearby areas such as ${nearby.join(", ")} should confirm coverage, time zone support and any onboarding costs.` : ""}

## Questions to ask before hiring
Ask whether the assistant is dedicated or shared, how many hours are included, which time zones are covered and how backup works during holidays or illness. Confirm the tools the assistant can use, how training is handled, what the replacement or trial policy is, and how quickly a new assistant can start. Ask about NDAs, background checks, device and password policies, data access and what happens at the end of the engagement. Get the total monthly cost in writing, including setup, management, software and any minimum term.

## How it compares locally
${comparisonLine} Buyers should compare at least three providers on the same set of questions. A smaller agency may offer more direct communication, while a larger provider may have deeper recruiting and backup capacity. The right choice depends on the tasks, hours, time-zone needs, budget and how much management you want to keep in house.

## Verdict
${name} is a ${typeLabel} provider serving ${cityState}. ${firm.rating != null ? `Its public rating of ${firm.rating.toFixed(1)} from ${firm.reviews?.toLocaleString() || 0} reviews is a useful starting signal, but it is not a substitute for due diligence.` : `The absence of a public rating makes direct due diligence especially important.`} Validate scope, pricing, security and replacement terms before signing, and compare the firm with other ${firm.city} providers on the same criteria.`;

  const metaTitle = fitText(`${name} - ${firm.city}, ${firm.state}`, 60);
  const metaDescription = fitText(
    `Profile of ${name}, a ${typeLabel} provider in ${cityState}. Compare services, ratings, pricing signals and contact details.`,
    158
  );

  const keywords = [
    `${name} reviews`,
    `${name} virtual assistant`,
    `${firm.city} virtual assistant`,
    `virtual assistant companies ${firm.city} ${firm.state}`,
    `${typeLabel} ${firm.city}`,
    `virtual assistant services near ${firm.city}`,
  ];

  const tags = [
    FIRM_TYPE_LABELS[primary],
    ...(types.length > 1 ? types.slice(1).map((t) => FIRM_TYPE_LABELS[t]) : []),
    `${firm.city} local`,
    "Business owners",
  ];

  const faqs: FirmFaq[] = [
    {
      q: `What services does ${name} offer?`,
      a: `${name} is listed as a ${typeLabel} provider. Buyers should confirm the exact scope directly with the firm, since listing categories do not always capture every role, industry specialism or engagement model.`,
    },
    {
      q: `Where is ${name} located?`,
      a: `${name} is listed in ${cityState}${firm.address ? ` at ${firm.address}` : ""}. ${firm.phone ? `The public phone number is ${firm.phone}.` : "A public phone number is not listed."}`,
    },
    {
      q: `What should I ask ${name} before hiring?`,
      a: "Ask whether the assistant is dedicated, the included hours and time zones, the tools they can use, how training and replacement work, the trial and notice terms, security and NDA policies, and the total monthly cost including setup and management.",
    },
  ];

  return {
    slug: firm.slug,
    name: firm.name,
    city: firm.city,
    state: firm.state,
    brief,
    review,
    metaTitle,
    metaDescription,
    keywords,
    tags,
    faqs,
    briefWordCount: wordCount(brief),
    reviewWordCount: wordCount(review),
    generatedAt: FALLBACK_UPDATED,
    model: "directory-fallback",
    isFallback: true,
  };
}
