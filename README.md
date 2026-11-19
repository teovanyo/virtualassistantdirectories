# VirtualAssistantDirectories.com

A US directory of virtual assistant companies: VA agencies, staffing and placement
firms, offshore teams, executive support and specialist assistants.

Next.js 16 (App Router), Tailwind CSS v4, generated from public business listings.

## Data

- `data/cities.json` - US cities >= 25k population (GeoNames)
- `data/firms.json` - verified providers only
- `data/firms-unverified.json` - raw filtered scrape before verification
- `data/states.json` - state code to name
- `data/raw/places.jsonl` - raw Google Maps scrape batches (not committed)

Pipeline:

```bash
MIN_POP=25000 node scripts/build-cities.mjs /path/to/US.txt
MIN_POP=25000 TOP_VARIANTS=600 CONCURRENCY=80 node scripts/collect.mjs
node scripts/build-firms.mjs        # writes data/firms-unverified.json
node scripts/verify.mjs             # scrapes each site via treg -> data/verify.jsonl
node scripts/apply-verification.mjs # -> data/firms.json (confirmed VA providers only)
node scripts/build-hero-map.mjs
```

Verification is required: the Maps scrape returns general staffing firms, government
offices and unrelated businesses. `verify.mjs` fetches each provider website (plus one
service/about page when needed) and keeps a listing only when the name or page explicitly
confirms virtual assistant services.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

## Deploy

Production runs on Coolify3. Push to `main`, then trigger the Coolify deploy (see `AGENTS.md`).
