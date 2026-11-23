import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Nav";

const BASE = "https://virtualassistantdirectories.com";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | VirtualAssistantDirectories.com" },
  description:
    "How VirtualAssistantDirectories.com collects, uses and protects information, including directory listing data, server logs, cookies, sponsored placements and your privacy rights.",
  alternates: { canonical: `${BASE}/privacy` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "November 23, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Legal</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <div className="mt-7 space-y-5 text-[15px] leading-7 text-ink/80">
        <p>
          This Privacy Policy explains how <strong>VirtualAssistantDirectories.com</strong> (“we,” “us,” “our” or “the
          Directory”) collects, uses, shares and protects information when you visit or use this website (the “Site”).
          The Site is a free directory of virtual assistant companies in the United States. By using the Site, you agree
          to this policy. If you do not agree, please do not use the Site.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">1. Information we collect</h2>

        <h3 className="pt-2 font-display text-lg tracking-tight">Information you provide to us</h3>
        <p>
          The Directory does not require an account to browse. We collect information you choose to send us, such as
          when you email us about a listing, request a correction or removal, claim a provider page, ask a question or
          report a problem. This may include your name, email address, phone number, the provider you represent and any
          details or attachments you include.
        </p>

        <h3 className="pt-2 font-display text-lg tracking-tight">Information collected automatically</h3>
        <p>
          When you visit the Site, our servers and service providers automatically receive and may log standard
          technical information. This can include your IP address, the date and time of requests, the pages you view,
          the page that referred you, browser type and version, device type, operating system, and general (city or
          region level) location derived from your IP address. We use this information to operate, secure and improve the
          Site and to understand aggregate usage. We do not use it to attempt to identify you personally.
        </p>

        <h3 className="pt-2 font-display text-lg tracking-tight">Cookies and local storage</h3>
        <p>
          The Site may use cookies and similar technologies, including browser local storage, to keep the Site working
          and to remember your preferences. For example, if you dismiss a sitewide notice or advertisement ribbon, we
          store that choice in your browser’s local storage so it is not shown again on that device. We do not use
          cookies to build advertising profiles of you on this Site. You can clear or block cookies and local storage
          through your browser settings; some features may then behave differently.
        </p>

        <h3 className="pt-2 font-display text-lg tracking-tight">Public business directory data</h3>
        <p>
          Directory listings are built from public business profiles and public records, such as business names,
          addresses, phone numbers, websites, categories and public rating or review counts. This is business listing
          information about a company or practice, not information we collect from you as a website visitor. If a
          listing contains your personal information because you are a provider or listed contact, see “Corrections and
          your rights” below.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">2. How we use information</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To provide, operate, maintain and secure the Site and its directory content.</li>
          <li>To respond to your questions, correction requests, claims, reports and other communications.</li>
          <li>To review, update, correct or remove directory listings and editorial profiles.</li>
          <li>To understand aggregate usage and improve search, navigation and page quality.</li>
          <li>To detect, prevent and address fraud, abuse, security incidents and technical problems.</li>
          <li>To comply with applicable laws, legal process and our legitimate business requirements.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use the content of your emails to build advertising
          profiles, and we do not send marketing email to people who contact us about a listing unless they ask to
          receive it.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">3. Legal bases for processing (EEA and UK visitors)</h2>
        <p>
          If data protection laws such as the GDPR or UK GDPR apply to you, we process personal information on the
          following legal bases: our <strong>legitimate interests</strong> in operating, securing and improving the Site
          and responding to inquiries; <strong>performance of a request or contract</strong> when you ask us to act on a
          listing; <strong>consent</strong> where we ask for it (for example, for optional cookies or communications);
          and <strong>legal obligation</strong> where we must retain or disclose information.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">4. How we share information</h2>
        <p>We may share information in the following limited circumstances:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Service providers.</strong> Vendors that help us host and operate the Site, deliver email, provide
            security or analytics, or maintain backups, under agreements that limit their use of the information to
            providing those services to us.
          </li>
          <li>
            <strong>Legal and safety.</strong> When we believe disclosure is required by law, legal process or a
            governmental request, or is necessary to protect the rights, property or safety of the Directory, our users
            or others.
          </li>
          <li>
            <strong>Business transfers.</strong> In connection with a merger, acquisition, reorganization, financing or
            sale of assets, information may be transferred as part of that transaction, subject to this policy.
          </li>
          <li>
            <strong>With your direction.</strong> When you ask us to share information or to pass a correction request to
            a provider.
          </li>
        </ul>
        <p>
          We do not sell personal information and we do not share it for cross-context behavioral advertising on this
          Site.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">5. Advertising and sponsored placements</h2>
        <p>
          The Directory is free to use and is supported by clearly labeled sponsored placements and advertising. Some
          placements, including the “Powered by Stealth Agents” credit, link to external sites such as
          <a className="font-semibold text-violet underline" href="https://stealthagents.com/" target="_blank" rel="noopener"> stealthagents.com</a>.
          Sponsored placements are labeled, and they do not change independent directory rankings. When you click an
          external or sponsored link, you leave the Directory and the destination site’s own privacy policy and cookie
          practices apply. We do not control those third-party sites.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">6. Data retention</h2>
        <p>
          We keep information for as long as reasonably necessary for the purposes described in this policy. Emails and
          correction requests are generally retained while the related listing is maintained and for a reasonable period
          afterward for recordkeeping. Server logs are typically kept for a short period. Listing data may be retained
          in backups and archives. If you ask us to delete information and we have no legal or operational reason to keep
          it, we will take reasonable steps to delete or de-identify it.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">7. Security</h2>
        <p>
          We use reasonable administrative, technical and organizational measures to protect information, including
          encryption in transit and access controls. No method of transmission or storage is completely secure, so we
          cannot guarantee absolute security. Please do not send us sensitive information such as government identifiers,
          financial account numbers, passwords or health information through email or the Site.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">8. Corrections and your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, restrict or object to the
          processing of your personal information, to request a portable copy, to withdraw consent, or to appeal a
          decision. California residents have rights under the CCPA/CPRA, including the right to know, delete, correct
          and opt out of sale or sharing. We do not sell or share personal information as those terms are defined by the
          CCPA/CPRA, and we do not discriminate against you for exercising your rights.
        </p>
        <p>
          To make a request, email us at the address below. Please describe the listing or information at issue and how we
          can verify your identity or authority (for example, that you manage the listed business). We may need to
          confirm your request before acting. You may use an authorized agent where the law allows. If we deny a request,
          you may appeal by replying to our decision.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">9. Children</h2>
        <p>
          The Site is intended for businesses and adults. It is not directed to children under 13 (or under 16 where
          local law sets a higher age), and we do not knowingly collect personal information from children. If you
          believe a child has provided us personal information, contact us and we will take appropriate steps to delete
          it.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">10. International visitors</h2>
        <p>
          The Directory is operated in the United States. If you access it from another country, your information may be
          processed in the United States, where privacy laws may differ from those in your country. Where required, we
          use appropriate safeguards for cross-border transfers.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">11. Third-party links</h2>
        <p>
          Listings, editorial profiles and advertising contain links to third-party websites. We are not responsible for
          the content, availability, security or privacy practices of those sites. Review their policies before
          providing personal information.
        </p>

        <h2 className="pt-3 font-display text-2xl tracking-tight">12. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The “Last updated” date at the top shows when it last
          changed. Material changes will be reflected on this page, and continued use of the Site after an update means
          you accept the revised policy.
        </p>

        <div className="rounded-2xl border border-line bg-card p-5 text-sm leading-6 text-muted">
          <p className="font-bold text-ink">Contact us</p>
          <p className="mt-2">
            Questions or requests about this policy or your information:
          </p>
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

        <p className="text-sm text-muted">
          See also our <Link href="/terms" className="font-semibold text-violet underline">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
