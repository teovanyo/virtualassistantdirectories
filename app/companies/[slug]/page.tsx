import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, Building2, Globe } from "lucide-react";
import { NICHE_LABELS, getCompanies, getCompany, relatedCompanies } from "@/lib/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { Breadcrumbs } from "@/components/Nav";
import { AdInline } from "@/components/Ads";

type Props = { params: Promise<{ slug: string }> };
const BASE = "https://virtualassistantdirectories.com";

export function generateStaticParams() {
  return getCompanies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) return { title: "Company not found" };
  const canonical = `${BASE}/companies/${company.slug}`;
  const title = `${company.name} - Virtual Assistant Company Review`;
  const description = company.review.length > 155 ? `${company.review.slice(0, 152).replace(/\s+\S*$/, "")}...` : company.review;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, siteName: "Virtual Assistant Directories", title, description },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const related = relatedCompanies(company, 6);
  const canonical = `${BASE}/companies/${company.slug}`;
  const label = NICHE_LABELS[company.niche] || "Virtual assistant";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonical,
        url: canonical,
        name: `${company.name} - Virtual Assistant Company`,
        description: company.review,
        isPartOf: { "@type": "WebSite", "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "VA companies", item: `${BASE}/companies` },
          { "@type": "ListItem", position: 3, name: company.name, item: canonical },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${canonical}#organization`,
        name: company.name,
        url: company.url,
        description: company.review,
        foundingLocation: "United States",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "VA companies", href: "/companies" }, { label: company.name }]} />

      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-violet">{label}</p>
            <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">{company.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Globe className="h-4 w-4" aria-hidden />
              <a href={company.url} target="_blank" rel="noopener" className="hover:text-violet">{company.domain}</a>
            </p>
          </div>
          <a
            href={company.url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-violet"
          >
            Visit website <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="font-display text-xl tracking-tight">Editorial review</h2>
          <p className="mt-2 text-[15px] leading-7 text-ink/80">{company.review}</p>
          {company.title ? <p className="mt-3 text-[12px] text-muted">Site title: {company.title}</p> : null}
        </div>

        <div className="mt-6 rounded-xl bg-paper p-4 text-[12.5px] leading-6 text-muted">
          <p className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden />
            <span>
              This listing is an editorial summary of a virtual assistant brand site, not a customer review or an endorsement. Confirm services,
              pricing and terms directly with the company. See the <Link href="/about" className="font-semibold text-violet underline">about page</Link> for how
              listings are built.
            </span>
          </p>
        </div>
      </div>

      <div className="my-8"><AdInline placement="company-detail" /></div>

      {related.length ? (
        <section>
          <div className="mb-4 flex items-end justify-between gap-2 border-b border-line pb-3">
            <h2 className="font-display text-2xl tracking-tight">More VA companies</h2>
            <Link href="/companies" className="text-[12px] font-semibold text-violet hover:underline">View all</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c, i) => <CompanyCard key={c.slug} company={c} index={i} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
