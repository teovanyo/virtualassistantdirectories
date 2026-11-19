import type { Metadata } from "next";
import { getIndex } from "@/lib/data";
import { Breadcrumbs } from "@/components/Nav";
import { AdInline } from "@/components/Ads";

const BASE = "https://virtualassistantdirectories.com";
export const metadata: Metadata = {
  title: { absolute: "About This Virtual Assistant Directory" },
  description: "How VirtualAssistantDirectories.com is built, where listing data comes from, how editorial profiles and ratings work, and how providers can claim or correct a listing.",
  alternates: { canonical: `${BASE}/about` },
};

export default function AboutPage() {
  const { firms, states, topCities } = getIndex();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">About</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">A directory built for buyers, with sponsors kept separate</h1>
      <div className="mt-7 space-y-5 text-[15px] leading-7 text-ink/80">
        <p>VirtualAssistantDirectories.com is a free directory of virtual assistant companies in the United States. It currently lists <strong>{firms.length.toLocaleString()}</strong> providers in <strong>{topCities.length.toLocaleString()}</strong> cities and towns across <strong>{states.length}</strong> states and Washington, D.C.</p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">Where the data comes from</h2>
        <p>Listings come from public business profiles. Each record can include the business name, address, phone number, website, categories and the public rating and review count at the time of collection. We do not sell contact data, and providers do not pay to appear in search results or city listings. The top-rated page includes one clearly labeled sponsored featured partner above the independent ranking; that placement does not change the ranking below or any other listing.</p>
        <p>Coverage grows city by city, starting with larger markets and expanding into smaller communities. A listing is a starting point, not a verification that a provider is licensed, insured, accepting clients or still operating at that address.</p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">How editorial profiles work</h2>
        <p>Provider pages include a short brief and a longer editorial profile. Both draw on listing data: categories, city, state, public rating, review volume, the local mix of provider types and nearby cities. The profile explains what the provider appears to specialize in, what the rating does and does not tell you, who it may suit and what to ask before hiring.</p>
        <p>Editorial profiles are not customer reviews, star ratings, endorsements or guarantees. They are written to help you compare providers and ask better questions. Fees, scope, availability and terms change, so confirm them directly with the provider.</p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">Ratings and rankings</h2>
        <p>The star rating and review count shown on a listing come from the underlying public business profile. They are not VirtualAssistantDirectories.com reviews. A high rating from a small number of reviews is a weaker signal than the same rating from thousands, and profiles note when the sample is small.</p>
        <p>Search and city pages default to public review volume so established providers surface first. You can re-sort by rating or name and filter by provider type, website availability and minimum rating. The top-rated page uses a rating and review threshold so a handful of reviews cannot dominate. No provider can pay to move up the independent ranking.</p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">Corrections and claims</h2>
        <p>If you own or manage a provider listed here and something is wrong (a closed location, a new phone number, a changed website or a wrong category), email <a className="font-semibold text-violet underline" href="mailto:hello@virtualassistantdirectories.com">hello@virtualassistantdirectories.com</a> with the provider name, city and correction. Providers can also ask to be removed. We aim to review requests promptly and update the listing where the public record supports the change.</p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">What this site is not</h2>
        <p>This is not a lead-generation form, a paid ranking, a background-check service or a substitute for contract review. We do not verify every license, insurance certificate, security certification, price or service claim. Before hiring a provider, confirm business terms, request proof of insurance or security controls where relevant, read the agreement and ask for references.</p>
        <p>Sponsored placements from service providers are clearly labeled and kept separate from directory listings and search rankings.</p>

        <div className="rounded-2xl border border-line bg-card p-5 text-sm leading-6 text-muted">
          <p className="font-bold text-ink">Quick facts</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{firms.length.toLocaleString()} virtual assistant providers listed</li>
            <li>{topCities.length.toLocaleString()} cities and towns represented</li>
            <li>{states.length} states plus Washington, D.C.</li>
            <li>Free to browse; no signup required to see contact details</li>
            <li>Directory rankings are independent; sponsored placements are clearly labeled</li>
          </ul>
        </div>

        <div className="pt-2"><AdInline placement="about-inline" /></div>
      </div>
    </div>
  );
}
