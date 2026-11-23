import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Nav";

const BASE = "https://virtualassistantdirectories.com";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | VirtualAssistantDirectories.com" },
  description:
    "The terms that govern use of VirtualAssistantDirectories.com, a free directory of virtual assistant companies, including listings, claims, sponsored placements and limitations of liability.",
  alternates: { canonical: `${BASE}/terms` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "November 23, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Legal</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <div className="mt-7 space-y-5 text-[15px] leading-7 text-ink/80">
        <p>
          These Terms of Service (“Terms”) govern your access to and use of
          <strong> VirtualAssistantDirectories.com</strong> (the “Site”), a free directory of virtual assistant
          companies, agencies, staffing firms and specialist assistants in the United States. The Site is operated as
          described in our <Link href="/privacy" className="font-semibold text-violet underline">Privacy Policy</Link>.
          By accessing or using the Site, you agree to these Terms. If you do not agree, do not use the Site.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">1. The directory is informational only</h2>
        <p>
          The Site helps people research and compare virtual assistant providers. It is not a hiring, staffing,
          placement, legal, tax, accounting, background-check or professional advisory service. Nothing on the Site is
          an offer to provide services, a recommendation to hire a particular provider, or a guarantee of any outcome.
          You are responsible for your own due diligence and for any agreement you enter into with a provider.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">2. Listings, data and no endorsement</h2>
        <p>
          Listings are compiled from public business profiles, public records and other third-party sources. We aim to be
          accurate and useful, but listings may be incomplete, outdated or incorrect, and coverage varies by city and
          provider type. A listing, ranking, rating, review count or editorial profile is not an endorsement, a
          verification of licensing, insurance, security, pricing, availability or service quality, or a statement that a
          provider is currently operating or accepting clients.
        </p>
        <p>
          Star ratings and review counts shown on the Site come from underlying public business profiles and are not
          reviews created or verified by us. Editorial profiles are original commentary based on listing data; they are
          not customer reviews, endorsements or guarantees. Always confirm fees, scope, availability, insurance,
          references and contract terms directly with the provider before hiring.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">3. Permitted use</h2>
        <p>
          You may use the Site for lawful, personal and internal business research. You may view, search and share links
          to public pages. You may not:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>use the Site in violation of any law or regulation, or to infringe the rights of others;</li>
          <li>
            scrape, crawl, harvest, copy or systematically extract listings or other content except as permitted by our
            robots.txt or with our prior written permission, or resell or redistribute the directory as a competing
            database;
          </li>
          <li>circumvent rate limits, access controls, CAPTCHAs or other technical measures, or use the Site in a way that imposes an unreasonable load;</li>
          <li>introduce malware, attempt to gain unauthorized access, probe or scan the Site, or interfere with its operation or security;</li>
          <li>impersonate another person or business, misrepresent your affiliation, or submit false correction or claim requests;</li>
          <li>use contact details from the Site to send spam, unlawful solicitations or harassing communications; or</li>
          <li>remove, obscure or alter proprietary notices, or use our name, logo or content in a way that suggests endorsement without permission.</li>
        </ul>

        <h2 className="pt-3 font-display text-2xl tracking-tight">4. Provider listings, claims and corrections</h2>
        <p>
          If you own or manage a listed provider, you may contact us to correct or update a listing or to request
          removal. We may ask for reasonable evidence that you are authorized to act for the business. We will review
          requests and make changes where the public record and applicable rules support them, but we are not obligated
          to publish, retain or modify any particular listing, and we may decline requests that are inaccurate,
          unverifiable or inconsistent with the directory’s purpose.
        </p>
        <p>
          If you submit content to us (for example, corrected details, a description, images or a claim request), you
          represent that you have the right to provide it and grant us a non-exclusive, worldwide, royalty-free license
          to use, reproduce, edit, display and distribute that content in connection with the Site. You are responsible
          for the accuracy of what you submit. Do not send confidential information you do not want displayed publicly.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">5. Sponsored placements and advertising</h2>
        <p>
          The Site is free and is supported by clearly labeled sponsored placements and advertising, including placements
          that link to third parties such as
          <a className="font-semibold text-violet underline" href="https://stealthagents.com/" target="_blank" rel="noopener"> stealthagents.com</a>.
          Sponsored placements are identified as sponsored or paid, and they do not change independent directory
          rankings. We may receive compensation when you click a sponsored link or when a provider purchases placement.
          Advertisers are responsible for their own claims and offers. Your dealings with advertisers and third-party
          sites are solely between you and them.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">6. Third-party sites and services</h2>
        <p>
          The Site links to third-party websites, including provider websites and advertising destinations. We do not
          control and are not responsible for their content, products, services, availability, security or privacy
          practices. Links are provided for convenience and do not imply endorsement. Review the terms and policies of
          any third-party site you visit.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">7. Intellectual property</h2>
        <p>
          The Site’s design, text, editorial profiles, compilation, organization, graphics and logos are owned by us or
          our licensors and are protected by intellectual property laws. Subject to these Terms, we grant you a limited,
          revocable, non-exclusive, non-transferable license to access and use the Site for its intended purpose. All
          rights not expressly granted are reserved. “Virtual Assistant Directories,” “VA Directories,” related names and
          logos are our trademarks or those of their respective owners. Third-party names and marks belong to their
          owners.
        </p>
        <p>
          If you believe content on the Site infringes your copyright, email us at the address below with the information
          needed to evaluate the claim (identification of the work and the allegedly infringing material, your contact
          details, and a statement of good-faith belief and authority). We will review and respond as appropriate.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">8. Disclaimers</h2>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY AND
          NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE OR FREE OF HARMFUL
          COMPONENTS, OR THAT ANY LISTING OR INFORMATION IS ACCURATE, COMPLETE OR CURRENT. SOME JURISDICTIONS DO NOT
          ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">9. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS AND
          LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE
          DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL OR BUSINESS OPPORTUNITY, ARISING OUT OF OR
          RELATING TO YOUR USE OF THE SITE OR ANY PROVIDER, ADVERTISER OR THIRD-PARTY SITE, EVEN IF WE HAVE BEEN ADVISED
          OF THE POSSIBILITY. OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SITE WILL NOT EXCEED ONE HUNDRED U.S.
          DOLLARS (US$100). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO SOME OF THE ABOVE MAY NOT APPLY TO
          YOU.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">10. Indemnification</h2>
        <p>
          You agree to defend, indemnify and hold harmless the Directory and its officers, directors, employees, agents
          and suppliers from and against any claims, damages, liabilities, costs and expenses (including reasonable
          attorneys’ fees) arising out of or relating to your use of the Site, your content or submissions, your
          violation of these Terms or applicable law, or your dealings with any provider or third party.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">11. Governing law and venue</h2>
        <p>
          These Terms are governed by the laws of the State of New Jersey, United States, without regard to conflict of
          law principles. Subject to any mandatory consumer protections, you agree that any dispute arising out of or
          relating to the Site or these Terms will be brought exclusively in the state or federal courts located in New
          Jersey, and you consent to their jurisdiction and venue. Nothing in these Terms limits rights you may have
          under applicable mandatory law.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">12. Changes and termination</h2>
        <p>
          We may update these Terms from time to time. The “Last updated” date shows when they last changed, and
          continued use of the Site after an update means you accept the revised Terms. We may modify, suspend or
          discontinue all or part of the Site at any time, and we may restrict or terminate access if we believe you
          have violated these Terms or posed a risk to the Site or others. Sections that by their nature should survive
          termination, including ownership, disclaimers, limitation of liability and indemnification, will survive.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">13. General</h2>
        <p>
          If any provision of these Terms is found unenforceable, that provision will be limited to the minimum extent
          necessary and the remaining provisions will stay in effect. Our failure to enforce a provision is not a waiver.
          You may not assign these Terms without our consent; we may assign them in connection with a merger,
          acquisition or sale of assets. These Terms, together with our Privacy Policy, are the entire agreement between
          you and us regarding the Site.
        </p>

        <div className="rounded-2xl border border-line bg-card p-5 text-sm leading-6 text-muted">
          <p className="font-bold text-ink">Contact us</p>
          <p className="mt-2">Questions about these Terms or the Site:</p>
          <p className="mt-2">
            <a className="font-semibold text-violet underline" href="mailto:support@virtualassistantdirectories.com">support@virtualassistantdirectories.com</a>
            <br />
            VirtualAssistantDirectories.com
            <br />
            PO Box 235
            <br />
            Beverly, NJ 08010
            <br />
            United States
          </p>
        </div>
      </div>
    </div>
  );
}
