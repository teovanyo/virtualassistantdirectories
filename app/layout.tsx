import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { Logo } from "@/components/Logo";
import { AdRibbon } from "@/components/AdRibbon";
import { AdBanner } from "@/components/Ads";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://virtualassistantdirectories.com"),
  title: {
    default: "Virtual Assistant Directories - Find a VA Agency or Assistant",
    template: "%s | Virtual Assistant Directories",
  },
  description:
    "Find virtual assistant companies across the US. Compare VA agencies, staffing firms, offshore teams and specialist assistants by ratings, reviews, pricing signals and contact details.",
  keywords: [
    "virtual assistant companies",
    "virtual assistant agency",
    "hire a virtual assistant",
    "VA staffing agency",
    "offshore virtual assistants",
    "executive assistant services",
    "virtual assistant directory",
  ],
  category: "Business Directory",
  openGraph: {
    type: "website",
    siteName: "Virtual Assistant Directories",
    title: "Virtual Assistant Directories - Find a VA Agency or Assistant",
    description:
      "Find virtual assistant companies across the US: agencies, staffing firms, offshore teams and specialist assistants.",
    url: "https://virtualassistantdirectories.com",
  },
  twitter: {
    card: "summary",
    title: "Virtual Assistant Directories",
    description: "Find virtual assistant companies across the US.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

const NAV = [
  { href: "/directory", label: "Directory" },
  { href: "/top-rated", label: "Top rated" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://virtualassistantdirectories.com/#website",
                  url: "https://virtualassistantdirectories.com",
                  name: "Virtual Assistant Directories",
                  description: "A free directory of virtual assistant companies across the United States.",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: { "@type": "EntryPoint", urlTemplate: "https://virtualassistantdirectories.com/search?q={search_term_string}" },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://virtualassistantdirectories.com/#organization",
                  name: "Virtual Assistant Directories",
                  url: "https://virtualassistantdirectories.com",
                  description: "A free US directory of VA agencies, staffing firms, offshore teams and specialist virtual assistants.",
                },
              ],
            }),
          }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink">
          Skip to content
        </a>
        <AdRibbon />
        <header className="sticky top-0 z-40 bg-charcoal text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="hidden text-[15px] font-semibold tracking-tight sm:block">
                VA<span className="text-lime">Directories</span>
              </span>
            </Link>
            <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/search" className="rounded-full px-3 py-1.5 text-sm text-white/65 hover:text-white sm:hidden">
                Search
              </Link>
              <a
                href="https://stealthagents.com/?utm_source=virtualassistantdirectories&utm_medium=display&utm_campaign=virtual-assistant&utm_content=header-cta"
                target="_blank"
                rel="sponsored noopener"
                className="rounded-full bg-lime px-4 py-2 text-[13px] font-semibold text-ink transition hover:bg-lime-soft"
              >
                Hire a VA
              </a>
            </div>
          </div>
        </header>
        <main id="main" className="flex-1">{children}</main>
        <AdBanner placement="sitewide-footer" />
        <footer className="bg-charcoal text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <Logo />
                <span className="font-display text-xl tracking-tight">Virtual Assistant Directories</span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
                A free directory of virtual assistant agencies, staffing firms, offshore teams and specialist assistants across the United States. Listings are built from public business data; directory rankings are independent and sponsored placements are clearly labeled.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lime">Browse</p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li><Link href="/directory" className="hover:text-white">All states</Link></li>
                <li><Link href="/top-rated" className="hover:text-white">Top rated</Link></li>
                <li><Link href="/type/agency" className="hover:text-white">VA agencies</Link></li>
                <li><Link href="/type/offshore" className="hover:text-white">Offshore teams</Link></li>
                <li><Link href="/site-map" className="hover:text-white">Site map</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lime">More</p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li><Link href="/about" className="hover:text-white">About the data</Link></li>
                <li><Link href="/about" className="hover:text-white">Claim a listing</Link></li>
                <li><a href="https://stealthagents.com/?utm_source=virtualassistantdirectories&utm_medium=display&utm_campaign=virtual-assistant&utm_content=footer-link" target="_blank" rel="sponsored noopener" className="hover:text-white">Hire a VA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; 2026 VirtualAssistantDirectories.com</p>
              <p>Public business data. Not an endorsement or a verification of service quality.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
